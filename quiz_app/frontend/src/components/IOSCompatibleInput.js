import React, { useState, useRef, useEffect } from 'react';

const IOSCompatibleInput = ({ value, onChange, placeholder, maxLength, className }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');
  const hiddenInputRef = useRef(null);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleDisplayClick = () => {
    if (isIOS) {
      // For iOS, we'll show a native prompt instead of using input
      const newValue = prompt(placeholder || 'Enter value', localValue);
      if (newValue !== null) {
        const trimmedValue = newValue.substring(0, maxLength || 20);
        setLocalValue(trimmedValue);
        if (onChange) {
          // Simulate an event object
          onChange({ target: { value: trimmedValue } });
        }
      }
    } else {
      // For non-iOS, use normal input
      setIsEditing(true);
      setTimeout(() => {
        if (hiddenInputRef.current) {
          hiddenInputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      setLocalValue(newValue);
      if (onChange) {
        onChange(e);
      }
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  // For iOS, render a div that looks like an input
  if (isIOS) {
    return (
      <div 
        className={`ios-input-display ${className}`}
        onClick={handleDisplayClick}
        style={{
          padding: '12px 16px',
          border: '2px solid #dee2e6',
          borderRadius: '6px',
          backgroundColor: '#fff',
          color: localValue ? '#212529' : '#6c757d',
          fontSize: '16px',
          cursor: 'pointer',
          minHeight: '44px', // iOS recommended touch target
          display: 'flex',
          alignItems: 'center',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none'
        }}
      >
        {localValue || placeholder || 'Tap to enter'}
      </div>
    );
  }

  // For non-iOS, use regular input approach
  return (
    <div className="input-wrapper" style={{ position: 'relative' }}>
      {!isEditing ? (
        <div 
          className={`input-display ${className}`}
          onClick={handleDisplayClick}
          style={{
            padding: '12px 16px',
            border: '2px solid #dee2e6',
            borderRadius: '6px',
            backgroundColor: '#fff',
            color: localValue ? '#212529' : '#6c757d',
            fontSize: '16px',
            cursor: 'text',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {localValue || placeholder || 'Click to enter'}
        </div>
      ) : (
        <input
          ref={hiddenInputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={className}
          style={{
            padding: '12px 16px',
            border: '2px solid #007bff',
            borderRadius: '6px',
            fontSize: '16px',
            width: '100%',
            outline: 'none'
          }}
        />
      )}
    </div>
  );
};

export default IOSCompatibleInput;