import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Slider,
  Paper,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  Stop,
  SkipPrevious,
  SkipNext,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  FileOpen,
} from "@mui/icons-material";
import VideoPlayer from "./components/VideoPlayer";
import SpeedControl from "./components/SpeedControl";

function App() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(
    !!document.fullscreenElement
  );
  const [playbackRate, setPlaybackRate] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Keyboard shortcuts and fullscreen detection
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === "INPUT") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlayPause();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skip(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        default:
          break;
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener("keydown", handleKeyPress);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isPlaying, isMuted, volume]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const adjustVolume = (delta) => {
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleFileOpen = async () => {
    try {
      const filePath = await window.electronAPI.openFileDialog();
      if (filePath) {
        setCurrentVideo(filePath);
        setPlaylist([filePath]);
        setCurrentIndex(0);
        setSnackbar({
          open: true,
          message: "Video loaded successfully",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error opening file",
        severity: "error",
      });
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setPlaybackRate(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const handleVideoEnded = () => {
    if (currentIndex < playlist.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentVideo(playlist[currentIndex + 1]);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Video Player */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            backgroundColor: "black",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 3,
          }}
        >
          {currentVideo ? (
            <VideoPlayer
              ref={videoRef}
              src={currentVideo}
              volume={isMuted ? 0 : volume}
              playbackRate={playbackRate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleVideoEnded}
            />
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                borderRadius: "inherit",
              }}
            >
              <Typography variant="h4" gutterBottom>
                No Video Loaded
              </Typography>
              <Typography variant="body1" gutterBottom>
                Open a video file to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<FileOpen />}
                onClick={handleFileOpen}
                sx={{ mt: 2 }}
              >
                Open Video File
              </Button>
            </Box>
          )}
        </Box>

        {/* Controls */}
        {currentVideo && (
          <Paper
            sx={{
              p: 2,
              backgroundColor: "background.paper",
              mt: 2,
              maxWidth: "1200px",
              width: "100%",
              borderRadius: 2,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Playback Controls */}
              <Grid item>
                <IconButton onClick={togglePlayPause} size="large">
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton onClick={stopVideo}>
                  <Stop />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton onClick={() => skip(-10)}>
                  <SkipPrevious />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton onClick={() => skip(10)}>
                  <SkipNext />
                </IconButton>
              </Grid>

              {/* Volume Control */}
              <Grid item xs={2}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={toggleMute}>
                    {isMuted ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                  <Slider
                    value={isMuted ? 0 : volume}
                    onChange={(e, value) => {
                      setVolume(value);
                      setIsMuted(value === 0);
                    }}
                    min={0}
                    max={1}
                    step={0.1}
                    sx={{ ml: 1 }}
                  />
                </Box>
              </Grid>

              {/* Speed Control */}
              <Grid item xs={2}>
                <SpeedControl
                  value={playbackRate}
                  onChange={handleSpeedChange}
                />
              </Grid>

              {/* Fullscreen */}
              <Grid item>
                <IconButton onClick={toggleFullscreen}>
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
