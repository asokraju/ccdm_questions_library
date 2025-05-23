import React from 'react';
import TopicSelector from './TopicSelector';
import { Button, Card } from './ui';

const MainMenu = React.memo(function MainMenu({ 
  topics, 
  selectedTopic, 
  onTopicChange, 
  onNavigate, 
  onReset,
  onLogout,
  currentUser
}) {
  return (
    <div className="main-menu-container">
      <div className="user-header">
        <div className="user-info">
          <span className="welcome-text">Welcome back,</span>
          <span className="username">{currentUser}</span>
        </div>
        <button className="logout-btn" onClick={() => {
          if (window.confirm('Are you sure you want to logout?')) {
            onLogout();
          }
        }}>
          Logout
        </button>
      </div>

      <TopicSelector
        topics={topics}
        selectedTopic={selectedTopic}
        onTopicChange={onTopicChange}
      />
      
      <div className="menu-grid">
        {/* Primary Actions */}
        <Card className="menu-card primary-card">
          <div className="card-icon">📚</div>
          <h3>Practice Quiz</h3>
          <p>Test your knowledge with customizable quizzes</p>
          <Button 
            variant="primary"
            onClick={() => onNavigate('config')}
            className="card-button"
          >
            Start Quiz
          </Button>
        </Card>

        <Card className="menu-card study-card">
          <div className="card-icon">📖</div>
          <h3>Study Material</h3>
          <p>Review comprehensive study notes and resources</p>
          <Button 
            variant="study"
            onClick={() => onNavigate('notes')}
            className="card-button"
          >
            Open Notes
          </Button>
        </Card>

        {/* Progress & Review */}
        <Card className="menu-card stats-card">
          <div className="card-icon">📊</div>
          <h3>Your Progress</h3>
          <p>Track your performance and learning statistics</p>
          <Button 
            variant="secondary"
            onClick={() => onNavigate('statistics')}
            className="card-button"
          >
            View Stats
          </Button>
        </Card>

        <Card className="menu-card review-card">
          <div className="card-icon">🔍</div>
          <h3>Review Mistakes</h3>
          <p>Learn from incorrect answers and improve</p>
          <Button 
            variant="secondary"
            onClick={() => onNavigate('review')}
            className="card-button"
          >
            Review Answers
          </Button>
        </Card>

        {/* Data Management */}
        <Card className="menu-card comment-card">
          <div className="card-icon">💬</div>
          <h3>Your Notes</h3>
          <p>Manage and search through all your comments</p>
          <Button 
            variant="secondary"
            onClick={() => onNavigate('comments')}
            className="card-button"
          >
            Manage Notes
          </Button>
        </Card>

        <Card className="menu-card data-card">
          <div className="card-icon">💾</div>
          <h3>Data Management</h3>
          <p>Export or import your quiz data</p>
          <Button 
            variant="secondary"
            onClick={() => onNavigate('data')}
            className="card-button"
          >
            Manage Data
          </Button>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="menu-footer">
        <Button 
          variant="secondary"
          onClick={() => onNavigate('users')}
          size="small"
        >
          👥 Manage Users
        </Button>
        
        <Button 
          variant="danger"
          onClick={onReset}
          size="small"
        >
          Reset Progress
        </Button>
      </div>
    </div>
  );
});

export default MainMenu;