# TODO List

## Content Generation Resources Added (Jan 2025)
- [x] Created comprehensive question generation template
  - 5-part methodology for high-quality questions
  - YAML format specifications
  - Example questions for each difficulty level
  - Located in: `/content_generation/QUESTION_GENERATION_PROMPT.md`
- [x] Created quick-use prompt template
  - Copy-paste ready format
  - Located in: `/content_generation/QUICK_PROMPT_TEMPLATE.md`
- [x] Created step-by-step workflow guide
  - Complete process from chapter to quiz
  - Located in: `/content_generation/QUESTION_GENERATION_WORKFLOW.md`

## Current Sprint: Cross-Device Storage & Sync

### High Priority - Storage & Sync
- [ ] Implement server-side storage for user data
  - Move from localStorage to database (PostgreSQL/SQLite)
  - Create API endpoints for user data CRUD operations
  - Enable multi-device sync
- [ ] Add user authentication
  - Simple email/password or OAuth
  - Secure user data access
- [ ] Handle offline/online data sync
  - Queue changes when offline
  - Sync when connection restored

### Recently Completed Features ✓
- [x] Add comment functionality to quiz questions
  - Added comment textarea with templates and character count
  - Comments saved per user per question
- [x] Implement user profiles/sessions
  - Username-based profiles with localStorage
  - Isolated data per user
- [x] Add export/import functionality
  - Export all user data to JSON
  - Import data from file
  - Bulk comment management
- [x] Enhance comment UI
  - Comment templates
  - Character counter
  - Copy/paste/clear functions
  - Save indicator
- [x] Fix iOS Safari input bug
  - Created IOSCompatibleInput component
  - Uses prompt() fallback on iOS
- [x] Redesign main menu
  - Card-based grid layout
  - Better mobile ergonomics
  - User profile indicator

### Known Issues
- [ ] localStorage not shared between devices
  - Currently browser-specific storage
  - Need server-side solution for sync
- [ ] Firefox iOS may have localStorage restrictions
  - Added fallback to in-memory storage
  - Need to test on actual device

### Medium Priority
- [ ] Add progress sync across devices
  - Sync quiz statistics
  - Sync answer history
- [ ] Add conflict resolution for concurrent edits
  - Handle when same user edits from multiple devices
- [ ] Add data backup/restore
  - Automated backups
  - Point-in-time restore

### Low Priority
- [ ] Add search/filter for comments
  - Search through all comments
  - Filter questions by comment keywords
- [ ] Add comment analytics
  - Most commented topics
  - Comment word cloud
- [ ] Add collaborative features
  - Share comments with other users
  - Public/private comment options

## Previous Sprint: Quiz Configuration Features

### High Priority
- [x] Create new branch for quiz configuration features
- [x] Investigate current quiz setup UI components
- [x] Add question count dropdown selection (5, 10, 15, 20, 25, 30 questions)
- [x] Add difficulty level selection (easy, moderate, challenging, balanced)
- [x] Set default options for quiz configuration
- [x] Update backend to handle new quiz parameters
- [x] Test quiz configuration functionality

### Medium Priority
- [ ] Test quiz configuration on mobile devices
- [ ] Add question count validation and feedback

### Low Priority
- [x] Update project TODO.md file
- [ ] Document quiz configuration API parameters

## Recent Completed Issues

### Chart.js Bug Fixes (Completed)
- [x] Fixed deprecated 'horizontalBar' chart type (now uses 'bar' with indexAxis: 'y')
- [x] Improved chart cleanup to prevent canvas reuse errors
- [x] Set chart instances to null after destruction

### Quiz Configuration Features (In Progress)
- [x] Created QuizConfig component with intuitive interface
- [x] Added question count dropdown (5-30 questions)
- [x] Added difficulty selection: Easy, Moderate, Challenging, Balanced
- [x] Integrated with existing backend API (already supported difficulty filtering)
- [x] Updated App.js to include configuration step before quiz
- [x] Added mobile-responsive styling for configuration interface

## Technical Notes
- Backend already supported difficulty filtering via query parameter
- QuizContainer updated to use new quizConfig prop instead of selectedTopic
- Default configuration: 10 questions, balanced difficulty
- Configuration persists until user returns to menu