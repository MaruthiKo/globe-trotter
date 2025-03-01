import React from 'react';
import '../styles/Score.css';

function Score({ score = { correct: 0, incorrect: 0 } }) {
    // Ensure score object exists with default values
    const scoreData = {
        correct: score?.correct || 0,
        incorrect: score?.incorrect || 0
    };

    const accuracy = scoreData.correct + scoreData.incorrect > 0
        ? ((scoreData.correct / (scoreData.correct + scoreData.incorrect)) * 100).toFixed(1)
        : '0.0';

    return (
        <div className="score-container">
            <div className="score-item">
                <span className="score-label">Correct</span>
                <span className="score-value correct">{scoreData.correct}</span>
            </div>
            <div className="score-item">
                <span className="score-label">Incorrect</span>
                <span className="score-value incorrect">{scoreData.incorrect}</span>
            </div>
            <div className="score-item">
                <span className="score-label">Accuracy</span>
                <span className="score-value">{accuracy}%</span>
            </div>
        </div>
    );
}

export default Score;