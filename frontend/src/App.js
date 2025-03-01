import React from 'react';
import Game from './components/Game';
import Auth from './components/Auth';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/App.css';

function AppContent() {
  const { user, logout } = useAuth();

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
          </div>
        )}
      </header>

      {user ? <Game /> : <Auth />}
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