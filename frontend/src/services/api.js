import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configuration axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// WebSocket pour les mises à jour en temps réel
const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

// Services API
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const threatService = {
  getAll: (params) => api.get('/threats', { params }),
  getById: (id) => api.get(`/threats/${id}`),
  create: (data) => api.post('/threats', data),
  update: (id, data) => api.put(`/threats/${id}`, data),
  verify: (id) => api.post(`/threats/${id}/verify`),
  getHeatmap: (params) => api.get('/threats/heatmap', { params }),
  getStats: (params) => api.get('/threats/stats', { params }),
};

export const nodeService = {
  getAll: (params) => api.get('/nodes', { params }),
  register: (data) => api.post('/nodes/register', data),
  updateStatus: (id, data) => api.put(`/nodes/${id}/status`, data),
  getMetrics: () => api.get('/nodes/metrics'),
  heartbeat: (data) => api.post('/nodes/heartbeat', data),
};

export const communityService = {
  getReports: (params) => api.get('/community/reports', { params }),
  createReport: (data) => api.post('/community/reports', data),
  voteReport: (id, vote) => api.post(`/community/reports/${id}/vote`, { vote }),
  addComment: (id, comment) => api.post(`/community/reports/${id}/comments`, { comment }),
  getLeaderboard: (params) => api.get('/community/leaderboard', { params }),
};

export const federatedService = {
  getCurrentRound: () => api.get('/federated/current'),
  getRounds: (params) => api.get('/federated/rounds', { params }),
  getMetrics: () => api.get('/federated/metrics'),
  submitContribution: (roundId, data) => api.post(`/federated/rounds/${roundId}/contribute`, data),
};

export const statsService = {
  getDashboard: (params) => api.get('/stats/dashboard', { params }),
  getRealtime: () => api.get('/stats/realtime'),
  getHistorical: (params) => api.get('/stats/historical', { params }),
  getCountryStats: () => api.get('/stats/countries'),
  getPerformance: () => api.get('/stats/performance'),
};

// WebSocket events
export const socketEvents = {
  onNewThreat: (callback) => socket.on('new-threat', callback),
  onThreatUpdated: (callback) => socket.on('threat-updated', callback),
  onNewRound: (callback) => socket.on('new-round', callback),
  onRoundCompleted: (callback) => socket.on('round-completed', callback),
  onAlert: (callback) => socket.on('alert', callback),
  off: (event) => socket.off(event),
};

export default api;