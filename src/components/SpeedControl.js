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
  TextField,
} from "@mui/material";
import { Speed, Add, Remove } from "@mui/icons-material";

const SpeedControl = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [customSpeed, setCustomSpeed] = useState(value);
  const [textInputValue, setTextInputValue] = useState(value.toFixed(2));

  const presetSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setCustomSpeed(value);
    setTextInputValue(value.toFixed(2));
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
    setTextInputValue(newValue.toFixed(2));
  };

  const handleTextInputChange = (event) => {
    const inputValue = event.target.value;
    setTextInputValue(inputValue);

    // Parse the input value and update custom speed if valid
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue) && parsedValue >= 0.1 && parsedValue <= 16) {
      setCustomSpeed(parsedValue);
    }
  };

  const handleTextInputKeyPress = (event) => {
    if (event.key === "Enter") {
      const parsedValue = parseFloat(textInputValue);
      if (!isNaN(parsedValue) && parsedValue >= 0.1 && parsedValue <= 16) {
        setCustomSpeed(parsedValue);
        setTextInputValue(parsedValue.toFixed(2));
      } else {
        // Reset to current custom speed if invalid
        setTextInputValue(customSpeed.toFixed(2));
      }
    }
  };

  const handleCustomSpeedCommit = () => {
    const parsedValue = parseFloat(textInputValue);
    if (!isNaN(parsedValue) && parsedValue >= 0.1 && parsedValue <= 16) {
      onChange(parsedValue);
    } else {
      // Use the slider value if text input is invalid
      onChange(customSpeed);
    }
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

          {/* Custom Speed Input */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Custom Speed
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <TextField
                size="small"
                value={textInputValue}
                onChange={handleTextInputChange}
                onKeyPress={handleTextInputKeyPress}
                onBlur={() => {
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
