from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str
    GOOGLE_API_KEY: str
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,https://ai-wiki-quiz-generator-xi.vercel.app"
    
    @property
    def cors_origins_list(self) -> List[str]:
        if self.ENVIRONMENT == "production":
            origins = [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
            origins.append("https://*.vercel.app")
            return origins
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
