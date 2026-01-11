from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Optional
from datetime import datetime

class QuestionBase(BaseModel):
    question: str
    options: List[str]
    answer: str
    difficulty: str
    explanation: str
    section_reference: Optional[str] = None

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: int
    
    class Config:
        from_attributes = True

class KeyEntities(BaseModel):
    people: List[str] = []
    organizations: List[str] = []
    locations: List[str] = []

class QuizBase(BaseModel):
    url: str
    title: str
    summary: str
    key_entities: KeyEntities
    sections: List[str]
    related_topics: List[str]

class QuizCreate(QuizBase):
    raw_html: Optional[str] = None

class QuizResponse(QuizBase):
    id: int
    quiz: List[QuestionResponse]
    created_at: datetime
    
    class Config:
        from_attributes = True

class QuizHistoryItem(BaseModel):
    id: int
    url: str
    title: str
    created_at: datetime
    question_count: int
    
    class Config:
        from_attributes = True

class URLValidationRequest(BaseModel):
    url: str

class URLValidationResponse(BaseModel):
    valid: bool
    title: Optional[str] = None
    message: Optional[str] = None
    cached: bool = False
    quiz_id: Optional[int] = None
