<template>
  <div class="recibir-pagos-view">
    <div class="header">
      <h1>Consulta de Alumnos</h1>
      <RouterLink to="/alumnos" class="btn-secondary">← Volver</RouterLink>
    </div>
    <p>Busca un alumno por nombre o matrícula para ver su ficha y estado de cuenta.</p>
    <div class="search-container">
      <input 
        type="text" 
        v-model="terminoBusqueda" 
        placeholder="Buscar alumno..."
        class="search-input"
      />
    </div>

    <SpinnerLoader v-if="cargando" />

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

watch(terminoBusqueda, async (nuevoValor) => {
  if (nuevoValor.length < 2) {
    resultados.value = [];
    return;
  }

  cargando.value = true;
  try {
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
/* ==== ESTILOS AÑADIDOS ==== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
}
/* ==== FIN DE ESTILOS AÑADIDOS ==== */

.search-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.1rem;
  margin-top: 1.5rem;
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
</style>