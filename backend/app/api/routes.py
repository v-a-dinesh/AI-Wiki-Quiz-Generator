from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.quiz_service import QuizService
from app.schemas.quiz import QuizResponse, QuizHistoryItem, URLValidationRequest, URLValidationResponse
from typing import List

router = APIRouter(prefix="/api/quiz", tags=["quiz"])

@router.post("/validate-url", response_model=URLValidationResponse)
async def validate_url(request: URLValidationRequest, db: Session = Depends(get_db)):
    try:
        quiz_service = QuizService(db)
        result = quiz_service.validate_url(request.url)
        return URLValidationResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(request: URLValidationRequest, db: Session = Depends(get_db)):
    try:
        quiz_service = QuizService(db)
        quiz = quiz_service.generate_quiz(request.url)
        return quiz
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")

@router.get("/history", response_model=List[QuizHistoryItem])
async def get_quiz_history(db: Session = Depends(get_db)):
    try:
        quiz_service = QuizService(db)
        return quiz_service.get_all_quizzes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz_details(quiz_id: int, db: Session = Depends(get_db)):
    try:
        quiz_service = QuizService(db)
        quiz = quiz_service.get_quiz_by_id(quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return quiz
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
