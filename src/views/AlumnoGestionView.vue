<template>
  <div class="gestion-view">
    <div class="header">
      <RouterLink to="/alumnos" class="btn-secondary">
        ← Volver
      </RouterLink>
      <h1>Editar o Eliminar Alumno</h1>
      <RouterLink to="/alumnos/crear" class="btn-primary">
        + Crear Nuevo Alumno
      </RouterLink>
    </div>
    <p>Busca un alumno por nombre o matrícula para modificar su información o darlo de baja.</p>

    <div class="search-container">
      <input 
        type="text" 
        v-model="terminoBusqueda" 
        placeholder="Buscar alumno para editar..."
        class="search-input"
      />
    </div>

    <SpinnerLoader v-if="cargando" />

    <ul v-else-if="resultados.length > 0" class="lista-container">
      <li v-for="alumno in resultados" :key="alumno.id">
        <span>
          <strong>{{ alumno.nombre_completo }}</strong> - Matrícula: {{ alumno.matricula }}
        </span>
        <RouterLink :to="`/alumnos/${alumno.id}/editar`" class="btn-edit">
          Editar
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
      params: { buscar: nuevoValor }
    });
    resultados.value = response.data;
  } catch (error) {
    toast.error("Ocurrió un error al realizar la búsqueda.");
  } finally {
    cargando.value = false;
  }
});
</script>

<style scoped>
.gestion-view { max-width: 800px; margin: 0 auto; }
.header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 0.5rem; 
}
.header h1 {
    font-size: 1.5rem;
    text-align: center;
    flex-grow: 1;
}
.search-input { width: 100%; padding: 0.75rem; font-size: 1.1rem; margin-top: 1.5rem; margin-bottom: 1.5rem; }
.lista-container { list-style: none; padding: 0; }
.lista-container li { display: flex; justify-content: space-between; align-items: center; background: #fff; border: 1px solid #ddd; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px; }
.btn-primary { background-color: #3751FF; color: white; padding: 0.6rem 1rem; border-radius: 8px; text-decoration: none; font-weight: bold; white-space: nowrap; }
.btn-secondary { background-color: #6c757d; color: white; padding: 0.6rem 1rem; border-radius: 8px; text-decoration: none; }
.btn-edit { background-color: #ffc107; color: black; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; }
</style>