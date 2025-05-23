-- Users table for storing user profiles
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Comments table for storing user comments on questions
CREATE TABLE IF NOT EXISTS user_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    question_id TEXT NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, question_id)
);

-- Progress table for storing user quiz progress
CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    correct INTEGER DEFAULT 0,
    incorrect INTEGER DEFAULT 0,
    answer_history TEXT DEFAULT '[]', -- JSON array
    topic_stats TEXT DEFAULT '{}',    -- JSON object
    subtopic_stats TEXT DEFAULT '{}', -- JSON object
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON user_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_question_id ON user_comments(question_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON user_progress(user_id);

-- Trigger to update last_active on any user activity
CREATE TRIGGER IF NOT EXISTS update_user_last_active
AFTER UPDATE ON user_comments
BEGIN
    UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = NEW.user_id;
END;

-- Trigger to update last_active on progress update
CREATE TRIGGER IF NOT EXISTS update_user_last_active_progress
AFTER UPDATE ON user_progress
BEGIN
    UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = NEW.user_id;
END;

-- Trigger to update comment timestamp
CREATE TRIGGER IF NOT EXISTS update_comment_timestamp
AFTER UPDATE ON user_comments
BEGIN
    UPDATE user_comments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update progress timestamp
CREATE TRIGGER IF NOT EXISTS update_progress_timestamp
AFTER UPDATE ON user_progress
BEGIN
    UPDATE user_progress SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;