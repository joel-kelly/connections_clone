# Google Sheets Setup Guide

Connect your Connections game to Google Sheets for easy puzzle management.

## Overview

Your family can create puzzles in a Google Sheet, and the game will fetch them automatically. This guide walks you through:
1. Creating the Google Sheet
2. Setting up Google Cloud API access
3. Connecting your backend

## Part 1: Create Your Puzzle Sheet

### 1. Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Connections Puzzles" (or whatever you like)

### 2. Set Up the Sheet Structure

Rename the first sheet to "Puzzles" and create these columns in Row 1:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| puzzle_id | title | author | date_created | yellow_category | yellow_words | green_category | green_words | blue_category | blue_words | purple_category | purple_words | status |

### 3. Add Sample Puzzle

Add this sample puzzle in Row 2:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Fish & Planets | John | 2024-01-15 | FISH | BASS,FLOUNDER,SALMON,TROUT | PLANETS | EARTH,MARS,VENUS,JUPITER | ___ PAPER | TOILET,NEWS,WALL,SAND | STARTS WITH METALS | GOLDEN,LEADERSHIP,IRONIC,BRAZEN | published |

**Important**:
- Words should be comma-separated with no spaces: `WORD1,WORD2,WORD3,WORD4`
- Use uppercase for consistency
- Each category needs exactly 4 words
- **Status column**: Set to "published" to show in game, "hidden" to hide
  - New puzzles submitted via the web form are automatically "published"
  - Change status to "hidden" if you want to temporarily hide a puzzle

### 4. Get Your Sheet ID

Your Google Sheet URL looks like:
```
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
```

Copy the `SHEET_ID_HERE` part - you'll need it later.

## Part 2: Set Up Google Cloud API

### 1. Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### 2. Create a New Project

1. Click the project dropdown (top left)
2. Click "New Project"
3. Name it "Connections Game"
4. Click "Create"

### 3. Enable Google Sheets API

1. In the search bar, type "Google Sheets API"
2. Click on "Google Sheets API"
3. Click "Enable"

### 4. Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name: "connections-backend"
4. Click "Create and Continue"
5. Skip optional steps, click "Done"

### 5. Create and Download Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create New Key"
4. Choose "JSON"
5. Click "Create"
6. A JSON file will download - **save this securely!**

### 6. Share Sheet with Service Account

1. Open the JSON file you downloaded
2. Find the `client_email` field (looks like `something@something.iam.gserviceaccount.com`)
3. Copy that email
4. Go back to your Google Sheet
5. Click "Share" (top right)
6. Paste the service account email
7. Give it **"Editor"** access (required for puzzle submissions)
8. Uncheck "Notify people"
9. Click "Share"

**Note**: Editor access is needed so the web form can automatically add submitted puzzles to your sheet.

## Part 3: Configure Your Backend

### 1. Add Credentials to Backend

1. Rename your downloaded JSON file to `credentials.json`
2. Move it to your `backend/` directory:
   ```bash
   mv ~/Downloads/your-project-*.json backend/credentials.json
   ```

**Security Note**: This file contains sensitive credentials. Never commit it to Git (it's in `.gitignore`).

### 2. Update Environment Variables

Edit `backend/.env`:
```env
PORT=3001
GOOGLE_SHEET_ID=your_sheet_id_from_part_1
SUBMIT_PASSWORD=your_password_here
```

Replace:
- `your_sheet_id_from_part_1` with the Sheet ID you copied earlier
- `your_password_here` with a secure password for puzzle submissions

### 3. Restart Backend

```bash
# If running dev server, restart it
npm run dev
```

## Part 4: Test It

1. Open your game at http://localhost:3000
2. Go to the puzzle list
3. You should see puzzles from your Google Sheet!

## Adding New Puzzles

There are two ways to add puzzles:

### Option 1: Web Submission Form (Recommended)

1. Go to `/submit` in your game
2. Enter the submission password
3. Fill out the puzzle form with categories and words
4. Submit - the puzzle is automatically added to your Google Sheet!

### Option 2: Direct Google Sheets Entry

1. Open your Google Sheet
2. Add a new row with:
   - Unique puzzle_id (increment from last)
   - Title and author
   - Four categories with exactly 4 words each
   - Status: "published"
3. Save
4. Refresh your game - the new puzzle appears!

## Tips

- **Difficulty Order**: Yellow (easiest) → Green → Blue → Purple (hardest)
- **Word Length**: Keep words short (1-2 words max) for mobile display
- **Testing**: Test puzzles before sharing with family
- **Collaboration**: Multiple family members can add to the same sheet

## Troubleshooting

### "Puzzles not loading"
- Check `credentials.json` is in `backend/` directory
- Verify Sheet ID in `.env` is correct
- Ensure service account email has access to the sheet
- Check backend logs for specific errors

### "Permission denied" or "Cannot submit puzzles"
- Make sure you shared the sheet with the service account email
- Give the service account **"Editor"** access (not just Viewer)
- Verify the service account email is correct in the share settings

### "Sample puzzles still showing"
- Backend falls back to sample puzzles if Sheets connection fails
- Check backend terminal for error messages
- Verify GOOGLE_SHEET_ID is set in `backend/.env`
