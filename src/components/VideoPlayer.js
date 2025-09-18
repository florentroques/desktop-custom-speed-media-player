import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  Box,
  Slider,
  Typography,
  IconButton,
  LinearProgress,
  Button,
  ButtonGroup,
  Popover,
  Paper,
  Tooltip,
  Divider,
  TextField,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Stop,
  SkipPrevious,
  SkipNext,
  Fullscreen,
  FullscreenExit,
  Speed,
  Add,
  Remove,
} from "@mui/icons-material";

const VideoPlayer = forwardRef(
  (
    {
      src,
      volume,
      playbackRate,
      onPlay,
      onPause,
      onEnded,
      isFullscreen,
      onVolumeChange,
      onMuteToggle,
      onPlaybackRateChange,
      onFullscreenToggle,
      onStop,
      onSkip,
    },
    ref
  ) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [buffered, setBuffered] = useState(0);
    const [speedAnchorEl, setSpeedAnchorEl] = useState(null);
    const [customSpeed, setCustomSpeed] = useState(playbackRate);
    const [textInputValue, setTextInputValue] = useState(
      playbackRate.toFixed(2)
    );
    const [durationInputValue, setDurationInputValue] = useState("");
    const [durationInputTime, setDurationInputTime] = useState(0);
    const [isInteractingWithInputs, setIsInteractingWithInputs] = useState(false);

    const videoRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    const presetSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];

    // Forward the ref
    React.useImperativeHandle(ref, () => videoRef.current);

    // Calculate adjusted duration based on playback rate
    const adjustedDuration = duration / playbackRate;
    const adjustedCurrentTime = currentTime / playbackRate;

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const updateTime = () => setCurrentTime(video.currentTime);
      const updateDuration = () => setDuration(video.duration);
      const updateBuffered = () => {
        if (video.buffered.length > 0) {
          setBuffered(
            (video.buffered.end(video.buffered.length - 1) / video.duration) *
              100
          );
        }
      };

      video.addEventListener("timeupdate", updateTime);
      video.addEventListener("loadedmetadata", updateDuration);
      video.addEventListener("progress", updateBuffered);
      video.addEventListener("play", () => {
        setIsPlaying(true);
        onPlay?.();
      });
      video.addEventListener("pause", () => {
        setIsPlaying(false);
        onPause?.();
      });
      video.addEventListener("ended", onEnded);

      return () => {
        video.removeEventListener("timeupdate", updateTime);
        video.removeEventListener("loadedmetadata", updateDuration);
        video.removeEventListener("progress", updateBuffered);
        video.removeEventListener("play", () => {
          setIsPlaying(true);
          onPlay?.();
        });
        video.removeEventListener("pause", () => {
          setIsPlaying(false);
          onPause?.();
        });
        video.removeEventListener("ended", onEnded);
      };
    }, [onPlay, onPause, onEnded]);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.volume = volume;
      }
    }, [volume]);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.playbackRate = playbackRate;
      }
    }, [playbackRate]);

    // Control visibility based on playing state
    useEffect(() => {
      if (!isPlaying) {
        // Show controls when paused
        setShowControls(true);
        // Clear any existing timeout when paused
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      } else {
        // Hide controls when playing starts
        setShowControls(false);
      }
    }, [isPlaying]);

    // Handle cursor visibility in fullscreen when popover is open
    useEffect(() => {
      const speedOpen = Boolean(speedAnchorEl);
      if (isFullscreen && speedOpen) {
        // Force cursor to be visible on fullscreen element
        const fullscreenEl = document.fullscreenElement;
        if (fullscreenEl) {
          fullscreenEl.style.cursor = 'default';
        }
      } else if (isFullscreen && !speedOpen && !showControls) {
        // Reset cursor to none when popover closes in fullscreen
        const fullscreenEl = document.fullscreenElement;
        if (fullscreenEl) {
          fullscreenEl.style.cursor = 'none';
        }
      }
    }, [isFullscreen, speedAnchorEl, showControls]);

    // Handle spacebar when popover is open
    useEffect(() => {
      const speedOpen = Boolean(speedAnchorEl);
      if (!speedOpen) return;

      const handleKeyDown = (e) => {
        // Only handle spacebar when popover is open and not focused on text inputs
        if (e.code === "Space" && 
            !(e.target.tagName === "INPUT" && (e.target.type === "text" || e.target.type === "number")) &&
            e.target.tagName !== "TEXTAREA") {
          e.preventDefault();
          e.stopPropagation();
          
          // Toggle play/pause
          if (videoRef.current) {
            if (isPlaying) {
              videoRef.current.pause();
            } else {
              videoRef.current.play();
            }
          }
          
          // Close popover
          setSpeedAnchorEl(null);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [speedAnchorEl, isPlaying]);

    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);

      if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")}`;
      }
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };


    const handleSeek = (event, newValue) => {
      if (videoRef.current) {
        videoRef.current.currentTime = (newValue / 100) * duration;
      }
    };

    const togglePlayPause = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      }
    };

    const toggleMute = () => {
      onMuteToggle?.();
    };

    const handleVolumeChange = (event, newValue) => {
      onVolumeChange?.(newValue);
    };

    const handleSpeedClick = (event) => {
      setSpeedAnchorEl(event.currentTarget);
      setCustomSpeed(playbackRate);
      setTextInputValue(playbackRate.toFixed(2));
      setDurationInputValue("");
      setDurationInputTime(0);
    };

    const handleSpeedClose = (event, reason, forceClose = false) => {
      // Don't close if we're currently interacting with inputs, unless forced
      if (isInteractingWithInputs && !forceClose) {
        return;
      }
      // Close if forced, or if clicking outside the popover or pressing escape
      if (forceClose || reason === 'backdropClick' || reason === 'escapeKeyDown') {
        setSpeedAnchorEl(null);
      }
    };

    const handlePresetSpeedClick = (speed) => {
      setCustomSpeed(speed);
      setTextInputValue(speed.toFixed(2));
      
      // Update target duration based on new speed
      if (duration > 0 && speed > 0) {
        const targetDurationSeconds = duration / speed;
        const hours = Math.floor(targetDurationSeconds / 3600);
        const minutes = Math.floor((targetDurationSeconds % 3600) / 60);
        const seconds = Math.floor(targetDurationSeconds % 60);
        
        let durationString = "";
        if (hours > 0) {
          durationString = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
          durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        setDurationInputValue(durationString);
        setDurationInputTime(targetDurationSeconds);
      }
    };

    const handleCustomSpeedChange = (event, newValue) => {
      setCustomSpeed(newValue);
      setTextInputValue(newValue.toFixed(2));
      
      // Update target duration based on new speed
      if (duration > 0 && newValue > 0) {
        const targetDurationSeconds = duration / newValue;
        const hours = Math.floor(targetDurationSeconds / 3600);
        const minutes = Math.floor((targetDurationSeconds % 3600) / 60);
        const seconds = Math.floor(targetDurationSeconds % 60);
        
        let durationString = "";
        if (hours > 0) {
          durationString = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
          durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        setDurationInputValue(durationString);
        setDurationInputTime(targetDurationSeconds);
      }
    };

    const handleTextInputChange = (event) => {
      const inputValue = event.target.value;
      setTextInputValue(inputValue);

      const parsedValue = parseFloat(inputValue);
      if (!isNaN(parsedValue) && parsedValue >= 0.1 && parsedValue <= 16) {
        setCustomSpeed(parsedValue);
        
        // Update target duration based on new speed
        if (duration > 0 && parsedValue > 0) {
          const targetDurationSeconds = duration / parsedValue;
          const hours = Math.floor(targetDurationSeconds / 3600);
          const minutes = Math.floor((targetDurationSeconds % 3600) / 60);
          const seconds = Math.floor(targetDurationSeconds % 60);
          
          let durationString = "";
          if (hours > 0) {
            durationString = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          } else {
            durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          }
          
          setDurationInputValue(durationString);
          setDurationInputTime(targetDurationSeconds);
        }
      }
    };

    const handleTextInputKeyPress = (event) => {
      if (event.key === "Enter") {
        const parsedValue = parseFloat(textInputValue);
        if (!isNaN(parsedValue) && parsedValue >= 0.1 && parsedValue <= 16) {
          setCustomSpeed(parsedValue);
          setTextInputValue(parsedValue.toFixed(2));
        } else {
          setTextInputValue(customSpeed.toFixed(2));
        }
      }
    };

    const handleCustomSpeedCommit = () => {
      // Use customSpeed directly as it reflects the current state (from preset clicks or slider changes)
      if (customSpeed >= 0.1 && customSpeed <= 16) {
        onPlaybackRateChange?.(customSpeed);
      }
      handleSpeedClose(null, null, true); // Force close
    };

    const handleDurationInputChange = (event) => {
      const inputValue = event.target.value;
      setDurationInputValue(inputValue);

      // Parse time input (format: MM:SS or HH:MM:SS)
      const timeParts = inputValue.split(":").map((part) => parseInt(part, 10));
      let totalSeconds = 0;

      if (timeParts.length === 2) {
        // MM:SS format
        totalSeconds = timeParts[0] * 60 + timeParts[1];
      } else if (timeParts.length === 3) {
        // HH:MM:SS format
        totalSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
      }

      if (!isNaN(totalSeconds) && totalSeconds > 0) {
        setDurationInputTime(totalSeconds);
        // Calculate required speed to reach this time
        const requiredSpeed = duration / totalSeconds;
        if (requiredSpeed >= 0.1 && requiredSpeed <= 16) {
          setCustomSpeed(requiredSpeed);
          setTextInputValue(requiredSpeed.toFixed(2));
        }
      }
    };

    const handleDurationInputKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        handleCustomSpeedCommit();
      }
    };

    const handleTextInputKeyDownWithDuration = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        handleCustomSpeedCommit();
      } else if (event.key === "Enter") {
        const parsedValue = parseFloat(textInputValue);
        if (!isNaN(parsedValue) && parsedValue >= 0.1 && parsedValue <= 16) {
          setCustomSpeed(parsedValue);
          setTextInputValue(parsedValue.toFixed(2));
        }
      }
    };

    const handleSpeedIncrement = () => {
      const newSpeed = Math.min(16, playbackRate + 0.25);
      onPlaybackRateChange?.(newSpeed);
    };

    const handleSpeedDecrement = () => {
      const newSpeed = Math.max(0.1, playbackRate - 0.25);
      onPlaybackRateChange?.(newSpeed);
    };

    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      // Only hide controls automatically if video is playing
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const handleMouseLeave = () => {
      // Only hide controls on mouse leave if video is playing
      if (isPlaying) {
        setShowControls(false);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };

    const speedOpen = Boolean(speedAnchorEl);

    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "inherit",
          cursor: speedOpen || showControls ? "default" : "none",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            backgroundColor: "black",
            borderRadius: "inherit",
          }}
          controls={false}
          preload="metadata"
        />

        {/* Floating Controls Bar */}
        {showControls && (
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0, 0, 0, 0.8)",
              borderRadius: 2,
              p: 2,
              minWidth: 600,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Progress Bar with Time Labels */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ color: "white", minWidth: 45, ml: 1.5 }}
                >
                  {playbackRate !== 1
                    ? formatTime(adjustedCurrentTime)
                    : formatTime(currentTime)}
                </Typography>
                <Box sx={{ flexGrow: 1, mx: 2 }}>
                  <Slider
                    value={duration > 0 ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                    sx={{
                      color: "primary.main",
                      "& .MuiSlider-track": {
                        backgroundColor: "primary.main",
                      },
                      "& .MuiSlider-rail": {
                        backgroundColor: "rgba(255,255,255,0.3)",
                      },
                      "& .MuiSlider-thumb": {
                        backgroundColor: "primary.main",
                        width: 12,
                        height: 12,
                      },
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: "white", minWidth: 45, mr: 0.5 }}
                >
                  {playbackRate !== 1
                    ? formatTime(adjustedDuration)
                    : formatTime(duration)}
                </Typography>
              </Box>
            </Box>

            {/* Control Buttons */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Left side controls */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={togglePlayPause} sx={{ color: "white" }}>
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton onClick={onStop} sx={{ color: "white" }}>
                  <Stop />
                </IconButton>
                <IconButton
                  onClick={() => onSkip?.(-10)}
                  sx={{ color: "white" }}
                >
                  <SkipPrevious />
                </IconButton>
                <IconButton
                  onClick={() => onSkip?.(10)}
                  sx={{ color: "white" }}
                >
                  <SkipNext />
                </IconButton>
              </Box>

              {/* Center - Volume Control */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={toggleMute} sx={{ color: "white" }}>
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
                <Slider
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  min={0}
                  max={1}
                  step={0.1}
                  sx={{
                    width: 100,
                    color: "primary.main",
                    "& .MuiSlider-track": {
                      backgroundColor: "primary.main",
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "rgba(255,255,255,0.3)",
                    },
                    "& .MuiSlider-thumb": {
                      backgroundColor: "primary.main",
                    },
                  }}
                />
              </Box>

              {/* Right side controls */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* Speed Control */}
                <Tooltip title="Decrease Speed">
                  <IconButton
                    size="small"
                    onClick={handleSpeedDecrement}
                    sx={{ color: "white" }}
                  >
                    <Remove />
                  </IconButton>
                </Tooltip>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSpeedClick}
                  startIcon={<Speed />}
                  sx={{
                    minWidth: 80,
                    color: "white",
                    borderColor: "rgba(255,255,255,0.3)",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                  }}
                >
                  {playbackRate.toFixed(2)}x
                </Button>

                <Tooltip title="Increase Speed">
                  <IconButton
                    size="small"
                    onClick={handleSpeedIncrement}
                    sx={{ color: "white" }}
                  >
                    <Add />
                  </IconButton>
                </Tooltip>

                <IconButton
                  onClick={onFullscreenToggle}
                  sx={{ color: "white" }}
                >
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Box>
            </Box>

            {/* Speed Control Popover */}
            <Popover
              open={speedOpen}
              anchorEl={speedAnchorEl}
              onClose={handleSpeedClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              disableAutoFocus
              disableEnforceFocus
              disableRestoreFocus
              disableEscapeKeyDown
              container={isFullscreen ? document.fullscreenElement : document.body}
              slotProps={{
                paper: {
                  onMouseDown: (e) => e.stopPropagation(),
                  onMouseUp: (e) => e.stopPropagation(),
                  onKeyDown: (e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCustomSpeedCommit();
                    }
                  },
                  sx: {
                    zIndex: 9999,
                    cursor: "default", // Ensure cursor is visible over entire popover
                    "& *": {
                      cursor: "default", // Ensure all child elements show cursor
                    },
                    "& button": {
                      cursor: "pointer", // Interactive elements get pointer cursor
                    },
                    "& input": {
                      cursor: "text", // Text inputs get text cursor
                    },
                    "& .MuiSlider-root": {
                      cursor: "pointer", // Sliders get pointer cursor
                    }
                  }
                }
              }}
            >
              <Paper sx={{ p: 2, minWidth: 600 }}>
                <Typography variant="h6" gutterBottom>
                  Playback Speed
                </Typography>

                {/* Preset Speeds */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Preset Speeds
                  </Typography>
                  <ButtonGroup
                    variant="outlined"
                    size="small"
                    sx={{ flexWrap: "wrap" }}
                  >
                    {presetSpeeds.map((speed) => (
                      <Button
                        key={speed}
                        onClick={() => handlePresetSpeedClick(speed)}
                        variant={
                          customSpeed === speed ? "contained" : "outlined"
                        }
                        sx={{ minWidth: 50 }}
                      >
                        {speed}x
                      </Button>
                    ))}
                  </ButtonGroup>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Custom Speed and Duration Inputs */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Custom Speed Input */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Custom Speed
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <TextField
                          size="small"
                          value={textInputValue}
                          onChange={handleTextInputChange}
                          onKeyDown={handleTextInputKeyDownWithDuration}
                          onMouseDown={(e) => e.stopPropagation()}
                          onMouseUp={(e) => e.stopPropagation()}
                          onFocus={(e) => {
                            e.stopPropagation();
                            setIsInteractingWithInputs(true);
                          }}
                          onBlur={(e) => {
                            e.stopPropagation();
                            setIsInteractingWithInputs(false);
                            const parsedValue = parseFloat(textInputValue);
                            if (
                              !isNaN(parsedValue) &&
                              parsedValue >= 0.1 &&
                              parsedValue <= 16
                            ) {
                              setTextInputValue(parsedValue.toFixed(2));
                            } else {
                              setTextInputValue(customSpeed.toFixed(2));
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsInteractingWithInputs(true);
                          }}
                          inputProps={{
                            min: 0.1,
                            max: 16,
                            step: 0.01,
                            style: { textAlign: "center" },
                          }}
                          sx={{ width: 80 }}
                          placeholder="1.00"
                        />
                        <Typography variant="body2">x</Typography>
                      </Box>
                    </Box>

                    {/* Duration Input */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Target Duration
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <TextField
                          size="small"
                          value={durationInputValue}
                          onChange={handleDurationInputChange}
                          onKeyDown={handleDurationInputKeyDown}
                          onMouseDown={(e) => e.stopPropagation()}
                          onMouseUp={(e) => e.stopPropagation()}
                          onFocus={(e) => {
                            e.stopPropagation();
                            setIsInteractingWithInputs(true);
                          }}
                          onBlur={(e) => {
                            e.stopPropagation();
                            setIsInteractingWithInputs(false);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsInteractingWithInputs(true);
                          }}
                          placeholder="MM:SS or HH:MM:SS"
                          inputProps={{
                            style: { textAlign: "center" },
                          }}
                          sx={{ width: 240 }}
                          helperText="Longer duration = slower playback"
                        />
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, width: 200 }}>
                          <Typography variant="body2" color="primary.main">
                            Target Duration: {duration > 0 && customSpeed > 0 ? (() => {
                              const targetDurationSeconds = duration / customSpeed;
                              const hours = Math.floor(targetDurationSeconds / 3600);
                              const minutes = Math.floor((targetDurationSeconds % 3600) / 60);
                              const seconds = Math.floor(targetDurationSeconds % 60);
                              if (hours > 0) {
                                return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                              } else {
                                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                              }
                            })() : "0:00"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            (Original: {formatTime(duration)})
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Custom Speed Slider */}
                  <Slider
                    value={customSpeed}
                    onChange={handleCustomSpeedChange}
                    min={0.1}
                    max={16}
                    step={0.01}
                    marks={[
                      { value: 0.1, label: "0.1x" },
                      { value: 1, label: "1x" },
                      { value: 5, label: "5x" },
                      { value: 10, label: "10x" },
                      { value: 16, label: "16x" },
                    ]}
                    sx={{ mb: 2 }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 1, display: "block" }}
                  >
                    Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to apply
                    changes
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                  >
                    <Button size="small" onClick={() => handleSpeedClose(null, null, true)}>
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleCustomSpeedCommit}
                    >
                      Apply
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Popover>
          </Box>
        )}

        {/* Loading Indicator */}
        {buffered < 100 && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
            }}
          >
            <LinearProgress
              variant="determinate"
              value={buffered}
              sx={{ width: 200, height: 4 }}
            />
          </Box>
        )}
      </Box>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
