import React, { useEffect, useState } from 'react';
import Game from './components/Game';
import Auth from './components/Auth';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/App.css';

function AppContent() {
  const { user, logout } = useAuth();
  const [challengeInfo, setChallengeInfo] = useState(null);

  // Parse URL parameters for challenge info
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const challengeUsername = params.get('challenge');
    
    if (challengeUsername) {
      setChallengeInfo({
        username: challengeUsername
      });
      
      // Optionally clear the URL parameter after reading it
      if (window.history.replaceState) {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        {user ? (
          <div className="header-content">
            <div className="header-title">
              <h1>🌎 Globetrotter Challenge 🌍</h1>
              <p>Test your knowledge of famous destinations around the world!</p>
            </div>
            <div className="user-info">
              <span>Welcome, {user.username}!</span>
              <button onClick={logout} className="logout-button">Logout</button>
            </div>
          </div>
        ) : (
          <div className="header-content-centered">
            <div className="header-title">
              <h1>🌎 Globetrotter Challenge 🌍</h1>
              <p>Test your knowledge of famous destinations around the world!</p>
            </div>
            {challengeInfo && (
              <div className="challenge-banner">
                <p>You've been challenged by <strong>{challengeInfo.username}</strong>!</p>
                <p>Login or register to beat their score!</p>
              </div>
            )}
          </div>
        )}
      </header>

      {user ? <Game /> : <Auth challengeInfo={challengeInfo} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;