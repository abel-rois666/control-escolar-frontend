<template>
  <div class="dashboard-view">
    <div class="header">
      <h1>Panel de Control</h1>
      <div class="date-picker-container">
        <label for="report-date">Mostrando datos para:</label>
        <button @click="cambiarDia(-1)" class="date-nav-btn">←</button>
        <input type="date" id="report-date" v-model="fechaSeleccionada" />
        <button @click="cambiarDia(1)" class="date-nav-btn">→</button>
      </div>
    </div>

    <div class="quick-access-cards">
      <RouterLink to="/alumnos" class="card">
        <div class="card-icon alumnos-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <h3>Alumnos</h3>
      </RouterLink>
      <RouterLink to="/recibir-pagos" class="card">
        <div class="card-icon pagos-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <h3>Recibir Pagos</h3>
      </RouterLink>
      <RouterLink to="/reportes" class="card">
        <div class="card-icon reportes-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
        </div>
        <h3>Reportes</h3>
      </RouterLink>
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

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const ingresosDiarios = ref([]);
const fechaSeleccionada = ref(new Date().toISOString().split('T')[0]);

const fetchIngresos = async (fecha) => {
  try {
    const response = await apiClient.get('/reportes/ingresos-diarios', {
      params: { fecha: fecha },
    });
    ingresosDiarios.value = response.data;
  } catch (error) {
    console.error(`Error al obtener los ingresos para la fecha ${fecha}:`, error);
    ingresosDiarios.value = [];
  }
};

watch(fechaSeleccionada, (nuevaFecha) => {
  fetchIngresos(nuevaFecha);
});

onMounted(() => {
  fetchIngresos(fechaSeleccionada.value);
});

// --- NUEVA FUNCIÓN ---
const cambiarDia = (dias) => {
  const fechaActual = new Date(fechaSeleccionada.value);
  fechaActual.setUTCDate(fechaActual.getUTCDate() + dias);
  fechaSeleccionada.value = fechaActual.toISOString().split('T')[0];
};

const fechaFormateada = computed(() => {
  const date = new Date(fechaSeleccionada.value);
  const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return utcDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const totalIngresosDiarios = computed(() => {
  return ingresosDiarios.value.reduce((sum, ingreso) => sum + parseFloat(ingreso.total), 0);
});

const chartData = computed(() => ({
  labels: ingresosDiarios.value.map(i => i.forma_pago),
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
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
.quick-access-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}
.card {
  background-color: #fff;
  border: 1px solid #DFE0EB;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  text-decoration: none;
  color: #252733;
  transition: all 0.2s ease-in-out;
}
.card:hover {
  border-color: #3751FF;
  color: #3751FF;
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.card h3 {
  margin-top: 1rem;
  font-weight: bold;
}
.card-icon {
  margin: 0 auto;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card-icon svg {
  width: 24px;
  height: 24px;
  stroke: #fff;
}
.alumnos-icon { background-color: #ff9f43; }
.pagos-icon { background-color: #28a745; }
.reportes-icon { background-color: #007bff; }
.date-nav-btn {
  background: #fff;
  border: 1px solid #DFE0EB;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.date-nav-btn:hover {
  background-color: #f2f2f2;
}
</style>