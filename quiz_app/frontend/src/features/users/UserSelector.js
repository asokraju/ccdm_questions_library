import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import './users.css';

function UserSelector({ onUserSelected }) {
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadUsers();
    const current = userService.getCurrentUser();
    setCurrentUser(current);
    
    // If there's a current user, auto-select them
    if (current) {
      onUserSelected(current);
    }
  }, [onUserSelected]);

  const loadUsers = () => {
    const allUsers = userService.getAllUsers();
    setUsers(allUsers);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError('');

    try {
      const username = userService.createUser(newUsername.trim());
      setNewUsername('');
      setShowCreateForm(false);
      loadUsers();
      setCurrentUser(username);
      onUserSelected(username);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectUser = (username) => {
    userService.switchUser(username);
    setCurrentUser(username);
    onUserSelected(username);
  };

  const handleDeleteUser = (username) => {
    if (window.confirm(`Delete user "${username}" and all their data?`)) {
      userService.deleteUser(username);
      loadUsers();
      
      if (currentUser === username) {
        setCurrentUser(null);
        onUserSelected(null);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (currentUser) {
    return (
      <div className="current-user-banner">
        <span>Playing as: <strong>{currentUser}</strong></span>
        <button 
          className="switch-user-btn"
          onClick={() => {
            setCurrentUser(null);
            onUserSelected(null);
          }}
        >
          Switch User
        </button>
      </div>
    );
  }

  return (
    <div className="user-selector-container">
      <div className="card">
        <h2>Select User Profile</h2>
        <p>Choose an existing profile or create a new one to track your progress</p>

        {users.length > 0 && (
          <div className="user-list">
            {users.map(user => (
              <div key={user.username} className="user-item">
                <div className="user-info" onClick={() => handleSelectUser(user.username)}>
                  <h3>{user.username}</h3>
                  <small>
                    Created: {formatDate(user.createdAt)} | 
                    Last active: {formatDate(user.lastActive)}
                  </small>
                </div>
                <button 
                  className="delete-user-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(user.username);
                  }}
                  title="Delete user"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        {!showCreateForm ? (
          <button 
            className="primary create-user-btn"
            onClick={() => setShowCreateForm(true)}
          >
            Create New User
          </button>
        ) : (
          <form onSubmit={handleCreateUser} className="create-user-form">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter username"
              maxLength="20"
              autoFocus
              className="username-input"
            />
            <div className="form-actions">
              <button type="submit" className="primary" disabled={!newUsername.trim()}>
                Create
              </button>
              <button 
                type="button" 
                className="secondary"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewUsername('');
                  setError('');
                }}
              >
                Cancel
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </form>
        )}

        {users.length === 0 && !showCreateForm && (
          <div className="no-users-message">
            <p>No users yet. Create your first profile to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSelector;