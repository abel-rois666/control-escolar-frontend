<template>
  <div class="consulta-recibos-view">
    <h1>Consulta de Recibos</h1>

    <div class="card">
      <h3>Buscar por Folio de Recibo</h3>
      <form @submit.prevent="buscarPorFolio" class="form-inline">
        <input v-model="folioBusqueda" type="text" placeholder="Ingresa el folio..." required />
        <button type="submit" :disabled="cargandoFolio">
          {{ cargandoFolio ? 'Buscando...' : 'Buscar' }}
        </button>
      </form>
    </div>

    <div class="card">
      <h3>Buscar por Alumno</h3>
      <p>Busca un alumno para ver su historial de recibos.</p>
      <input v-model="terminoBusquedaAlumno" type="text" placeholder="Buscar alumno por nombre o matrícula..." class="search-input" />
      
      <SpinnerLoader v-if="cargandoAlumnos" />
      <ul v-if="alumnosEncontrados.length > 0" class="lista-alumnos">
        <li v-for="alumno in alumnosEncontrados" :key="alumno.id">
          <span>{{ alumno.nombre_completo }} - {{ alumno.matricula }}</span>
          <button @click="seleccionarAlumno(alumno)" class="btn-ver">Ver Recibos</button>
        </li>
      </ul>
    </div>

    <div v-if="alumnoSeleccionado" class="card">
      <h3>Historial de Recibos de: <strong>{{ alumnoSeleccionado.nombre_completo }}</strong></h3>
      <SpinnerLoader v-if="cargandoRecibos" />
      <table v-if="recibosEncontrados.length > 0">
        <thead>
            <tr><th>Folio</th><th>Fecha de Pago</th><th>Monto</th><th>Acciones</th></tr>
        </thead>
        <tbody>
            <tr v-for="recibo in recibosEncontrados" :key="recibo.id">
                <td>{{ recibo.folio }}</td>
                <td>{{ formatDate(recibo.fecha_pago) }}</td>
                <td><strong>${{ parseFloat(recibo.monto_total_recibido).toFixed(2) }}</strong></td>
                <td><RouterLink :to="`/recibos/${recibo.id}`" class="btn-ver">Ver Recibo</RouterLink></td>
            </tr>
        </tbody>
      </table>
      <p v-else-if="!cargandoRecibos">Este alumno no tiene recibos registrados.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const router = useRouter();
const toast = useToast();

const folioBusqueda = ref('');
const cargandoFolio = ref(false);

const terminoBusquedaAlumno = ref('');
const alumnosEncontrados = ref([]);
const cargandoAlumnos = ref(false);
const alumnoSeleccionado = ref(null);

const recibosEncontrados = ref([]);
const cargandoRecibos = ref(false);


const buscarPorFolio = async () => {
  if (!folioBusqueda.value.trim()) return;
  cargandoFolio.value = true;
  try {
    const response = await apiClient.get(`/consultas/recibos/folio`, { params: { folio: folioBusqueda.value } });
    router.push(`/recibos/${response.data.id}`);
  } catch (error) {
    toast.error("Recibo no encontrado con ese folio.");
  } finally {
    cargandoFolio.value = false;
  }
};

watch(terminoBusquedaAlumno, async (nuevoValor) => {
  alumnoSeleccionado.value = null;
  recibosEncontrados.value = [];
  if (nuevoValor.length < 2) {
    alumnosEncontrados.value = [];
    return;
  }
  cargandoAlumnos.value = true;
  try {
    const response = await apiClient.get('/alumnos', { params: { buscar: nuevoValor } });
    alumnosEncontrados.value = response.data;
  } catch (error) {
    toast.error("Error al buscar alumnos.");
  } finally {
    cargandoAlumnos.value = false;
  }
});

const seleccionarAlumno = async (alumno) => {
    alumnoSeleccionado.value = alumno;
    alumnosEncontrados.value = []; // Oculta la lista de búsqueda para dar espacio a los resultados
    cargandoRecibos.value = true;
    try {
        const response = await apiClient.get(`/consultas/recibos/alumnos/${alumno.id}`);
        recibosEncontrados.value = response.data;
    } catch (error) {
        toast.error("Error al cargar el historial de recibos.");
    } finally {
        cargandoRecibos.value = false;
    }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
};
</script>

<style scoped>
.consulta-recibos-view { max-width: 900px; margin: auto; }
.card { background-color: #fff; border: 1px solid #DFE0EB; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; position: relative; }
.form-inline { display: flex; gap: 1rem; }
.form-inline input { flex-grow: 1; }
.search-input { width: 100%; }
input { padding: 0.6rem; border-radius: 6px; border: 1px solid #DFE0EB; }
button { padding: 0.6rem 1.5rem; border: none; background-color: #3751FF; color: white; border-radius: 8px; cursor: pointer; }
button:disabled { background-color: #9FA2B4; }
.lista-alumnos { list-style: none; padding: 0; margin-top: 1rem; max-height: 200px; overflow-y: auto; }
.lista-alumnos li { 
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem; 
    border-bottom: 1px solid #eee;
}
table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
th, td { border-bottom: 1px solid #ddd; padding: 12px; text-align: left; }
.btn-ver { background-color: #17a2b8; color: white; padding: 5px 10px; border-radius: 4px; text-decoration: none; border: none; cursor: pointer; }
</style>