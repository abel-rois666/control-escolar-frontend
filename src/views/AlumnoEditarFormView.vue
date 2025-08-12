<template>
  <div class="editar-alumno-view">
    <SpinnerLoader v-if="cargando" />
    <div v-if="!cargando && alumno.id">
      <div class="header">
        <h1>Editando a: {{ alumnoOriginal.nombre_completo }}</h1>
        <RouterLink to="/alumnos/gestion" class="btn-secondary">← Volver a la búsqueda</RouterLink>
      </div>

      <div class="card">
        <form @submit.prevent="actualizarAlumno" class="form-crear-alumno">
          <div class="form-group">
            <label>Apellido Paterno*</label>
            <input v-model="alumno.apellido_paterno" required />
          </div>
          <div class="form-group">
            <label>Apellido Materno</label>
            <input v-model="alumno.apellido_materno" />
          </div>
          <div class="form-group">
            <label>Nombre(s)*</label>
            <input v-model="alumno.nombre" required />
          </div>
          <div class="form-group">
            <label>Matrícula*</label>
            <input v-model="alumno.matricula" required />
          </div>
          <div class="form-group">
            <label>Licenciatura*</label>
            <select v-model="alumno.carrera" required>
              <option v-for="lic in licenciaturas" :key="lic.id" :value="lic.nombre">{{ lic.nombre }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Plan de Pago*</label>
            <select v-model="alumno.lista_de_precios_id" required>
              <option v-for="lista in listasDePrecios" :key="lista.id" :value="lista.id">{{ lista.nombre_lista }}</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Guardar Cambios</button>
            <button type="button" class="btn-delete" @click="abrirModalConfirmacion">Eliminar Alumno</button>
          </div>
        </form>
      </div>
    </div>
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
import { useRouter, useRoute, RouterLink } from 'vue-router';
import SpinnerLoader from '../components/SpinnerLoader.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const toast = useToast();
const router = useRouter();
const route = useRoute();

const alumno = ref({});
const alumnoOriginal = ref({}); // Para guardar una copia del nombre original
const listasDePrecios = ref([]);
const licenciaturas = ref([]);
const cargando = ref(true);
const mostrarModal = ref(false);

onMounted(async () => {
  const alumnoId = route.params.id;
  cargando.value = true;
  try {
    const [alumnoRes, listasRes, licRes] = await Promise.all([
      apiClient.get(`/alumnos/${alumnoId}`),
      apiClient.get('/listas-precios'),
      apiClient.get('/licenciaturas')
    ]);
    alumno.value = alumnoRes.data;
    alumnoOriginal.value = { ...alumnoRes.data }; // Guardamos una copia
    listasDePrecios.value = listasRes.data;
    licenciaturas.value = licRes.data;
  } catch (error) {
    toast.error("Error al cargar los datos para la edición.");
  } finally {
    cargando.value = false;
  }
});

const actualizarAlumno = async () => {
  try {
    await apiClient.put(`/alumnos/${alumno.value.id}`, alumno.value);
    toast.success("Alumno actualizado exitosamente.");
    router.push('/alumnos/gestion');
  } catch (error) {
    toast.error("Error al actualizar el alumno.");
  }
};

const abrirModalConfirmacion = () => { mostrarModal.value = true; };
const cerrarModalConfirmacion = () => { mostrarModal.value = false; };

const eliminarAlumno = async () => {
  try {
    await apiClient.delete(`/alumnos/${alumno.value.id}`);
    toast.success("Alumno eliminado exitosamente.");
    router.push('/alumnos/gestion');
  } catch (error) {
    toast.error("Error al eliminar el alumno.");
  } finally {
    cerrarModalConfirmacion();
  }
};
</script>

<style scoped>
/* Puedes usar estilos similares a AlumnoCrearView y añadir esto */
.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.btn-delete { background-color: #dc3545; color: white; }
</style>