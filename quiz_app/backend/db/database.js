const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    this.db = null;
  }

  async initialize() {
    try {
      // Open database connection
      this.db = await open({
        filename: path.join(__dirname, 'quiz_app.db'),
        driver: sqlite3.Database
      });

      console.log('Database connection established');

      // Enable foreign keys
      await this.db.run('PRAGMA foreign_keys = ON');

      // Run schema
      const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
      await this.db.exec(schema);

      console.log('Database schema initialized');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  // User operations
  async createUser(username) {
    try {
      const result = await this.db.run(
        'INSERT INTO users (username) VALUES (?)',
        [username]
      );
      return { id: result.lastID, username };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new Error('User already exists');
      }
      throw error;
    }
  }

  async getUser(username) {
    return await this.db.get(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
  }

  async getAllUsers() {
    return await this.db.all('SELECT * FROM users ORDER BY last_active DESC');
  }

  async deleteUser(username) {
    const user = await this.getUser(username);
    if (!user) throw new Error('User not found');
    
    await this.db.run('DELETE FROM users WHERE id = ?', [user.id]);
    return true;
  }

  async updateUserActivity(userId) {
    await this.db.run(
      'UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );
  }

  // Comment operations
  async saveComment(username, questionId, comment) {
    const user = await this.getUser(username);
    if (!user) throw new Error('User not found');

    await this.db.run(
      `INSERT INTO user_comments (user_id, question_id, comment) 
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, question_id) 
       DO UPDATE SET comment = excluded.comment`,
      [user.id, questionId, comment]
    );
  }

  async getComments(username) {
    const user = await this.getUser(username);
    if (!user) return {};

    const comments = await this.db.all(
      'SELECT question_id, comment FROM user_comments WHERE user_id = ?',
      [user.id]
    );

    // Convert to object format matching frontend
    const commentObj = {};
    comments.forEach(c => {
      commentObj[c.question_id] = c.comment;
    });
    return commentObj;
  }

  async deleteComment(username, questionId) {
    const user = await this.getUser(username);
    if (!user) throw new Error('User not found');

    await this.db.run(
      'DELETE FROM user_comments WHERE user_id = ? AND question_id = ?',
      [user.id, questionId]
    );
  }

  // Progress operations
  async saveProgress(username, progress) {
    const user = await this.getUser(username);
    if (!user) throw new Error('User not found');

    await this.db.run(
      `INSERT INTO user_progress (user_id, correct, incorrect, answer_history, topic_stats, subtopic_stats)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id)
       DO UPDATE SET 
         correct = excluded.correct,
         incorrect = excluded.incorrect,
         answer_history = excluded.answer_history,
         topic_stats = excluded.topic_stats,
         subtopic_stats = excluded.subtopic_stats`,
      [
        user.id,
        progress.correct || 0,
        progress.incorrect || 0,
        JSON.stringify(progress.answerHistory || []),
        JSON.stringify(progress.topicStats || {}),
        JSON.stringify(progress.subtopicStats || {})
      ]
    );
  }

  async getProgress(username) {
    const user = await this.getUser(username);
    if (!user) {
      return {
        correct: 0,
        incorrect: 0,
        answerHistory: [],
        topicStats: {},
        subtopicStats: {}
      };
    }

    const progress = await this.db.get(
      'SELECT * FROM user_progress WHERE user_id = ?',
      [user.id]
    );

    if (!progress) {
      return {
        correct: 0,
        incorrect: 0,
        answerHistory: [],
        topicStats: {},
        subtopicStats: {}
      };
    }

    return {
      correct: progress.correct,
      incorrect: progress.incorrect,
      answerHistory: JSON.parse(progress.answer_history),
      topicStats: JSON.parse(progress.topic_stats),
      subtopicStats: JSON.parse(progress.subtopic_stats)
    };
  }

  // Export user data
  async exportUserData(username) {
    const user = await this.getUser(username);
    if (!user) throw new Error('User not found');

    const comments = await this.getComments(username);
    const progress = await this.getProgress(username);

    return {
      username: user.username,
      createdAt: user.created_at,
      lastActive: user.last_active,
      comments,
      progress
    };
  }

  // Import user data
  async importUserData(username, data) {
    // Create user if doesn't exist
    let user = await this.getUser(username);
    if (!user) {
      await this.createUser(username);
      user = await this.getUser(username);
    }

    // Import comments
    if (data.comments) {
      for (const [questionId, comment] of Object.entries(data.comments)) {
        await this.saveComment(username, questionId, comment);
      }
    }

    // Import progress
    if (data.progress) {
      await this.saveProgress(username, data.progress);
    }
  }

  async close() {
    if (this.db) {
      await this.db.close();
      console.log('Database connection closed');
    }
  }
}

module.exports = new Database();