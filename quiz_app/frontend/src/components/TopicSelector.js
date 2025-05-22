import React from 'react';

function TopicSelector({ topics, selectedTopic, onTopicChange }) {
  return (
    <div className="topic-selector">
      <label htmlFor="topic-select">Select Topic: </label>
      <select
        id="topic-select"
        value={selectedTopic}
        onChange={(e) => onTopicChange(e.target.value)}
      >
        <option value="all">All Topics</option>
        {topics.map(topic => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TopicSelector;