<template>
  <div class="crear-alumno-view">
    <div class="header">
      <h1>Crear Nuevo Alumno</h1>
      <RouterLink to="/alumnos/gestion" class="btn-secondary">← Volver a Gestión</RouterLink>
    </div>

    <div class="card">
      <SpinnerLoader v-if="cargando" />
      <form v-else @submit.prevent="crearNuevoAlumno" class="form-crear-alumno">
        <div class="form-group">
          <label>Apellido Paterno*</label>
          <input v-model="nuevoAlumno.apellido_paterno" required />
        </div>
        <div class="form-group">
          <label>Apellido Materno</label>
          <input v-model="nuevoAlumno.apellido_materno" />
        </div>
        <div class="form-group">
          <label>Nombre(s)*</label>
          <input v-model="nuevoAlumno.nombre" required />
        </div>
        <div class="form-group">
          <label>Matrícula*</label>
          <input v-model="nuevoAlumno.matricula" required />
        </div>
        <div class="form-group">
          <label>Licenciatura*</label>
          <select v-model="nuevoAlumno.carrera" required>
            <option disabled value="">Selecciona una licenciatura</option>
            <option v-for="lic in licenciaturas" :key="lic.id" :value="lic.nombre">
              {{ lic.nombre }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Plan de Pago*</label>
          <select v-model="nuevoAlumno.lista_de_precios_id" required>
            <option disabled value="">Selecciona un plan</option>
            <option v-for="lista in listasDePrecios" :key="lista.id" :value="lista.id">
              {{ lista.nombre_lista }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Grado</label>
          <input v-model="nuevoAlumno.grado" />
        </div>
        <div class="form-group">
          <label>Grupo</label>
          <input v-model="nuevoAlumno.grupo" />
        </div>
        <div class="form-group">
          <label>Turno</label>
          <input v-model="nuevoAlumno.turno" />
        </div>
        <div class="form-group">
          <label>Email de Contacto</label>
          <input type="email" v-model="nuevoAlumno.email_contacto" />
        </div>
        <div class="form-group">
          <label>Teléfono Celular</label>
          <input v-model="nuevoAlumno.telefono_celular" />
        </div>
        <div class="form-group">
          <label>Nombre del Tutor</label>
          <input v-model="nuevoAlumno.nombre_tutor" />
        </div>
        <div class="form-group">
          <label>Beca (%)</label>
          <input type="number" v-model.number="nuevoAlumno.porcentaje_beca" max="100" />
        </div>
         <div class="form-group">
          <label>Estatus</label>
          <select v-model="nuevoAlumno.estatus" required>
            <option>Activo</option>
            <option>Baja</option>
            <option>Egresado</option>
          </select>
        </div>
        <button type="submit" class="full-width">Guardar Alumno</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import { useRouter, RouterLink } from 'vue-router';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const toast = useToast();
const router = useRouter();
const listasDePrecios = ref([]);
const licenciaturas = ref([]);
const cargando = ref(true);

const nuevoAlumno = ref({
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  matricula: '',
  lista_de_precios_id: '',
  carrera: '',
  grado: '',
  grupo: '',
  turno: '',
  email_contacto: '',
  telefono_celular: '', // <-- Campo añadido
  nombre_tutor: '',     // <-- Campo añadido
  porcentaje_beca: 0,
  estatus: 'Activo',
});

const fetchRequiredData = async () => {
  cargando.value = true;
  try {
    const [listasRes, licRes] = await Promise.all([
      apiClient.get('/listas-precios'),
      apiClient.get('/licenciaturas')
    ]);
    listasDePrecios.value = listasRes.data;
    licenciaturas.value = licRes.data;
  } catch (error) {
    toast.error("Error al cargar datos de configuración.");
  } finally {
    cargando.value = false;
  }
};

const crearNuevoAlumno = async () => {
  try {
    await apiClient.post('/alumnos', nuevoAlumno.value);
    toast.success("Alumno creado exitosamente.");
    router.push('/alumnos/gestion'); // Redirige a la página de gestión/búsqueda
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Error desconocido';
    toast.error(`Error al crear alumno: ${errorMessage}`);
  }
};

onMounted(fetchRequiredData);
</script>

<style scoped>
.crear-alumno-view { max-width: 1000px; margin: 0 auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.card { background-color: #fff; border: 1px solid #DFE0EB; border-radius: 8px; padding: 2rem; position: relative; min-height: 200px; }
.form-crear-alumno { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; }
.form-group label { margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: bold; }
.form-group input, .form-group select { padding: 0.6rem; border-radius: 6px; border: 1px solid #DFE0EB; width: 100%; }
.full-width { grid-column: 1 / -1; margin-top: 1rem; }
.btn-secondary { background-color: #6c757d; color: white; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; }
button { padding: 0.8rem 1.5rem; border: none; background-color: #3751FF; color: white; border-radius: 8px; cursor: pointer; font-size: 1rem; }
</style>