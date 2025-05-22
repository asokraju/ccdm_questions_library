import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging/debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      throw new Error(data?.error || `Server error: ${status}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error: No response from server');
    } else {
      // Something else happened
      throw new Error(`Request error: ${error.message}`);
    }
  }
);

// API service methods
export const apiService = {
  // Topics
  async getTopics() {
    return api.get('/topics');
  },

  // Questions
  async getQuestions(params = {}) {
    return api.get('/questions', { params });
  },

  // Quiz/Progress
  async submitAnswer(answerData) {
    return api.post('/answer', answerData);
  },

  async getProgress() {
    return api.get('/progress');
  },

  async resetProgress() {
    return api.post('/reset');
  },

  // Review
  async getReviews() {
    return api.get('/reviews');
  },

  // Notes
  async getNotesTopics() {
    return api.get('/notes/topics');
  },

  async getNoteContent(topic) {
    return api.get(`/notes/${encodeURIComponent(topic)}`);
  },
};

// Specialized service classes for different features
export class QuizService {
  static async startQuiz(config) {
    const params = {
      topic: config.topic,
      limit: config.questionCount,
    };
    
    if (config.difficulty) {
      params.difficulty = config.difficulty;
    }
    
    return apiService.getQuestions(params);
  }

  static async submitAnswer(questionData) {
    return apiService.submitAnswer(questionData);
  }

  static async getReviewQuestions() {
    return apiService.getReviews();
  }
}

export class ProgressService {
  static async getUserProgress() {
    return apiService.getProgress();
  }

  static async resetUserProgress() {
    return apiService.resetProgress();
  }
}

export class NotesService {
  static async getAllTopics() {
    return apiService.getNotesTopics();
  }

  static async getTopicContent(topicName) {
    return apiService.getNoteContent(topicName);
  }
}

// Error handling utilities
export const handleApiError = (error, context = 'API call') => {
  console.error(`${context} failed:`, error);
  
  // You can add more sophisticated error handling here
  // such as toast notifications, error tracking, etc.
  
  return {
    message: error.message || 'An unexpected error occurred',
    type: 'error',
    context,
  };
};

// Loading state utilities
export const createLoadingState = () => ({
  isLoading: false,
  error: null,
  data: null,
});

// Cache utilities for optimizing API calls
class ApiCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl,
    });
  }

  clear() {
    this.cache.clear();
  }
}

export const apiCache = new ApiCache();

// Cached API calls
export const cachedApiService = {
  async getTopics() {
    const cacheKey = 'topics';
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
    
    const data = await apiService.getTopics();
    apiCache.set(cacheKey, data);
    return data;
  },

  async getNotesTopics() {
    const cacheKey = 'notes-topics';
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
    
    const data = await apiService.getNotesTopics();
    apiCache.set(cacheKey, data);
    return data;
  },
};