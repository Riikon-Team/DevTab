# DevTab - Developer's New Tab Extension

A modern, customizable browser extension that transforms your new tab page into a powerful developer dashboard with weather, GitHub stats, notes, bookmarks, and more.


### Important: The information below is for v2 and is subject to change for the upcoming v3 release.

## 🌟 Features

### 📊 **GitHub Integration**
- View your GitHub profile statistics
- Language usage charts and commit activity
- Repository and star counts
- Customizable display options

### 🌤️ **Weather Widget**
- Real-time weather information
- Multi-day forecasts with hourly details
- Support for multiple cities and coordinates
- Customizable temperature scales (Celsius/Fahrenheit)

### 📝 **Notes & Tasks**
- Create, edit, and organize notes
- Task completion tracking
- Color-coded notes with tags
- Deadline management with overdue alerts

### 🔖 **Smart Bookmarks**
- Quick access to your browser bookmarks
- Folder organization with expandable menus
- Customizable icon sizes and labels
- Smooth scrolling navigation

### 🔍 **Search Engine**
- Multiple search engine support (Google, Bing, DuckDuckGo)
- Auto-complete suggestions
- Keyboard navigation
- Customizable default engine

### ⏰ **Digital Clock**
- Multiple timezone support
- 12/24 hour format options
- Weekday display
- Customizable appearance

### 🎨 **Background Customization**
- Built-in beautiful backgrounds
- Custom image/video URL support
- Parallax effect with mouse tracking
- Brightness adjustment

## 🚀 Installation

### From Source
1. Clone the repository:
   ```bash
   git clone https://github.com/riikon/devtab.git
   cd devtab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in browser:
   - **Chrome/Edge**: Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", select the `dist` folder
   - **Firefox**: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select `manifest.json` from the `dist` folder

### From Release
Download the latest release from the [Releases page](https://github.com/riikon/devtab/releases) and follow the browser-specific installation instructions above.

## ⚙️ Configuration

### General Settings
- **Dark/Light Mode**: Toggle between themes
- **Primary Color**: Customize the accent color
- **Background**: Choose from built-in images or add custom URLs

### GitHub Settings
- **Username**: Enter your GitHub username
- **Cache Duration**: Set how long to cache data (1-60 minutes)
- **Display Options**: Choose which stats to show
- **Excluded Languages**: Filter out specific programming languages

### Weather Settings
- **Location**: Set your city or coordinates
- **Temperature Scale**: Celsius or Fahrenheit
- **Refresh Interval**: Update frequency (15-120 minutes)
- **Font Size**: Adjust text size (10-18px)

### Notes Settings
- **Expanded View**: Show detailed note information
- **Sort Options**: Sort by creation date, deadline, or title
- **Deadline Display**: Show/hide deadline information
- **Background Effects**: Transparent background with blur

### Bookmark Settings
- **Show Labels**: Display bookmark titles
- **Show Icons**: Display favicons
- **Show Folders**: Include folder bookmarks
- **Icon Size**: Adjust icon size (8-24px)

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run type checking
npm run type-check
```

### Project Structure
```
src/
├── components/          # React components
│   ├── Background/     # Background customization
│   ├── Bookmark/       # Bookmark management
│   ├── Clock/          # Digital clock
│   ├── Github/         # GitHub integration
│   ├── Notes/          # Notes and tasks
│   ├── SearchEngine/   # Search functionality
│   ├── Setting/        # Settings panel
│   └── Weather/        # Weather widget
├── constants/          # Type definitions and constants
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── layouts/            # Layout components
├── utils/              # Utility functions
└── main.tsx           # Application entry point
```

### Technologies Used
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Material-UI (MUI)** for UI components
- **Chart.js** for data visualization
- **date-fns** for date manipulation
- **Axios** for HTTP requests

## 🎯 Performance Optimizations

- **Code Splitting**: Dynamic imports for heavy components
- **Memoization**: React.memo and useMemo for performance
- **Bundle Optimization**: Manual chunks for vendor libraries
- **Lazy Loading**: Components loaded on demand
- **Caching**: Local storage for API responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Add proper error handling
- Include appropriate tests
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) for the beautiful UI components
- [Chart.js](https://www.chartjs.org/) for data visualization
- [Vite](https://vitejs.dev/) for the excellent build tool
- [React](https://reactjs.org/) for the amazing framework

## 📞 Contact

- **Email**: riikon04@gmail.com
- **Website**: https://riikon.com
- **GitHub**: https://github.com/riikon

---

Made with ❤️ by the Riikon Team
