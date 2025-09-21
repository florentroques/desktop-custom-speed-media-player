import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Button, Alert, Snackbar } from "@mui/material";
import { FileOpen } from "@mui/icons-material";
import MediaPlayer from "./components/MediaPlayer";

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
  const [isLooping, setIsLooping] = useState(false);
  const [isAudio, setIsAudio] = useState(false);
  const [currentFileName, setCurrentFileName] = useState(null);
  const [mediaMetadata, setMediaMetadata] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Handle media metadata changes
  const handleMetadataChange = (metadata) => {
    setMediaMetadata(metadata);
  };

  // Update page title based on media metadata
  useEffect(() => {
    if (mediaMetadata) {
      const { title, artist, isAudio } = mediaMetadata;
      let newTitle = title;
      
      if (artist) {
        newTitle = `${title} - ${artist}`;
      }
      
      // Add media type suffix
      newTitle += ` - ${isAudio ? 'Audio' : 'Video'} Player`;
      
      document.title = newTitle;
    } else {
      // Reset to default title when no media is loaded
      document.title = 'Desktop Custom Speed Media Player';
    }
  }, [mediaMetadata]);

  // Reset metadata when no video is loaded
  useEffect(() => {
    if (!currentVideo) {
      setMediaMetadata(null);
    }
  }, [currentVideo]);

  // Check for initial video path from command line arguments (Electron only)
  useEffect(() => {
    const checkInitialVideo = async () => {
      try {
        // Only run if in Electron environment
        if (window.electronAPI && window.electronAPI.getInitialVideoPath) {
          const initialPath = await window.electronAPI.getInitialVideoPath();
          if (initialPath) {
            const isAudioType = isAudioFile(initialPath);
            const fileName = initialPath.split(/[/\\]/).pop();
            setCurrentVideo(initialPath);
            setPlaylist([initialPath]);
            setCurrentIndex(0);
            setIsAudio(isAudioType);
            setCurrentFileName(fileName);
            setSnackbar({
              open: true,
              message: `${isAudioType ? 'Audio' : 'Video'} loaded from command line`,
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

  // Helper function to check if a file is audio
  const isAudioFile = (filePath) => {
    const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma', '.opus'];
    return audioExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  };

  // Listen for media file opened events (when app is already running) - Electron only
  useEffect(() => {
    const handleMediaFileOpened = (event) => {
      const mediaPath = event.detail;
      const isAudioType = isAudioFile(mediaPath);
      const fileName = mediaPath.split(/[/\\]/).pop();
      setCurrentVideo(mediaPath);
      setPlaylist([mediaPath]);
      setCurrentIndex(0);
      setIsAudio(isAudioType);
      setCurrentFileName(fileName);
      setSnackbar({
        open: true,
        message: `${isAudioType ? 'Audio' : 'Video'} loaded from file association`,
        severity: "success",
      });
    };

    // Only add event listener in Electron environment
    if (window.electronAPI) {
      window.addEventListener("media-file-opened", handleMediaFileOpened);
      return () => {
        window.removeEventListener("media-file-opened", handleMediaFileOpened);
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
          const isAudioType = isAudioFile(filePath);
          const fileName = filePath.split(/[/\\]/).pop();
          setCurrentVideo(filePath);
          setPlaylist([filePath]);
          setCurrentIndex(0);
          setIsAudio(isAudioType);
          setCurrentFileName(fileName);
          setSnackbar({
            open: true,
            message: `${isAudioType ? 'Audio' : 'Video'} loaded successfully`,
            severity: "success",
          });
        }
      } else {
        // Web browser environment - create file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*,audio/*';
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            const mediaUrl = URL.createObjectURL(file);
            const isAudioType = file.type.startsWith('audio/');
            setCurrentVideo(mediaUrl);
            setPlaylist([mediaUrl]);
            setCurrentIndex(0);
            setIsAudio(isAudioType);
            setCurrentFileName(file.name);
            setSnackbar({
              open: true,
              message: `${isAudioType ? 'Audio' : 'Video'} loaded successfully`,
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
    // Don't auto-advance to next video if looping is enabled
    if (!isLooping) {
      if (currentIndex < playlist.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCurrentVideo(playlist[currentIndex + 1]);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
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
          padding: 1,
          minHeight: 0, // Allow flex item to shrink
        }}
      >
        {/* Video Player */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            maxWidth: "100vw",
            maxHeight: "100vh",
            position: "relative",
            backgroundColor: "black",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 3,
          }}
        >
          {currentVideo ? (
            <MediaPlayer
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
              onLoopToggle={toggleLoop}
              isLooping={isLooping}
              isAudio={isAudio}
              fileName={currentFileName}
              onMetadataChange={handleMetadataChange}
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
                No Media Loaded
              </Typography>
              <Typography variant="body1" gutterBottom>
                Open a video or audio file to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<FileOpen />}
                onClick={handleFileOpen}
                sx={{ mt: 2 }}
              >
                Open Media File
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
