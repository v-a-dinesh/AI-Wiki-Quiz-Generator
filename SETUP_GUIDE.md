# Complete Setup Guide - Wiki Quiz Generator

This guide will walk you through setting up the Wiki Quiz Generator from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup (Supabase)](#database-setup-supabase)
3. [Google Gemini API Key](#google-gemini-api-key)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Testing Locally](#testing-locally)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Python 3.9 or higher** - [Download](https://www.python.org/downloads/)
- **Node.js 18 or higher** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **PostgreSQL** (for local development) - [Download](https://www.postgresql.org/download/)

### Required Accounts
- **Supabase Account** - [Sign up](https://supabase.com/)
- **Google Cloud Account** - [Sign up](https://cloud.google.com/)
- **Vercel Account** - [Sign up](https://vercel.com/)
- **Render Account** - [Sign up](https://render.com/)

## Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click **"New Project"**
3. Fill in:
   - **Name**: wikiquiz
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait for project to be ready (2-3 minutes)

### Step 2: Get Connection String

1. In your project dashboard, go to **Settings** > **Database**
2. Scroll to **Connection string** section
3. Select **URI** tab
4. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. Save this for later use

### Step 3: Database Tables

The tables will be created automatically when you first run the backend. The SQLAlchemy models will handle this.

## Google Gemini API Key

### Step 1: Enable Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"**
4. Click **"Create API key in new project"** (or select existing project)
5. Copy your API key
6. Save this for later use

**Note**: The free tier includes:
- 60 requests per minute
- 1,500 requests per day
- Sufficient for development and testing

## Backend Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/DeepKlarity.git
cd DeepKlarity/backend
```

### Step 2: Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` file with your values:
```env
DATABASE_URL=postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres
GOOGLE_API_KEY=your_gemini_api_key_here
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Step 5: Test Backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Step 6: Verify API

1. Open browser to: `http://localhost:8000/docs`
2. You should see FastAPI Swagger documentation
3. Try the `/health` endpoint - should return `{"status": "healthy"}`

## Frontend Setup

### Step 1: Navigate to Frontend

```bash
cd ../frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React
- Vite
- TailwindCSS
- Axios
- Lucide React icons

### Step 3: Configure Environment Variables

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

### Step 4: Start Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.0.11  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

### Step 5: Verify Frontend

1. Open browser to: `http://localhost:5173`
2. You should see the Wiki Quiz Generator interface
3. Try entering a Wikipedia URL and validating it

## Testing Locally

### Test 1: URL Validation

1. Go to **Generate Quiz** tab
2. Enter: `https://en.wikipedia.org/wiki/Alan_Turing`
3. Click **Validate**
4. Should show: "Valid Wikipedia article. Ready to generate quiz."

### Test 2: Quiz Generation

1. After validation, click **Generate Quiz**
2. Wait 10-30 seconds (LLM processing)
3. Should display:
   - Article title and summary
   - Key entities (people, organizations, locations)
   - 8 quiz questions with options
   - Related topics

### Test 3: Take Quiz Mode

1. Click **Take Quiz** button
2. Answer questions
3. Click **Submit Quiz**
4. View your score and review answers

### Test 4: Quiz History

1. Go to **Past Quizzes** tab
2. Should see the quiz you just generated
3. Click **View Details**
4. Should display the full quiz

### Test 5: Caching

1. Go back to **Generate Quiz** tab
2. Enter the same URL again
3. Click **Validate**
4. Should show: "This article has already been processed."
5. Click **Load Cached Quiz**
6. Should load instantly (no LLM call)

## Deployment

### Deploy Backend to Render

1. **Push code to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Create Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New +"** > **"Web Service"**
   - Connect your GitHub repository
   - Configure:
     - **Name**: wikiquiz-api
     - **Region**: Oregon (or closest)
     - **Branch**: main
     - **Root Directory**: backend
     - **Runtime**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables**
   - `DATABASE_URL`: Your Supabase connection string
   - `GOOGLE_API_KEY`: Your Gemini API key
   - `ENVIRONMENT`: production
   - `CORS_ORIGINS`: (will add after frontend deployment)

4. **Deploy**
   - Click **"Create Web Service"**
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://wikiquiz-api.onrender.com`)

### Deploy Frontend to Vercel

1. **Push code to GitHub** (if not already done)

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **"Add New..."** > **"Project"**
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: frontend
     - **Build Command**: `npm run build`
     - **Output Directory**: dist

3. **Add Environment Variable**
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://wikiquiz-api.onrender.com`)

4. **Deploy**
   - Click **"Deploy"**
   - Wait for deployment (2-3 minutes)
   - Copy your frontend URL (e.g., `https://wikiquiz.vercel.app`)

5. **Update Backend CORS**
   - Go back to Render dashboard
   - Update `CORS_ORIGINS` environment variable to your Vercel URL
   - Redeploy backend

### Verify Deployment

1. Visit your Vercel URL
2. Test all features:
   - URL validation
   - Quiz generation
   - Take quiz mode
   - History view

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'app'`
```bash
# Solution: Make sure you're in the backend directory
cd backend
# And virtual environment is activated
venv\Scripts\activate  # Windows
```

**Problem**: `sqlalchemy.exc.OperationalError: could not connect to server`
```bash
# Solution: Check your DATABASE_URL in .env
# Make sure Supabase project is running
# Verify connection string is correct
```

**Problem**: `google.api_core.exceptions.PermissionDenied: 403`
```bash
# Solution: Check your GOOGLE_API_KEY
# Make sure Gemini API is enabled in Google Cloud Console
```

### Frontend Issues

**Problem**: `Failed to fetch`
```bash
# Solution: Make sure backend is running on port 8000
# Check VITE_API_URL in .env
# Verify CORS is configured correctly
```

**Problem**: `npm install` fails
```bash
# Solution: Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

**Problem**: Tables not created
```bash
# Solution: The tables are created automatically on first run
# Make sure DATABASE_URL is correct
# Check Supabase project is active
```

**Problem**: Connection timeout
```bash
# Solution: Check your network/firewall
# Verify Supabase project region
# Try using connection pooler URL from Supabase
```

### Deployment Issues

**Problem**: Render build fails
```bash
# Solution: Check requirements.txt has all dependencies
# Verify Python version (3.9+)
# Check build logs for specific errors
```

**Problem**: Vercel build fails
```bash
# Solution: Check package.json scripts
# Verify Node version (18+)
# Check build logs for specific errors
```

## Support

For issues or questions:
1. Check the [README.md](README.md)
2. Review API documentation at `/docs` endpoint
3. Check sample data in `sample_data/` folder
4. Review prompt templates in `backend/prompts/`

## Next Steps

After successful setup:
1. Test with various Wikipedia URLs
2. Customize UI colors/branding
3. Add more features (export quiz, share quiz, etc.)
4. Implement rate limiting
5. Add analytics
6. Create user authentication (optional)

---

**Happy Quiz Generating!**
