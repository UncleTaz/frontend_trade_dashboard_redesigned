# Railway Live Trade Dashboard - Frontend

A modern, responsive React TypeScript application for monitoring and visualizing live trading data. This dashboard provides real-time insights into trading performance, equity curves, and detailed trade analytics.

## 🚀 Features

- **Real-time Trade Monitoring**: Live updates of trading activity and performance
- **Interactive Equity Curve**: Visual representation of trading performance over time
- **Comprehensive Statistics**: Detailed analytics including win rate, profit/loss, and risk metrics
- **Trade List Management**: Sortable and filterable trade history
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Material-UI Components**: Modern, accessible user interface
- **Progressive Loading**: Smooth user experience with progressive content loading

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2.0
- **Language**: TypeScript 4.9.5
- **UI Library**: Material-UI (MUI) 5.17.1
- **Charts**: Recharts 2.7.2
- **HTTP Client**: Axios 1.10.0
- **Date Handling**: date-fns 2.29.3
- **Virtualization**: react-window for performance optimization
- **Build Tool**: React Scripts 5.0.1

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/frontend_trade_dashboard_redesigned.git
cd frontend_trade_dashboard_redesigned
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Update the environment variables:

```env
# URL of the backend API
REACT_APP_API_URL=https://your-backend-api-url.com/api

# Port for local development
PORT=3000
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Serve production build locally
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (⚠️ irreversible)

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AboutContent/    # About section component
│   ├── BotSettings/     # Bot configuration settings
│   ├── Dashboard/       # Main dashboard layout
│   ├── EquityCurve/     # Equity curve visualization
│   ├── ProgressiveParagraph/ # Progressive text loading
│   ├── Statistics/      # Trading statistics display
│   ├── StatTooltip/     # Statistical tooltips
│   └── TradeList/       # Trade history table
├── hooks/               # Custom React hooks
├── services/            # API services and utilities
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles
```

## 🔧 Configuration

### API Integration

The application connects to a backend API for real-time trading data. Configure the API endpoint in your `.env` file:

```env
REACT_APP_API_URL=https://bot-trades-web-dashboard-backend-production.up.railway.app/api
```

### Build Configuration

The project uses standard Create React App configuration with TypeScript support. Build settings can be customized in `tsconfig.json`.

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Deployment Options

- **Railway**: Configured for Railway deployment with automatic builds
- **Netlify/Vercel**: Compatible with static hosting platforms
- **Docker**: Can be containerized for deployment

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Tests are written using React Testing Library and Jest.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🔗 Related Projects

- Backend API: [Railway Live Trade Dashboard Backend]
- Documentation: [Project Documentation]

## 📞 Support

For support and questions, please contact the development team.

---

**Built with ❤️ for efficient trading analysis**
