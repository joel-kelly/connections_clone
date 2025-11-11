# Setup Guide

Complete step-by-step guide to get your Connections clone up and running.

## Prerequisites

- Node.js 18+ installed
- Git (for cloning)
- A Google account (for Sheets integration)

## Installation Steps

### 1. Clone and Install

```bash
# Navigate to your project directory
cd connections_clone

# Install all dependencies
npm run install:all
```

This will install dependencies for the root project, frontend, and backend.

### 2. Configure Backend

```bash
# Copy environment template
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=3001
GOOGLE_SHEET_ID=your_google_sheet_id_here
SUBMIT_PASSWORD=your_password_here
```

**Environment Variables:**
- `PORT` - Backend server port (default: 3001)
- `GOOGLE_SHEET_ID` - Your Google Sheets puzzle database ID (optional for dev)
- `SUBMIT_PASSWORD` - Password for puzzle submission page (defaults to "kellyconnect")

**Note**: The app works with sample puzzles without Google Sheets. You can skip the Google Sheets setup initially and add it later.

### 3. Run the Development Server

```bash
# From the root directory
npm run dev
```

This starts:
- Frontend on http://localhost:3000
- Backend on http://localhost:3001

### 4. Access the Game

- **On your computer**: Visit http://localhost:3000
- **On your phone** (same WiFi): Visit http://YOUR_COMPUTER_IP:3000
  - Find your IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)

## Testing

1. Open the game in your browser
2. Click "Play" on the welcome screen
3. Select a puzzle from the list
4. Try the sample puzzles!

## Next Steps

- **Set up Google Sheets**: See [Google Sheets Setup](GOOGLE_SHEETS_SETUP.md)
- **Deploy to your server**: See [Deployment Guide](DEPLOYMENT.md)
- **Create puzzle submission form**: See [Puzzle Submission](PUZZLE_SUBMISSION.md)

## Troubleshooting

### Frontend won't start
- Check Node.js version: `node --version` (should be 18+)
- Delete `node_modules` and reinstall: `npm run install:all`

### Backend errors
- Check if port 3001 is available
- Verify `.env` file exists in `backend/`

### Can't access from phone
- Make sure your computer and phone are on the same WiFi
- Check firewall isn't blocking ports 3000/3001
- Try http (not https)

### No puzzles showing
- Backend is serving 3 sample puzzles by default
- Check browser console for errors
- Verify backend is running on port 3001
