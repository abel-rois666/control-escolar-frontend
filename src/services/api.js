// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Interceptor de Solicitud (Request)
// Se ejecuta ANTES de que se envíe cada solicitud
apiClient.interceptors.request.use(
  (config) => {
    // Lee el token MÁS ACTUALIZADO desde localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // Si tenemos un token, lo añadimos al header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Interceptor de Respuesta (Response)
// Se ejecuta DESPUÉS de recibir una respuesta
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, solo la retornamos
    return response;
  },
  (error) => {
    // Si el servidor nos dice que no estamos autorizados (401)
    // o que el token es inválido (403)...
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // ...borramos el token y forzamos al usuario a hacer login de nuevo.
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      
      // (Evitamos bucles infinitos si el error ocurrió en la propia página de login)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'; // Redirección forzada
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
