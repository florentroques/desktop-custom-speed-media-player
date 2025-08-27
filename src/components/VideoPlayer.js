import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  Box,
  Slider,
  Typography,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { PlayArrow, Pause, VolumeUp, VolumeOff } from "@mui/icons-material";

const VideoPlayer = forwardRef(
  ({ src, volume, playbackRate, onPlay, onPause, onEnded }, ref) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [buffered, setBuffered] = useState(0);

    const videoRef = useRef(null);
    const controlsTimeoutRef = useRef(null);

    // Forward the ref
    React.useImperativeHandle(ref, () => videoRef.current);

    // Calculate adjusted duration based on playback rate
    const adjustedDuration = duration / playbackRate;
    const adjustedCurrentTime = currentTime / playbackRate;
    const adjustedTimeRemaining = adjustedDuration - adjustedCurrentTime;

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

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const formatTimeWithHours = (seconds) => {
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
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(!isMuted);
      }
    };

    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const handleMouseLeave = () => {
      setShowControls(false);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };

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

        {/* Overlay Controls */}
        {showControls && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
              p: 2,
            }}
          >
            {/* Progress Bar */}
            <Box sx={{ mb: 2 }}>
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
                  },
                }}
              />
            </Box>

            {/* Control Buttons and Timing */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={togglePlayPause} sx={{ color: "white" }}>
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton onClick={toggleMute} sx={{ color: "white" }}>
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
                <Typography variant="body2" sx={{ color: "white", ml: 2 }}>
                  {playbackRate}x
                </Typography>
              </Box>

              {/* Timing Display */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Typography variant="caption" sx={{ color: "white" }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>
                {playbackRate !== 1 && (
                  <Typography
                    variant="caption"
                    sx={{ color: "white", opacity: 0.8 }}
                  >
                    {formatTimeWithHours(adjustedCurrentTime)} /{" "}
                    {formatTimeWithHours(adjustedDuration)}
                  </Typography>
                )}
              </Box>
            </Box>
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
