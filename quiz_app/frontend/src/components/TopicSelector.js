import React from 'react';
import { useDropdown } from '../hooks/useDropdown';

function TopicSelector({ topics, selectedTopic, onTopicChange }) {
  const allOptions = [
    { value: 'all', label: 'All Topics' },
    ...topics.map(topic => ({ value: topic, label: topic }))
  ];

  const {
    isOpen,
    dropdownRef,
    toggleDropdown,
    selectOption,
    getDisplayLabel
  } = useDropdown(selectedTopic, allOptions);

  const handleTopicSelect = (topicValue) => {
    selectOption(topicValue);
    onTopicChange(topicValue);
  };

  return (
    <div className="topic-selector">
      <label htmlFor="topic-select">Select Topic: </label>
      <div className="custom-dropdown topic-dropdown" ref={dropdownRef}>
        <button
          type="button"
          id="topic-select"
          className={`dropdown-button ${isOpen ? 'open' : ''}`}
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{getDisplayLabel()}</span>
          <span className="dropdown-arrow">▼</span>
        </button>
        
        {isOpen && (
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