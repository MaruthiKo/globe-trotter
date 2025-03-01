# Globe Trotter Challenge

A full-stack web app where users get cryptic clues about famous places and must guess which destination it refers to. Players earn points for correct answers and can track their progress!

## Features

- Random destination clues from a curated dataset
- Multiple-choice answer selection
- Animated feedback with confetti for correct answers
- Fun facts about destinations after each answer
- Score tracking
- Simple authentication system with username/password
- Protected routes requiring authentication

## Technology Stack

- **Frontend**: React.js
- **Backend**: Flask (Python)
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Additional Libraries**:
  - canvas-confetti (for animations)
  - flask-cors (for API access)
  - PyJWT (for token management)

## Project Structure

```
globe-trotter/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── database.py         # Database operations
│   ├── data/
│   │   └── destinations.json  # Destination data
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── components/     # React components
│   │   │   ├── Auth.js    # Authentication component
│   │   │   ├── Game.js    # Main game component
│   │   │   ├── Clue.js    # Clue display
│   │   │   ├── Options.js # Answer options
│   │   │   ├── Score.js   # Score display
│   │   │   ├── Share.js   # Share functionality
│   │   │   └── Feedback.js # Answer feedback
│   │   ├── contexts/
│   │   │   └── AuthContext.js # Authentication context
│   │   └── styles/        # CSS files
│   └── package.json       # React dependencies
└── README.md
```

## Project Setup

### Backend Setup (Flask)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python app.py
   ```
   The server will start on http://localhost:5000

### Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The app will be available at http://localhost:3000

## How to Play

1. Register with a username and password
2. Log in to access the game
3. Read the clues about a mystery destination
4. Select your answer from the multiple choices
5. Get immediate feedback:
   - See if your answer was correct
   - Learn an interesting fact about the destination
   - Watch confetti animation for correct answers!
6. Click "Next Destination" to continue playing
7. Track your score as you play

## API Endpoints

### Authentication Endpoints
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Game Endpoints (Protected)
- `GET /api/destination` - Get random destination with clues
- `POST /api/check-answer` - Submit and check answer
- `GET /api/user` - Get user profile and score

## Environment Setup

Create a `.env` file in the backend directory with:
```
JWT_SECRET_KEY=your_secret_key_here
```

## Important Notes

- All game endpoints require authentication via JWT token
- Tokens expire after 24 hours
- SQLite database is used for development