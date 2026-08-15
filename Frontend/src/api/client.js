import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

// Auth
export const login = (credentials) => api.post('/users/login', credentials);
export const register = (userData) => api.post('/users/register', userData);

// Pathway
export const getStudentProgress = (studentId) => api.get(`/pathway/student/${studentId}`);

// Agents
export const chatMainAgent = (data) => api.post('/agent/main/chat', data);
export const chatDoubtAgent = (data) => api.post('/agent/doubt/chat', data);
export const evaluateCode = (data) => api.post('/agent/evaluate', data);

export default api;
