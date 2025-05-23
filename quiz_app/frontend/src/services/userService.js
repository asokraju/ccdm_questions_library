// User management service for local storage based user profiles

const USER_STORAGE_KEY = 'quizUsers';
const CURRENT_USER_KEY = 'currentUser';

class UserService {
  constructor() {
    this.storageAvailable = this.checkStorageAvailable();
    this.fallbackStorage = {};
    this.initializeStorage();
  }

  checkStorageAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage not available, using in-memory fallback:', e);
      return false;
    }
  }

  getStorage(key, defaultValue = null) {
    if (!this.storageAvailable) {
      const value = this.fallbackStorage[key];
      return value !== undefined ? value : defaultValue;
    }
    try {
      const value = localStorage.getItem(key);
      return value !== null ? value : defaultValue;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      const value = this.fallbackStorage[key];
      return value !== undefined ? value : defaultValue;
    }
  }

  setStorage(key, value) {
    if (!this.storageAvailable) {
      this.fallbackStorage[key] = value;
      return true;
    }
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error('Error writing to localStorage:', e);
      this.fallbackStorage[key] = value;
      return true;
    }
  }

  removeStorage(key) {
    if (!this.storageAvailable) {
      delete this.fallbackStorage[key];
      return true;
    }
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing from localStorage:', e);
      delete this.fallbackStorage[key];
      return true;
    }
  }

  initializeStorage() {
    if (!this.getStorage(USER_STORAGE_KEY)) {
      this.setStorage(USER_STORAGE_KEY, JSON.stringify({}));
    }
  }

  getAllUsers() {
    const usersData = this.getStorage(USER_STORAGE_KEY, '{}');
    const users = JSON.parse(usersData);
    return Object.keys(users).map(username => ({
      username,
      ...users[username]
    }));
  }

  getCurrentUser() {
    return this.getStorage(CURRENT_USER_KEY, null);
  }

  setCurrentUser(username) {
    if (username) {
      this.setStorage(CURRENT_USER_KEY, username);
    } else {
      this.removeStorage(CURRENT_USER_KEY);
    }
  }

  createUser(username) {
    if (!username || username.trim().length === 0) {
      throw new Error('Username cannot be empty');
    }

    const usersData = this.getStorage(USER_STORAGE_KEY, '{}');
    const users = JSON.parse(usersData);
    
    if (users[username]) {
      throw new Error('User already exists');
    }

    users[username] = {
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    this.setStorage(USER_STORAGE_KEY, JSON.stringify(users));
    this.setCurrentUser(username);

    // Initialize user-specific storage
    this.initializeUserData(username);

    return username;
  }

  deleteUser(username) {
    const usersData = this.getStorage(USER_STORAGE_KEY, '{}');
    const users = JSON.parse(usersData);
    delete users[username];
    this.setStorage(USER_STORAGE_KEY, JSON.stringify(users));

    // Clear user-specific data
    this.clearUserData(username);

    // If deleted user was current user, clear current user
    if (this.getCurrentUser() === username) {
      this.setCurrentUser(null);
    }
  }

  switchUser(username) {
    const usersData = this.getStorage(USER_STORAGE_KEY, '{}');
    const users = JSON.parse(usersData);
    
    if (!users[username]) {
      throw new Error('User does not exist');
    }

    // Update last active time
    users[username].lastActive = new Date().toISOString();
    this.setStorage(USER_STORAGE_KEY, JSON.stringify(users));

    this.setCurrentUser(username);
  }

  getUserComments(username) {
    const data = this.getStorage(`quizComments_${username}`, '{}');
    return JSON.parse(data);
  }

  setUserComments(username, comments) {
    this.setStorage(`quizComments_${username}`, JSON.stringify(comments));
  }

  getUserProgress(username) {
    const data = this.getStorage(`quizProgress_${username}`, '{}');
    return JSON.parse(data);
  }

  setUserProgress(username, progress) {
    this.setStorage(`quizProgress_${username}`, JSON.stringify(progress));
  }

  initializeUserData(username) {
    // Initialize empty comments and progress for new user
    if (!this.getStorage(`quizComments_${username}`)) {
      this.setStorage(`quizComments_${username}`, '{}');
    }
    if (!this.getStorage(`quizProgress_${username}`)) {
      this.setStorage(`quizProgress_${username}`, JSON.stringify({
        correct: 0,
        incorrect: 0,
        answerHistory: [],
        topicStats: {},
        subtopicStats: {}
      }));
    }
  }

  clearUserData(username) {
    this.removeStorage(`quizComments_${username}`);
    this.removeStorage(`quizProgress_${username}`);
  }

  exportUserData(username) {
    const usersData = this.getStorage(USER_STORAGE_KEY, '{}');
    const users = JSON.parse(usersData);
    const userData = users[username];
    
    if (!userData) {
      throw new Error('User not found');
    }

    return {
      username,
      ...userData,
      comments: this.getUserComments(username),
      progress: this.getUserProgress(username)
    };
  }

  importUserData(username, data) {
    // Create user if doesn't exist
    const usersData = this.getStorage(USER_STORAGE_KEY, '{}');
    const users = JSON.parse(usersData);
    
    if (!users[username]) {
      users[username] = {
        createdAt: data.createdAt || new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      this.setStorage(USER_STORAGE_KEY, JSON.stringify(users));
    }

    // Import comments and progress
    if (data.comments) {
      this.setUserComments(username, data.comments);
    }
    if (data.progress) {
      this.setUserProgress(username, data.progress);
    }
  }
}

export default new UserService();