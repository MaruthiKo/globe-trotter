import React from 'react';
import '../styles/Options.css';

function Options({ options, onSelect, selectedAnswer }) {
  return (
    <div className="options-container">
      <h3>Which destination is it?</h3>
      <div className="options-grid">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
            onClick={() => onSelect(option)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Options;