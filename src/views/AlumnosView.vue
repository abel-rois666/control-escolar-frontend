<template>
  <div class="alumnos-view">
    <h1>Gestión de Alumnos</h1>

    <form @submit.prevent="crearNuevoAlumno" class="form-container">
      <h3>Crear Nuevo Alumno</h3>
      <input v-model="nuevoAlumno.matricula" placeholder="Matrícula" required />
      <input v-model="nuevoAlumno.nombre_completo" placeholder="Nombre Completo" required />
      <select v-model="nuevoAlumno.lista_de_precios_id" required>
        <option disabled value="">Selecciona una lista de precios</option>
        <option v-for="lista in listasDePrecios" :key="lista.id" :value="lista.id">
          {{ lista.nombre_lista }}
        </option>
      </select>
      <input v-model="nuevoAlumno.carrera" placeholder="Carrera" />
       <input type="number" v-model.number="nuevoAlumno.porcentaje_beca" placeholder="Porcentaje Beca (ej: 10.5)" />
      <button type="submit">Crear Alumno</button>
    </form>

    <hr />

    <h2>Alumnos Registrados</h2>
    <ul class="lista-container">
      <li v-for="alumno in alumnos" :key="alumno.id">
        <RouterLink :to="`/alumnos/${alumno.id}`">
          {{ alumno.nombre_completo }} (Matrícula: {{ alumno.matricula }})
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api.js';
import { RouterLink } from 'vue-router';

const alumnos = ref([]);
const listasDePrecios = ref([]);
const nuevoAlumno = ref({
  matricula: '',
  nombre_completo: '',
  lista_de_precios_id: '',
  carrera: '',
  porcentaje_beca: 0,
  estatus: 'Activo', // Valor por defecto
});

const fetchAlumnos = async () => {
  const response = await apiClient.get('/alumnos');
  alumnos.value = response.data;
};

const fetchListasDePrecios = async () => {
  const response = await apiClient.get('/listas-precios');
  listasDePrecios.value = response.data;
};

const crearNuevoAlumno = async () => {
    try {
        await apiClient.post('/alumnos', nuevoAlumno.value);
        await fetchAlumnos(); // Recargar la lista
        // Limpiar formulario
        Object.keys(nuevoAlumno.value).forEach(key => nuevoAlumno.value[key] = '');
        nuevoAlumno.value.porcentaje_beca = 0;
        nuevoAlumno.value.estatus = 'Activo';
    } catch (error) {
        console.error("Error al crear alumno:", error.response.data);
        alert(`Error: ${error.response.data.error}`);
    }
};

onMounted(() => {
  fetchAlumnos();
  fetchListasDePrecios();
});
</script>

<style scoped>
/* Puedes copiar y pegar los estilos de ListasView.vue o personalizarlos */
.alumnos-view { max-width: 800px; margin: 0 auto; }
.form-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; padding: 1rem; background-color: #f9f9f9; border-radius: 8px; }
.form-container h3, .form-container button { grid-column: 1 / -1; }
.lista-container { list-style: none; padding: 0; }
.lista-container li { background: #fff; border: 1px solid #ddd; padding: 1rem; margin-bottom: .5rem; border-radius: 4px; }
</style>