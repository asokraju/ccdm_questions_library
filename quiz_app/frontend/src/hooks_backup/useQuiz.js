import { useState, useCallback, useEffect } from 'react';
import { QuizService } from '../services/apiService';
import { useApp } from '../contexts/AppContext';

export const useQuiz = (quizConfig) => {
  const { actions } = useApp();
  const [quizState, setQuizState] = useState({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswer: null,
    showExplanation: false,
    answers: {},
    isLoading: false,
    error: null,
  });

  const loadQuestions = useCallback(async (config) => {
    if (!config) {
      setQuizState(prev => ({ ...prev, error: 'Quiz configuration is required' }));
      return;
    }

    setQuizState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const questions = await QuizService.startQuiz(config);
      setQuizState(prev => ({
        ...prev,
        questions,
        currentQuestionIndex: 0,
        selectedAnswer: null,
        showExplanation: false,
        answers: {},
        isLoading: false,
      }));
    } catch (error) {
      setQuizState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  }, []);

  // Load questions when quizConfig changes
  useEffect(() => {
    if (quizConfig) {
      loadQuestions(quizConfig);
    }
  }, [quizConfig, loadQuestions]);

  const selectAnswer = useCallback((answer) => {
    if (quizState.showExplanation) return;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answer,
    }));
  }, [quizState.showExplanation]);

  const submitAnswer = useCallback(async () => {
    if (!quizState.selectedAnswer || !quizState.questions[quizState.currentQuestionIndex]) {
      return;
    }

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = quizState.selectedAnswer === currentQuestion.correctAnswer;
    
    // Store answer locally
    const newAnswers = {
      ...quizState.answers,
      [currentQuestion.id]: {
        answer: quizState.selectedAnswer,
        isCorrect,
      },
    };

    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      showExplanation: true,
    }));

    // Submit to backend
    try {
      await QuizService.submitAnswer({
        questionId: currentQuestion.id,
        answer: quizState.selectedAnswer,
        topic: currentQuestion.topic,
        subtopic: currentQuestion.subtopic,
        isCorrect,
      });
      
      // Refresh progress
      actions.loadProgress();
    } catch (error) {
      console.error('Error submitting answer:', error);
      // Don't block the quiz flow for submission errors
    }
  }, [quizState.selectedAnswer, quizState.questions, quizState.currentQuestionIndex, quizState.answers, actions]);

  const nextQuestion = useCallback(() => {
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        selectedAnswer: null,
        showExplanation: false,
      }));
    }
  }, [quizState.currentQuestionIndex, quizState.questions.length]);

  const resetQuiz = useCallback(() => {
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showExplanation: false,
      answers: {},
      isLoading: false,
      error: null,
    });
  }, []);

  const getQuizProgress = useCallback(() => {
    if (quizState.questions.length === 0) return 0;
    return ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;
  }, [quizState.currentQuestionIndex, quizState.questions.length]);

  const getQuizResults = useCallback(() => {
    const correctCount = Object.values(quizState.answers).filter(a => a.isCorrect).length;
    const totalQuestions = quizState.questions.length;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    
    return {
      correct: correctCount,
      total: totalQuestions,
      accuracy: accuracy.toFixed(1),
    };
  }, [quizState.answers, quizState.questions.length]);

  const isQuizComplete = useCallback(() => {
    return quizState.currentQuestionIndex >= quizState.questions.length - 1 && quizState.showExplanation;
  }, [quizState.currentQuestionIndex, quizState.questions.length, quizState.showExplanation]);

  return {
    // State
    questions: quizState.questions,
    currentQuestion: quizState.questions[quizState.currentQuestionIndex] || null,
    currentQuestionIndex: quizState.currentQuestionIndex,
    selectedAnswer: quizState.selectedAnswer,
    showExplanation: quizState.showExplanation,
    answers: quizState.answers,
    isLoading: quizState.isLoading,
    error: quizState.error,
    
    // Actions
    loadQuestions,
    selectAnswer,
    submitAnswer,
    nextQuestion,
    resetQuiz,
    
    // Computed values
    progress: getQuizProgress(),
    results: getQuizResults(),
    isComplete: isQuizComplete(),
  };
};