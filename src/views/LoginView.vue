<template>
  <div class="login-container">
    <div class="login-card">
      <img :src="logo" alt="Logo CUOM" class="logo" />
      <h2>Control Escolar y de Cobranza</h2>
      <p>Por favor, inicia sesión para continuar.</p>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Usuario (admin)</label>
          <input id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input id="password" type="password" v-model="password" required />
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <button type="submit" :disabled="cargando" class="btn-login">
          {{ cargando ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // <-- AÑADIDO
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import logo from '@/assets/06-Logo_CUOM_v3_ConFondoAmpliado.jpg';
import { useAuthStore } from '../stores/auth.js'; 

const authStore = useAuthStore(); 
const router = useRouter(); // <-- AÑADIDO (aquí sí es seguro usarlo)

const username = ref('');
const password = ref('');
const cargando = ref(false);
const error = ref(null);

const toast = useToast();

const handleLogin = async () => {
  cargando.value = true;
  error.value = null;
  try {
    const response = await apiClient.post('/auth/login', {
      username: username.value,
      password: password.value,
    });
    
    // 1. El Store guarda el token y el usuario
    authStore.login(response.data); 
    
    // 2. La Vista redirige al usuario
    router.push('/dashboard'); // <-- AÑADIDO

  } catch (err) {
    error.value = 'Credenciales incorrectas. Intenta de nuevo.';
    toast.error('Credenciales incorrectas.');
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #F7F8FC;
}
.login-card {
  background-color: #fff;
  border: 1px solid #DFE0EB;
  border-radius: 8px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.logo {
  max-width: 120px;
  margin-bottom: 1rem;
}
h2 {
  color: #252733;
  font-weight: bold;
}
p {
  color: #9FA2B4;
  margin-bottom: 2rem;
}
.form-group {
  text-align: left;
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.form-group input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid #DFE0EB;
}
.btn-login {
  width: 100%;
  padding: 0.8rem 1.5rem;
  border: none;
  background-color: #3751FF;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}
.btn-login:disabled {
  background-color: #9FA2B4;
}
.error-message {
  color: #dc3545;
  background-color: #fbebee;
  border: 1px solid #dc3545;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}
</style>