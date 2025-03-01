import sqlite3
from sqlite3 import Error
import os
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
from config import SECRET_KEY

DATABASE_PATH = 'globetrotter.db'
TOKEN_EXPIRY = 24  # Token expiry in hours

def get_db_connection():
    """Create a database connection and return it"""
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row  # This enables column access by name: row['column_name']
        return conn
    except Error as e:
        print(f"Error connecting to database: {e}")
        raise

def init_db():
    """Initialize the database with required tables"""
    conn = get_db_connection()
    c = conn.cursor()
    
    # Drop existing table and recreate
    c.execute('DROP TABLE IF EXISTS users')
    c.execute('''
        CREATE TABLE users (
            username TEXT PRIMARY KEY,
            password_hash TEXT NOT NULL,
            score_correct INTEGER DEFAULT 0,
            score_incorrect INTEGER DEFAULT 0,
            last_login TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

def get_user(username):
    """Get user by username"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT username, password_hash, score_correct, score_incorrect 
            FROM users 
            WHERE username = ?
        ''', (username,))
        
        user = cursor.fetchone()
        if user:
            return {
                'username': user[0],
                'password_hash': user[1],
                'score_correct': user[2],
                'score_incorrect': user[3]
            }
    finally:
        conn.close()
    
    return None

def create_user(username, password):
    """Create a new user with authentication"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Generate password hash
        password_hash = generate_password_hash(password)
        
        cursor.execute('''
            INSERT INTO users (username, password_hash, score_correct, score_incorrect)
            VALUES (?, ?, 0, 0)
        ''', (username, password_hash))
        
        conn.commit()
        
        # Return user data after creation
        return {
            'username': username,
            'score_correct': 0,
            'score_incorrect': 0
        }
    finally:
        conn.close()

def create_token(username, score_correct=0, score_incorrect=0):
    """Generate JWT token with user data"""
    payload = {
        'username': username,
        'score': {
            'correct': score_correct,
            'incorrect': score_incorrect
        },
        'exp': datetime.utcnow() + timedelta(hours=TOKEN_EXPIRY)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_user(username, password):
    """Verify user credentials"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT username, password_hash, score_correct, score_incorrect 
            FROM users 
            WHERE username = ?
        ''', (username,))
        
        user = cursor.fetchone()
        
        if user and check_password_hash(user['password_hash'], password):
            # Create token with user data
            return create_token(user['username'], user['score_correct'], user['score_incorrect'])
    finally:
        conn.close()
    
    return None

def update_user_score(username, is_correct):
    """Update user's score"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if is_correct:
            cursor.execute('''
                UPDATE users 
                SET score_correct = score_correct + 1 
                WHERE username = ?
            ''', (username,))
        else:
            cursor.execute('''
                UPDATE users 
                SET score_incorrect = score_incorrect + 1 
                WHERE username = ?
            ''', (username,))
        conn.commit()
    finally:
        conn.close()

def verify_auth_token(token):
    """Verify JWT token and return username if valid"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['username']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_password_hash(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('SELECT password_hash FROM users WHERE username = ?', (username,))
        result = cursor.fetchone()
        return result[0] if result else None
    finally:
        conn.close()

# Add this function to help with debugging
def print_user_data(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()
        print(f"User data in database: {user}")
    finally:
        conn.close() 