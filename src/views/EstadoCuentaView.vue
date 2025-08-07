<template>
  <div class="estado-cuenta-view">
    <div v-if="!cargando && alumno">
      <div class="header">
        <div>
          <h1>Estado de Cuenta</h1>
          <h2>{{ alumno.nombre_completo }}</h2>
          <p>Matrícula: {{ alumno.matricula }}</p>
        </div>
            <button @click="imprimirEstadoDeCuenta">Imprimir</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Cargo</th>
            <th>Abono</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaccion, index) in historialConSaldo" :key="index">
            <td>{{ formatDate(transaccion.fecha) }}</td>
            <td>{{ transaccion.descripcion }}</td>
            <td>{{ transaccion.tipo === 'cargo' ? '$' + transaccion.monto : '' }}</td>
            <td>{{ transaccion.tipo === 'pago' ? '$' + transaccion.monto : '' }}</td>
            <td><strong>${{ transaccion.saldo }}</strong></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4">Saldo Final</td>
            <td><strong>${{ saldoFinal }}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <SpinnerLoader v-else />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const route = useRoute();
const alumno = ref(null);
const historial = ref([]);
const cargando = ref(true);

// Calcula el historial añadiendo un saldo corriente
const historialConSaldo = computed(() => {
  let saldoAcumulado = 0;
  return historial.value.map(t => {
    if (t.tipo === 'cargo') {
      saldoAcumulado += parseFloat(t.monto);
    } else if (t.tipo === 'pago') {
      saldoAcumulado -= parseFloat(t.monto);
    }
    return { ...t, saldo: saldoAcumulado.toFixed(2) };
  });
});

const saldoFinal = computed(() => {
    const ultimoItem = historialConSaldo.value[historialConSaldo.value.length - 1];
    return ultimoItem ? ultimoItem.saldo : '0.00';
});

onMounted(async () => {
  const alumnoId = route.params.id;
  try {
    const [alumnoRes, historialRes] = await Promise.all([
      apiClient.get(`/alumnos/${alumnoId}`),
      apiClient.get(`/alumnos/${alumnoId}/estado-de-cuenta`),
    ]);
    alumno.value = alumnoRes.data;
    historial.value = historialRes.data;
  } catch (error) {
    console.error("Error al generar el estado de cuenta:", error);
  } finally {
    cargando.value = false;
  }
});

const formatDate = (dateString) => { /* ... (función de formateo de fecha) ... */ };

const imprimirEstadoDeCuenta = () => {
  window.print();
};

</script>



<style scoped>
/* Estilos para que se vea bien y sea imprimible */
.estado-cuenta-view { max-width: 800px; margin: auto; background: #fff; padding: 2rem; }
.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 8px; }
th { background-color: #f2f2f2; }
tfoot { font-weight: bold; background-color: #f2f2f2; }
@media print {
  body * { visibility: hidden; }
  .estado-cuenta-view, .estado-cuenta-view * { visibility: visible; }
  .estado-cuenta-view { position: absolute; left: 0; top: 0; width: 100%; }
  button { display: none; }
}
</style>