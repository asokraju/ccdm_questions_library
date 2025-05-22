import React, { useState, useEffect, useRef } from 'react';

function TopicSelector({ topics, selectedTopic, onTopicChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const allOptions = [
    { value: 'all', label: 'All Topics' },
    ...topics.map(topic => ({ value: topic, label: topic }))
  ];

  const selectedOption = allOptions.find(option => option.value === selectedTopic);
  const displayLabel = selectedOption ? selectedOption.label : 'All Topics';

  const handleTopicSelect = (topicValue) => {
    onTopicChange(topicValue);
    setIsDropdownOpen(false);
  };

  return (
    <div className="topic-selector">
      <label htmlFor="topic-select">Select Topic: </label>
      <div className="custom-dropdown topic-dropdown" ref={dropdownRef}>
        <button
          type="button"
          id="topic-select"
          className={`dropdown-button ${isDropdownOpen ? 'open' : ''}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
        >
          <span>{displayLabel}</span>
          <span className="dropdown-arrow">▼</span>
        </button>
        
        {isDropdownOpen && (
          <div className="dropdown-menu" role="listbox">
            {allOptions.map(option => (
              <button
                key={option.value}
                type="button"
                className={`dropdown-option ${option.value === selectedTopic ? 'selected' : ''}`}
                onClick={() => handleTopicSelect(option.value)}
                role="option"
                aria-selected={option.value === selectedTopic}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TopicSelector;