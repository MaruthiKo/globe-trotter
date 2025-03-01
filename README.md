# 🌎 Globe Trotter Challenge 🧳

**The Ultimate Travel Guessing Game!**

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Backend: Flask](https://img.shields.io/badge/Backend-Flask-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)

Globe Trotter Challenge is an interactive web game that takes players on a virtual journey around the world! Get cryptic clues about famous destinations, test your geography knowledge, and discover fascinating facts about places you may have never visited.

![Game Demo Placeholder](https://via.placeholder.com/800x400?text=Globe+Trotter+Game+Demo)

## ✨ Features

- 🔍 **Cryptic Destination Clues**: Test your knowledge with intriguing hints about world-famous places
- 🎮 **Multiple-Choice Format**: Select from possible destinations to find the right answer
- 🎉 **Animated Feedback**: Watch confetti explode across your screen with every correct guess!
- 😢 **Gentle Encouragement**: Get a sad-face animation but still learn something new when incorrect
- 💯 **Score Tracking**: Monitor your progress as you become a master globe trotter
- 👥 **Challenge Friends**: Generate unique invitation links with dynamic images to challenge others
- 📱 **Social Sharing**: Easily share your achievements via WhatsApp and other platforms
- 🔐 **Simple Authentication**: Register with a unique username and password to save your progress

## 🚀 Technology Stack

- **Frontend**: 
  - React.js for a responsive and interactive UI
  - canvas-confetti for celebratory animations
  - React Router for navigation

- **Backend**: 
  - Flask (Python) for a robust API
  - SQLite for lightweight data storage
  - JWT (JSON Web Tokens) for secure authentication

## 🗂️ Project Structure

```
globe-trotter/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── database.py         # Database operations
│   ├── data/
│   │   └── destinations.json  # Destination data with clues and facts
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── components/     # React components
│   │   │   ├── Auth.js     # Authentication component
│   │   │   ├── Game.js     # Main game component
│   │   │   ├── Clue.js     # Clue display
│   │   │   ├── Options.js  # Answer options
│   │   │   ├── Score.js    # Score display
│   │   │   ├── Share.js    # Share functionality
│   │   │   └── Feedback.js # Answer feedback
│   │   ├── contexts/
│   │   │   └── AuthContext.js # Authentication context
│   │   └── styles/        # CSS files
│   └── package.json       # React dependencies
└── README.md
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- npm or yarn

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

4. Set up environment variables:
   ```bash
   # Create a .env file with:
   BACKEND_SECRET_KEY=your_secret_key_here
   ```

5. Run the Flask server:
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

## 🎮 How to Play

1. **Register**: Create your unique Globe Trotter identity
2. **Login**: Access the game with your credentials
3. **Get Clues**: Read the cryptic hints about a mystery destination
4. **Make Your Guess**: Select what you believe is the correct location
5. **Instant Feedback**:
   ✅ Correct? Enjoy the confetti celebration and learn an interesting fact!
   ❌ Incorrect? Don't worry - you'll still discover something fascinating
6. **Continue Your Journey**: Click "Next Destination" for a new challenge
7. **Challenge Friends**: Share your score and invite others to beat it
8. **Become a Master Globe Trotter**: See how many destinations you can identify!

## 🌐 API Endpoints

### Authentication Endpoints
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Game Endpoints (Protected)
- `GET /api/destination` - Get random destination with clues
- `POST /api/check-answer` - Submit and check answer
- `GET /api/user` - Get user profile and score
- `POST /api/challenge` - Generate challenge link for sharing

## 🔒 Security Notes

- All game endpoints require access from a magic key(JWT Token)
- You have only a day(24hr) before the key vanishes into thin air. (*Don't worry you can create another key by entering into the game again*)
- The clues are securely stored on a hidden island to which only we have the access.
- Your passwords are secretly stored using a magic potion, which does not allow anyone else except you. (*FYI Not even me*)

---

Happy globe trotting! 🌍✈️