<template>
  <div class="reportes-view">
    <h1>Reporte de Adeudos</h1>
    <p>Selecciona un rango de fechas para ver los cargos con saldo pendiente y fecha de vencimiento dentro de ese periodo.</p>

    <div class="card filter-container">
      <div class="form-group">
        <label for="fechaInicio">Fecha de Inicio:</label>
        <input type="date" id="fechaInicio" v-model="fechas.fechaInicio" />
      </div>
      <div class="form-group">
        <label for="fechaFin">Fecha de Fin:</label>
        <input type="date" id="fechaFin" v-model="fechas.fechaFin" />
      </div>
      <button @click="generarReporte" :disabled="cargando">
        {{ cargando ? 'Generando...' : 'Generar Reporte' }}
      </button>
    </div>

    <div class="results-container card">
      <SpinnerLoader v-if="cargando" />
      
      <div v-if="!cargando && reporte.detalles.length > 0">
        <div class="summary">
          <h3>Total de Adeudo en el Periodo: <strong>${{ reporte.totalAdeudo }}</strong></h3>
        </div>
        <table>
          <thead>
            <tr>
              <th @click="sortByColumn('nombre_completo')">
                Alumno <span v-if="sort.by === 'nombre_completo'">{{ sort.order === 'ASC' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortByColumn('grupo')">
                Grupo <span v-if="sort.by === 'grupo'">{{ sort.order === 'ASC' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortByColumn('turno')">
                Turno <span v-if="sort.by === 'turno'">{{ sort.order === 'ASC' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortByColumn('nombre_concepto')">
                Concepto <span v-if="sort.by === 'nombre_concepto'">{{ sort.order === 'ASC' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortByColumn('fecha_vencimiento')">
                Vencimiento <span v-if="sort.by === 'fecha_vencimiento'">{{ sort.order === 'ASC' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortByColumn('saldo_pendiente')">
                Saldo <span v-if="sort.by === 'saldo_pendiente'">{{ sort.order === 'ASC' ? '▲' : '▼' }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detalle, index) in reporte.detalles" :key="index">
              <td>{{ detalle.nombre_completo }}</td>
              <td>{{ detalle.grupo }}</td>
              <td>{{ detalle.turno }}</td>
              <td>{{ detalle.nombre_concepto }}</td>
              <td>{{ formatDate(detalle.fecha_vencimiento) }}</td>
              <td><strong>${{ detalle.saldo_pendiente }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p v-if="!cargando && busquedaRealizada && reporte.detalles.length === 0" class="no-results-message">
        No se encontraron adeudos para el rango de fechas seleccionado.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const toast = useToast();
const fechas = ref({
  fechaInicio: new Date().toISOString().split('T')[0],
  fechaFin: new Date().toISOString().split('T')[0],
});
const reporte = ref({
  detalles: [],
  totalAdeudo: 0,
});
const cargando = ref(false);
const busquedaRealizada = ref(false);

const sort = ref({
  by: 'nombre_completo',
  order: 'ASC',
});

const sortByColumn = (columnName) => {
  if (sort.value.by === columnName) {
    sort.value.order = sort.value.order === 'ASC' ? 'DESC' : 'ASC';
  } else {
    sort.value.by = columnName;
    sort.value.order = 'ASC';
  }
  if (busquedaRealizada.value) {
    generarReporte();
  }
};

const generarReporte = async () => {
  if (!fechas.value.fechaInicio || !fechas.value.fechaFin) {
    toast.warning('Por favor, selecciona ambas fechas.');
    return;
  }
  cargando.value = true;
  busquedaRealizada.value = true;
  try {
    const response = await apiClient.get('/reportes/adeudos', {
      params: {
        fechaInicio: fechas.value.fechaInicio,
        fechaFin: fechas.value.fechaFin,
        sortBy: sort.value.by,
        sortOrder: sort.value.order,
      },
    });
    reporte.value = response.data;
  } catch (error) {
    toast.error('Ocurrió un error al generar el reporte.');
    reporte.value = { detalles: [], totalAdeudo: 0 };
  } finally {
    cargando.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};
</script>

<style scoped>
.reportes-view { max-width: 1000px; margin: 0 auto; }
h1 { color: #252733; margin-bottom: 1rem; }
p { color: #5e606b; margin-bottom: 2rem; }
.card { background-color: #fff; border: 1px solid #DFE0EB; border-radius: 8px; padding: 1.5rem; }
.filter-container { display: flex; align-items: flex-end; gap: 1rem; margin-bottom: 2rem; }
.form-group { display: flex; flex-direction: column; }
.form-group label { margin-bottom: 0.5rem; font-size: 0.9rem; }
.form-group input { padding: 0.5rem; border-radius: 6px; border: 1px solid #DFE0EB; }
button { padding: 0.6rem 1.5rem; border: none; background-color: #3751FF; color: white; border-radius: 8px; cursor: pointer; }
button:disabled { background-color: #9FA2B4; cursor: not-allowed; }
.results-container { min-height: 200px; position: relative; }
.summary { margin-bottom: 1.5rem; text-align: right; }
.summary h3 { font-size: 1.2rem; }
table { width: 100%; border-collapse: collapse; }
th, td { border-bottom: 1px solid #DFE0EB; padding: 12px; text-align: left; }
th { color: #9FA2B4; font-size: 0.9rem; cursor: pointer; user-select: none; }
th:hover { color: #3751FF; }
tr:last-child td { border-bottom: none; }
.no-results-message { text-align: center; padding-top: 2rem; color: #5e606b; }
</style>