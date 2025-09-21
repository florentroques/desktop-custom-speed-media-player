# Desktop Custom Speed Video Player

A modern, cross-platform desktop video player built with Electron and React, featuring advanced custom speed controls and a sleek user interface.

## ✨ Features

### 🎬 Video Playback

- **Multiple Formats**: MP4, AVI, MKV, MOV, WMV, FLV, WebM, M4V
- **Hardware Acceleration**: Optimized performance with GPU support
- **Fullscreen Mode**: Immersive viewing experience
- **Custom Controls**: Intuitive video controls with progress tracking

### ⚡ Advanced Speed Controls

- **Preset Speeds**: 0.25x, 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x, 3x, 4x
- **Custom Speed Slider**: Fine-tune from 0.1x to 16x
- **Quick Adjustments**: +/- buttons for 0.25x increments
- **Real-time Display**: Shows current playback speed

### 🎛️ User Experience

- **Keyboard Shortcuts**: Space (play/pause), F (fullscreen), M (mute), arrows (skip/volume)
- **Volume Control**: Slider with mute toggle
- **Playlist Support**: Queue multiple videos
- **Modern UI**: Dark theme with Material-UI components
- **File Association**: Set as default video player (Windows)

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd custom-speed-video-player

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

### Opening Videos

1. Click "Open Video File" button
2. Select a video file from your computer
3. The video will load and start playing

### File Association

Set the app as your default video player to double-click any video file:

#### Windows

##### Automatic Setup

File associations are automatically registered during installation for common video formats.

##### Manual Setup

```bash
# Run setup script (requires admin privileges)
npm run setup-associations-windows
```

##### Alternative Methods

- **Windows Settings**: Right-click video file → "Open with" → "Choose another app" → Select "Custom Speed Video Player"
- **Command Prompt** (admin):
  ```cmd
  assoc .mp4=CustomSpeedVideoPlayer.mp4
  ftype CustomSpeedVideoPlayer.mp4="C:\path\to\Custom Speed Video Player.exe" "%1"
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

1. Right-click on a video file in Finder
2. Select "Get Info"
3. Under "Open with", select "Custom Speed Video Player"
4. Click "Change All..." to apply to all files of this type
5. Repeat for other video formats (MP4, AVI, MKV, etc.)

##### Verify Associations

Check if associations are working:
```bash
# Run the test script
npm run test-associations-mac

# Or manually check
duti -x .mp4
```

This should show "Custom Speed Video Player" as the default app.

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
custom-speed-video-player/
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

1. **Video not playing**: Ensure format is supported (MP4, AVI, MKV, etc.)
2. **Speed controls not working**: Check video element is properly loaded
3. **File associations not working**: Run setup script with admin privileges
4. **Build errors**: Ensure all dependencies are installed

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

- Enable hardware acceleration for better performance
- Use supported video formats for optimal playback
- Close other applications to free up system resources

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
