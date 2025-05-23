import React, { useState, useEffect } from 'react';
import { apiService } from './services/apiService';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import ViewRouter from './components/ViewRouter';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('menu');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState(null);
  const [quizConfig, setQuizConfig] = useState(null);

  useEffect(() => {
    // Load topics
    apiService.getTopics()
      .then(response => setTopics(response))
      .catch(error => console.error('Error loading topics:', error));
    
    // Load progress
    loadProgress();
  }, []);

  const loadProgress = () => {
    apiService.getProgress()
      .then(response => setProgress(response))
      .catch(error => console.error('Error loading progress:', error));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      apiService.resetProgress()
        .then(() => {
          loadProgress();
          setCurrentView('menu');
        })
        .catch(error => console.error('Error resetting progress:', error));
    }
  };

  return (
    <div className="container">
      <Header />

      {currentView === 'menu' ? (
        <MainMenu
          topics={topics}
          selectedTopic={selectedTopic}
          onTopicChange={setSelectedTopic}
          onNavigate={setCurrentView}
          onReset={handleReset}
        />
      ) : (
        <ViewRouter
          currentView={currentView}
          selectedTopic={selectedTopic}
          quizConfig={quizConfig}
          progress={progress}
          onNavigate={setCurrentView}
          onSetQuizConfig={setQuizConfig}
          onUpdateProgress={loadProgress}
        />
      )}
    </div>
  );
}

export default App;