import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuizContainer from './components/QuizContainer';
import Statistics from './components/Statistics';
import ReviewList from './components/ReviewList';
import TopicSelector from './components/TopicSelector';
import QuizConfig from './components/QuizConfig';
import StudyNotes from './components/StudyNotes';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('menu');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState(null);
  const [quizConfig, setQuizConfig] = useState(null);

  useEffect(() => {
    // Load topics
    axios.get('/api/topics')
      .then(response => setTopics(response.data))
      .catch(error => console.error('Error loading topics:', error));
    
    // Load progress
    loadProgress();
  }, []);

  const loadProgress = () => {
    axios.get('/api/progress')
      .then(response => setProgress(response.data))
      .catch(error => console.error('Error loading progress:', error));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      axios.post('/api/reset')
        .then(() => {
          loadProgress();
          setCurrentView('menu');
        })
        .catch(error => console.error('Error resetting progress:', error));
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>CCDM Quiz Application</h1>
        <p>Test your Clinical Data Management knowledge</p>
      </div>

      {currentView === 'menu' && (
        <div>
          <TopicSelector
            topics={topics}
            selectedTopic={selectedTopic}
            onTopicChange={setSelectedTopic}
          />
          
          <div className="menu card">
            <h2>Choose an Option</h2>
            <div className="menu-buttons">
              <button 
                className="primary"
                onClick={() => setCurrentView('config')}
              >
                Start Quiz
              </button>
              <button 
                className="secondary study-button"
                onClick={() => setCurrentView('notes')}
              >
                📖 Study Material
              </button>
              <button 
                className="secondary"
                onClick={() => setCurrentView('statistics')}
              >
                View Statistics
              </button>
              <button 
                className="secondary"
                onClick={() => setCurrentView('review')}
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

      {currentView === 'config' && (
        <QuizConfig
          selectedTopic={selectedTopic}
          onStartQuiz={(config) => {
            setQuizConfig(config);
            setCurrentView('quiz');
          }}
          onBack={() => {
            setCurrentView('menu');
            setQuizConfig(null);
          }}
        />
      )}

      {currentView === 'quiz' && (
        <>
          {quizConfig ? (
            <QuizContainer
              quizConfig={quizConfig}
              onBack={() => {
                setCurrentView('menu');
                setQuizConfig(null);
              }}
              onUpdateProgress={loadProgress}
            />
          ) : (
            <div className="card">
              <p>Quiz configuration error. Please try again.</p>
              <button 
                className="secondary" 
                onClick={() => {
                  setCurrentView('menu');
                  setQuizConfig(null);
                }}
              >
                Back to Menu
              </button>
            </div>
          )}
        </>
      )}

      {currentView === 'statistics' && progress && (
        <Statistics
          progress={progress}
          onBack={() => setCurrentView('menu')}
        />
      )}

      {currentView === 'review' && (
        <ReviewList
          onBack={() => setCurrentView('menu')}
        />
      )}

      {currentView === 'notes' && (
        <StudyNotes
          onBack={() => setCurrentView('menu')}
        />
      )}
    </div>
  );
}

export default App;