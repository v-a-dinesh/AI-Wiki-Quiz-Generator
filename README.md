# AI Wiki Quiz Generator - DeepKlarity Technologies

An intelligent web application that automatically generates interactive quizzes from Wikipedia articles using Google Gemini AI. Built with FastAPI, React, and PostgreSQL.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Submission Details](#submission-details)

## Features

### Core Features

- **Wikipedia Article Scraping**: Extract content from any Wikipedia URL using BeautifulSoup
- **AI-Powered Quiz Generation**: Generate 5-10 questions with Google Gemini 2.5 Flash via LangChain
- **Structured Data Extraction**: Extract title, summary, sections, and key entities
- **PostgreSQL Database**: Store all quizzes with complete history
- **RESTful API**: FastAPI backend with automatic Swagger documentation
- **Modern React UI**: Clean, responsive interface with TailwindCSS

### Bonus Features (All Implemented)

- **Take Quiz Mode**: Interactive quiz mode with scoring and answer review
- **URL Validation & Preview**: Validate URLs and preview article titles before generation
- **Raw HTML Storage**: Store original Wikipedia HTML for reference
- **Caching Mechanism**: Prevent duplicate scraping of the same URL
- **Section-wise Grouping**: Questions organized by article sections
- **Related Topics**: AI-generated suggestions for further reading

## Tech Stack

### Backend

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Scraping**: BeautifulSoup4
- **LLM Integration**: LangChain + Google Gemini API
- **Validation**: Pydantic
- **Server**: Uvicorn

### Frontend

- **Framework**: React 18 with Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase (PostgreSQL)

## Project Structure

```
DeepKlarity/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py              # API endpoints
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py              # Configuration settings
│   │   │   └── database.py            # Database connection
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── quiz.py                # SQLAlchemy models
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── quiz.py                # Pydantic schemas
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── scraper.py             # Wikipedia scraper
│   │   │   ├── llm_service.py         # LLM integration
│   │   │   └── quiz_service.py        # Business logic
│   │   ├── __init__.py
│   │   └── main.py                    # FastAPI application
│   ├── prompts/
│   │   ├── quiz_generation_prompt.md  # Quiz generation prompt
│   │   └── related_topics_prompt.md   # Related topics prompt
│   ├── .env.example
│   ├── .gitignore
│   ├── requirements.txt
│   └── start.py                       # Application starter
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GenerateQuiz.jsx       # Quiz generation tab
│   │   │   ├── QuizDisplay.jsx        # Quiz display component
│   │   │   ├── TakeQuizMode.jsx       # Interactive quiz mode
│   │   │   └── QuizHistory.jsx        # History tab
│   │   ├── services/
│   │   │   └── api.js                 # API client
│   │   ├── App.jsx                    # Main application
│   │   ├── index.css                  # Global styles
│   │   └── main.jsx                   # Entry point
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
├── sample_data/
│   ├── urls.txt                       # Sample Wikipedia URLs
│   └── sample_output_alan_turing.json # Sample API output
├── FEATURES.md                        # Feature documentation
├── SETUP_GUIDE.md                     # Detailed setup guide
├── SUBMISSION.md                      # Submission checklist
├── TESTING.md                         # Testing guide
└── README.md                          # This file
```

## Installation

### Prerequisites

- Python 3.10 or higher
- Node.js 16 or higher
- PostgreSQL database (or Supabase account)
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create `.env` file from example:
```bash
cp .env.example .env
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

## Configuration

### Backend Configuration (`.env`)

```env
DATABASE_URL=postgresql://user:password@host:port/database
GOOGLE_API_KEY=your_gemini_api_key_here
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Getting Credentials:**

1. **Google Gemini API Key**: 
   - Visit https://aistudio.google.com/app/apikey
   - Create a new API key
   - Copy and paste into `.env`

2. **Supabase Database**:
   - Create a project at https://supabase.com
   - Go to Settings > Database
   - Copy the Connection String (URI format)
   - Replace `[YOUR-PASSWORD]` with your database password
   - URL-encode special characters in password

### Frontend Configuration (`.env`)

```env
VITE_API_URL=http://localhost:8000
```

For production, update to your deployed backend URL.

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
python start.py
```

Backend will run on: http://127.0.0.1:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:5173

### Production Build

**Backend:**
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## API Documentation

### Endpoints

#### 1. Health Check
```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-11T14:30:00"
}
```

#### 2. Validate Wikipedia URL
```http
POST /api/quiz/validate-url
Content-Type: application/json

{
  "url": "https://en.wikipedia.org/wiki/Alan_Turing"
}
```

Response:
```json
{
  "valid": true,
  "title": "Alan Turing",
  "message": "Valid Wikipedia article"
}
```

#### 3. Generate Quiz
```http
POST /api/quiz/generate
Content-Type: application/json

{
  "url": "https://en.wikipedia.org/wiki/Alan_Turing",
  "num_questions": 8
}
```

Response: See `sample_data/sample_output_alan_turing.json`

#### 4. Get Quiz History
```http
GET /api/quiz/history
```

Response:
```json
[
  {
    "id": 1,
    "url": "https://en.wikipedia.org/wiki/Alan_Turing",
    "title": "Alan Turing",
    "created_at": "2026-01-11T14:30:00",
    "question_count": 8
  }
]
```

#### 5. Get Quiz by ID
```http
GET /api/quiz/{quiz_id}
```

Response: Full quiz details with questions

### Interactive API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Testing

### Manual Testing

1. **URL Validation**:
   - Enter: `https://en.wikipedia.org/wiki/Alan_Turing`
   - Click "Validate"
   - Verify article title appears

2. **Quiz Generation**:
   - Click "Generate Quiz"
   - Wait 10-30 seconds
   - Verify 8 questions appear with options, explanations, and difficulty levels

3. **Take Quiz Mode**:
   - Click "Take Quiz"
   - Answer questions
   - Submit and verify score calculation

4. **Quiz History**:
   - Navigate to "Past Quizzes" tab
   - Verify quiz appears in table
   - Click "View Details" to see full quiz

### Sample Data

Sample Wikipedia URLs for testing are provided in `sample_data/urls.txt`:
- Alan Turing
- Artificial Intelligence
- Python (programming language)
- Machine Learning
- Quantum Computing

Expected output format is shown in `sample_data/sample_output_alan_turing.json`

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables:
   - `VITE_API_URL`: Your backend URL
4. Deploy

### Backend (Render)

1. Create new Web Service
2. Connect GitHub repository
3. Configure:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables from `.env`
5. Deploy

### Database (Supabase)

1. Create project at https://supabase.com
2. Copy connection string from Settings > Database
3. Update `DATABASE_URL` in backend environment variables

## Screenshots

### Tab 1: Generate Quiz
![Generate Quiz](screenshots/generate_quiz.png)
- URL input with validation
- Quiz display with questions, options, and explanations
- Section-wise grouping
- Related topics suggestions

### Tab 2: Past Quizzes
![Quiz History](screenshots/quiz_history.png)
- Table of all generated quizzes
- Details modal with full quiz view

### Take Quiz Mode
![Take Quiz](screenshots/take_quiz.png)
- Interactive quiz interface
- Score calculation
- Answer review

## Submission Details

### GitHub Repository
https://github.com/your-username/deepklarity-wiki-quiz

### Deployed Application
- **Frontend**: https://deepklarity-wiki-quiz.vercel.app
- **Backend API**: https://deepklarity-api.onrender.com
- **API Docs**: https://deepklarity-api.onrender.com/docs

### Screen Recording
https://drive.google.com/file/d/your-recording-id/view

### Key Highlights

1. **Prompt Engineering**: Custom prompts for quiz generation with grounding in article content
2. **Quiz Quality**: 8 questions with varying difficulty, factual accuracy, and clear explanations
3. **Extraction Quality**: Clean scraping with section detection and entity extraction
4. **Functionality**: Complete end-to-end flow from URL to stored quiz
5. **Code Quality**: Modular architecture with clear separation of concerns
6. **Error Handling**: Comprehensive error handling for invalid URLs and API failures
7. **UI Design**: Modern, responsive design with excellent UX
8. **Database**: Efficient storage with caching to prevent duplicates
9. **Testing**: Extensive manual testing with sample data

## Requirements Verification

### Core Requirements
- [x] Python backend (FastAPI)
- [x] PostgreSQL database
- [x] BeautifulSoup scraping
- [x] LangChain + Gemini LLM
- [x] React frontend
- [x] Two-tab interface
- [x] Quiz generation with all required fields
- [x] History view with details modal

### Bonus Features
- [x] Take Quiz mode with scoring
- [x] URL validation and preview
- [x] Raw HTML storage
- [x] Caching mechanism
- [x] Section-wise grouping

### Submission Requirements
- [x] Complete working code
- [x] Screenshots
- [x] Sample data folder
- [x] README with setup instructions
- [x] LangChain prompt templates
- [x] Hosted application
- [x] GitHub repository
- [x] Screen recording

## License

This project is developed for DeepKlarity Technologies.

## Contact

For questions or support, please contact DeepKlarity Technologies.

---

Built with care by DeepKlarity Technologies
