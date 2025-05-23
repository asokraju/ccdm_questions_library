import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import './users.css';

function UserManagement({ onBack }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = userService.getAllUsers();
    setUsers(allUsers);
  };

  const handleUserSelect = (username) => {
    setSelectedUser(username);
    
    // Load user stats
    const progress = userService.getUserProgress(username);
    const comments = userService.getUserComments(username);
    
    setUserStats({
      totalQuestions: progress.correct + progress.incorrect,
      correctAnswers: progress.correct,
      incorrectAnswers: progress.incorrect,
      accuracy: progress.correct + progress.incorrect > 0 
        ? Math.round((progress.correct / (progress.correct + progress.incorrect)) * 100)
        : 0,
      totalComments: Object.keys(comments).length,
      lastActive: users.find(u => u.username === username)?.lastActive
    });
  };

  const handleExportUser = (username) => {
    try {
      const userData = userService.exportUserData(username);
      
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-${username}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting user data');
    }
  };

  const handleDeleteUser = (username) => {
    if (window.confirm(`Delete user "${username}" and all their data? This cannot be undone.`)) {
      userService.deleteUser(username);
      loadUsers();
      setSelectedUser(null);
      setUserStats(null);
    }
  };

  const handleMakeActive = (username) => {
    userService.switchUser(username);
    window.location.reload(); // Reload to apply user change
  };

  return (
    <div className="user-management-container">
      <button className="secondary back-button" onClick={onBack}>
        Back to Menu
      </button>

      <div className="card">
        <h2>User Management</h2>
        <p>Manage user profiles and their data</p>

        <div className="user-list">
          {users.map(user => (
            <div 
              key={user.username} 
              className={`user-item ${selectedUser === user.username ? 'selected' : ''}`}
              onClick={() => handleUserSelect(user.username)}
            >
              <div className="user-info">
                <h3>
                  {user.username}
                  {userService.getCurrentUser() === user.username && (
                    <span className="active-badge"> (Active)</span>
                  )}
                </h3>
                <small>
                  Created: {new Date(user.createdAt).toLocaleDateString()} | 
                  Last active: {new Date(user.lastActive).toLocaleDateString()}
                </small>
              </div>
            </div>
          ))}
        </div>

        {selectedUser && userStats && (
          <div className="user-details">
            <h3>{selectedUser}'s Statistics</h3>
            
            <div className="user-stats-grid">
              <div className="stat-card">
                <h3>Total Questions</h3>
                <div className="stat-value">{userStats.totalQuestions}</div>
              </div>
              
              <div className="stat-card">
                <h3>Correct Answers</h3>
                <div className="stat-value">{userStats.correctAnswers}</div>
              </div>
              
              <div className="stat-card">
                <h3>Accuracy</h3>
                <div className="stat-value">{userStats.accuracy}%</div>
              </div>
              
              <div className="stat-card">
                <h3>Total Comments</h3>
                <div className="stat-value">{userStats.totalComments}</div>
              </div>
            </div>

            <div className="user-actions">
              {userService.getCurrentUser() !== selectedUser && (
                <button 
                  className="primary"
                  onClick={() => handleMakeActive(selectedUser)}
                >
                  Make Active User
                </button>
              )}
              
              <button 
                className="secondary"
                onClick={() => handleExportUser(selectedUser)}
              >
                Export User Data
              </button>
              
              <button 
                className="danger"
                onClick={() => handleDeleteUser(selectedUser)}
              >
                Delete User
              </button>
            </div>
          </div>
        )}

        {users.length === 0 && (
          <div className="no-users-message">
            <p>No users found. Create a user profile from the main menu.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;