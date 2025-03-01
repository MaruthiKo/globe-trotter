import React from 'react';
import '../styles/Clue.css';

function Clue({ text }) {
  return (
    <div className="clue">
      <p>🔍 {text}</p>
    </div>
  );
}

export default Clue;