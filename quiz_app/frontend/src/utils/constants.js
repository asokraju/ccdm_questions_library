// Application views
export const VIEWS = {
  MENU: 'menu',
  CONFIG: 'config',
  QUIZ: 'quiz',
  STATISTICS: 'statistics',
  REVIEW: 'review',
  NOTES: 'notes',
};

// Quiz configuration
export const QUIZ_CONFIG = {
  QUESTION_COUNTS: [5, 10, 15, 20, 25, 30],
  DEFAULT_QUESTION_COUNT: 10,
  
  DIFFICULTY_LEVELS: [
    { 
      value: 'balanced', 
      label: 'Balanced (Mixed Difficulty)', 
      description: 'Mix of all difficulty levels' 
    },
    { 
      value: 'easy', 
      label: 'Easy', 
      description: 'Basic knowledge questions' 
    },
    { 
      value: 'moderate', 
      label: 'Moderate', 
      description: 'Intermediate level questions' 
    },
    { 
      value: 'challenging', 
      label: 'Challenging', 
      description: 'Advanced knowledge questions' 
    },
  ],
  DEFAULT_DIFFICULTY: 'balanced',
};

// API endpoints
export const API_ENDPOINTS = {
  TOPICS: '/api/topics',
  QUESTIONS: '/api/questions',
  ANSWER: '/api/answer',
  PROGRESS: '/api/progress',
  RESET: '/api/reset',
  REVIEWS: '/api/reviews',
  NOTES_TOPICS: '/api/notes/topics',
  NOTES_CONTENT: '/api/notes',
};

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user-preferences',
  READING_PROGRESS: 'reading-progress',
  QUIZ_STATE: 'quiz-state',
};

// Theme configuration
export const THEME = {
  COLORS: {
    PRIMARY: '#007bff',
    SECONDARY: '#6c757d',
    SUCCESS: '#28a745',
    DANGER: '#dc3545',
    WARNING: '#ffc107',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40',
  },
  
  BREAKPOINTS: {
    MOBILE: '768px',
    TABLET: '1024px',
    DESKTOP: '1200px',
  },
  
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    XXL: '3rem',
  },
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error: Please check your internet connection',
  SERVER_ERROR: 'Server error: Please try again later',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Please check your input and try again',
  UNKNOWN_ERROR: 'An unexpected error occurred',
};

// Success messages
export const SUCCESS_MESSAGES = {
  QUIZ_COMPLETED: 'Quiz completed successfully!',
  PROGRESS_RESET: 'Progress has been reset',
  ANSWER_SUBMITTED: 'Answer submitted',
};

// Quiz result thresholds
export const QUIZ_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  FAIR: 50,
  POOR: 0,
};

// Reading time calculation (words per minute)
export const READING_SPEED = {
  AVERAGE_WPM: 200,
  SLOW_WPM: 150,
  FAST_WPM: 250,
};

// Animation durations (in milliseconds)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Validation rules
export const VALIDATION = {
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 50,
  REQUIRED_FIELDS: ['topic', 'questionCount'],
};