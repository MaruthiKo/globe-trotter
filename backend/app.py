from flask import Flask, jsonify, request, g
import json
import random
import os
from flask_cors import CORS
import uuid
from functools import wraps
from database import (
    init_db, get_user, create_user, update_user_score,
    verify_user, verify_auth_token, check_password_hash, create_token
)
import logging
import jwt
from config import SECRET_KEY

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# Initialize database when the app starts
init_db()

# Set up logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No authorization token provided'}), 401
        
        token = auth_header.split(' ')[1]
        username = verify_auth_token(token)
        
        if not username:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        g.username = username
        return f(*args, **kwargs)
    return decorated_function

# Load destinations data
def load_destinations():
    with open('data/destinations.json', 'r') as f:
        return json.load(f)

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            logger.warning("Registration attempt with missing credentials")
            return jsonify({
                "error": "Please provide both username and password"
            }), 400

        if get_user(username):
            logger.info(f"Registration attempt with existing username: {username}")
            return jsonify({
                "error": "Username already exists. Please login or choose a different username."
            }), 409

        user = create_user(username, password)
        token = create_token(username, user['score_correct'], user['score_incorrect'])
        
        return jsonify({
            "message": "Registration successful",
            "token": token,
            "user": {
                "username": user['username'],
                "score": {
                    "correct": user['score_correct'],
                    "incorrect": user['score_incorrect']
                }
            }
        }), 201

    except Exception as e:
        logger.error(f"Registration error for user {username}: {str(e)}", exc_info=True)
        return jsonify({
            "error": "An error occurred during registration"
        }), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        # Debug logging
        print(f"Login attempt for username: {username}")

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        user = get_user(username)
        if not user:
            print(f"User not found: {username}")  # Debug log
            return jsonify({"error": "Invalid credentials"}), 401

        # Debug logging
        print(f"Found user in database: {user['username']}")

        token = verify_user(username, password)
        if token:
            print(f"Login successful for user: {username}")  # Debug log
            return jsonify({
                "token": token,
                "user": {
                    "username": user['username'],
                    "score": {
                        "correct": user['score_correct'],
                        "incorrect": user['score_incorrect']
                    }
                }
            }), 200
        
        print(f"Password verification failed for user: {username}")  # Debug log
        return jsonify({"error": "Invalid credentials"}), 401

    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        print(f"Login exception: {str(e)}")  # Debug log
        return jsonify({"error": "An error occurred during login"}), 500

@app.route('/api/destination', methods=['GET'])
@login_required
def get_random_destination():
    destinations = load_destinations()
    destination = random.choice(destinations)
    
    response_data = {
        'id': destination.get('id', str(uuid.uuid4())),
        'clues': random.sample(destination['clues'], min(2, len(destination['clues']))),
        'options': generate_options(destinations, destination['city'])
    }
    
    return jsonify(response_data)

def generate_options(destinations, correct_answer):
    incorrect_options = []
    cities = [d['city'] for d in destinations if d['city'] != correct_answer]
    incorrect_options = random.sample(cities, min(3, len(cities)))
    
    all_options = incorrect_options + [correct_answer]
    random.shuffle(all_options)
    
    return all_options

@app.route('/api/check-answer', methods=['POST'])
@login_required
def check_answer():
    try:
        data = request.get_json()
        print(data)
        username = g.username
        
        if not username:
            return jsonify({"error": "User not found"}), 404

        destinations = load_destinations()
        destination = next((d for d in destinations if d['id'] == data['id']), None)
        
        if not destination:
            return jsonify({"error": "Destination not found"}), 404
            
        answer_correct = destination['city'] == data['answer']
        # print(f"answer_correct = {answer_correct}")
        # print(f"destination['city'] = {destination['city']}")
        # print(f"data['answer'] = {data['answer']}")
        # Update the user's score
        update_user_score(username, answer_correct)
            
        # Fetch updated user data
        updated_user = get_user(username)
        
        # Generate new token with updated score
        new_token = create_token(
            username=updated_user['username'],
            score_correct=updated_user['score_correct'],
            score_incorrect=updated_user['score_incorrect']
        )
        
        return jsonify({
            "correct": answer_correct,
            "answer": destination['city'],
            "country": destination['country'],
            "fact": random.choice(destination['fun_fact']),
            "token": new_token,  # Include the new token
            "user": {
                "username": updated_user['username'],
                "score": {
                    "correct": updated_user['score_correct'],
                    "incorrect": updated_user['score_incorrect']
                }
            }
        })
    except Exception as e:
        logger.error(f"Error checking answer: {str(e)}", exc_info=True)
        return jsonify({"error": "An error occurred"}), 500

@app.route('/api/user/profile', methods=['GET'])
@login_required
def get_user_profile():
    user = get_user(g.username)
    return jsonify(user)

@app.errorhandler(Exception)
def handle_error(error):
    # Log the actual error with stack trace
    logger.error(f"An error occurred: {str(error)}", exc_info=True)
    # Return a generic message to the user
    return jsonify({
        "error": "An internal server error occurred. Please try again later."
    }), 500

# Add this function to get the current user from the token
def get_current_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return {
            'username': payload['username'],
            'score': payload['score']
        }
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def check_destination_answer(destination_id, answer):
    destinations = load_destinations()
    destination = next((d for d in destinations if d['id'] == destination_id), None)
    return destination and destination['city'] == answer

if __name__ == '__main__':    
    app.run(debug=True)