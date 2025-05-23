import { READING_SPEED, QUIZ_THRESHOLDS } from './constants';

// Text and formatting utilities
export const formatters = {
  // Calculate reading time from word count
  calculateReadingTime: (wordCount, wpm = READING_SPEED.AVERAGE_WPM) => {
    if (!wordCount || wordCount <= 0) return 0;
    return Math.ceil(wordCount / wpm);
  },

  // Format time duration
  formatDuration: (minutes) => {
    if (minutes < 1) return '< 1 min';
    if (minutes === 1) return '1 min';
    if (minutes < 60) return `${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return hours === 1 ? '1 hour' : `${hours} hours`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  },

  // Format percentage
  formatPercentage: (value, decimals = 1) => {
    if (typeof value !== 'number') return '0%';
    return `${value.toFixed(decimals)}%`;
  },

  // Format large numbers
  formatNumber: (number) => {
    if (typeof number !== 'number') return '0';
    return number.toLocaleString();
  },

  // Truncate text with ellipsis
  truncateText: (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  // Convert snake_case to Title Case
  toTitleCase: (str) => {
    if (!str) return '';
    return str
      .replace(/_/g, ' ')
      .replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
  },

  // Extract description from markdown content
  extractDescription: (content, maxLength = 150) => {
    if (!content) return '';
    
    // Remove markdown headers and formatting
    const plainText = content
      .replace(/^#{1,6}\s+/gm, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
      .trim();
    
    // Find first substantial paragraph
    const lines = plainText.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && trimmed.length > 50) {
        return formatters.truncateText(trimmed, maxLength);
      }
    }
    
    return formatters.truncateText(plainText, maxLength);
  },
};

// Validation utilities
export const validators = {
  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate quiz configuration
  isValidQuizConfig: (config) => {
    if (!config || typeof config !== 'object') return false;
    
    const { topic, questionCount, difficulty } = config;
    
    // Check required fields
    if (!topic || typeof questionCount !== 'number') return false;
    
    // Check question count range
    if (questionCount < 1 || questionCount > 100) return false;
    
    // Check difficulty if provided
    if (difficulty && !['easy', 'moderate', 'challenging'].includes(difficulty)) {
      return false;
    }
    
    return true;
  },

  // Validate topic name
  isValidTopicName: (topic) => {
    return topic && typeof topic === 'string' && topic.trim().length > 0;
  },
};

// Quiz utilities
export const quizUtils = {
  // Calculate quiz performance level
  getPerformanceLevel: (accuracy) => {
    if (accuracy >= QUIZ_THRESHOLDS.EXCELLENT) return 'excellent';
    if (accuracy >= QUIZ_THRESHOLDS.GOOD) return 'good';
    if (accuracy >= QUIZ_THRESHOLDS.FAIR) return 'fair';
    return 'poor';
  },

  // Get performance message
  getPerformanceMessage: (accuracy) => {
    const level = quizUtils.getPerformanceLevel(accuracy);
    
    const messages = {
      excellent: 'Outstanding! You have excellent knowledge of this topic.',
      good: 'Great job! You have a solid understanding of this material.',
      fair: 'Good effort! Consider reviewing the material to improve your score.',
      poor: 'Keep studying! Review the material and try again.',
    };
    
    return messages[level] || messages.poor;
  },

  // Calculate study recommendations
  getStudyRecommendations: (topicStats) => {
    const recommendations = [];
    
    Object.entries(topicStats).forEach(([topic, stats]) => {
      const total = stats.correct + stats.incorrect;
      if (total === 0) return;
      
      const accuracy = (stats.correct / total) * 100;
      
      if (accuracy < QUIZ_THRESHOLDS.FAIR) {
        recommendations.push({
          topic,
          priority: 'high',
          message: `Focus on ${formatters.toTitleCase(topic)} - current accuracy: ${formatters.formatPercentage(accuracy)}`,
        });
      } else if (accuracy < QUIZ_THRESHOLDS.GOOD) {
        recommendations.push({
          topic,
          priority: 'medium',
          message: `Review ${formatters.toTitleCase(topic)} - current accuracy: ${formatters.formatPercentage(accuracy)}`,
        });
      }
    });
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  },

  // Shuffle array (Fisher-Yates algorithm)
  shuffleArray: (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },
};

// DOM utilities
export const domUtils = {
  // Smooth scroll to element
  scrollToElement: (elementId, offset = 0) => {
    const element = document.getElementById(elementId);
    if (element) {
      const targetPosition = element.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  },

  // Get scroll percentage
  getScrollPercentage: () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    return scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
  },

  // Check if element is in viewport
  isInViewport: (element) => {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Copy text to clipboard
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        return true;
      } catch (fallbackError) {
        console.error('Failed to copy text:', fallbackError);
        return false;
      } finally {
        document.body.removeChild(textArea);
      }
    }
  },
};

// Debounce function for performance optimization
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for performance optimization
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};