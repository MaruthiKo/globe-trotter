import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Fetch user profile when token exists
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                // Ensure the user object has the correct structure
                setUser({
                    ...userData,
                    score: {
                        correct: userData.score_correct || 0,
                        incorrect: userData.score_incorrect || 0
                    }
                });
            } else {
                console.error('Profile fetch failed:', await response.text());
                logout();
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('auth_token', data.token);
                setToken(data.token);
                // Ensure user data has the correct structure
                setUser({
                    ...data.user,
                    score: {
                        correct: data.user.score_correct || 0,
                        incorrect: data.user.score_incorrect || 0
                    }
                });
                return { success: true };
            } else {
                console.error('Login failed:', data.error);
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error occurred' };
        }
    };

    const register = async (username, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Don't automatically login after registration
                return { success: true };
            } else {
                // Return the error message from the server
                return { 
                    success: false, 
                    error: data.error,
                    // Add a status code to help identify specific errors
                    status: response.status 
                };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Network error occurred' };
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateToken: (newToken, userData) => {
            localStorage.setItem('auth_token', newToken);
            setToken(newToken);
            if (userData) {
                setUser({
                    ...userData,
                    score: {
                        correct: userData.score.correct || 0,
                        incorrect: userData.score.incorrect || 0
                    }
                });
            }
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 