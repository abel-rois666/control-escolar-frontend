<template>
  <div class="recibir-pagos-view">
    <h1>Recibir Pagos</h1>
    <p>Busca un alumno por nombre o matrícula para ver sus detalles y registrar un pago.</p>

    <div class="search-container">
      <input 
        type="text" 
        v-model="terminoBusqueda" 
        placeholder="Buscar alumno..."
        class="search-input"
      />
    </div>

     <SpinnerLoader v-if="cargando" />

    <div v-if="cargando" class="loading-message">
      Buscando...
    </div>

    <ul v-else-if="resultados.length > 0" class="lista-container">
      <li v-for="alumno in resultados" :key="alumno.id">
        <RouterLink :to="`/alumnos/${alumno.id}`">
          <strong>{{ alumno.nombre_completo }}</strong> - Matrícula: {{ alumno.matricula }}
        </RouterLink>
      </li>
    </ul>

    <p v-else-if="terminoBusqueda && !cargando">
      No se encontraron alumnos que coincidan con "{{ terminoBusqueda }}".
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification'; 
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const toast = useToast();
const terminoBusqueda = ref('');
const resultados = ref([]);
const cargando = ref(false);

// 'watch' es una función de Vue que "observa" una variable.
// Cada vez que 'terminoBusqueda' cambia, este código se ejecuta.
watch(terminoBusqueda, async (nuevoValor) => {
  if (nuevoValor.length < 2) {
    resultados.value = [];
    return;
  }

  cargando.value = true;
  try {
    // Hacemos la petición a la API con el término de búsqueda
    const response = await apiClient.get('/alumnos', {
      params: {
        buscar: nuevoValor
      }
    });
    resultados.value = response.data;
  } catch (error) {
    console.error('Error al buscar alumnos:', error);
    toast.error("Ocurrió un error al realizar la búsqueda."); 
    resultados.value = [];
  } finally {
    cargando.value = false;
  }
});
</script>

<style scoped>
.recibir-pagos-view {
  max-width: 800px;
  margin: 0 auto;
}
.search-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}
.lista-container {
  list-style: none;
  padding: 0;
}
.lista-container li a {
  display: block;
  background: #fff;
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  text-decoration: none;
  color: #2c3e50;
  transition: background-color 0.2s;
}
.lista-container li a:hover {
  background-color: #f9f9f9;
}
.loading-message {
  padding: 1rem;
  text-align: center;
  color: #555;
}
</style>