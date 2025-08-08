<template>
  <div class="alumnos-view">
    <h1>Gestión de Alumnos</h1>

    <form @submit.prevent="crearNuevoAlumno" class="form-container">
      <h3>Crear Nuevo Alumno</h3>
      <input v-model="nuevoAlumno.matricula" placeholder="Matrícula" required />
      <input v-model="nuevoAlumno.nombre_completo" placeholder="Nombre Completo" required />
      <select v-model="nuevoAlumno.lista_de_precios_id" required>
        <option disabled value="">Selecciona un plan de pago</option>
        <option v-for="lista in listasDePrecios" :key="lista.id" :value="lista.id">
          {{ lista.nombre_lista }}
        </option>
      </select>
      <input v-model="nuevoAlumno.carrera" placeholder="Carrera" />
       <input type="number" v-model.number="nuevoAlumno.porcentaje_beca" placeholder="Beca % (ej: 10.5)" max="100" />
      <button type="submit" class="full-width">Crear Alumno</button>
    </form>

    <hr />

    <h2>Alumnos Registrados</h2>
    <SpinnerLoader v-if="cargando" />
    <ul v-else class="lista-container">
      <li v-for="alumno in alumnos" :key="alumno.id">
        <RouterLink :to="`/alumnos/${alumno.id}`">
          {{ alumno.nombre_completo }} (Matrícula: {{ alumno.matricula }})
        </RouterLink>
        <button class="btn-delete" @click="abrirModalConfirmacion(alumno.id)">Borrar</button>
      </li>
    </ul>
  </div>

  <ConfirmModal
    :show="mostrarModal"
    title="Confirmar Eliminación de Alumno"
    message="¿Estás seguro? Se eliminarán todos los cargos y pagos asociados a este alumno de forma permanente."
    @confirm="eliminarAlumno"
    @cancel="cerrarModalConfirmacion"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import { RouterLink } from 'vue-router';
import SpinnerLoader from '../components/SpinnerLoader.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const toast = useToast();
const alumnos = ref([]);
const listasDePrecios = ref([]);
const cargando = ref(true);
const mostrarModal = ref(false);
const alumnoAEliminar = ref(null);

const nuevoAlumno = ref({
  matricula: '',
  nombre_completo: '',
  lista_de_precios_id: '',
  carrera: '',
  porcentaje_beca: 0,
  estatus: 'Activo',
});

// Función corregida para cargar alumnos
const fetchAlumnos = async () => {
  try {
    const response = await apiClient.get('/alumnos');
    alumnos.value = response.data;
  } catch (error) {
    toast.error("Error al cargar la lista de alumnos.");
    console.error("Error en fetchAlumnos:", error);
  }
};

// Función corregida para cargar listas de precios
const fetchListasDePrecios = async () => {
  try {
    const response = await apiClient.get('/listas-precios');
    listasDePrecios.value = response.data;
  } catch (error) {
    toast.error("Error al cargar los planes de pago.");
    console.error("Error en fetchListasDePrecios:", error);
  }
};

const crearNuevoAlumno = async () => {
    try {
        await apiClient.post('/alumnos', nuevoAlumno.value);
        toast.success("Alumno creado exitosamente.");
        await fetchAlumnos();
        Object.keys(nuevoAlumno.value).forEach(key => { nuevoAlumno.value[key] = '' });
        nuevoAlumno.value.porcentaje_beca = 0;
        nuevoAlumno.value.estatus = 'Activo';
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Ocurrió un error desconocido.';
        toast.error(`Error al crear alumno: ${errorMessage}`);
        console.error("Error al crear alumno:", error.response?.data);
    }
};

const abrirModalConfirmacion = (id) => {
  alumnoAEliminar.value = id;
  mostrarModal.value = true;
};

const cerrarModalConfirmacion = () => {
  mostrarModal.value = false;
  alumnoAEliminar.value = null;
};

const eliminarAlumno = async () => {
  try {
    await apiClient.delete(`/alumnos/${alumnoAEliminar.value}`);
    toast.success("Alumno eliminado exitosamente.");
    await fetchAlumnos();
  } catch (error) {
    toast.error("Error al eliminar el alumno.");
  } finally {
    cerrarModalConfirmacion();
  }
};

// onMounted corregido para manejar la carga de forma segura
onMounted(async () => {
  cargando.value = true;
  try {
    // Esperamos a que ambas peticiones terminen
    await Promise.all([
      fetchAlumnos(),
      fetchListasDePrecios()
    ]);
  } catch (error) {
    toast.error("No se pudo cargar la información inicial de la página.");
  } finally {
    cargando.value = false;
  }
});
</script>

<style scoped>
.alumnos-view { max-width: 800px; margin: 0 auto; }
.form-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; padding: 1rem; background-color: #f9f9f9; border-radius: 8px; }
.form-container h3, .form-container button { grid-column: 1 / -1; }
.lista-container { list-style: none; padding: 0; }
.lista-container li { display: flex; justify-content: space-between; align-items: center; background: #fff; border: 1px solid #ddd; padding: 1rem; margin-bottom: .5rem; border-radius: 4px; }
.btn-delete { background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
</style>