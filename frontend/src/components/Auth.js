import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        if (isLogin) {
            const result = await login(username, password);
            if (!result.success) {
                setError('Invalid username or password');
                console.error('Login error:', result.error);
            }
        } else {
            const result = await register(username, password);
            if (!result.success) {
                if (result.status === 409) {
                    setError('Username already exists. Please login instead.');
                    // Switch to login mode and preserve the username
                    setIsLogin(true);
                    setPassword(''); // Clear password for security
                } else {
                    setError('Sorry, something went wrong. Please try again.');
                    console.error('Registration error:', result.error);
                }
            } else {
                // Registration successful, switch to login mode
                setError('');
                setIsLogin(true);
                setPassword(''); // Clear password for security
                // Show success message
                setError('Registration successful! Please login.');
            }
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setUsername('');
        setPassword('');
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit} className="auth-form">
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
                {error && (
                    <p className={`message ${error.includes('successful') ? 'success-message' : 'error-message'}`}>
                        {error}
                    </p>
                )}
                <button type="submit" className="auth-button">
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
            <p className="auth-switch">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                    onClick={switchMode}
                    className="switch-button"
                >
                    {isLogin ? 'Register' : 'Login'}
                </button>
            </p>
        </div>
    );
}

export default Auth; 