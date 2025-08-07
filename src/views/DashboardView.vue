<template>
  <div class="dashboard-view">
    <div class="header">
      <h1>Panel de Control</h1>
      <div class="date-picker-container">
        <label for="report-date">Mostrando datos para:</label>
        <input type="date" id="report-date" v-model="fechaSeleccionada" />
      </div>
    </div>

    <div class="quick-access-cards">
      </div>

    <div class="report-container">
      <div class="income-table">
        <div class="report-header">
          <h3>Ingresos por forma de pago</h3>
          <span>{{ fechaFormateada }}</span>
        </div>
        <table>
          <tbody>
            <tr v-for="ingreso in ingresosDiarios" :key="ingreso.forma_pago">
              <td>{{ ingreso.forma_pago }}</td>
              <td><strong>${{ parseFloat(ingreso.total).toFixed(2) }}</strong></td>
            </tr>
            <tr class="total-row">
              <td><strong>Total</strong></td>
              <td><strong>${{ totalIngresosDiarios.toFixed(2) }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="income-chart">
        <Pie v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
        <p v-else>No hay datos de ingresos para la fecha seleccionada.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import apiClient from '../services/api.js';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

// Es necesario registrar los componentes de Chart.js que vamos a usar
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const ingresosDiarios = ref([]);

// Lógica para el selector de fecha
const fechaSeleccionada = ref(new Date().toISOString().split('T')[0]); // Fecha de hoy en formato YYYY-MM-DD

// Función para buscar los ingresos de una fecha específica
const fetchIngresos = async (fecha) => {
  try {
    const response = await apiClient.get('/reportes/ingresos-diarios', {
      params: {
        fecha: fecha, // Enviamos la fecha a la API
      },
    });
    ingresosDiarios.value = response.data;
  } catch (error) {
    console.error(`Error al obtener los ingresos para la fecha ${fecha}:`, error);
    ingresosDiarios.value = []; // Limpiamos los datos si hay un error
  }
};

// 'watch' observa la variable fechaSeleccionada y ejecuta la función cada vez que cambia
watch(fechaSeleccionada, (nuevaFecha) => {
  fetchIngresos(nuevaFecha);
});

// onMounted ahora llama a la función con la fecha inicial
onMounted(() => {
  fetchIngresos(fechaSeleccionada.value);
});

// Propiedad computada para mostrar la fecha en formato legible
const fechaFormateada = computed(() => {
  const date = new Date(fechaSeleccionada.value);
  // Ajustamos la zona horaria para evitar que se muestre el día anterior
  const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return utcDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Propiedad computada para calcular el total
const totalIngresosDiarios = computed(() => {
  return ingresosDiarios.value.reduce((sum, ingreso) => sum + parseFloat(ingreso.total), 0);
});

// Propiedad computada para darle formato a los datos para la gráfica
const chartData = computed(() => ({
  labels: ingresosDiarios.value.map(i => i.forma_pago),
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'], // Puedes añadir más colores
      data: ingresosDiarios.value.map(i => parseFloat(i.total)),
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<style scoped>
.dashboard-view { max-width: 1200px; }
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.header h1 {
  font-size: 1.8rem;
  color: #252733;
  font-weight: bold;
}
.date-picker-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.date-picker-container label {
  color: #9FA2B4;
  font-size: 0.9rem;
}
.date-picker-container input[type="date"] {
  border: 1px solid #DFE0EB;
  border-radius: 8px;
  padding: 0.5rem;
  background-color: #fff;
}
.report-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  background-color: #FFFFFF;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #DFE0EB;
}
.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.report-header h3 {
  font-weight: bold;
  color: #252733;
}
.report-header span {
  color: #9FA2B4;
}
.income-table table {
  width: 100%;
  border-collapse: collapse;
}
.income-table td {
  padding: 1rem;
  border-bottom: 1px solid #DFE0EB;
}
.income-table tr:last-child td {
  border-bottom: none;
}
.income-table .total-row td {
  font-size: 1.1rem;
}
.income-chart {
  position: relative;
  height: 300px;
}
</style>