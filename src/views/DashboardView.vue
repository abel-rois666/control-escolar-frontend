<template>
  <div class="dashboard-view">
    <div class="header">
      <h1>Panel de Control</h1>
      <span>Centro Universitario Oriente de México</span>
    </div>

    <div class="quick-access-cards">
      </div>

    <div class="report-container">
      <div class="income-table">
        <div class="report-header">
        <h3>Ingresos diarios por forma de pago</h3>
        <span>{{ fechaDeHoy }}</span>
        </div>
        <table>
          <tbody>
            <tr v-for="ingreso in ingresosDiarios" :key="ingreso.forma_pago">
              <td>{{ ingreso.forma_pago }}</td>
              <td><strong>${{ parseFloat(ingreso.total).toFixed(2) }}</strong></td>
            </tr>
            <tr class="total-row">
              <td><strong>Total del día</strong></td>
              <td><strong>${{ totalIngresosDiarios.toFixed(2) }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="income-chart">
        <Pie v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
        <p v-else>No hay datos de ingresos para mostrar en la gráfica.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import apiClient from '../services/api.js';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

// Es necesario registrar los componentes de Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const ingresosDiarios = ref([]);

// Propiedad computada para calcular el total
const totalIngresosDiarios = computed(() => {
  return ingresosDiarios.value.reduce((sum, ingreso) => sum + parseFloat(ingreso.total), 0);
});

// Propiedad computada para darle formato a los datos para la gráfica
const chartData = computed(() => ({
  labels: ingresosDiarios.value.map(i => i.forma_pago),
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF'], // Puedes añadir más colores
      data: ingresosDiarios.value.map(i => parseFloat(i.total)),
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

onMounted(async () => {
  try {
    const response = await apiClient.get('/reportes/ingresos-diarios');
    ingresosDiarios.value = response.data;
    const fechaDeHoy = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});
  } catch (error) {
    console.error('Error al obtener los ingresos diarios:', error);
  }
});
</script>

<style scoped>
.dashboard-view { max-width: 1200px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.header h1 { font-size: 1.8rem; color: #252733; font-weight: bold; }

.report-container {
  display: grid;
  grid-template-columns: 2fr 1fr; /* Le damos más espacio a la tabla */
  gap: 2rem;
  background-color: #FFFFFF; /* Fondo blanco */
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #DFE0EB; /* Borde suave */
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.report-header h3 { font-weight: bold; color: #252733; }
.report-header span { color: #9FA2B4; }

.income-table table { width: 100%; border-collapse: collapse; }
.income-table td { padding: 1rem; border-bottom: 1px solid #DFE0EB; }
.income-table tr:last-child td { border-bottom: none; }
.income-table .total-row td { font-size: 1.1rem; }

.income-chart { position: relative; height: 300px; }
</style>