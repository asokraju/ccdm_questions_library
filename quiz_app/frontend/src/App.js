import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { apiService } from './services/apiService';
import QuizContainer from './components/QuizContainer';
import Statistics from './components/Statistics';
import ReviewList from './components/ReviewList';
import TopicSelector from './components/TopicSelector';
import QuizConfig from './components/QuizConfig';
import StudyNotes from './components/StudyNotes';
import { VIEWS } from './utils/constants';
import './App.css';

function AppContent() {
  const { state, actions } = useApp();
  const { currentView, selectedTopic, topics, progress, quizConfig } = state;

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      try {
        await apiService.resetProgress();
        actions.setCurrentView(VIEWS.MENU);
        // Progress will be reloaded automatically by the context
      } catch (error) {
        console.error('Error resetting progress:', error);
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>CCDM Quiz Application</h1>
        <p>Test your Clinical Data Management knowledge</p>
      </div>

      {currentView === VIEWS.MENU && (
        <div>
          <TopicSelector
            topics={topics}
            selectedTopic={selectedTopic}
            onTopicChange={actions.setSelectedTopic}
          />
          
          <div className="menu card">
            <h2>Choose an Option</h2>
            <div className="menu-buttons">
              <button 
                className="primary"
                onClick={() => actions.setCurrentView(VIEWS.CONFIG)}
              >
                Start Quiz
              </button>
              <button 
                className="secondary study-button"
                onClick={() => actions.setCurrentView(VIEWS.NOTES)}
              >
                📖 Study Material
              </button>
              <button 
                className="secondary"
                onClick={() => actions.setCurrentView(VIEWS.STATISTICS)}
              >
                View Statistics
              </button>
              <button 
                className="secondary"
                onClick={() => actions.setCurrentView(VIEWS.REVIEW)}
              >
                Review Incorrect Answers
              </button>
              <button 
                className="danger"
                onClick={handleReset}
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === VIEWS.CONFIG && (
        <QuizConfig
          selectedTopic={selectedTopic}
          onStartQuiz={(config) => {
            actions.setQuizConfig(config);
            actions.setCurrentView(VIEWS.QUIZ);
          }}
          onBack={() => {
            actions.setCurrentView(VIEWS.MENU);
            actions.setQuizConfig(null);
          }}
        />
      )}

      {currentView === VIEWS.QUIZ && (
        <>
          {quizConfig ? (
            <QuizContainer
              quizConfig={quizConfig}
              onBack={() => {
                actions.setCurrentView(VIEWS.MENU);
                actions.setQuizConfig(null);
              }}
              onUpdateProgress={actions.loadProgress}
            />
          ) : (
            <div className="card">
              <p>Quiz configuration error. Please try again.</p>
              <button 
                className="secondary" 
                onClick={() => {
                  actions.setCurrentView(VIEWS.MENU);
                  actions.setQuizConfig(null);
                }}
              >
                Back to Menu
              </button>
            </div>
          )}
        </>
      )}

      {currentView === VIEWS.STATISTICS && progress && (
        <Statistics
          progress={progress}
          onBack={() => actions.setCurrentView(VIEWS.MENU)}
        />
      )}

      {currentView === VIEWS.REVIEW && (
        <ReviewList
          onBack={() => actions.setCurrentView(VIEWS.MENU)}
        />
      )}

      {currentView === VIEWS.NOTES && (
        <StudyNotes
          onBack={() => actions.setCurrentView(VIEWS.MENU)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;