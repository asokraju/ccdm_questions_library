import React, { useState, useEffect } from 'react';
import apiUserService from '../../services/apiUserService';
import IOSCompatibleInput from '../../components/IOSCompatibleInput';
import './users.css';

function UserSelector({ onUserSelected }) {
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [storageInfo, setStorageInfo] = useState('');

  useEffect(() => {
    loadUsers();
    const current = apiUserService.getCurrentUser();
    console.log('Current user from storage:', current);
    setCurrentUser(current);
    
    // If there's a current user, auto-select them
    if (current) {
      onUserSelected(current);
    }
  }, [onUserSelected]);

  const loadUsers = async () => {
    try {
      const allUsers = await apiUserService.getAllUsers();
      console.log('All users loaded:', allUsers);
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const username = await apiUserService.createUser(newUsername.trim());
      setNewUsername('');
      setShowCreateForm(false);
      await loadUsers();
      setCurrentUser(username);
      onUserSelected(username);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
  };

  const handleSelectUser = async (username) => {
    await apiUserService.switchUser(username);
    setCurrentUser(username);
    onUserSelected(username);
  };

  const handleDeleteUser = async (username) => {
    if (window.confirm(`Delete user "${username}" and all their data?`)) {
      await apiUserService.deleteUser(username);
      await loadUsers();
      
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
            apiUserService.setCurrentUser(null);
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
        
        {storageInfo && (
          <div className="storage-warning">
            {storageInfo}
          </div>
        )}

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
            onClick={handleShowCreateForm}
          >
            Create New User
          </button>
        ) : (
          <form onSubmit={handleCreateUser} className="create-user-form">
            <IOSCompatibleInput
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter username"
              maxLength={20}
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