// User management service for local storage based user profiles

const USER_STORAGE_KEY = 'quizUsers';
const CURRENT_USER_KEY = 'currentUser';

class UserService {
  constructor() {
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem(USER_STORAGE_KEY)) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({}));
    }
  }

  getAllUsers() {
    const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
    return Object.keys(users).map(username => ({
      username,
      ...users[username]
    }));
  }

  getCurrentUser() {
    return localStorage.getItem(CURRENT_USER_KEY);
  }

  setCurrentUser(username) {
    if (username) {
      localStorage.setItem(CURRENT_USER_KEY, username);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  createUser(username) {
    if (!username || username.trim().length === 0) {
      throw new Error('Username cannot be empty');
    }

    const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
    
    if (users[username]) {
      throw new Error('User already exists');
    }

    users[username] = {
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    this.setCurrentUser(username);

    // Initialize user-specific storage
    this.initializeUserData(username);

    return username;
  }

  deleteUser(username) {
    const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
    delete users[username];
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));

    // Clear user-specific data
    this.clearUserData(username);

    // If deleted user was current user, clear current user
    if (this.getCurrentUser() === username) {
      this.setCurrentUser(null);
    }
  }

  switchUser(username) {
    const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
    
    if (!users[username]) {
      throw new Error('User does not exist');
    }

    // Update last active time
    users[username].lastActive = new Date().toISOString();
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));

    this.setCurrentUser(username);
  }

  getUserComments(username) {
    return JSON.parse(localStorage.getItem(`quizComments_${username}`) || '{}');
  }

  setUserComments(username, comments) {
    localStorage.setItem(`quizComments_${username}`, JSON.stringify(comments));
  }

  getUserProgress(username) {
    return JSON.parse(localStorage.getItem(`quizProgress_${username}`) || '{}');
  }

  setUserProgress(username, progress) {
    localStorage.setItem(`quizProgress_${username}`, JSON.stringify(progress));
  }

  initializeUserData(username) {
    // Initialize empty comments and progress for new user
    if (!localStorage.getItem(`quizComments_${username}`)) {
      localStorage.setItem(`quizComments_${username}`, '{}');
    }
    if (!localStorage.getItem(`quizProgress_${username}`)) {
      localStorage.setItem(`quizProgress_${username}`, JSON.stringify({
        correct: 0,
        incorrect: 0,
        answerHistory: [],
        topicStats: {},
        subtopicStats: {}
      }));
    }
  }

  clearUserData(username) {
    localStorage.removeItem(`quizComments_${username}`);
    localStorage.removeItem(`quizProgress_${username}`);
  }

  exportUserData(username) {
    const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
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
    const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '{}');
    
    if (!users[username]) {
      users[username] = {
        createdAt: data.createdAt || new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
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