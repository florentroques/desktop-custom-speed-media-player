import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Slider,
  Paper,
  Grid,
  Container,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Chip,
  Divider,
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
  OpenInNew,
  Settings,
  Speed,
  FileOpen,
  FolderOpen,
} from "@mui/icons-material";
import VideoPlayer from "./components/VideoPlayer";
import SpeedControl from "./components/SpeedControl";
import Playlist from "./components/Playlist";
import SettingsDialog from "./components/SettingsDialog";

function App() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Keyboard shortcuts
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

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
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

  const handleFolderOpen = async () => {
    try {
      const folderPath = await window.electronAPI.openFolderDialog();
      if (folderPath) {
        // In a real app, you'd scan the folder for video files
        setSnackbar({
          open: true,
          message: "Folder opened (video scanning not implemented)",
          severity: "info",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error opening folder",
        severity: "error",
      });
    }
  };

  const handlePlaylistItemClick = (index) => {
    setCurrentIndex(index);
    setCurrentVideo(playlist[index]);
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
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Video Player */}
        <Box
          sx={{ flexGrow: 1, position: "relative", backgroundColor: "black" }}
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
          <Paper sx={{ p: 2, backgroundColor: "background.paper" }}>
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

              {/* Settings */}
              <Grid item>
                <IconButton onClick={() => setShowSettings(true)}>
                  <Settings />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {/* Speed Dial */}
      <SpeedDial
        ariaLabel="Quick actions"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<FileOpen />}
          tooltipTitle="Open File"
          onClick={handleFileOpen}
        />
        <SpeedDialAction
          icon={<FolderOpen />}
          tooltipTitle="Open Folder"
          onClick={handleFolderOpen}
        />
        <SpeedDialAction
          icon={<Speed />}
          tooltipTitle="Speed Controls"
          onClick={() => setShowPlaylist(!showPlaylist)}
        />
      </SpeedDial>

      {/* Playlist Panel */}
      {showPlaylist && (
        <Playlist
          playlist={playlist}
          currentIndex={currentIndex}
          onItemClick={handlePlaylistItemClick}
          onClose={() => setShowPlaylist(false)}
        />
      )}

      {/* Settings Dialog */}
      <SettingsDialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
      />

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
