# CCDM Quiz Application

A comprehensive quiz application for Clinical Data Management (CCDM) training and assessment with **cross-device synchronization** and multi-user support.

## 🚀 Key Features

### **Cross-Device Synchronization (NEW!)**
- **Multi-Device Access**: Create users on mobile, access from desktop (and vice versa)
- **Real-Time Sync**: Progress and comments automatically sync across all devices
- **Offline Support**: Works offline with automatic sync when connection restored
- **SQLite Backend**: Persistent database storage with proper schema

### **User Management**
- **Individual Profiles**: Multiple users with isolated data
- **Progress Tracking**: Detailed statistics per user and topic
- **Comment System**: Personal notes with templates and export/import
- **iOS/Android Compatible**: Seamless mobile experience

### **Enhanced Quiz Features**
- **Configurable Quizzes**: Customizable question count and difficulty levels
- **Performance Analytics**: Detailed statistics and progress visualization
- **Review System**: Review incorrect answers with personal comments
- **Study Notes**: Comprehensive markdown-based study materials

## Setup Instructions

### For Windows (Recommended: WSL Approach)

Due to potential Node.js installation issues on Windows, we recommend using Windows Subsystem for Linux (WSL) for the best development experience.

#### Step 1: Install WSL2
1. Open PowerShell as Administrator (Right-click Start → Windows PowerShell (Admin))
2. Install WSL:
   ```powershell
   wsl --install
   ```
3. Restart your computer when prompted
4. After restart, Ubuntu will automatically open and ask you to create a username and password

#### Step 2: Setup Development Environment in WSL
1. Open Ubuntu from Start Menu (or type `wsl` in Command Prompt)
2. Run the automated setup script:
   ```bash
   # Download and run the setup script
   curl -fsSL https://raw.githubusercontent.com/asokraju/ccdm_questions_library/main/quiz_app/setup.sh | bash
   ```

#### Alternative Manual Setup in WSL:
If you prefer manual setup, follow the Ubuntu instructions below within your WSL environment.

### For Native Windows (Not Recommended)

If you must use native Windows, use the provided `start.bat` script, but be aware of potential Node.js compatibility issues.

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

### Quick Start Scripts

#### Automated Setup (Recommended)
**One-command setup for WSL/Ubuntu:**
```bash
# Download and run the complete setup script
curl -fsSL https://raw.githubusercontent.com/asokraju/ccdm_questions_library/main/quiz_app/setup.sh | bash
```

This script will:
- Install all prerequisites (Node.js, Git, etc.)
- Clone the repository
- Install all dependencies
- Create a startup script
- Optionally start the application

#### Manual Start Scripts
If you already have the repository cloned:

**WSL/Ubuntu:**
```bash
cd quiz_app
chmod +x start.sh
./start.sh
```

**Windows (Native - Not Recommended):**
```cmd
cd quiz_app
start.bat
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

6. **WSL-specific issues:**
   - If WSL command not found: Update Windows to latest version
   - If Ubuntu doesn't start: `wsl --set-default-version 2`
   - If browser doesn't open: Manually go to http://localhost:3000
   - File permissions: `chmod +x setup.sh` before running

### Prerequisites Summary

- **Windows (WSL Recommended):** WSL2 with Ubuntu, Modern web browser
- **Windows (Native):** Node.js LTS, Git, Command Prompt or PowerShell
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

### Quiz Endpoints
- `GET /api/topics` - Get all available topics
- `GET /api/questions` - Get questions (with optional topic/difficulty filters)
- `POST /api/answer` - Submit an answer
- `GET /api/progress` - Get user progress and statistics
- `GET /api/reviews` - Get questions answered incorrectly
- `POST /api/reset` - Reset all progress

### User Management Endpoints (NEW!)
- `POST /api/users` - Create new user
- `GET /api/users` - Get all users
- `GET /api/users/:username` - Get specific user
- `DELETE /api/users/:username` - Delete user
- `GET /api/users/:username/comments` - Get user comments
- `POST /api/users/:username/comments` - Save/update comment
- `GET /api/users/:username/progress` - Get user progress
- `POST /api/users/:username/progress` - Update user progress
- `GET /api/users/:username/export` - Export all user data
- `POST /api/users/:username/import` - Import user data

### Study Notes Endpoints
- `GET /api/notes/topics` - Get available study topics
- `GET /api/notes/:topic` - Get study notes for specific topic

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

### 4. Cross-Device Synchronization (NEW!)
- **User Profiles**: Create users on any device, access from anywhere
- **Real-Time Sync**: Comments and progress sync automatically
- **Offline Mode**: Works offline with sync queue for later
- **Sync Status**: Visual indicator shows connection and sync status

### 5. Responsive Design
- Works seamlessly on desktop and mobile devices
- iOS/Android optimized with custom input components
- Clean, modern interface with accessibility considerations
- Network IP auto-detection for mobile access

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