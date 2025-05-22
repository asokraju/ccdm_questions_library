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

### For Windows (Fresh Install)

#### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download the latest LTS version (Long Term Support)
3. Run the installer (.msi file)
4. During installation, make sure to check "Automatically install the necessary tools" option
5. Restart your computer after installation

#### Step 2: Verify Installation
1. Open Command Prompt (Win + R, type `cmd`, press Enter)
2. Check Node.js version:
   ```cmd
   node --version
   ```
3. Check npm version:
   ```cmd
   npm --version
   ```
   Both commands should return version numbers.

#### Step 3: Install Git (if not already installed)
1. Go to https://git-scm.com/download/win
2. Download and install Git for Windows
3. During installation, select "Git from the command line and also from 3rd-party software"

#### Step 4: Clone the Repository
1. Open Command Prompt
2. Navigate to your desired directory (e.g., `cd C:\Users\YourUsername\Documents`)
3. Clone the repository:
   ```cmd
   git clone https://github.com/asokraju/ccdm_questions_library.git
   ```
4. Navigate to the project:
   ```cmd
   cd ccdm_questions_library\quiz_app
   ```

#### Step 5: Setup Backend
1. Navigate to backend directory:
   ```cmd
   cd backend
   ```
2. Install dependencies:
   ```cmd
   npm install
   ```
3. Start the backend server:
   ```cmd
   npm start
   ```
   The server will run on http://localhost:3001

#### Step 6: Setup Frontend (New Command Prompt Window)
1. Open a new Command Prompt window
2. Navigate to the frontend directory:
   ```cmd
   cd C:\Users\YourUsername\Documents\ccdm_questions_library\quiz_app\frontend
   ```
3. Install dependencies:
   ```cmd
   npm install
   ```
4. Start the React development server:
   ```cmd
   npm start
   ```
   The application will automatically open in your browser at http://localhost:3000

### For Ubuntu (Fresh Install)

#### Step 1: Update System
```bash
sudo apt update
sudo apt upgrade -y
```

#### Step 2: Install Node.js and npm
```bash
# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Step 3: Install Git (if not already installed)
```bash
sudo apt install git -y
```

#### Step 4: Clone the Repository
```bash
# Navigate to home directory
cd ~

# Clone the repository
git clone https://github.com/asokraju/ccdm_questions_library.git

# Navigate to project
cd ccdm_questions_library/quiz_app
```

#### Step 5: Setup Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm start
```
The server will run on http://localhost:3001

#### Step 6: Setup Frontend (New Terminal Window)
```bash
# Open new terminal (Ctrl+Alt+T)
# Navigate to frontend directory
cd ~/ccdm_questions_library/quiz_app/frontend

# Install dependencies
npm install

# Start the React development server
npm start
```
The application will automatically open in your browser at http://localhost:3000

### Quick Start Script

For convenience, you can use the provided start script:

**Windows:**
```cmd
cd quiz_app
start.bat
```

**Ubuntu:**
```bash
cd quiz_app
chmod +x start.sh
./start.sh
```

### Troubleshooting

#### Common Issues:

1. **Permission errors on Windows:**
   - Run Command Prompt as Administrator
   - Or use PowerShell: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

2. **Port already in use:**
   - Kill existing processes: `npx kill-port 3000 3001`
   - Or use different ports by modifying package.json

3. **Node.js version issues:**
   - Ensure you have Node.js 14 or higher
   - Use Node Version Manager (nvm) for multiple versions

4. **Ubuntu permission issues:**
   - Don't use `sudo` with npm in home directory
   - If needed, fix npm permissions: `sudo chown -R $(whoami) ~/.npm`

5. **Network/Firewall issues:**
   - Check if ports 3000 and 3001 are blocked
   - Temporarily disable firewall for testing

### Prerequisites Summary

- **Windows:** Node.js LTS, Git, Command Prompt or PowerShell
- **Ubuntu:** Node.js 14+, npm, Git, Terminal access
- **Both:** Modern web browser (Chrome, Firefox, Edge, Safari)

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