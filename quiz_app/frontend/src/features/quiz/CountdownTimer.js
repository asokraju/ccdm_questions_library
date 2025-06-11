import React, { useState, useEffect, useRef } from 'react';

function CountdownTimer({ 
  timeLimit, 
  isActive = true, 
  onTimeUp, 
  onTick,
  resetKey // Force reset when this changes
}) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const intervalRef = useRef(null);
  const hasCalledTimeUp = useRef(false);

  useEffect(() => {
    // Reset timer when resetKey changes
    setTimeRemaining(timeLimit);
    hasCalledTimeUp.current = false;
  }, [resetKey, timeLimit]);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1000;
          
          // Call onTick if provided
          if (onTick) {
            onTick(newTime);
          }
          
          // Check if time is up
          if (newTime <= 0 && !hasCalledTimeUp.current) {
            hasCalledTimeUp.current = true;
            if (onTimeUp) {
              setTimeout(() => onTimeUp(), 100); // Small delay to ensure state updates
            }
          }
          
          return Math.max(0, newTime);
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining, onTimeUp, onTick]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return (timeRemaining / timeLimit) * 100;
  };

  const getTimerClass = () => {
    const percentage = getProgressPercentage();
    if (percentage <= 20) return 'countdown-timer critical';
    if (percentage <= 50) return 'countdown-timer warning';
    return 'countdown-timer normal';
  };

  const getProgressBarClass = () => {
    const percentage = getProgressPercentage();
    if (percentage <= 20) return 'countdown-progress critical';
    if (percentage <= 50) return 'countdown-progress warning';
    return 'countdown-progress normal';
  };

  if (!timeLimit) return null;

  return (
    <div className={getTimerClass()}>
      <div className="countdown-display">
        <span className="timer-icon">⏰</span>
        <span className="timer-text">{formatTime(timeRemaining)}</span>
      </div>
      <div className="countdown-progress-container">
        <div 
          className={getProgressBarClass()}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>
    </div>
  );
}

export default CountdownTimer;