import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Button, Alert, Snackbar } from "@mui/material";
import { FileOpen } from "@mui/icons-material";
import VideoPlayer from "./components/VideoPlayer";

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

  // Check for initial video path from command line arguments (Electron only)
  useEffect(() => {
    const checkInitialVideo = async () => {
      try {
        // Only run if in Electron environment
        if (window.electronAPI && window.electronAPI.getInitialVideoPath) {
          const initialPath = await window.electronAPI.getInitialVideoPath();
          if (initialPath) {
            setCurrentVideo(initialPath);
            setPlaylist([initialPath]);
            setCurrentIndex(0);
            setSnackbar({
              open: true,
              message: "Video loaded from command line",
              severity: "success",
            });
          }
        }
      } catch (error) {
        console.error("Error getting initial video path:", error);
      }
    };

    checkInitialVideo();
  }, []);

  // Listen for video file opened events (when app is already running) - Electron only
  useEffect(() => {
    const handleVideoFileOpened = (event) => {
      const videoPath = event.detail;
      setCurrentVideo(videoPath);
      setPlaylist([videoPath]);
      setCurrentIndex(0);
      setSnackbar({
        open: true,
        message: "Video loaded from file association",
        severity: "success",
      });
    };

    // Only add event listener in Electron environment
    if (window.electronAPI) {
      window.addEventListener("video-file-opened", handleVideoFileOpened);
      return () => {
        window.removeEventListener("video-file-opened", handleVideoFileOpened);
      };
    }
  }, []);

  // Keyboard shortcuts and fullscreen detection
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only prevent shortcuts when typing in text inputs, not sliders or other controls
      if (e.target.tagName === "INPUT" && (e.target.type === "text" || e.target.type === "number")) return;
      if (e.target.tagName === "TEXTAREA") return;

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
      // Check if we're in Electron environment
      if (window.electronAPI && window.electronAPI.openFileDialog) {
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
      } else {
        // Web browser environment - create file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            const videoUrl = URL.createObjectURL(file);
            setCurrentVideo(videoUrl);
            setPlaylist([videoUrl]);
            setCurrentIndex(0);
            setSnackbar({
              open: true,
              message: "Video loaded successfully",
              severity: "success",
            });
          }
        };
        input.click();
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
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        cursor: isFullscreen ? "none" : "default",
      }}
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
              isFullscreen={isFullscreen}
              onVolumeChange={setVolume}
              onMuteToggle={toggleMute}
              onPlaybackRateChange={handleSpeedChange}
              onFullscreenToggle={toggleFullscreen}
              onStop={stopVideo}
              onSkip={skip}
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
