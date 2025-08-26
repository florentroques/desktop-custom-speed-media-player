import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  Switch,
  Slider,
  Typography,
  Box,
  Divider,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Grid,
} from "@mui/material";

const SettingsDialog = ({ open, onClose }) => {
  const [settings, setSettings] = useState({
    autoPlay: false,
    rememberLastPosition: true,
    defaultVolume: 0.7,
    defaultSpeed: 1.0,
    showSubtitles: false,
    subtitleLanguage: "en",
    videoQuality: "auto",
    enableHardwareAcceleration: true,
    rememberWindowSize: true,
    startMinimized: false,
  });

  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSave = () => {
    // In a real app, you'd save these settings to localStorage or a config file
    console.log("Settings saved:", settings);
    onClose();
  };

  const handleReset = () => {
    setSettings({
      autoPlay: false,
      rememberLastPosition: true,
      defaultVolume: 0.7,
      defaultSpeed: 1.0,
      showSubtitles: false,
      subtitleLanguage: "en",
      videoQuality: "auto",
      enableHardwareAcceleration: true,
      rememberWindowSize: true,
      startMinimized: false,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Playback Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Playback
            </Typography>
            <Box sx={{ pl: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoPlay}
                    onChange={(e) =>
                      handleSettingChange("autoPlay", e.target.checked)
                    }
                  />
                }
                label="Auto-play videos"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.rememberLastPosition}
                    onChange={(e) =>
                      handleSettingChange(
                        "rememberLastPosition",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Remember last playback position"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showSubtitles}
                    onChange={(e) =>
                      handleSettingChange("showSubtitles", e.target.checked)
                    }
                  />
                }
                label="Show subtitles by default"
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Default Values */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Default Volume
            </Typography>
            <Slider
              value={settings.defaultVolume}
              onChange={(e, value) =>
                handleSettingChange("defaultVolume", value)
              }
              min={0}
              max={1}
              step={0.1}
              marks={[
                { value: 0, label: "0%" },
                { value: 0.5, label: "50%" },
                { value: 1, label: "100%" },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Default Speed
            </Typography>
            <Slider
              value={settings.defaultSpeed}
              onChange={(e, value) =>
                handleSettingChange("defaultSpeed", value)
              }
              min={0.1}
              max={4}
              step={0.1}
              marks={[
                { value: 0.5, label: "0.5x" },
                { value: 1, label: "1x" },
                { value: 2, label: "2x" },
                { value: 4, label: "4x" },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value.toFixed(1)}x`}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Subtitle Settings */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Subtitle Language</InputLabel>
              <Select
                value={settings.subtitleLanguage}
                onChange={(e) =>
                  handleSettingChange("subtitleLanguage", e.target.value)
                }
                label="Subtitle Language"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="it">Italian</MenuItem>
                <MenuItem value="pt">Portuguese</MenuItem>
                <MenuItem value="ru">Russian</MenuItem>
                <MenuItem value="ja">Japanese</MenuItem>
                <MenuItem value="ko">Korean</MenuItem>
                <MenuItem value="zh">Chinese</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Video Quality</InputLabel>
              <Select
                value={settings.videoQuality}
                onChange={(e) =>
                  handleSettingChange("videoQuality", e.target.value)
                }
                label="Video Quality"
              >
                <MenuItem value="auto">Auto</MenuItem>
                <MenuItem value="1080p">1080p</MenuItem>
                <MenuItem value="720p">720p</MenuItem>
                <MenuItem value="480p">480p</MenuItem>
                <MenuItem value="360p">360p</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Performance Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Performance
            </Typography>
            <Box sx={{ pl: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableHardwareAcceleration}
                    onChange={(e) =>
                      handleSettingChange(
                        "enableHardwareAcceleration",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Enable hardware acceleration"
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Application Settings */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Application
            </Typography>
            <Box sx={{ pl: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.rememberWindowSize}
                    onChange={(e) =>
                      handleSettingChange(
                        "rememberWindowSize",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Remember window size and position"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.startMinimized}
                    onChange={(e) =>
                      handleSettingChange("startMinimized", e.target.checked)
                    }
                  />
                }
                label="Start minimized"
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset}>Reset to Defaults</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
