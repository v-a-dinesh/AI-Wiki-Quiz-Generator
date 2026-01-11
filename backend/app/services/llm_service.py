from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field
from typing import List
from app.core.config import settings
import json
import re

class QuizQuestion(BaseModel):
    question: str = Field(description="The quiz question text")
    options: List[str] = Field(description="Four answer options")
    answer: str = Field(description="The correct answer from the options")
    difficulty: str = Field(description="Difficulty level: easy, medium, or hard")
    explanation: str = Field(description="Brief explanation of the correct answer")
    section_reference: str = Field(description="The section of the article this question relates to")

class QuizOutput(BaseModel):
    questions: List[QuizQuestion] = Field(description="List of quiz questions")

class LLMService:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="models/gemini-2.5-flash",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.7
        )
    
    def generate_quiz(self, title: str, content: str, sections: List[str], num_questions: int = 8) -> List[dict]:
        quiz_prompt = PromptTemplate(
            input_variables=["title", "content", "sections", "num_questions"],
            template="""You are an expert quiz creator. Based on the following Wikipedia article, create {num_questions} high-quality quiz questions.

Article Title: {title}

Available Sections: {sections}

Article Content:
{content}

CRITICAL INSTRUCTIONS:
1. Base ALL questions STRICTLY on the provided article content - DO NOT use external knowledge
2. Create questions with varying difficulty levels (easy, medium, hard)
3. Each question must have EXACTLY 4 options (A, B, C, D format)
4. Ensure questions cover different sections of the article
5. Make explanations reference specific parts of the article
6. Ensure factual accuracy - verify answers are in the text
7. Avoid ambiguous questions

Generate EXACTLY {num_questions} questions in the following JSON format:
{{
  "questions": [
    {{
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct option text",
      "difficulty": "easy|medium|hard",
      "explanation": "Brief explanation referencing the article",
      "section_reference": "Section name from the article"
    }}
  ]
}}

Return ONLY valid JSON, no additional text."""
        )
        
        prompt_text = quiz_prompt.format(
            title=title,
            content=content[:12000],
            sections=", ".join(sections),
            num_questions=num_questions
        )
        
        try:
            response = self.llm.invoke(prompt_text)
            content_text = response.content
            
            json_match = re.search(r'\{.*\}', content_text, re.DOTALL)
            if json_match:
                content_text = json_match.group()
            
            quiz_data = json.loads(content_text)
            
            questions = []
            for q in quiz_data.get('questions', []):
                if len(q.get('options', [])) == 4:
                    questions.append({
                        'question': q['question'],
                        'options': q['options'],
                        'answer': q['answer'],
                        'difficulty': q.get('difficulty', 'medium'),
                        'explanation': q['explanation'],
                        'section_reference': q.get('section_reference', 'General')
                    })
            
            return questions[:num_questions]
            
        except Exception as e:
            raise Exception(f"Failed to generate quiz: {str(e)}")
    
    def generate_related_topics(self, title: str, content: str, sections: List[str]) -> List[str]:
        topics_prompt = PromptTemplate(
            input_variables=["title", "content", "sections"],
            template="""Based on the following Wikipedia article, suggest 5-8 related Wikipedia topics that would be interesting for further reading.

Article Title: {title}
Sections: {sections}
Content Summary: {content}

INSTRUCTIONS:
1. Suggest topics that are directly related to the article
2. Topics should be specific enough to have their own Wikipedia pages
3. Provide diverse topics covering different aspects mentioned in the article
4. Return ONLY a JSON array of topic names

Format:
{{
  "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]
}}

Return ONLY valid JSON, no additional text."""
        )
        
        prompt_text = topics_prompt.format(
            title=title,
            content=content[:3000],
            sections=", ".join(sections[:5])
        )
        
        try:
            response = self.llm.invoke(prompt_text)
            content_text = response.content
            
            json_match = re.search(r'\{.*\}', content_text, re.DOTALL)
            if json_match:
                content_text = json_match.group()
            
            topics_data = json.loads(content_text)
            return topics_data.get('topics', [])[:8]
            
        except Exception as e:
            return [
                f"{title} history",
                f"Related figures to {title}",
                "Historical context",
                "Modern impact"
            ]
