import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import '../styles/Feedback.css';

function Feedback({ correct, answer, country, fact }) {
  console.log('Feedback props:', { correct, answer, country, fact });

  useEffect(() => {
    if (correct) {
      // Launch confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [correct]);

  if (!answer || !country || !fact) {
    console.log('Missing feedback data');
    return null;
  }

  return (
    <div className={`feedback ${correct ? 'correct' : 'incorrect'}`}>
      <div className="feedback-header">
        {correct ? (
          <h2>🎉 Correct! 🎉</h2>
        ) : (
          <h2>😢 Oops! The answer was {answer}, {country}</h2>
        )}
      </div>
      
      <div className="feedback-content">
        <div className="fact-container">
          <h3>Did you know?</h3>
          <p>{fact}</p>
        </div>
      </div>
    </div>
  );
}

export default Feedback;