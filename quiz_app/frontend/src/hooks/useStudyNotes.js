import { useState, useCallback, useEffect } from 'react';
import { NotesService } from '../services/apiService';
import { useReadingProgress } from './useLocalStorage';

export const useStudyNotes = () => {
  const [notesState, setNotesState] = useState({
    topics: [],
    selectedTopic: null,
    noteContent: '',
    isLoading: false,
    error: null,
  });

  const loadTopics = useCallback(async () => {
    setNotesState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const topics = await NotesService.getAllTopics();
      setNotesState(prev => ({
        ...prev,
        topics,
        isLoading: false,
      }));
    } catch (error) {
      setNotesState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  }, []);

  // Load topics on mount
  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  const loadNoteContent = useCallback(async (topicName) => {
    setNotesState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await NotesService.getTopicContent(topicName);
      setNotesState(prev => ({
        ...prev,
        selectedTopic: topicName,
        noteContent: response.content,
        isLoading: false,
      }));
    } catch (error) {
      setNotesState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  }, []);

  const clearSelectedTopic = useCallback(() => {
    setNotesState(prev => ({
      ...prev,
      selectedTopic: null,
      noteContent: '',
      error: null,
    }));
  }, []);

  const retryLoadTopics = useCallback(() => {
    loadTopics();
  }, [loadTopics]);

  return {
    // State
    topics: notesState.topics,
    selectedTopic: notesState.selectedTopic,
    noteContent: notesState.noteContent,
    isLoading: notesState.isLoading,
    error: notesState.error,
    
    // Actions
    loadTopics,
    loadNoteContent,
    clearSelectedTopic,
    retryLoadTopics,
    
    // Computed
    hasTopics: notesState.topics.length > 0,
    hasSelectedTopic: !!notesState.selectedTopic,
  };
};

// Hook for individual topic with reading progress
export const useTopicNotes = (topicName) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const readingProgress = useReadingProgress(topicName);

  const loadContent = useCallback(async () => {
    if (!topicName) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await NotesService.getTopicContent(topicName);
      setContent(response.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [topicName]);

  // Load content when topic changes
  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleScroll = useCallback((scrollTop, scrollHeight, clientHeight) => {
    const scrollPercentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
    readingProgress.updateProgress(scrollPercentage);
  }, [readingProgress]);

  return {
    content,
    isLoading,
    error,
    readingProgress: readingProgress.progress,
    isComplete: readingProgress.isComplete,
    handleScroll,
    resetProgress: readingProgress.resetProgress,
    retryLoad: loadContent,
  };
};