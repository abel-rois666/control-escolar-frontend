// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// --- INICIO: CORRECCIÓN ---
// Esta función segura previene el error '... is not valid JSON'
// Si los datos están corruptos o vacíos, los limpia y devuelve null.
const getSafeUser = () => {
  const userString = localStorage.getItem('authUser');
  if (!userString) {
    return null;
  }
  try {
    // Intenta parsear datos válidos (ej: {"username": "admin", ...})
    return JSON.parse(userString);
  } catch (e) {
    // Atrapa el error si los datos son inválidos (ej: "admin")
    localStorage.removeItem('authUser'); // Limpia los datos corruptos
    localStorage.removeItem('authToken'); // Limpia el token por seguridad
    return null;
  }
};
// --- FIN: CORRECCIÓN ---

export const useAuthStore = defineStore('auth', () => {
  // --- Estado ---
  const token = ref(localStorage.getItem('authToken') || null);
  const user = ref(getSafeUser()); // <-- Usa la función segura

  // --- Getters ---
  const isLoggedIn = computed(() => !!token.value);
  const permissions = computed(() => (user.value ? user.value.permissions : {}));

  // --- Acciones ---
  
  const hasPermission = (perm) => {
    return permissions.value[perm] === true;
  };

  /**
   * Guarda los datos de sesión al iniciar sesión.
   */
  const login = (data) => {
    // 'data.user' DEBE ser un objeto (lo que viene del backend)
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authUser', JSON.stringify(data.user)); 
    token.value = data.token;
    user.value = data.user;
  };

  /**
   * Cierra la sesión del usuario.
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    token.value = null;
    user.value = null;
  };

  return {
    token,
    user,
    isLoggedIn,
    permissions,
    hasPermission,
    login,
    logout,
  };
});