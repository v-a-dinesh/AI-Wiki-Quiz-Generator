import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quizAPI = {
  validateUrl: async (url) => {
    const response = await api.post('/api/quiz/validate-url', { url });
    return response.data;
  },

  generateQuiz: async (url) => {
    const response = await api.post('/api/quiz/generate', { url });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/api/quiz/history');
    return response.data;
  },

  getQuizById: async (id) => {
    const response = await api.get(`/api/quiz/${id}`);
    return response.data;
  },
};

export default api;
