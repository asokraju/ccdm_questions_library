# TODO List

## Current Sprint: Quiz Configuration Features

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