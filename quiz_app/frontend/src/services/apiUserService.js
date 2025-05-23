// API-based user service that communicates with the backend
// Falls back to localStorage when offline

import userService from './userService';

// Auto-detect if we're on mobile and use network IP
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Check if we're accessing via IP (mobile) vs localhost (desktop)
  const hostname = window.location.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    // We're on mobile, use the same hostname/IP for API
    return `http://${hostname}:3001/api`;
  }
  
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiUrl();
console.log('API Base URL:', API_BASE_URL);

class ApiUserService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async fetchWithFallback(url, options = {}) {
    try {
      console.log('Making API request to:', url);
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      return data;
    } catch (error) {
      console.warn('API request failed, falling back to localStorage:', error);
      this.isOnline = false;
      throw error;
    }
  }

  // User Management
  async getAllUsers() {
    try {
      const users = await this.fetchWithFallback(`${API_BASE_URL}/users`);
      return users.map(user => ({
        username: user.username,
        createdAt: user.created_at,
        lastActive: user.last_active
      }));
    } catch (error) {
      // Fallback to localStorage
      return userService.getAllUsers();
    }
  }

  async createUser(username) {
    try {
      const user = await this.fetchWithFallback(`${API_BASE_URL}/users`, {
        method: 'POST',
        body: JSON.stringify({ username })
      });
      
      // Also save to localStorage for offline access
      userService.createUser(username);
      
      return username;
    } catch (error) {
      // Fallback to localStorage only
      return userService.createUser(username);
    }
  }

  async deleteUser(username) {
    try {
      await this.fetchWithFallback(`${API_BASE_URL}/users/${username}`, {
        method: 'DELETE'
      });
      
      // Also delete from localStorage
      userService.deleteUser(username);
    } catch (error) {
      // Queue for later sync
      this.addToSyncQueue({
        type: 'DELETE_USER',
        username,
        timestamp: new Date().toISOString()
      });
      
      // Delete from localStorage immediately
      userService.deleteUser(username);
    }
  }

  getCurrentUser() {
    // Always use localStorage for current user (client-side state)
    return userService.getCurrentUser();
  }

  setCurrentUser(username) {
    // Always use localStorage for current user (client-side state)
    userService.setCurrentUser(username);
  }

  async switchUser(username) {
    // Update localStorage immediately
    userService.switchUser(username);
    
    // Try to update server
    try {
      await this.fetchWithFallback(`${API_BASE_URL}/users/${username}`, {
        method: 'GET'
      });
    } catch (error) {
      // Ignore error, localStorage is updated
    }
  }

  // Comments
  async getUserComments(username) {
    try {
      const comments = await this.fetchWithFallback(`${API_BASE_URL}/users/${username}/comments`);
      
      // Update localStorage cache
      userService.setUserComments(username, comments);
      
      return comments;
    } catch (error) {
      // Fallback to localStorage
      return userService.getUserComments(username);
    }
  }

  async setUserComments(username, comments) {
    // Update localStorage immediately
    userService.setUserComments(username, comments);
    
    // Save each comment to API
    for (const [questionId, comment] of Object.entries(comments)) {
      try {
        await this.fetchWithFallback(`${API_BASE_URL}/users/${username}/comments`, {
          method: 'POST',
          body: JSON.stringify({ questionId, comment })
        });
      } catch (error) {
        // Queue for later sync
        this.addToSyncQueue({
          type: 'SAVE_COMMENT',
          username,
          questionId,
          comment,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async saveComment(username, questionId, comment) {
    // Update localStorage immediately
    const comments = userService.getUserComments(username);
    comments[questionId] = comment;
    userService.setUserComments(username, comments);
    
    // Try to save to API
    try {
      await this.fetchWithFallback(`${API_BASE_URL}/users/${username}/comments`, {
        method: 'POST',
        body: JSON.stringify({ questionId, comment })
      });
    } catch (error) {
      // Queue for later sync
      this.addToSyncQueue({
        type: 'SAVE_COMMENT',
        username,
        questionId,
        comment,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Progress
  async getUserProgress(username) {
    try {
      const progress = await this.fetchWithFallback(`${API_BASE_URL}/users/${username}/progress`);
      
      // Update localStorage cache
      userService.setUserProgress(username, progress);
      
      return progress;
    } catch (error) {
      // Fallback to localStorage
      return userService.getUserProgress(username);
    }
  }

  async setUserProgress(username, progress) {
    // Update localStorage immediately
    userService.setUserProgress(username, progress);
    
    // Try to save to API
    try {
      await this.fetchWithFallback(`${API_BASE_URL}/users/${username}/progress`, {
        method: 'POST',
        body: JSON.stringify(progress)
      });
    } catch (error) {
      // Queue for later sync
      this.addToSyncQueue({
        type: 'SAVE_PROGRESS',
        username,
        progress,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Export/Import
  async exportUserData(username) {
    try {
      return await this.fetchWithFallback(`${API_BASE_URL}/users/${username}/export`);
    } catch (error) {
      // Fallback to localStorage
      return userService.exportUserData(username);
    }
  }

  async importUserData(username, data) {
    // Import to localStorage first
    userService.importUserData(username, data);
    
    // Try to import to API
    try {
      await this.fetchWithFallback(`${API_BASE_URL}/users/${username}/import`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (error) {
      // Queue for later sync
      this.addToSyncQueue({
        type: 'IMPORT_DATA',
        username,
        data,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Sync Queue Management
  addToSyncQueue(item) {
    const queue = this.getSyncQueue();
    queue.push(item);
    localStorage.setItem('syncQueue', JSON.stringify(queue));
  }

  getSyncQueue() {
    return JSON.parse(localStorage.getItem('syncQueue') || '[]');
  }

  async processSyncQueue() {
    if (!this.isOnline) return;
    
    const queue = this.getSyncQueue();
    const failed = [];
    
    for (const item of queue) {
      try {
        switch (item.type) {
          case 'DELETE_USER':
            await this.fetchWithFallback(`${API_BASE_URL}/users/${item.username}`, {
              method: 'DELETE'
            });
            break;
            
          case 'SAVE_COMMENT':
            await this.fetchWithFallback(`${API_BASE_URL}/users/${item.username}/comments`, {
              method: 'POST',
              body: JSON.stringify({ 
                questionId: item.questionId, 
                comment: item.comment 
              })
            });
            break;
            
          case 'SAVE_PROGRESS':
            await this.fetchWithFallback(`${API_BASE_URL}/users/${item.username}/progress`, {
              method: 'POST',
              body: JSON.stringify(item.progress)
            });
            break;
            
          case 'IMPORT_DATA':
            await this.fetchWithFallback(`${API_BASE_URL}/users/${item.username}/import`, {
              method: 'POST',
              body: JSON.stringify(item.data)
            });
            break;
        }
      } catch (error) {
        console.error('Failed to sync item:', item, error);
        failed.push(item);
      }
    }
    
    // Update queue with only failed items
    localStorage.setItem('syncQueue', JSON.stringify(failed));
  }

  // Initialize user data (creates default empty data if needed)
  initializeUserData(username) {
    userService.initializeUserData(username);
  }

  // Clear user data
  clearUserData(username) {
    userService.clearUserData(username);
  }

  // Check if we're online
  getConnectionStatus() {
    return {
      online: this.isOnline,
      queueLength: this.getSyncQueue().length
    };
  }
}

export default new ApiUserService();