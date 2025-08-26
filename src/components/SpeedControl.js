import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Slider,
  Typography,
  Popover,
  Paper,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { Speed, Add, Remove } from "@mui/icons-material";

const SpeedControl = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [customSpeed, setCustomSpeed] = useState(value);

  const presetSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePresetClick = (speed) => {
    onChange(speed);
    setCustomSpeed(speed);
    handleClose();
  };

  const handleCustomSpeedChange = (event, newValue) => {
    setCustomSpeed(newValue);
  };

  const handleCustomSpeedCommit = () => {
    onChange(customSpeed);
    handleClose();
  };

  const handleIncrement = () => {
    const newSpeed = Math.min(16, value + 0.25);
    onChange(newSpeed);
  };

  const handleDecrement = () => {
    const newSpeed = Math.max(0.1, value - 0.25);
    onChange(newSpeed);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Tooltip title="Decrease Speed">
        <IconButton size="small" onClick={handleDecrement}>
          <Remove />
        </IconButton>
      </Tooltip>

      <Button
        variant="outlined"
        size="small"
        onClick={handleClick}
        startIcon={<Speed />}
        sx={{ minWidth: 80 }}
      >
        {value.toFixed(2)}x
      </Button>

      <Tooltip title="Increase Speed">
        <IconButton size="small" onClick={handleIncrement}>
          <Add />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Paper sx={{ p: 2, minWidth: 300 }}>
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
                  onClick={() => handlePresetClick(speed)}
                  variant={value === speed ? "contained" : "outlined"}
                  sx={{ minWidth: 50 }}
                >
                  {speed}x
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Custom Speed Slider */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Custom Speed: {customSpeed.toFixed(2)}x
            </Typography>
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
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button size="small" onClick={handleClose}>
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
  );
};

export default SpeedControl;
