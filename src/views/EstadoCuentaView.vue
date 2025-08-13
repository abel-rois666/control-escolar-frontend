<template>
  <div class="estado-cuenta-view">
    <div v-if="!cargando && alumno">
      <div class="header">
        <div>
          <h1>Estado de Cuenta</h1>
          <h2>{{ alumno.nombre_completo }}</h2>
          <p>Matrícula: {{ alumno.matricula }}</p>
        </div>
        <div class="header-actions">
            <RouterLink :to="`/alumnos/${alumno.id}`" class="btn-secondary">← Volver a la Ficha</RouterLink>
            <button @click="imprimirEstadoDeCuenta" class="btn-primary">Imprimir</button>
        </div>
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
            <td>{{ transaccion.tipo === 'cargo' ? '$' + parseFloat(transaccion.monto).toFixed(2) : '' }}</td>
            <td>{{ transaccion.tipo === 'pago' ? '$' + parseFloat(transaccion.monto).toFixed(2) : '' }}</td>
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
import { useRoute, RouterLink } from 'vue-router'; // <-- RouterLink importado
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const route = useRoute();
const alumno = ref(null);
const historial = ref([]);
const cargando = ref(true);

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

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
    });
};

const imprimirEstadoDeCuenta = () => {
  window.print();
};

</script>

<style scoped>
.estado-cuenta-view { max-width: 800px; margin: auto; background: #fff; padding: 2rem; }
.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
.header-actions { display: flex; gap: 1rem; align-items: center; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 8px; }
th { background-color: #f2f2f2; }
tfoot { font-weight: bold; background-color: #f2f2f2; }
.btn-primary, .btn-secondary {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;
    display: inline-block;
}
.btn-primary { background-color: #3751FF; color: white; }
.btn-secondary { background-color: #6c757d; color: white; }

@media print {
  body * { visibility: hidden; }
  .estado-cuenta-view, .estado-cuenta-view * { visibility: visible; }
  .estado-cuenta-view { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; border: none;}
  .header-actions { display: none; }
}
</style>