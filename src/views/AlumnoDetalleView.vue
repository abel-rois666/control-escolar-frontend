<template>
  <SpinnerLoader v-if="cargando" />

  <div class="alumno-detalle-view" v-if="!cargando && alumno">
    <div class="header-detalle">
      <div>
        <h1>Ficha del Alumno</h1>
        <h2>{{ alumno.nombre_completo }}</h2>
      </div>
      <div class="header-actions">
          <RouterLink :to="`/alumnos/${alumno.id}/generar-cargos`" class="btn-primary">
            Generar Cargos del Ciclo
          </RouterLink>
          <RouterLink :to="`/alumnos/${alumno.id}/recibir-pago`" class="btn-success">
            Recibir Pago
          </RouterLink>
          <RouterLink :to="`/alumnos/${alumno.id}/estado-de-cuenta`" class="btn-secondary">
            Estado de Cuenta
          </RouterLink>
      </div>
    </div>
    
    <div class="card info-grid">
      <p><strong>Matrícula:</strong> {{ alumno.matricula }}</p>
      <p><strong>Carrera:</strong> {{ alumno.carrera }}</p>
      <p><strong>Estatus:</strong> <span :class="`estatus-${alumno.estatus.toLowerCase()}`">{{ alumno.estatus }}</span></p>
      <p><strong>Grado:</strong> {{ alumno.grado || 'N/A' }}</p>
      <p><strong>Grupo:</strong> {{ alumno.grupo || 'N/A' }}</p>
      <p><strong>Turno:</strong> {{ alumno.turno || 'N/A' }}</p>
    </div>

    <hr />

    <div class="card filtro-ciclo">
      <label for="ciclo-escolar">Mostrando información para el ciclo:</label>
      <select id="ciclo-escolar" v-model="cicloSeleccionadoId">
        <option v-for="ciclo in ciclos" :key="ciclo.id" :value="ciclo.id">
          {{ ciclo.codigo }} - {{ ciclo.descripcion }}
        </option>
      </select>
    </div>

    <div class="card">
        <div class="totales-ciclo">
            <div>Total Adeudo del Ciclo: <span class="adeudo">${{ totalAdeudoCiclo.toFixed(2) }}</span></div>
            <div>Total Pagado en el Ciclo: <span class="pagado">${{ totalPagadoCiclo.toFixed(2) }}</span></div>
        </div>
        <h3>Cargos Asociados al Ciclo</h3>
        <table v-if="cargos.length > 0">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Monto Final</th>
              <th>Saldo Pendiente</th>
              <th>Estatus</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cargo in cargos" :key="cargo.id" :class="{ 'fila-pagado': cargo.saldo_pendiente <= 0 }">
              <td>{{ cargo.nombre_concepto }}</td>
              <td><strong>${{ parseFloat(cargo.monto_final).toFixed(2) }}</strong></td>
              <td><strong>${{ parseFloat(cargo.saldo_pendiente).toFixed(2) }}</strong></td>
              <td><span :class="`estatus-${cargo.saldo_pendiente <= 0 ? 'pagado' : 'pendiente'}`">{{ parseFloat(cargo.saldo_pendiente) <= 0 ? 'Pagado' : 'Pendiente' }}</span></td>
            </tr>
          </tbody>
        </table>
        <p v-else>Este alumno no tiene cargos registrados para este ciclo.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const toast = useToast();
const route = useRoute();
const alumno = ref(null);
const cargos = ref([]);
const ciclos = ref([]);
const cicloSeleccionadoId = ref(null);
const cargando = ref(true);

const totalAdeudoCiclo = computed(() => {
    return cargos.value.reduce((sum, cargo) => sum + parseFloat(cargo.saldo_pendiente), 0);
});

const totalPagadoCiclo = computed(() => {
    const totalCargado = cargos.value.reduce((sum, cargo) => sum + parseFloat(cargo.monto_final), 0);
    return totalCargado - totalAdeudoCiclo.value;
});

const fetchCargosPorCiclo = async (alumnoId, cicloId) => {
  if (!alumnoId || !cicloId) {
    cargos.value = [];
    return;
  }
  try {
    const response = await apiClient.get(`/alumnos/${alumnoId}/cargos`, {
      params: { cicloId }
    });
    cargos.value = response.data;
  } catch (error) {
    toast.error("Error al cargar los cargos del ciclo.");
  }
};

watch(cicloSeleccionadoId, (newCicloId) => {
  if (newCicloId) {
    fetchCargosPorCiclo(route.params.id, newCicloId);
  }
});

onMounted(async () => {
  cargando.value = true;
  const alumnoId = route.params.id;
  try {
    const [alumnoRes, ciclosRes] = await Promise.all([
      apiClient.get(`/alumnos/${alumnoId}`),
      apiClient.get('/ciclos-escolares')
    ]);

    alumno.value = alumnoRes.data;
    ciclos.value = ciclosRes.data;

    if (ciclos.value.length > 0) {
      const hoy = new Date();
      const cicloActual = ciclos.value.find(c => hoy >= new Date(c.fecha_inicio) && hoy <= new Date(c.fecha_fin));
      cicloSeleccionadoId.value = cicloActual ? cicloActual.id : ciclos.value[0].id;
    }
  } catch (error) {
    toast.error("Error al cargar la información de la página.");
  } finally {
    cargando.value = false;
  }
});
</script>

<style scoped>
.alumno-detalle-view { max-width: 900px; margin: 0 auto; }
.header-detalle { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.header-detalle h1, .header-detalle h2 { margin: 0; }
.header-actions { display: flex; gap: 1rem; }
.btn-primary, .btn-success, .btn-secondary { background-color: #3751FF; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: bold; white-space: nowrap; }
.btn-success { background-color: #28a745; }
.btn-secondary { background-color: #6c757d; }
.card { background-color: #fff; border: 1px solid #DFE0EB; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; }
.info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
th, td { border-bottom: 1px solid #ddd; padding: 12px; text-align: left; }
th { background-color: #f2f2f2; }
tr.fila-pagado { background-color: #e6ffed; }
hr { margin: 2rem 0; border: none; border-top: 1px solid #DFE0EB;}
.filtro-ciclo { margin-bottom: 2rem; background-color: #eef2f5; padding: 1rem; border-radius: 8px; display: flex; align-items: center; gap: 1rem; }
.filtro-ciclo label { font-weight: bold; }
.filtro-ciclo select { padding: 0.5rem; border-radius: 6px; border: 1px solid #DFE0EB; }
.estatus-activo, .estatus-pagado { color: #28a745; font-weight: bold; }
.estatus-baja, .estatus-pendiente { color: #dc3545; font-weight: bold; }
.estatus-egresado { color: #007bff; font-weight: bold; }
.totales-ciclo { display: flex; justify-content: space-between; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #eee; font-size: 1.1rem; }
.totales-ciclo .adeudo { color: #dc3545; font-weight: bold; }
.totales-ciclo .pagado { color: #28a745; font-weight: bold; }
</style>