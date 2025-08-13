<template>
  <div class="editar-alumno-view">
    <SpinnerLoader v-if="cargando" />
    <div v-if="!cargando && alumno.id">
      <div class="header">
        <h1>Editando a: {{ alumnoOriginal.nombre_completo }}</h1>
        <RouterLink to="/alumnos/gestion" class="btn-secondary">← Volver a la búsqueda</RouterLink>
      </div>

      <div class="card">
        <form @submit.prevent="actualizarAlumno" class="form-editar-alumno">
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
          
          <div class="form-group">
            <label>Grado</label>
            <input v-model="alumno.grado" />
          </div>
          <div class="form-group">
            <label>Grupo</label>
            <input v-model="alumno.grupo" />
          </div>
          <div class="form-group">
            <label>Turno</label>
            <input v-model="alumno.turno" />
          </div>

          <div class="form-group">
            <label>Email de Contacto</label>
            <input type="email" v-model="alumno.email_contacto" />
          </div>
          <div class="form-group">
            <label>Teléfono Celular</label>
            <input v-model="alumno.telefono_celular" />
          </div>
          <div class="form-group">
            <label>Nombre del Tutor</label>
            <input v-model="alumno.nombre_tutor" />
          </div>

          <div class="form-group">
            <label>Beca (%)</label>
            <input type="number" v-model.number="alumno.porcentaje_beca" max="100" />
          </div>
          <div class="form-group">
            <label>Estatus</label>
            <select v-model="alumno.estatus" required>
              <option>Activo</option>
              <option>Baja</option>
              <option>Egresado</option>
            </select>
          </div>

          <div class="form-actions full-width">
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
const alumnoOriginal = ref({});
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
    alumnoOriginal.value = { ...alumnoRes.data };
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
/* Estilos copiados de AlumnoCrearView para consistencia */
.editar-alumno-view { max-width: 1000px; margin: 0 auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.card { background-color: #fff; border: 1px solid #DFE0EB; border-radius: 8px; padding: 2rem; position: relative; min-height: 200px; }
.form-editar-alumno { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; }
.form-group label { margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: bold; }
.form-group input, .form-group select { padding: 0.6rem; border-radius: 6px; border: 1px solid #DFE0EB; width: 100%; }
.full-width { grid-column: 1 / -1; margin-top: 1rem; }
.btn-secondary { background-color: #6c757d; color: white; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; }
button { padding: 0.8rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; }
.btn-primary { background-color: #3751FF; color: white; }

/* Estilos específicos para esta vista */
.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.btn-delete { background-color: #dc3545; color: white; }
</style>