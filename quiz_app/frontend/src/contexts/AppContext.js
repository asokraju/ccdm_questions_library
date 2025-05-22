import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../services/apiService';

// Initial state
const initialState = {
  // App navigation
  currentView: 'menu',
  
  // Topics data
  topics: [],
  selectedTopic: 'all',
  
  // Quiz state
  quizConfig: null,
  
  // User progress
  progress: null,
  
  // Loading states
  loading: {
    topics: false,
    progress: false,
    quiz: false,
    notes: false,
  },
  
  // Error states
  errors: {
    topics: null,
    progress: null,
    quiz: null,
    notes: null,
  }
};

// Action types
export const ACTION_TYPES = {
  // Navigation
  SET_CURRENT_VIEW: 'SET_CURRENT_VIEW',
  
  // Topics
  SET_TOPICS_LOADING: 'SET_TOPICS_LOADING',
  SET_TOPICS_SUCCESS: 'SET_TOPICS_SUCCESS',
  SET_TOPICS_ERROR: 'SET_TOPICS_ERROR',
  SET_SELECTED_TOPIC: 'SET_SELECTED_TOPIC',
  
  // Quiz
  SET_QUIZ_CONFIG: 'SET_QUIZ_CONFIG',
  SET_QUIZ_LOADING: 'SET_QUIZ_LOADING',
  SET_QUIZ_ERROR: 'SET_QUIZ_ERROR',
  
  // Progress
  SET_PROGRESS_LOADING: 'SET_PROGRESS_LOADING',
  SET_PROGRESS_SUCCESS: 'SET_PROGRESS_SUCCESS',
  SET_PROGRESS_ERROR: 'SET_PROGRESS_ERROR',
  
  // Notes
  SET_NOTES_LOADING: 'SET_NOTES_LOADING',
  SET_NOTES_ERROR: 'SET_NOTES_ERROR',
  
  // General
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_CURRENT_VIEW:
      return {
        ...state,
        currentView: action.payload,
      };
    
    case ACTION_TYPES.SET_TOPICS_LOADING:
      return {
        ...state,
        loading: { ...state.loading, topics: action.payload },
        errors: { ...state.errors, topics: null },
      };
    
    case ACTION_TYPES.SET_TOPICS_SUCCESS:
      return {
        ...state,
        topics: action.payload,
        loading: { ...state.loading, topics: false },
        errors: { ...state.errors, topics: null },
      };
    
    case ACTION_TYPES.SET_TOPICS_ERROR:
      return {
        ...state,
        loading: { ...state.loading, topics: false },
        errors: { ...state.errors, topics: action.payload },
      };
    
    case ACTION_TYPES.SET_SELECTED_TOPIC:
      return {
        ...state,
        selectedTopic: action.payload,
      };
    
    case ACTION_TYPES.SET_QUIZ_CONFIG:
      return {
        ...state,
        quizConfig: action.payload,
      };
    
    case ACTION_TYPES.SET_QUIZ_LOADING:
      return {
        ...state,
        loading: { ...state.loading, quiz: action.payload },
        errors: { ...state.errors, quiz: null },
      };
    
    case ACTION_TYPES.SET_QUIZ_ERROR:
      return {
        ...state,
        loading: { ...state.loading, quiz: false },
        errors: { ...state.errors, quiz: action.payload },
      };
    
    case ACTION_TYPES.SET_PROGRESS_LOADING:
      return {
        ...state,
        loading: { ...state.loading, progress: action.payload },
        errors: { ...state.errors, progress: null },
      };
    
    case ACTION_TYPES.SET_PROGRESS_SUCCESS:
      return {
        ...state,
        progress: action.payload,
        loading: { ...state.loading, progress: false },
        errors: { ...state.errors, progress: null },
      };
    
    case ACTION_TYPES.SET_PROGRESS_ERROR:
      return {
        ...state,
        loading: { ...state.loading, progress: false },
        errors: { ...state.errors, progress: action.payload },
      };
    
    case ACTION_TYPES.SET_NOTES_LOADING:
      return {
        ...state,
        loading: { ...state.loading, notes: action.payload },
        errors: { ...state.errors, notes: null },
      };
    
    case ACTION_TYPES.SET_NOTES_ERROR:
      return {
        ...state,
        loading: { ...state.loading, notes: false },
        errors: { ...state.errors, notes: action.payload },
      };
    
    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        errors: { ...state.errors, [action.payload]: null },
      };
    
    case ACTION_TYPES.RESET_STATE:
      return initialState;
    
    default:
      return state;
  }
};

// Create contexts
const AppStateContext = createContext();
const AppDispatchContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Load initial data
  useEffect(() => {
    loadTopics();
    loadProgress();
  }, []);
  
  // Action creators
  const loadTopics = async () => {
    dispatch({ type: ACTION_TYPES.SET_TOPICS_LOADING, payload: true });
    try {
      const topics = await apiService.getTopics();
      dispatch({ type: ACTION_TYPES.SET_TOPICS_SUCCESS, payload: topics });
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_TOPICS_ERROR, payload: error.message });
    }
  };
  
  const loadProgress = async () => {
    dispatch({ type: ACTION_TYPES.SET_PROGRESS_LOADING, payload: true });
    try {
      const progress = await apiService.getProgress();
      dispatch({ type: ACTION_TYPES.SET_PROGRESS_SUCCESS, payload: progress });
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_PROGRESS_ERROR, payload: error.message });
    }
  };
  
  const actions = {
    loadTopics,
    loadProgress,
    
    // Navigation
    setCurrentView: (view) => 
      dispatch({ type: ACTION_TYPES.SET_CURRENT_VIEW, payload: view }),
    
    // Topics
    setSelectedTopic: (topic) => 
      dispatch({ type: ACTION_TYPES.SET_SELECTED_TOPIC, payload: topic }),
    
    // Quiz
    setQuizConfig: (config) => 
      dispatch({ type: ACTION_TYPES.SET_QUIZ_CONFIG, payload: config }),
    
    // General
    clearError: (errorType) => 
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR, payload: errorType }),
    
    resetState: () => 
      dispatch({ type: ACTION_TYPES.RESET_STATE }),
  };
  
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={actions}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

// Custom hooks for using context
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

export const useAppActions = () => {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppActions must be used within an AppProvider');
  }
  return context;
};

// Combined hook for convenience
export const useApp = () => {
  return {
    state: useAppState(),
    actions: useAppActions(),
  };
};