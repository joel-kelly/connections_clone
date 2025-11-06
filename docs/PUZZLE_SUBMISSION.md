# Puzzle Submission Setup

Set up a Google Form so your family can easily submit new puzzles.

## Overview

Since you chose Google Forms, here's how to set it up so family members can submit puzzles that you can then add to your Google Sheet.

---

## Step 1: Create Google Form

### 1. Create New Form

1. Go to [Google Forms](https://forms.google.com)
2. Click "Blank" or "+" to create a new form
3. Name it "Connections Puzzle Submission"

### 2. Add Form Fields

Add these questions (all required):

#### Field 1: Puzzle Title
- **Type**: Short answer
- **Question**: "Puzzle Title"
- **Help text**: "Give your puzzle a creative name"

#### Field 2: Your Name
- **Type**: Short answer
- **Question**: "Your Name"
- **Help text**: "Creator of this puzzle"

#### Field 3: Yellow Category (Easiest)
- **Type**: Short answer
- **Question**: "Yellow Category Name (Easiest)"
- **Help text**: "e.g., 'Types of Fish' or 'Things that are red'"

#### Field 4: Yellow Words
- **Type**: Short answer
- **Question**: "Yellow Category - 4 Words"
- **Help text**: "Enter 4 words separated by commas: WORD1,WORD2,WORD3,WORD4"

#### Field 5: Green Category
- **Type**: Short answer
- **Question**: "Green Category Name"

#### Field 6: Green Words
- **Type**: Short answer
- **Question**: "Green Category - 4 Words"
- **Help text**: "Enter 4 words separated by commas"

#### Field 7: Blue Category
- **Type**: Short answer
- **Question**: "Blue Category Name"

#### Field 8: Blue Words
- **Type**: Short answer
- **Question**: "Blue Category - 4 Words"
- **Help text**: "Enter 4 words separated by commas"

#### Field 9: Purple Category (Hardest)
- **Type**: Short answer
- **Question**: "Purple Category Name (Hardest)"

#### Field 10: Purple Words
- **Type**: Short answer
- **Question**: "Purple Category - 4 Words"
- **Help text**: "Enter 4 words separated by commas"

### 3. Customize Form

1. Click the palette icon (top right) to choose colors
2. Add a header image if you want
3. Add description:
   ```
   Submit your own Connections puzzle! Create 4 categories with 4 words each.

   Tips:
   - Yellow should be the easiest category
   - Purple should be the trickiest
   - Each word should only fit in ONE category
   - Keep words short (1-2 words max)
   - Use uppercase for consistency
   ```

### 4. Get Form Link

1. Click "Send" (top right)
2. Click the link icon
3. Click "Shorten URL"
4. Copy the link

Share this link with your family!

---

## Step 2: Link Form to Sheet (Optional)

You can have responses automatically go to a sheet, then manually copy to your Puzzles sheet:

1. In your form, click "Responses" tab
2. Click the Google Sheets icon
3. Choose "Create a new spreadsheet"
4. Name it "Puzzle Submissions"

Now all submissions automatically go to this sheet!

---

## Step 3: Process Submissions

When family submits puzzles, you'll review and add them to your main Puzzles sheet:

### Manual Method (Recommended)

1. Open "Puzzle Submissions" sheet
2. Review the submission:
   - Check for appropriate content
   - Verify each category has exactly 4 words
   - Make sure words are unique (no duplicates)
3. Copy data to your "Connections Puzzles" sheet:
   - Assign next puzzle_id
   - Format words as: `WORD1,WORD2,WORD3,WORD4` (no spaces after commas)
   - Add date_created
4. Test the puzzle yourself before making it live!

### Example Conversion

**From Form Submission:**
```
Puzzle Title: Movie Genres
Your Name: Sarah
Yellow Category: Action Movies
Yellow Words: DIE HARD, TERMINATOR, MATRIX, SPEED
Green Category: Comedies
Green Words: BRIDESMAIDS, SUPERBAD, CLUELESS, AIRPLANE
Blue Category: Horror
Blue Words: PSYCHO, SCREAM, HALLOWEEN, ALIEN
Purple Category: ____ STORY
Purple Words: TOY, LOVE, GHOST, WEST SIDE
```

**To Your Puzzles Sheet (Row):**
| puzzle_id | title | author | date_created | yellow_category | yellow_words | green_category | green_words | blue_category | blue_words | purple_category | purple_words |
|-----------|-------|--------|--------------|-----------------|--------------|----------------|-------------|---------------|------------|-----------------|--------------|
| 4 | Movie Genres | Sarah | 2024-01-20 | Action Movies | DIE HARD,TERMINATOR,MATRIX,SPEED | Comedies | BRIDESMAIDS,SUPERBAD,CLUELESS,AIRPLANE | Horror | PSYCHO,SCREAM,HALLOWEEN,ALIEN | ____ STORY | TOY,LOVE,GHOST,WEST SIDE |

---

## Step 4: Share Form with Family

### Ways to Share:

1. **Direct Link**: Send them the shortened form URL
2. **QR Code**: Generate QR code in form's Send menu
3. **Bookmark**: Have them save it to phone home screen

### Message Template:

```
🎮 Want to create your own Connections puzzle?

Fill out this form and I'll add it to our game:
[YOUR FORM LINK]

Tips:
- Think of 4 categories with 4 words each
- Yellow = easiest, Purple = hardest
- Make it challenging but fair!
- Test it in your head first

Can't wait to play your puzzles! 🎉
```

---

## Tips for Good Puzzle Design

Share these guidelines with puzzle creators:

### ✅ Good Practices

- **Clear categories**: Categories should make sense once revealed
- **Unique words**: Each word should ONLY fit in one category
- **Appropriate difficulty**: Yellow easier than purple
- **Short words**: 1-2 words max (displays better on mobile)
- **No proper nouns** (unless that's the category)

### ❌ Common Mistakes

- Words that fit multiple categories
- Obscure references only one person knows
- Too-easy purple categories
- Words longer than 3 words

### Example Categories

**Easy (Yellow)**:
- Types of Fruit
- Colors
- Days of the Week

**Medium (Green/Blue)**:
- ___ Party (types of parties)
- Things That Are Round
- Synonyms for Happy

**Hard (Purple)**:
- Words that start with silent letters
- ____ Keys (different types of keys)
- Anagrams of countries

---

## Alternative: Whitelist Email Addresses

If you want more control, you can:

1. In Form settings → "Responses" tab
2. Check "Limit to 1 response" (if desired)
3. Check "Collect email addresses"
4. Share form only with specific family email addresses

This way only whitelisted family members can submit.

---

## Automation (Advanced)

If you get comfortable with Google Apps Script, you can automate adding approved puzzles from Submissions sheet to Puzzles sheet:

1. Tools → Script Editor in Google Sheets
2. Write a script to copy approved rows
3. Add a checkbox column for "Approved"

This is optional and for advanced users only!

---

## Moderation

### Review Checklist

Before adding a puzzle:
- [ ] All categories have exactly 4 words
- [ ] Words are appropriate for family
- [ ] No word appears in multiple categories
- [ ] Puzzle is solvable (test it!)
- [ ] Words are properly formatted (uppercase, comma-separated, no spaces)
- [ ] Difficulty order makes sense (yellow easiest, purple hardest)

### If Puzzle Needs Fixes

Reply to the submitter:
```
Hey [Name]! Love the puzzle idea, but we need to tweak a few things:

- [specific feedback]

Can you resubmit with those changes? Thanks!
```

---

## FAQ for Family

**Q: How long until my puzzle appears?**
A: Usually within a day or two after I review it.

**Q: Can I make another puzzle?**
A: Absolutely! Make as many as you want!

**Q: What if my puzzle is too hard/easy?**
A: I'll test it and might adjust the difficulty colors.

**Q: Can we work on a puzzle together?**
A: Yes! Collaborate on the form or share ideas in family chat first.
