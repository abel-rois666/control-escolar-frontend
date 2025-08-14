<template>
  <div class="historial-recibos-view">
    <SpinnerLoader v-if="cargando" />
    <div v-if="!cargando && alumno">
        <div class="header">
            <div>
                <h1>Historial de Recibos</h1>
                <h2>{{ alumno.nombre_completo }}</h2>
            </div>
            <RouterLink :to="`/alumnos/${alumno.id}`" class="btn-secondary">← Volver a la Ficha</RouterLink>
        </div>

        <div class="card">
            <table v-if="recibos.length > 0">
                <thead>
                    <tr>
                        <th>Folio</th>
                        <th>Fecha de Pago</th>
                        <th>Monto Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="recibo in recibos" :key="recibo.id">
                        <td>{{ recibo.folio }}</td>
                        <td>{{ formatDate(recibo.fecha_pago) }}</td>
                        <td><strong>${{ parseFloat(recibo.monto_total_recibido).toFixed(2) }}</strong></td>
                        <td>
                            <RouterLink :to="`/recibos/${recibo.id}`" class="btn-ver">Ver Recibo</RouterLink>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-else>Este alumno no tiene recibos registrados.</p>
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
const cargando = ref(true);
const alumno = ref(null);
const recibos = ref([]);

onMounted(async () => {
    const alumnoId = route.params.id;
    try {
        const [alumnoRes, recibosRes] = await Promise.all([
            apiClient.get(`/alumnos/${alumnoId}`),
            apiClient.get(`/consultas/recibos/alumnos/${alumnoId}`)
        ]);
        alumno.value = alumnoRes.data;
        recibos.value = recibosRes.data;
    } catch (error) {
        toast.error("Error al cargar el historial de recibos.");
    } finally {
        cargando.value = false;
    }
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
};
</script>

<style scoped>
.historial-recibos-view { max-width: 900px; margin: auto; }
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}
.header h1, .header h2 { margin: 0; }
.card {
    background-color: #fff;
    border: 1px solid #DFE0EB;
    border-radius: 8px;
    padding: 1.5rem;
}
table {
    width: 100%;
    border-collapse: collapse;
}
th, td {
    border-bottom: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}
th {
    background-color: #f8f9fa;
}
.btn-secondary {
    background-color: #6c757d;
    color: white;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    text-decoration: none;
}
.btn-ver {
    background-color: #17a2b8;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    text-decoration: none;
}
</style>