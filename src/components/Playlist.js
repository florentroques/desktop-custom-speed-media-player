import React from "react";
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import { Close, PlayArrow, Delete } from "@mui/icons-material";

const Playlist = ({ playlist, currentIndex, onItemClick, onClose }) => {
  const getFileName = (path) => {
    return path.split(/[\\/]/).pop() || path;
  };

  const formatDuration = (duration) => {
    if (!duration || isNaN(duration)) return "--:--";
    const mins = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Paper
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 300,
        height: "100%",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Playlist</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      <Divider />

      {playlist.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No videos in playlist
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Open a video file to add it to the playlist
          </Typography>
        </Box>
      ) : (
        <List sx={{ flexGrow: 1, overflow: "auto" }}>
          {playlist.map((video, index) => (
            <ListItem
              key={index}
              disablePadding
              secondaryAction={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {index === currentIndex && (
                    <Chip
                      label="Now Playing"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  <IconButton size="small">
                    <Delete />
                  </IconButton>
                </Box>
              }
            >
              <ListItemButton
                onClick={() => onItemClick(index)}
                selected={index === currentIndex}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  },
                }}
              >
                <ListItemText
                  primary={getFileName(video)}
                  secondary={`Track ${index + 1}`}
                  primaryTypographyProps={{
                    variant: "body2",
                    noWrap: true,
                  }}
                  secondaryTypographyProps={{
                    variant: "caption",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      <Divider />

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {playlist.length} video{playlist.length !== 1 ? "s" : ""} in playlist
        </Typography>
      </Box>
    </Paper>
  );
};

export default Playlist;
