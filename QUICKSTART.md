# Quick Start Guide

Get your Connections game running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm run install:all
```

## Step 2: Start Development Server

```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Step 3: Open the Game

Visit **http://localhost:3000** in your browser!

You'll see 3 sample puzzles ready to play.

---

## Next Steps

### Want to use your own puzzles from Google Sheets?

1. Follow the [Google Sheets Setup Guide](docs/GOOGLE_SHEETS_SETUP.md)
2. Add your Sheet ID to `backend/.env`
3. Add your credentials to `backend/credentials.json`
4. Restart the dev server

### Want to deploy to your home server?

See the [Deployment Guide](docs/DEPLOYMENT.md) for:
- Docker deployment (easiest)
- Bare metal deployment
- Making it accessible to your family

### Want family to submit puzzles?

See the [Puzzle Submission Guide](docs/PUZZLE_SUBMISSION.md) for setting up a Google Form.

---

## Troubleshooting

**Can't access from phone?**
- Make sure phone is on same WiFi
- Use `http://YOUR_COMPUTER_IP:3000`
- Find your IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)

**Port already in use?**
- Kill process on port 3000: `lsof -i :3000` then `kill -9 PID`
- Or change port in `frontend/vite.config.js`

**No puzzles showing?**
- Check backend is running on port 3001
- Open browser console for errors
- Sample puzzles should work without any setup

---

## Project Structure

```
connections_clone/
├── frontend/           # React app
│   ├── src/
│   │   ├── components/ # UI components
│   │   └── App.jsx     # Main app
│   └── package.json
├── backend/            # Express API
│   ├── server.js       # API server
│   ├── sheets.js       # Google Sheets
│   └── package.json
└── docs/               # Documentation
```

---

## Game Controls

- **Select words**: Tap/click 4 words
- **Submit**: Check if they're a category
- **Shuffle**: Rearrange remaining words
- **Deselect All**: Clear selection

---

## Questions?

Check the [full README](README.md) or specific guides in `docs/`
