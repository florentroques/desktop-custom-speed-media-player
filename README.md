# Custom Speed Video Player

A cross-platform native desktop video player application built with Electron and React, featuring advanced custom speed controls and a modern user interface.

## Features

### 🎬 Video Playback

- Support for multiple video formats (MP4, AVI, MKV, MOV, WMV, FLV, WebM, M4V)
- Custom video controls with progress bar
- Fullscreen mode support
- Hardware acceleration support

### ⚡ Custom Speed Controls

- **Preset speeds**: 0.25x, 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x, 3x, 4x
- **Custom speed slider**: Fine-tune playback speed from 0.1x to 16x
- **Quick increment/decrement**: Adjust speed by 0.25x increments
- **Real-time speed display**: Shows current playback speed

### 🎛️ Advanced Controls

- Volume control with mute toggle
- Keyboard shortcuts for quick access
- Playlist management
- Settings dialog with comprehensive options
- Custom title bar with window controls

### ⌨️ Keyboard Shortcuts

- **Space**: Play/Pause
- **F**: Toggle fullscreen
- **M**: Toggle mute
- **←/→**: Skip 10 seconds backward/forward
- **↑/↓**: Increase/decrease volume

### 🎨 Modern UI

- Dark theme with Material-UI components
- Responsive design
- Smooth animations and transitions
- Intuitive user interface

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd custom-speed-video-player
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

This will start both the React development server and the Electron application.

### Building for Production

#### Build for all platforms

```bash
npm run dist
```

#### Build for specific platforms

```bash
# Windows
npm run dist:win

# macOS
npm run dist:mac

# Linux
npm run dist:linux
```

The built applications will be available in the `dist` folder.

## Usage

### Opening Videos

1. Click the "Open Video File" button or use the speed dial menu
2. Select a video file from your computer
3. The video will load and start playing

### Adjusting Playback Speed

1. **Using preset buttons**: Click the speed control button to open the speed menu
2. **Using the slider**: Drag the custom speed slider for precise control
3. **Using increment buttons**: Click the +/- buttons for quick adjustments
4. **Keyboard shortcuts**: Use the speed dial menu for quick access

### Managing Playlist

1. Open the playlist panel using the speed dial menu
2. Click on any video in the playlist to switch to it
3. Videos will automatically advance to the next in the playlist

### Settings

1. Click the settings icon in the control bar
2. Adjust various settings including:
   - Default volume and speed
   - Auto-play behavior
   - Subtitle preferences
   - Performance options
   - Application behavior

## Project Structure

```
custom-speed-video-player/
├── electron/                 # Electron main process
│   ├── main.js              # Main process entry point
│   └── preload.js           # Preload script for secure IPC
├── public/                  # Static assets
│   └── index.html           # Main HTML file
├── src/                     # React application
│   ├── components/          # React components
│   │   ├── VideoPlayer.js   # Video player component
│   │   ├── SpeedControl.js  # Speed control component
│   │   ├── Playlist.js      # Playlist management
│   │   └── SettingsDialog.js # Settings dialog
│   ├── App.js               # Main application component
│   └── index.js             # React entry point
├── package.json             # Project configuration
└── README.md               # This file
```

## Technology Stack

- **Electron**: Cross-platform desktop application framework
- **React**: User interface library
- **Material-UI**: Component library for modern UI
- **HTML5 Video API**: Native video playback capabilities

## Development

### Available Scripts

- `npm start`: Start development server
- `npm run build`: Build React application
- `npm run test`: Run tests
- `npm run dist`: Build for distribution
- `npm run eject`: Eject from Create React App

### Code Style

- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Add comments for complex logic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

1. **Video not playing**: Ensure the video format is supported by your browser
2. **Speed controls not working**: Check that the video element is properly loaded
3. **Build errors**: Make sure all dependencies are installed correctly

### Performance Tips

- Enable hardware acceleration in settings for better performance
- Use supported video formats for optimal playback
- Close other applications to free up system resources

## Roadmap

- [ ] Subtitle support
- [ ] Video effects and filters
- [ ] Screenshot capture
- [ ] Video trimming
- [ ] Multiple audio track support
- [ ] Network streaming support
- [ ] Plugin system
- [ ] Cloud storage integration

## Support

For support and questions, please open an issue on the GitHub repository.
