import React, { useState, useEffect } from 'react';
import Clue from './Clue';
import Options from './Options';
import Feedback from './Feedback';
import Score from './Score';
import Share from './Share';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Game.css';

function Game() {
  const { user, token, updateToken } = useAuth();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://globe-trotter-backend.onrender.com';

  const fetchDestination = async () => {
    setLoading(true);
    setSelectedAnswer(null);
    setResult(null);
    setShowFeedback(false);
    
    try {
      const response = await fetch(`${API_URL}/api/destination`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Fetched destination:', data);
      
      if (response.ok) {
        setDestination(data);
        setError('');
      } else {
        setError('Failed to load destination');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = async (answer) => {
    if (!destination || selectedAnswer) return;
    
    setSelectedAnswer(answer);
    
    try {
      console.log('Checking answer:', answer, 'for destination:', destination.id);
      const response = await fetch(`${API_URL}/api/check-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: destination.id,
          answer
        }),
      });
      
      const data = await response.json();
      console.log('Answer response:', data);
      
      if (response.ok) {
        // Update token and user data when receiving new token
        if (data.token && data.user) {
          updateToken(data.token, data.user);
        }
        
        // Set result and show feedback
        setResult(data);
        setShowFeedback(true);
        console.log('Setting feedback to true and result:', data);
      } else {
        setError('Failed to check answer');
      }
    } catch (err) {
      console.error('Error checking answer:', err);
      setError('Network error. Please try again.');
    }
  };

  const handleNextDestination = () => {
    console.log('Handling next destination');
    fetchDestination();
  };

  // Only fetch initial destination when component mounts
  useEffect(() => {
    if (!destination) {
      fetchDestination();
    }
  }, []); // Empty dependency array

  // Debug logs
  useEffect(() => {
    console.log('Current state:', {
      result: result ? {
        correct: result.correct,
        answer: result.answer,
        country: result.country,
        fact: result.fact
      } : null,
      showFeedback,
      selectedAnswer,
      destination: destination?.id
    });
  }, [result, showFeedback, selectedAnswer, destination]);

  if (loading) {
    return <div className="loading">Loading destination...</div>;
  }

  if (error) {
    return <div className="error">{error} <button onClick={fetchDestination}>Try Again</button></div>;
  }

  return (
    <div className="game-container">
      <Score score={user.score} />
      
      {destination && (
        <>
          {!showFeedback ? (
            // Show clues and options when not showing feedback
            <>
              <div className="clues-container">
                {destination.clues.map((clue, index) => (
                  <Clue key={index} text={clue} />
                ))}
              </div>
              <Options 
                options={destination.options} 
                onSelect={checkAnswer}
                selectedAnswer={selectedAnswer}
              />
            </>
          ) : (
            // Show feedback section
            <div className="feedback-section">
              <Feedback 
                correct={result.correct}
                answer={result.answer}
                country={result.country}
                fact={result.fact}
              />
              
              <div className="actions">
                <button className="next-button" onClick={handleNextDestination}>
                  Next Destination
                </button>
                <Share username={user.username} score={user.score} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Game;