# Connections Clone

A clone of the New York Times Connections game, designed for family use with Google Sheets as the backend for puzzle management.

## Features

- 🎮 **Full Game Mechanics** - 4x4 word grid with category matching
- 📱 **Mobile Optimized** - Especially for iPhone users
- 🎨 **NYT-Style UI** - Authentic look and feel with smooth animations
- 💾 **Progress Tracking** - LocalStorage remembers your game state
- 🔄 **Multi-Puzzle Support** - Browse and play multiple puzzles
- 📤 **iOS Share** - Share results with colored emoji squares
- 📊 **Google Sheets Backend** - Easy puzzle management
- ✨ **Animations** - Shake on error, smooth category reveals

## Tech Stack

- **Frontend**: React + Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js + Express
- **Data**: Google Sheets API
- **Storage**: LocalStorage for game state

## Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Set Up Backend

Copy the example environment file:

```bash
cp backend/.env.example backend/.env
```

The app will work with sample puzzles without Google Sheets setup. To connect to Google Sheets, see `docs/GOOGLE_SHEETS_SETUP.md`.

### 3. Run Development Server

```bash
npm run dev
```

This starts both frontend (http://localhost:3000) and backend (http://localhost:3001).

### 4. Access the Game

Open http://localhost:3000 in your browser (or on your phone if on same network).

## Project Structure

```
connections-clone/
├── frontend/           # React + Vite app
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── App.jsx     # Main app with routing
│   │   └── main.jsx    # Entry point
│   └── package.json
├── backend/            # Express API server
│   ├── server.js       # API routes
│   ├── sheets.js       # Google Sheets integration
│   └── package.json
└── docs/               # Documentation
```

## Documentation

- **[Setup Guide](docs/SETUP_GUIDE.md)** - Complete setup instructions
- **[Google Sheets Setup](docs/GOOGLE_SHEETS_SETUP.md)** - Connect to Google Sheets
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deploy to your home server

## Game Rules

1. You have 16 words and must find 4 groups of 4 related words
2. Select 4 words and submit your guess
3. You get 4 mistakes before game over
4. Categories are color-coded by difficulty:
   - 🟨 Yellow (easiest)
   - 🟩 Green
   - 🟦 Blue
   - 🟪 Purple (hardest)

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Build for Production
```bash
npm run build
```

## Deployment

See `docs/DEPLOYMENT.md` for detailed deployment instructions for:
- Docker deployment
- Bare metal deployment
- Nginx configuration

## License

MIT
