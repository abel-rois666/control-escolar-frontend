<template>
  <SpinnerLoader v-if="cargando" />

  <div class="alumno-detalle-view" v-if="!cargando && alumno">
    <div class="header-detalle">
      <div>
        <h1>Ficha del Alumno</h1>
        <h2>{{ alumno.nombre_completo }}</h2>
      </div>
      <RouterLink :to="`/alumnos/${alumno.id}/estado-de-cuenta`" class="btn-primary">
        Generar Estado de Cuenta
      </RouterLink>
    </div>
    <p><strong>Matrícula:</strong> {{ alumno.matricula }}</p>
    <p><strong>Carrera:</strong> {{ alumno.carrera }}</p>
    <p><strong>Estatus:</strong> {{ alumno.estatus }}</p>

    <hr />

    <div class="card filtro-ciclo">
      <label for="ciclo-escolar">Mostrando información para el ciclo:</label>
      <select id="ciclo-escolar" v-model="cicloSeleccionadoId">
        <option v-for="ciclo in ciclos" :key="ciclo.id" :value="ciclo.id">
          {{ ciclo.codigo }} - {{ ciclo.descripcion }}
        </option>
      </select>
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
        <tr v-for="cargo in cargos" :key="cargo.id" :class="{ 'pagado': cargo.saldo_pendiente <= 0 }">
          <td>{{ cargo.nombre_concepto }}</td>
          <td><strong>${{ parseFloat(cargo.monto_final).toFixed(2) }}</strong></td>
          <td><strong>${{ parseFloat(cargo.saldo_pendiente).toFixed(2) }}</strong></td>
          <td>{{ parseFloat(cargo.saldo_pendiente) <= 0 ? 'Pagado' : cargo.estatus }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Este alumno no tiene cargos registrados para este ciclo.</p>

    <hr />

    <div class="card">
      <h3>Crear Nuevo Cargo (Fuera del Plan)</h3>
      <form @submit.prevent="crearNuevoCargo" class="form-grid">
        <div class="form-group">
          <label for="concepto">Concepto a cobrar:</label>
          <select id="concepto" v-model="nuevoCargo.concepto_id" required>
            <option disabled value="">Selecciona un concepto</option>
            <option v-for="c in todosLosConceptos" :key="c.id" :value="c.id">
              {{ c.nombre_concepto }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="fecha-vencimiento">Fecha de Vencimiento:</label>
          <input id="fecha-vencimiento" type="date" v-model="nuevoCargo.fecha_vencimiento" />
        </div>
        <button type="submit">Generar Cargo</button>
      </form>
    </div>

    <div class="card">
      <h3>Registrar Pago</h3>
      <form @submit.prevent="registrarPago" class="form-grid-pago">
        <div class="form-group">
          <label>Folio del Recibo:</label>
          <input v-model="nuevoRecibo.folio" placeholder="Ej: REC-002" required />
        </div>
        <div class="form-group">
          <label>Monto Total Recibido:</label>
          <input type="number" step="0.01" v-model.number="nuevoRecibo.monto_total_recibido" required />
        </div>
        <div class="form-group">
          <label>Fecha del Pago:</label>
          <input type="date" v-model="nuevoRecibo.fecha_pago" required />
        </div>
        <div class="form-group">
          <label>Forma de Pago:</label>
          <input v-model="nuevoRecibo.forma_pago" placeholder="Efectivo, Transferencia..." />
        </div>
        <h4 class="full-width">Aplicar pago a los siguientes cargos del ciclo actual:</h4>
        <div v-for="cargo in cargosPendientes" :key="cargo.id" class="cargo-a-pagar">
           <input type="checkbox" v-model="cargosSeleccionados" :value="cargo.id" />
           <label>
             {{ cargo.nombre_concepto }} - <strong>Saldo: ${{ cargo.saldo_pendiente }}</strong>
           </label>
        </div>
        <button type="submit" class="full-width">Registrar Pago</button>
      </form>
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
const todosLosConceptos = ref([]);
const cargando = ref(true);

const nuevoCargo = ref({
  concepto_id: '',
  fecha_vencimiento: '',
});

const nuevoRecibo = ref({
  folio: '',
  alumno_id: null,
  monto_total_recibido: 0,
  fecha_pago: new Date().toISOString().split('T')[0],
  forma_pago: 'Efectivo',
  detalles: [],
});
const cargosSeleccionados = ref([]);

const cargosPendientes = computed(() => {
  return cargos.value.filter(c => parseFloat(c.saldo_pendiente) > 0);
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
    const [alumnoRes, ciclosRes, conceptosRes] = await Promise.all([
      apiClient.get(`/alumnos/${alumnoId}`),
      apiClient.get('/ciclos-escolares'),
      apiClient.get('/conceptos')
    ]);

    alumno.value = alumnoRes.data;
    ciclos.value = ciclosRes.data;
    todosLosConceptos.value = conceptosRes.data;

    if (ciclos.value.length > 0) {
      cicloSeleccionadoId.value = ciclos.value[0].id;
    }
  } catch (error) {
    toast.error("Error al cargar la información de la página.");
  } finally {
    cargando.value = false;
  }
});

const crearNuevoCargo = async () => {
  const alumnoId = route.params.id;
  try {
    await apiClient.post(`/alumnos/${alumnoId}/cargos`, nuevoCargo.value);
    await fetchCargosPorCiclo(alumnoId, cicloSeleccionadoId.value);
    toast.success("Cargo generado exitosamente.");
    nuevoCargo.value.concepto_id = '';
    nuevoCargo.value.fecha_vencimiento = '';
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Error desconocido';
    toast.error(`Error al crear el cargo: ${errorMessage}`);
  }
};

const registrarPago = async () => {
  nuevoRecibo.value.alumno_id = alumno.value.id;
  let montoRestante = nuevoRecibo.value.monto_total_recibido;
  const detalles = [];

  for (const cargoId of cargosSeleccionados.value) {
    if (montoRestante <= 0) break;
    const cargo = cargos.value.find(c => c.id === cargoId);
    if (cargo) {
        const saldo = parseFloat(cargo.saldo_pendiente);
        const montoAAplicar = Math.min(montoRestante, saldo);
        detalles.push({ cargo_id: cargoId, monto_aplicado: montoAAplicar });
        montoRestante -= montoAAplicar;
    }
  }

  if (detalles.length === 0) {
    toast.warning("Por favor, selecciona al menos un cargo para aplicar el pago.");
    return;
  }
  nuevoRecibo.value.detalles = detalles;

  try {
    await apiClient.post('/recibos', nuevoRecibo.value);
    toast.success('¡Pago registrado exitosamente!');
    await fetchCargosPorCiclo(alumno.value.id, cicloSeleccionadoId.value);
    nuevoRecibo.value.folio = '';
    nuevoRecibo.value.monto_total_recibido = 0;
    cargosSeleccionados.value = [];
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Error desconocido';
    toast.error(`Error al registrar el pago: ${errorMessage}`);
  }
};
</script>

<style scoped>
.alumno-detalle-view { max-width: 900px; margin: 0 auto; }
.header-detalle { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.header-detalle h1, .header-detalle h2 { margin: 0; }
.btn-primary { background-color: #3751FF; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: bold; white-space: nowrap; }
.card { background-color: #f9f9f9; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; align-items: end; }
.form-grid-pago { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { display: flex; flex-direction: column; }
.cargo-a-pagar { grid-column: 1 / -1; display: flex; align-items: center; gap: 0.5rem; }
.full-width { grid-column: 1 / -1; }
table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
th, td { border-bottom: 1px solid #ddd; padding: 8px; }
th { background-color: #f2f2f2; }
tr.pagado td { background-color: #e6ffed; color: #2d6a4f; }
hr { margin: 2rem 0; border: none; border-top: 1px solid #DFE0EB;}
.filtro-ciclo { margin-bottom: 2rem; background-color: #eef2f5; padding: 1rem; border-radius: 8px; display: flex; align-items: center; gap: 1rem; }
.filtro-ciclo label { font-weight: bold; }
.filtro-ciclo select { padding: 0.5rem; border-radius: 6px; border: 1px solid #DFE0EB; }
</style>