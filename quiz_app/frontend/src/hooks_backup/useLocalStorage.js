import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Set value in localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function for the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Hook for managing reading progress
export const useReadingProgress = (topicName) => {
  const [progress, setProgress] = useLocalStorage(`reading-progress-${topicName}`, 0);
  
  const updateProgress = useCallback((scrollPercentage) => {
    // Only update if new progress is higher than stored progress
    if (scrollPercentage > progress) {
      setProgress(scrollPercentage);
    }
  }, [progress, setProgress]);

  const resetProgress = useCallback(() => {
    setProgress(0);
  }, [setProgress]);

  return {
    progress,
    updateProgress,
    resetProgress,
    isComplete: progress >= 90, // Consider 90% as "complete"
  };
};

// Hook for managing user preferences
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage('user-preferences', {
    theme: 'light',
    fontSize: 'medium',
    autoAdvance: false,
    showExplanations: true,
  });

  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, [setPreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences({
      theme: 'light',
      fontSize: 'medium',
      autoAdvance: false,
      showExplanations: true,
    });
  }, [setPreferences]);

  return {
    preferences,
    updatePreference,
    resetPreferences,
  };
};