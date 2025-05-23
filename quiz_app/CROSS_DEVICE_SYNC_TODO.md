# Cross-Device Sync Implementation Plan

## Overview
Transform the current browser-only storage to a full server-side solution with cross-device sync.

## Phase 1: Backend Database Setup (Simplest Start)
### 1.1 Add SQLite to Backend
- [ ] Install sqlite3 package: `npm install sqlite3 sqlite`
- [ ] Create database schema file (`backend/db/schema.sql`)
  ```sql
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE user_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    question_id TEXT NOT NULL,
    comment TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  
  CREATE TABLE user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    correct INTEGER DEFAULT 0,
    incorrect INTEGER DEFAULT 0,
    answer_history TEXT, -- JSON string
    topic_stats TEXT,    -- JSON string
    subtopic_stats TEXT, -- JSON string
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  ```

### 1.2 Create Database Connection
- [ ] Create `backend/db/database.js` for SQLite connection
- [ ] Initialize database on server start
- [ ] Add database file to .gitignore

## Phase 2: Basic API Endpoints (No Auth Yet)
### 2.1 User Management Endpoints
- [ ] `POST /api/users` - Create new user
- [ ] `GET /api/users` - List all users (for dev/testing)
- [ ] `GET /api/users/:username` - Get user by username

### 2.2 User Data Endpoints
- [ ] `GET /api/users/:username/comments` - Get all comments
- [ ] `POST /api/users/:username/comments` - Save/update comment
- [ ] `GET /api/users/:username/progress` - Get progress
- [ ] `POST /api/users/:username/progress` - Update progress

### 2.3 Export/Import Endpoints
- [ ] `GET /api/users/:username/export` - Export all user data
- [ ] `POST /api/users/:username/import` - Import user data

## Phase 3: Frontend Integration
### 3.1 Create API Service
- [ ] Create `frontend/src/services/apiUserService.js`
- [ ] Mirror all methods from `userService.js` but use API calls
- [ ] Add error handling and retry logic

### 3.2 Dual Storage Strategy
- [ ] Keep localStorage as fallback/cache
- [ ] Try API first, fall back to localStorage if offline
- [ ] Queue changes when offline, sync when online

### 3.3 Update UI Components
- [ ] Add sync status indicator (synced/syncing/offline)
- [ ] Show last sync time
- [ ] Add manual sync button

## Phase 4: Simple Authentication
### 4.1 Basic Password Protection
- [ ] Add password field to users table
- [ ] Hash passwords with bcrypt
- [ ] Create login endpoint
- [ ] Store session token in localStorage

### 4.2 Protect API Endpoints
- [ ] Add middleware to verify user identity
- [ ] Users can only access their own data

## Phase 5: Offline/Online Sync
### 5.1 Change Queue
- [ ] Track changes made while offline
- [ ] Store queue in localStorage
- [ ] Process queue when connection restored

### 5.2 Conflict Resolution
- [ ] Use "last write wins" strategy (simplest)
- [ ] Add timestamps to all changes
- [ ] Show warning if data was modified elsewhere

## Implementation Order (Easiest to Hardest)

### Week 1: Database & Basic API
1. **Day 1-2**: Set up SQLite database
   - Install packages
   - Create schema
   - Test with SQL client

2. **Day 3-4**: Create basic API endpoints
   - Start with user creation
   - Add comment endpoints
   - Test with Postman/curl

3. **Day 5**: Frontend API service
   - Create apiUserService.js
   - Add to one component first (e.g., UserSelector)

### Week 2: Full Integration
1. **Day 1-2**: Update all components to use API
   - Keep localStorage as fallback
   - Add loading states

2. **Day 3-4**: Add sync indicators
   - Show connection status
   - Add retry mechanisms

3. **Day 5**: Testing & bug fixes

### Week 3: Authentication (Optional)
1. **Day 1-2**: Add basic auth
   - Password field
   - Login page

2. **Day 3-4**: Secure endpoints
   - Add auth middleware
   - Test security

3. **Day 5**: Polish & deploy

## Simplest Possible Start

If you want the absolute simplest start:

1. **Just add one endpoint first**:
   ```javascript
   // In backend/server.js
   app.post('/api/users/:username/comments/:questionId', (req, res) => {
     // Save to a JSON file for now, upgrade to SQLite later
     const { username, questionId } = req.params;
     const { comment } = req.body;
     // Save to file system
     res.json({ success: true });
   });
   ```

2. **Update one component to test**:
   ```javascript
   // In Question.js, add alongside localStorage save
   fetch(`/api/users/${currentUser}/comments/${question.id}`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ comment })
   }).catch(() => {
     // Ignore errors for now, localStorage is backup
   });
   ```

## Estimated Effort
- **Minimal MVP** (file-based storage, no auth): 2-3 days
- **Full SQLite + API**: 1 week
- **With Authentication**: 2 weeks
- **Complete with offline sync**: 3 weeks

## Benefits of This Approach
1. Each phase works independently
2. Always have localStorage as fallback
3. Can deploy incrementally
4. Users won't lose existing data
5. Can stop at any phase and still have improvements