import axios from 'axios';

const API_BASE_URL = 'https://mock-ielts.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin API functions
export const adminAPI = {
  // Barcha savollarni olish
  getQuestions: () => api.get('/admin/questions'),
  
  // Bitta savolni olish
  getQuestion: (id) => api.get(`/admin/questions/${id}`),
  
  // Yangi savol qo'shish
  createQuestion: (questionData) => api.post('/admin/questions', questionData),
  
  // Savolni yangilash
  updateQuestion: (id, questionData) => api.put(`/admin/questions/${id}`, questionData),
  
  // Savolni o'chirish
  deleteQuestion: (id) => api.delete(`/admin/questions/${id}`),
};

// User API functions
export const userAPI = {
  // Test uchun savollarni olish
  getQuestions: (limit = 10) => api.get(`/questions?limit=${limit}`),
  
  // Javoblarni yuborish
  submitAnswers: (answers) => api.post('/submit', { answers }),
};