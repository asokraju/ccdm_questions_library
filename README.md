# CCDM Questions Library - Interactive Quiz Application

A comprehensive quiz application for Clinical Data Management (CCDM) with cross-device synchronization, user profiles, and advanced study features.

## 🚀 Key Features

### **Cross-Device Synchronization**
- **Multi-Device Access**: Create users on any device, access from anywhere
- **Real-Time Sync**: Progress and comments sync automatically across devices
- **Offline Support**: Works offline with automatic sync when back online
- **SQLite Backend**: Persistent storage with proper database architecture

### **User Management**
- **Individual Profiles**: Isolated data for multiple users
- **Progress Tracking**: Detailed statistics per user and topic
- **Comment System**: Personal notes with templates and export/import
- **iOS Compatible**: Works seamlessly on mobile devices including iOS

### **Quiz Features**
- **Configurable Quizzes**: Customizable question count and difficulty
- **Progress Tracking**: Detailed statistics and performance analytics
- **Review System**: Review answers with comments and explanations
- **Study Notes**: Comprehensive markdown-based study materials

## 📱 Quick Start

### Prerequisites
- Node.js 14+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/asokraju/ccdm_questions_library.git
   cd ccdm_questions_library/quiz_app
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Start the application**
   ```bash
   # Start backend (from backend directory)
   npm start
   
   # Start frontend (from frontend directory, in new terminal)
   npm start
   ```

4. **Access the application**
   - **Desktop**: http://localhost:3000
   - **Mobile**: Use the network IP shown in backend startup (e.g., http://192.168.1.100:3000)

## 🌐 Cross-Device Usage

### Desktop Setup
1. Start both backend and frontend servers
2. Create user profiles and take quizzes
3. Add comments and track progress

### Mobile Access
1. Connect to the same WiFi network as your desktop
2. Use the network IP address shown in backend startup logs
3. Access the same user profiles and synchronized data

### Synchronization
- **Automatic**: Changes sync in real-time when online
- **Offline Queue**: Changes are queued when offline and sync when back online
- **Sync Status**: Visual indicator shows connection status and pending changes

## 📊 Architecture

### Backend (Node.js + SQLite)
- **Database**: SQLite with proper schema and indexes
- **API**: RESTful endpoints for users, comments, and progress
- **Real-time**: Automatic data synchronization
- **Network**: Supports both localhost and network access

### Frontend (React)
- **Components**: Modular, responsive design
- **State Management**: React hooks with persistent storage
- **Offline Support**: localStorage fallback with sync queue
- **Mobile Optimized**: iOS/Android compatible with touch-friendly UI

## 🛠️ Development

### Project Structure
```
quiz_app/
├── backend/
│   ├── db/
│   │   ├── database.js      # Database connection and operations
│   │   ├── schema.sql       # Database schema
│   │   └── quiz_app.db      # SQLite database (auto-generated)
│   ├── server.js            # Express server with API endpoints
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── features/        # Feature-specific components
    │   ├── services/        # API and storage services
    │   └── utils/           # Helper functions
    └── package.json
```

### Key Services
- **apiUserService.js**: Cross-device user management with offline support
- **userService.js**: Local storage fallback service
- **database.js**: SQLite operations and schema management

## 📚 Data Management

### Topics Covered
- Data Privacy (05)
- Data Management Plan (06)
- Additional CCDM topics as configured

### Question Format
- Multiple choice questions with explanations
- Difficulty levels: Easy, Moderate, Challenging, Balanced
- Topic and subtopic categorization

### User Data
- **Comments**: Personal notes per question with templates
- **Progress**: Detailed statistics and answer history
- **Export/Import**: JSON format for data portability

## 🔧 Configuration

### Environment Variables
- `REACT_APP_API_URL`: Custom backend URL (optional)

### Database
- **Location**: `backend/db/quiz_app.db`
- **Backup**: Automatic with git (excluded via .gitignore)
- **Migration**: Schema auto-applied on startup

## 🚀 Recent Updates (v2.0.0)

### ✨ New Features
- **Cross-Device Sync**: Full synchronization between devices
- **SQLite Database**: Persistent, scalable storage
- **Offline Support**: Work offline with automatic sync
- **Sync Status**: Visual feedback for connection state
- **Mobile Optimization**: Enhanced iOS/Android support

### 🔧 Technical Improvements
- **Database Architecture**: Proper schema with relationships and indexes
- **API Design**: RESTful endpoints with comprehensive error handling
- **Network Detection**: Auto-detect mobile vs desktop for API URLs
- **Error Recovery**: Graceful fallbacks and retry mechanisms

### 🐛 Bug Fixes
- **iOS Input Issues**: Custom input components for iOS compatibility
- **Cross-Device User Switching**: Seamless user switching between devices
- **Data Consistency**: Ensures localStorage and database stay in sync

## 📄 License

This project is part of the CCDM educational resources.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test cross-device functionality
5. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the troubleshooting section in `/quiz_app/CROSS_DEVICE_SYNC_TODO.md`
2. Review console logs for sync status
3. Verify network connectivity between devices