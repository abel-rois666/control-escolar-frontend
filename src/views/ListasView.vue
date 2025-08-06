<template>
  <div class="listas-view">
    <h1>Gestión de Listas de Precios</h1>

    <form @submit.prevent="crearNuevaLista" class="form-container">
      <input 
        v-model="nuevaLista.nombre_lista" 
        type="text" 
        placeholder="Nombre de la nueva lista" 
        required 
      />
      <button type="submit">Crear Lista</button>
    </form>

    <hr />

    <h2>Listas Existentes</h2>
    <ul v-if="listas.length > 0" class="lista-container">
      <li v-for="lista in listas" :key="lista.id">
        <RouterLink :to="`/listas-precios/${lista.id}`">
        {{ lista.nombre_lista }} (ID: {{ lista.id }})
        </RouterLink>
      </li>
    </ul>
    <p v-else>No hay listas de precios registradas.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api.js';

const listas = ref([]);

// Variable para el formulario de la nueva lista
const nuevaLista = ref({
  nombre_lista: '',
});

// Función para cargar las listas desde la API
const fetchListas = async () => {
  try {
    const response = await apiClient.get('/listas-precios');
    listas.value = response.data;
  } catch (error) {
    console.error('Error al obtener las listas de precios:', error);
  }
};

// Función para crear una nueva lista
const crearNuevaLista = async () => {
  try {
    await apiClient.post('/listas-precios', nuevaLista.value);
    await fetchListas(); // Recargamos la lista
    nuevaLista.value.nombre_lista = ''; // Limpiamos el formulario
  } catch (error) {
    console.error('Error al crear la lista de precios:', error);
  }
};

onMounted(fetchListas);
</script>

<style scoped>
.listas-view {
  max-width: 800px;
  margin: 0 auto;
}
.form-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}
input[type="text"] {
  flex-grow: 1;
  padding: 0.5rem;
}
hr {
  margin: 2rem 0;
}
.lista-container {
  list-style-type: none;
  padding: 0;
}
.lista-container li {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}
</style>