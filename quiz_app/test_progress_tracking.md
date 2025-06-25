# Progress Tracking Test Plan

## Changes Made

1. **Backend Server Updates:**
   - Modified `/api/answer` endpoint to save progress to user-specific database when username is provided
   - Updated `/api/progress` endpoint to retrieve user-specific progress from database
   - Modified `/api/reset` endpoint to reset user-specific progress in database
   - Updated `/api/reviews` endpoint to fetch user-specific incorrect answers

2. **Frontend Updates:**
   - Updated `QuizContainer.js` to send username with answer submissions
   - Modified `App.js` to handle user-specific progress resets
   - Updated API service to support username parameters
   - Modified `ReviewList.js` to fetch user-specific reviews

## Testing Steps

1. **Start the application:**
   ```bash
   cd quiz_app
   ./start.sh
   ```

2. **Test Progress Tracking:**
   - Login/select a user
   - Start a quiz and answer some questions (mix of correct and incorrect)
   - Check if progress is displayed correctly in statistics
   - Refresh the page and verify progress persists
   - Restart the server and verify progress still persists

3. **Test User-Specific Progress:**
   - Create/select User A
   - Answer some questions and note the progress
   - Switch to User B
   - Verify User B has separate progress (should start at 0)
   - Switch back to User A
   - Verify User A's progress is still intact

4. **Test Progress Reset:**
   - Select a user with existing progress
   - Click reset progress
   - Verify progress is reset to 0
   - Verify other users' progress is not affected

5. **Test Review Questions:**
   - Answer some questions incorrectly
   - Go to Review section
   - Verify only incorrect answers for current user are shown
   - Switch users and verify different review questions

## Expected Results

- Progress should persist across page refreshes
- Progress should persist across server restarts
- Each user should have independent progress tracking
- Reset should only affect the current user's progress
- Review questions should be user-specific