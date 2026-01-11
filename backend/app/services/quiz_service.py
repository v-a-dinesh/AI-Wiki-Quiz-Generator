from sqlalchemy.orm import Session
from app.models.quiz import Quiz, Question
from app.schemas.quiz import QuizCreate, QuizResponse, QuestionResponse, QuizHistoryItem
from app.services.scraper import WikipediaScraper
from app.services.llm_service import LLMService
from typing import List, Optional
from datetime import datetime

class QuizService:
    def __init__(self, db: Session):
        self.db = db
        self.scraper = WikipediaScraper()
        self.llm_service = LLMService()
    
    def check_cached_quiz(self, url: str) -> Optional[Quiz]:
        return self.db.query(Quiz).filter(Quiz.url == url).first()
    
    def validate_url(self, url: str) -> dict:
        if not self.scraper.validate_wikipedia_url(url):
            return {
                'valid': False,
                'message': 'Invalid Wikipedia URL. Please provide a valid English Wikipedia article URL.',
                'cached': False
            }
        
        cached_quiz = self.check_cached_quiz(url)
        if cached_quiz:
            return {
                'valid': True,
                'title': cached_quiz.title,
                'message': 'This article has already been processed.',
                'cached': True,
                'quiz_id': cached_quiz.id
            }
        
        try:
            scraped_data = self.scraper.scrape_article(url)
            return {
                'valid': True,
                'title': scraped_data['title'],
                'message': 'Valid Wikipedia article. Ready to generate quiz.',
                'cached': False
            }
        except Exception as e:
            return {
                'valid': False,
                'message': f'Failed to fetch article: {str(e)}',
                'cached': False
            }
    
    def generate_quiz(self, url: str, num_questions: int = 8) -> QuizResponse:
        cached_quiz = self.check_cached_quiz(url)
        if cached_quiz:
            return self._quiz_to_response(cached_quiz)
        
        scraped_data = self.scraper.scrape_article(url)
        
        quiz_questions = self.llm_service.generate_quiz(
            title=scraped_data['title'],
            content=scraped_data['content_text'],
            sections=scraped_data['sections'],
            num_questions=num_questions
        )
        
        related_topics = self.llm_service.generate_related_topics(
            title=scraped_data['title'],
            content=scraped_data['content_text'],
            sections=scraped_data['sections']
        )
        
        quiz = Quiz(
            url=url,
            title=scraped_data['title'],
            summary=scraped_data['summary'],
            key_entities=scraped_data['key_entities'],
            sections=scraped_data['sections'],
            related_topics=related_topics,
            raw_html=scraped_data['raw_html']
        )
        
        self.db.add(quiz)
        self.db.flush()
        
        for q_data in quiz_questions:
            question = Question(
                quiz_id=quiz.id,
                question_text=q_data['question'],
                options=q_data['options'],
                correct_answer=q_data['answer'],
                difficulty=q_data['difficulty'],
                explanation=q_data['explanation'],
                section_reference=q_data.get('section_reference', 'General')
            )
            self.db.add(question)
        
        self.db.commit()
        self.db.refresh(quiz)
        
        return self._quiz_to_response(quiz)
    
    def get_quiz_by_id(self, quiz_id: int) -> Optional[QuizResponse]:
        quiz = self.db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if quiz:
            return self._quiz_to_response(quiz)
        return None
    
    def get_all_quizzes(self) -> List[QuizHistoryItem]:
        quizzes = self.db.query(Quiz).order_by(Quiz.created_at.desc()).all()
        return [
            QuizHistoryItem(
                id=quiz.id,
                url=quiz.url,
                title=quiz.title,
                created_at=quiz.created_at,
                question_count=len(quiz.questions)
            )
            for quiz in quizzes
        ]
    
    def _quiz_to_response(self, quiz: Quiz) -> QuizResponse:
        questions = [
            QuestionResponse(
                id=q.id,
                question=q.question_text,
                options=q.options,
                answer=q.correct_answer,
                difficulty=q.difficulty,
                explanation=q.explanation,
                section_reference=q.section_reference
            )
            for q in quiz.questions
        ]
        
        return QuizResponse(
            id=quiz.id,
            url=quiz.url,
            title=quiz.title,
            summary=quiz.summary,
            key_entities=quiz.key_entities,
            sections=quiz.sections,
            related_topics=quiz.related_topics,
            quiz=questions,
            created_at=quiz.created_at
        )
