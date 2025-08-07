<template>
  <div class="reportes-view">
    <h1>Reporte de Adeudos</h1>
    <p>Selecciona un rango de fechas para ver los cargos con saldo pendiente.</p>

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

    <div v-if="reporte.detalles.length > 0" class="results-container">
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
    
    <p v-else-if="busquedaRealizada && !cargando">
      No se encontraron adeudos para el rango de fechas seleccionado.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from '../services/api.js';

// Variables reactivas para el formulario y los resultados
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

// Lógica de Ordenamiento
const sort = ref({
  by: 'nombre_completo', // Columna por defecto
  order: 'ASC', // Orden por defecto
});

// Se llama al hacer clic en un encabezado de tabla
const sortByColumn = (columnName) => {
  if (sort.value.by === columnName) {
    // Si ya se está ordenando por esta columna, invertimos el orden
    sort.value.order = sort.value.order === 'ASC' ? 'DESC' : 'ASC';
  } else {
    // Si es una nueva columna, la establecemos y reiniciamos el orden a ASC
    sort.value.by = columnName;
    sort.value.order = 'ASC';
  }
  // Volvemos a generar el reporte con la nueva configuración de ordenamiento
  generarReporte();
};

// Función para generar el reporte
const generarReporte = async () => {
  if (!fechas.value.fechaInicio || !fechas.value.fechaFin) {
    alert('Por favor, selecciona ambas fechas.');
    return;
  }
  cargando.value = true;
  busquedaRealizada.value = true;
  try {
    const response = await apiClient.get('/reportes/adeudos', {
      params: {
        fechaInicio: fechas.value.fechaInicio,
        fechaFin: fechas.value.fechaFin,
        sortBy: sort.value.by,       // Enviamos los parámetros
        sortOrder: sort.value.order, // de ordenamiento a la API
      },
    });
    reporte.value = response.data;
  } catch (error) {
    console.error('Error al generar el reporte de adeudos:', error);
    alert('Ocurrió un error al generar el reporte.');
  } finally {
    cargando.value = false;
  }
};

// Función de utilidad para formatear la fecha
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC' // Importante para evitar problemas de zona horaria
    });
};
</script>

<style scoped>
.reportes-view { max-width: 1000px; margin: 0 auto; }
.card { background-color: #fff; border: 1px solid #DFE0EB; border-radius: 8px; padding: 1.5rem; }
.filter-container { display: flex; align-items: flex-end; gap: 1rem; margin-bottom: 2rem; }
.form-group { display: flex; flex-direction: column; }
.form-group label { margin-bottom: 0.5rem; font-size: 0.9rem; }
.results-container { margin-top: 2rem; }
.summary { margin-bottom: 1rem; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
th { 
  background-color: #f2f2f2;
  cursor: pointer;
  user-select: none;
}
th:hover {
  background-color: #e0e0e0;
}
</style>