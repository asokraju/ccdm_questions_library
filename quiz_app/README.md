# CCDM Quiz Application

A comprehensive quiz application for Clinical Data Management (CCDM) training and assessment.

## Features

- Multiple-choice questions from YAML files
- Topic-based question selection
- Progress tracking with statistics
- Performance visualization by topic and subtopic
- Review system for incorrect answers
- Responsive web interface

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd quiz_app/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

   The server will run on http://localhost:3001

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd quiz_app/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The application will open in your browser at http://localhost:3000

## Project Structure

```
quiz_app/
├── backend/
│   ├── server.js           # Express server with API endpoints
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── QuizContainer.js
│   │   │   ├── Question.js
│   │   │   ├── Statistics.js
│   │   │   ├── ReviewList.js
│   │   │   ├── TopicSelector.js
│   │   │   └── ProgressBar.js
│   │   ├── App.js          # Main application component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## API Endpoints

- `GET /api/topics` - Get all available topics
- `GET /api/questions` - Get questions (with optional topic/difficulty filters)
- `POST /api/answer` - Submit an answer
- `GET /api/progress` - Get user progress and statistics
- `GET /api/reviews` - Get questions answered incorrectly
- `POST /api/reset` - Reset all progress

## Features Overview

### 1. Quiz Mode
- Select topics or take questions from all topics
- Progress bar showing quiz completion
- Immediate feedback with explanations
- Question difficulty indicators

### 2. Statistics Dashboard
- Overall accuracy percentage
- Performance breakdown by topic
- Subtopic performance visualization
- Interactive charts using Chart.js

### 3. Review System
- Access all incorrectly answered questions
- Full explanations for learning
- Organized by topic and difficulty

### 4. Responsive Design
- Works on desktop and mobile devices
- Clean, modern interface
- Accessibility considerations

## Adding New Questions

Questions are loaded from YAML files in the `data/` directory. To add new questions:

1. Create a new folder in `data/` for your topic
2. Add a `questions.yaml` file with the following format:

```yaml
- question: "Your question text"
  difficulty: "easy" # or "moderate" or "challenging"
  options:
    a: "Option A text"
    b: "Option B text"
    c: "Option C text"
    d: "Option D text"
  answer: "b" # correct answer key
  explanation: "Explanation text"
  subtopic: "Subtopic name"
```

## Development

For development with hot reloading:

- Backend: `npm run dev` (requires nodemon)
- Frontend: `npm start` (React development server)

## Production Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Serve the backend with a process manager like PM2
3. Configure a reverse proxy (nginx/Apache) for production use

## License

This project is for educational purposes as part of the CCDM questions library.