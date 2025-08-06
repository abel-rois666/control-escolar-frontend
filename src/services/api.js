// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // La URL base de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;