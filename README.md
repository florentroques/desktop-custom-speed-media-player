# Desktop Custom Speed Media Player

A modern, cross-platform desktop media player built with Electron and React, featuring advanced custom speed controls and a sleek user interface. Supports both video and audio files with the same powerful speed control features.

## ✨ Features

### 🎬 Video Playback

- **Multiple Formats**: MP4, AVI, MKV, MOV, WMV, FLV, WebM, M4V
- **Hardware Acceleration**: Optimized performance with GPU support
- **Fullscreen Mode**: Immersive viewing experience
- **Custom Controls**: Intuitive video controls with progress tracking

### 🎵 Audio Playback

- **Multiple Formats**: MP3, WAV, FLAC, AAC, OGG, M4A, WMA, OPUS
- **Audio Visualizer**: Beautiful music-themed interface with metadata display
- **Title Display**: Shows filename and extracted metadata when available
- **Same Speed Controls**: All speed features work identically for audio files

### ⚡ Advanced Speed Controls

- **Preset Speeds**: 0.25x, 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x, 3x, 4x
- **Custom Speed Slider**: Fine-tune from 0.1x to 16x
- **Quick Adjustments**: +/- buttons for 0.25x increments
- **Real-time Display**: Shows current playback speed

### 🎛️ User Experience

- **Keyboard Shortcuts**: Space (play/pause), F (fullscreen for video), M (mute), arrows (skip/volume)
- **Volume Control**: Slider with mute toggle
- **Playlist Support**: Queue multiple media files (video or audio)
- **Modern UI**: Dark theme with Material-UI components, adaptive interface for audio/video
- **File Association**: Set as default media player for both video and audio files
- **Loop Mode**: Repeat single files indefinitely
- **Smart Detection**: Automatically detects and handles audio vs video files

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd desktop-custom-speed-media-player

# Install dependencies
npm install

# Start development server
npm start
```

### Building for Production

```bash
# Build for all platforms
npm run dist

# Build for specific platform
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

## 📖 Usage

### Opening Media Files

1. Click "Open Media File" button
2. Select a video or audio file from your computer
3. The media will load and start playing
4. Audio files display with a music-themed interface
5. Video files display in the standard video player interface

### File Association

Set the app as your default media player to double-click any video or audio file:

#### Windows

##### Automatic Setup

File associations are automatically registered during installation for common video and audio formats.

##### Manual Setup

```bash
# Run setup script (requires admin privileges)
npm run setup-associations-windows
```

##### Alternative Methods

- **Windows Settings**: Right-click media file → "Open with" → "Choose another app" → Select "Desktop Custom Speed Media Player"
- **Command Prompt** (admin):
  ```cmd
  # For video files (example with MP4)
  assoc .mp4=CustomSpeedMediaPlayer.mp4
  ftype CustomSpeedMediaPlayer.mp4="C:\path\to\Desktop Custom Speed Media Player.exe" "%1"
  
  # For audio files (example with MP3)
  assoc .mp3=CustomSpeedMediaPlayer.mp3
  ftype CustomSpeedMediaPlayer.mp3="C:\path\to\Desktop Custom Speed Media Player.exe" "%1"
  ```

#### macOS

##### Prerequisites

Install `duti` (a command-line tool for managing file associations):

```bash
# Using Homebrew
brew install duti

# Or download from: https://github.com/moretension/duti
```

##### Setup File Associations

1. **Build the app first**:
   ```bash
   npm run dist:mac
   ```

2. **Run the setup script**:
   ```bash
   npm run setup-associations-mac
   ```

3. **Restart Finder** (optional but recommended):
   ```bash
   killall Finder
   ```

##### Manual Setup

If the automatic setup doesn't work, you can manually set associations:

1. Right-click on a media file in Finder
2. Select "Get Info"
3. Under "Open with", select "Desktop Custom Speed Media Player"
4. Click "Change All..." to apply to all files of this type
5. Repeat for other media formats (video: MP4, AVI, MKV, etc.; audio: MP3, FLAC, WAV, etc.)

##### Verify Associations

Check if associations are working:
```bash
# Run the test script
npm run test-associations-mac

# Or manually check
duti -x .mp4
```

This should show "Desktop Custom Speed Media Player" as the default app.

### Speed Controls

- **Preset Buttons**: Click speed control button for preset options
- **Custom Slider**: Drag for precise speed control (0.1x - 16x)
- **Quick Buttons**: Use +/- buttons for 0.25x increments
- **Keyboard**: Access speed menu for quick changes

### Keyboard Shortcuts

| Key     | Action            |
| ------- | ----------------- |
| `Space` | Play/Pause        |
| `F`     | Toggle Fullscreen |
| `M`     | Toggle Mute       |
| `←/→`   | Skip 10 seconds   |
| `↑/↓`   | Volume up/down    |

## 🏗️ Project Structure

```
desktop-custom-speed-media-player/
├── electron/                 # Electron main process
│   ├── main.js              # Main process entry point
│   ├── preload.js           # Preload script for IPC
│   └── assets/              # Icons and assets
├── src/                     # React application
│   ├── components/          # React components
│   │   └── MediaPlayer.js   # Main media player component
│   └── App.js               # Main application component
├── scripts/                 # Build and utility scripts
│   ├── setup-file-associations-windows.js
│   └── ...
├── public/                  # Static assets
└── dist/                    # Built applications
```

## 🛠️ Development

### Available Scripts

```bash
npm start                    # Start development server
npm run build               # Build React application
npm run dist                # Build for distribution
npm run dist:win            # Build Windows executable
npm run dist:mac            # Build macOS application
npm run setup-associations-windows  # Setup file associations (Windows)
npm run setup-associations-mac      # Setup file associations (macOS)
npm run test-associations-mac       # Test file associations (macOS)
```

### Technology Stack

- **Electron**: Cross-platform desktop framework
- **React**: User interface library
- **Material-UI**: Component library
- **HTML5 Video API**: Native video playback

## 🌍 Cross-Platform Support

### Windows

- ✅ File association setup
- ✅ Single instance application
- ✅ Command line support
- ✅ Drag & drop support

### macOS

- ✅ File association setup (with duti)
- ✅ Single instance application
- ✅ Command line support
- ✅ Drag & drop support
- ✅ Native macOS integration

### Linux

- ✅ Command line arguments
- ✅ Drag & drop support
- ⚠️ Manual file association setup required

## 🔧 Troubleshooting

### Common Issues

1. **Media not playing**: Ensure format is supported
   - Video: MP4, AVI, MKV, MOV, WMV, FLV, WebM, M4V
   - Audio: MP3, WAV, FLAC, AAC, OGG, M4A, WMA, OPUS
2. **Speed controls not working**: Check media element is properly loaded
3. **File associations not working**: Run setup script with admin privileges
4. **Build errors**: Ensure all dependencies are installed
5. **Audio files showing as video**: Check file extension is in supported audio formats list

### macOS-Specific Issues

1. **File associations not working after setup**:
   - Restart Finder: `killall Finder`
   - Log out and back in
   - Check if `duti` is installed: `which duti`
   - Verify associations: `duti -x .mp4`

2. **App not opening files**:
   - Ensure the app is built: `npm run dist:mac`
   - Check app bundle exists: `ls -la dist/mac/`
   - Try manual association in Finder

3. **Permission issues**:
   - Grant necessary permissions in System Preferences → Security & Privacy
   - Allow the app to control your computer if prompted

### Performance Tips

- Enable hardware acceleration for better video performance
- Use supported media formats for optimal playback
- Close other applications to free up system resources
- Audio files typically use less CPU than video files
- Large FLAC files may take longer to load than compressed formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support and questions, please open an issue on the GitHub repository.
