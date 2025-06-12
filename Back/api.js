import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4242', // ou a URL do seu backend
});

// Interceptor para tratar erros globais
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;