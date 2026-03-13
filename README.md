# Edu2Job – AI Career Prediction Platform

Edu2Job is a full-stack web application designed to help students and professionals discover their ideal career paths. By leveraging machine learning and resume parsing, the platform predicts the most suitable job roles based on a user's skills, education, and experience, while also identifying skill gaps to help them reach their goals.

## Features

- **User Authentication**: Secure signup and login using JWT (JSON Web Tokens).
- **Profile Management**: Users can manage their personal information, education, and skills.
- **Resume Parsing**: Automatically extract skills and information from uploaded resumes (PDF/DOCX).
- **AI Job Prediction**: Utilizes a trained machine learning model (scikit-learn) to predict the most likely career role based on user data.
- **Skill Gap Analysis**: Visualizes the gap between a user's current skills and the skills required for their predicted or desired role.
- **Interactive Dashboard**: A modern, responsive dashboard to view prediction history and statistics.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript.
- **Backend**: Python, Flask, Flask-CORS.
- **Database**: MongoDB (with an automatic in-memory fallback for easy testing).
- **Machine Learning**: scikit-learn, pandas, numpy, joblib.
- **Authentication**: PyJWT, werkzeug.security.
- **File Parsing**: PyPDF2, python-docx.

## Project Structure

```text
Edu2Job/
├── backend/                # Python Flask application
│   ├── app.py              # Main application entry point
│   ├── auth.py             # Authentication routes (login/signup)
│   ├── charts.py           # Logic for generating chart data
│   ├── database.py         # MongoDB connection and fallback logic
│   ├── prediction.py       # ML model loading and prediction logic
│   ├── resume_parser.py    # PDF and DOCX parsing utilities
│   ├── routes.py           # API route definitions
│   ├── train_model.py      # Script to train the ML model
│   ├── uploads/            # Temporary storage for uploaded resumes
│   └── __pycache__/        
├── dataset/                # Datasets used for training the model
├── frontend/               # Static frontend files (HTML/CSS/JS)
│   ├── index.html          # Landing page
│   ├── login.html          # Login page
│   ├── signup.html         # Signup page
│   ├── dashboard.html      # User dashboard
│   ├── profile.html        # User profile and resume upload
│   ├── prediction.html     # Career prediction interface
│   ├── skillgap.html       # Skill gap analysis map
│   ├── styles.css          # Shared CSS styles
│   └── script.js           # Shared JavaScript logic
├── ml_model/               # Saved, trained machine learning models (*.pkl)
└── requirements.txt        # Python dependencies
```

## Getting Started

### Prerequisites

- **Python 3.8+** installed on your machine.
- (Optional) **MongoDB** installed and running locally on port `27017`. If MongoDB is not found, the app will gracefully fall back to an in-memory database, allowing you to test the app without any database setup!

### Installation & Setup

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd Edu2Job
   ```

2. **Install the required Python packages**:
   It is recommended to use a virtual environment.
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Backend Server**:
   The Flask backend is configured to automatically serve the frontend files.
   ```bash
   cd backend
   python app.py
   ```

4. **Access the Application**:
   Open your web browser and navigate to:
   [http://localhost:5000](http://localhost:5000)

## API Endpoints Overview

- `POST /auth/signup`: Register a new user.
- `POST /auth/login`: Authenticate a user and receive a JWT.
- `GET /api/user/profile`: Fetch the current user's profile.
- `PUT /api/user/profile`: Update the user's profile.
- `POST /api/user/upload-resume`: Upload and parse a resume.
- `POST /api/predict`: Generate a career prediction based on current profile/resume data.
- `POST /api/skill-gap`: Generate a skill gap analysis for a target role.

## License

This project is licensed under the MIT License.
