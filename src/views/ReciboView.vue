<template>
  <div class="recibo-view">
    <SpinnerLoader v-if="cargando" />
    <div v-if="!cargando && recibo" class="recibo-container">
      <div class="header">
        <div class="header-info">
          <h1>Recibo de Pago</h1>
          <p><strong>Folio:</strong> {{ recibo.folio }}</p>
          <p><strong>Fecha de Pago:</strong> {{ formatDate(recibo.fecha_pago) }}</p>
        </div>
        <div class="header-logo">
          <img src="@/assets/06-Logo_CUOM_v3_ConFondoAmpliado.jpg" alt="Logo CUOM" />
        </div>
      </div>

      <div class="card alumno-info">
        <h3>Información del Alumno</h3>
        <p><strong>Nombre:</strong> {{ alumno.nombre_completo }}</p>
        <p><strong>Matrícula:</strong> {{ alumno.matricula }}</p>
      </div>

      <div class="card pago-detalles">
        <h3>Detalles del Pago</h3>
        <p><strong>Monto Total Recibido:</strong> <span class="monto-total">${{ parseFloat(recibo.monto_total_recibido).toFixed(2) }}</span></p>
        <p><strong>Forma de Pago:</strong> {{ recibo.forma_pago }}</p>
        <p v-if="recibo.banco"><strong>Banco:</strong> {{ recibo.banco }}</p>
      </div>

      <div class="card conceptos-pagados">
        <h3>Conceptos Cubiertos</h3>
        <table>
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Monto Aplicado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detalle, index) in recibo.detalles" :key="index">
              <td>{{ detalle.nombre_concepto }}</td>
              <td><strong>${{ parseFloat(detalle.monto_aplicado).toFixed(2) }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="footer-actions">
        <button @click="imprimirRecibo" class="btn-primary">Imprimir Recibo</button>
        <RouterLink :to="`/alumnos/${recibo.alumno_id}`" class="btn-secondary">Volver a la Ficha del Alumno</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const route = useRoute();
const toast = useToast();
const recibo = ref(null);
const alumno = ref(null);
const cargando = ref(true);

onMounted(async () => {
  const reciboId = route.params.id;
  try {
    const reciboRes = await apiClient.get(`/recibos/${reciboId}`);
    recibo.value = reciboRes.data;

    if (recibo.value) {
      const alumnoRes = await apiClient.get(`/alumnos/${recibo.value.alumno_id}`);
      alumno.value = alumnoRes.data;
    }
  } catch (error) {
    toast.error("Error al cargar la información del recibo.");
  } finally {
    cargando.value = false;
  }
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  });
};

const imprimirRecibo = () => {
  window.print();
};
</script>

<style scoped>
.recibo-view { max-width: 800px; margin: auto; background: #fff; padding: 2rem; border-radius: 8px; }
.recibo-container { border: 1px solid #ccc; padding: 1.5rem; }
.header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #192A4E; padding-bottom: 1rem; margin-bottom: 1.5rem; }
.header-logo img { max-width: 120px; }
h1 { color: #192A4E; margin: 0 0 0.5rem 0; }
.card { border: 1px solid #eee; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; }
.monto-total { font-size: 1.2rem; font-weight: bold; color: #29CC97; }
table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
th, td { border-bottom: 1px solid #ddd; padding: 8px; text-align: left; }
th { background-color: #f2f2f2; }
.footer-actions { margin-top: 2rem; display: flex; justify-content: center; gap: 1rem; }
.btn-primary { background-color: #3751FF; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: bold; border: none; cursor: pointer; }
.btn-secondary { background-color: #6c757d; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; }

@media print {
  body * { visibility: hidden; }
  .recibo-view, .recibo-view * { visibility: visible; }
  .recibo-view { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; }
  .footer-actions { display: none; }
}
</style>