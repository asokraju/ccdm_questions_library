import React, { useState, useEffect } from 'react';
import apiUserService from '../services/apiUserService';
import './syncStatus.css';

function SyncStatus() {
  const [connectionStatus, setConnectionStatus] = useState({
    online: true,
    queueLength: 0
  });
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    // Check status every 5 seconds
    const checkStatus = () => {
      const status = apiUserService.getConnectionStatus();
      setConnectionStatus(status);
      
      if (status.online && status.queueLength === 0) {
        setLastSync(new Date());
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    // Listen for online/offline events
    const handleOnline = () => {
      setConnectionStatus(prev => ({ ...prev, online: true }));
      apiUserService.processSyncQueue();
    };

    const handleOffline = () => {
      setConnectionStatus(prev => ({ ...prev, online: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatLastSync = () => {
    if (!lastSync) return 'Never';
    
    const seconds = Math.floor((new Date() - lastSync) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const syncNow = async () => {
    if (connectionStatus.online) {
      await apiUserService.processSyncQueue();
      const status = apiUserService.getConnectionStatus();
      setConnectionStatus(status);
      if (status.queueLength === 0) {
        setLastSync(new Date());
      }
    }
  };

  return (
    <div className={`sync-status ${connectionStatus.online ? 'online' : 'offline'}`}>
      <div className="sync-indicator">
        <span className="status-dot"></span>
        <span className="status-text">
          {connectionStatus.online ? 'Online' : 'Offline'}
        </span>
      </div>
      
      {connectionStatus.queueLength > 0 && (
        <div className="queue-info">
          <span className="queue-count">{connectionStatus.queueLength} pending</span>
          {connectionStatus.online && (
            <button className="sync-button" onClick={syncNow}>Sync now</button>
          )}
        </div>
      )}
      
      {connectionStatus.online && connectionStatus.queueLength === 0 && (
        <div className="last-sync">
          Synced: {formatLastSync()}
        </div>
      )}
    </div>
  );
}

export default SyncStatus;