# Google Form Auto-Publish Setup Guide

Set up a Google Form that writes directly to your Puzzles sheet for instant auto-publishing.

## Step 1: Open Your Puzzles Sheet

1. Open your "Connections Puzzles" Google Sheet
2. Make sure you're on the **Puzzles** tab (where your puzzles are)
3. Note the current column headers in Row 1:
   - A: puzzle_id
   - B: title
   - C: author
   - D: date_created
   - E: yellow_category
   - F: yellow_words
   - G: green_category
   - H: green_words
   - I: blue_category
   - J: blue_words
   - K: purple_category
   - L: purple_words

## Step 2: Create Google Form

1. In your Google Sheet, click **Tools** → **Create a new form**
   - This creates a form linked to your sheet!
2. Name it "Submit a Connections Puzzle"

## Step 3: Add Form Fields

Add these questions to your form (in this exact order):

### Question 1: Puzzle Title
- **Type**: Short answer
- **Question**: "Puzzle Title"
- **Description**: "Give your puzzle a creative name"
- **Required**: Yes

### Question 2: Your Name
- **Type**: Short answer
- **Question**: "Your Name"
- **Description**: "Who created this puzzle?"
- **Required**: Yes

### Question 3: Yellow Category (Easiest)
- **Type**: Short answer
- **Question**: "Yellow Category Name"
- **Description**: "This should be the easiest category. Example: 'Types of Fish'"
- **Required**: Yes

### Question 4: Yellow Words
- **Type**: Short answer
- **Question**: "Yellow Category - 4 Words"
- **Description**: "Enter exactly 4 words, separated by commas. Example: BASS,FLOUNDER,SALMON,TROUT"
- **Required**: Yes

### Question 5: Green Category
- **Type**: Short answer
- **Question**: "Green Category Name"
- **Description**: "Medium difficulty"
- **Required**: Yes

### Question 6: Green Words
- **Type**: Short answer
- **Question**: "Green Category - 4 Words"
- **Description**: "Enter exactly 4 words, separated by commas"
- **Required**: Yes

### Question 7: Blue Category
- **Type**: Short answer
- **Question**: "Blue Category Name"
- **Description**: "Harder difficulty"
- **Required**: Yes

### Question 8: Blue Words
- **Type**: Short answer
- **Question**: "Blue Category - 4 Words"
- **Description**: "Enter exactly 4 words, separated by commas"
- **Required**: Yes

### Question 9: Purple Category (Hardest)
- **Type**: Short answer
- **Question**: "Purple Category Name"
- **Description**: "This should be the trickiest category"
- **Required**: Yes

### Question 10: Purple Words
- **Type**: Short answer
- **Question**: "Purple Category - 4 Words"
- **Description**: "Enter exactly 4 words, separated by commas"
- **Required**: Yes

## Step 4: Configure Form Settings

1. Click the **Settings** gear icon (top right)
2. **General** tab:
   - ✅ Collect email addresses (optional but recommended)
   - ✅ Limit to 1 response (optional - prevents spam)
3. **Presentation** tab:
   - ✅ Show progress bar
   - Confirmation message: "Thanks for creating a puzzle! It will appear in the game within a few minutes."

## Step 5: Handle puzzle_id and date_created

Since the form doesn't collect these, you need to set them up in the sheet:

### For puzzle_id (Column A):
1. In the **Puzzles** sheet, click cell **A2**
2. If you have existing puzzles, find the highest puzzle_id and remember it
3. For the first form submission row, you'll manually set the ID to be the next number

**Better option - Auto-increment:**
1. After you get your first form submission (it will be in row with blank puzzle_id)
2. Manually set that first one to the next available ID
3. For subsequent ones, you can manually add IDs, OR...
4. Use this formula approach:
   - Find the last row with data
   - Manually assign IDs after each submission (just type the next number)

### For date_created (Column D):
The form automatically adds a timestamp in column M, but we want it in column D.

**Option 1: Manual** (simple)
- After form submissions, copy the date from the timestamp column to date_created

**Option 2: Formula** (automated)
- In cell D2 (first form response row), use: `=TEXT(M2, "yyyy-mm-dd")`
- This converts the timestamp to date format
- Copy this formula down for all future rows

## Step 6: Test the Form

1. Click **Preview** (eye icon) to open the form
2. Fill it out with a test puzzle
3. Submit it
4. Check your Puzzles sheet - you should see a new row!
5. Manually set the puzzle_id in column A
6. Your game should now show this puzzle!

## Step 7: Share with Family

### Get the Form Link:
1. Click **Send** (top right)
2. Click the **link icon**
3. Check **Shorten URL**
4. Copy the link

### Share it:
Send this message to your family:

```
🎮 Want to create a Connections puzzle?

Submit yours here: [YOUR FORM LINK]

Tips:
- Yellow = easiest category, Purple = hardest
- Use exactly 4 words per category (comma-separated)
- Make sure each word only fits in ONE category
- Example: BASS,FLOUNDER,SALMON,TROUT

Can't wait to play your puzzles! 🎉
```

### Optional: Restrict to Family Only
1. In Form settings → General
2. ✅ Limit to 1 response
3. Under Responses → select specific email addresses
4. Add your family members' Gmail addresses

## Step 8: Maintenance

### After Each Submission:
1. Open your Puzzles sheet
2. Find the new row (will have blank puzzle_id)
3. Set puzzle_id to next number (look at last puzzle and add 1)
4. Optionally: Test the puzzle yourself before family sees it
5. The puzzle appears in the game automatically!

### To Remove a Bad Puzzle:
- Simply delete the row from the Puzzles sheet
- OR add a "Status" column and mark as "Hidden" (would require code change)

## Tips for Good Puzzle Submissions

Share these guidelines with your family:

### ✅ Good Practices:
- **Clear categories** - Should make sense when revealed
- **Unique words** - Each word fits in ONLY one category
- **Proper difficulty order** - Yellow easier than purple
- **Test it** - Make sure you can solve it yourself

### ❌ Common Mistakes:
- Words that fit multiple categories
- Too-easy purple categories or too-hard yellow
- Misspellings or formatting issues
- Inappropriate content

### Example Good Puzzle:

**Yellow: STARTS WITH A**
APPLE,ARROW,ANKLE,ALARM

**Green: STARTS WITH B**
BALL,BEAR,BOAT,BOOK

**Blue: STARTS WITH C**
CAR,CAKE,COIN,CROW

**Purple: STARTS WITH D**
DOOR,DUCK,DRUM,DESK

---

## Troubleshooting

**"Form responses aren't showing up in my sheet"**
- Check that the form is linked to the right sheet
- Look for the "Form Responses" tab - might be separate from Puzzles tab
- If so, you need to manually move responses to Puzzles tab

**"Game isn't showing new puzzles"**
- Make sure puzzle_id is set (not blank)
- Check all required columns have data
- Words should be formatted: WORD1,WORD2,WORD3,WORD4 (no spaces after commas)
- Refresh the game/browser

**"Duplicate puzzle_id errors"**
- Each puzzle needs a unique ID
- Check you didn't reuse an ID
- IDs should increment: 1, 2, 3, 4, etc.

---

## Next Steps

1. Follow this guide to create the form
2. Test it yourself first
3. Share with one family member to test
4. Once it's working smoothly, share with everyone!
5. Optional: Set up a fun family competition or leaderboard

Enjoy the puzzles! 🎉
