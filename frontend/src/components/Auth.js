import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

function Auth({ challengeInfo }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        if (isLogin) {
            const result = await login(username, password);
            if (!result.success) {
                setError(result.error || 'Login failed');
            }
        } else {
            const result = await register(username, password);
            if (result.success) {
                // Switch to login view after successful registration
                setIsLogin(true);
                setError('Registration successful! Please login.');
            } else {
                setError(result.error || 'Registration failed');
            }
        }
    };

    return (
        <div className="auth-container">
            {challengeInfo && (
                <div className="challenge-info">
                    <h3>Challenge from {challengeInfo.username}</h3>
                    <p>Register or login to accept this challenge and see if you can beat their score!</p>
                </div>
            )}
            
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                
                <button type="submit" className="auth-button">
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
            
            <div className="auth-switch">
                <p>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        className="switch-button"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Auth; 