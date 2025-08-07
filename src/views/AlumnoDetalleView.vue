<template>
  <SpinnerLoader v-if="cargando" />

  <div class="alumno-detalle-view" v-if="!cargando && alumno">

    <div class="header-detalle">
      <div>
        <h1>Detalle del Alumno</h1>
        <h2>{{ alumno.nombre_completo }}</h2>
      </div>
      <RouterLink :to="`/alumnos/${alumno.id}/estado-de-cuenta`" class="btn-primary">
        Generar Estado de Cuenta
      </RouterLink>
    </div>
    <p><strong>Matrícula:</strong> {{ alumno.matricula }}</p>
    <p><strong>Carrera:</strong> {{ alumno.carrera }}</p>
    <p><strong>Beca:</strong> {{ alumno.porcentaje_beca }}%</p>

    <hr />

    <div class="card">
      <h3>Crear Nuevo Cargo</h3>
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

    <hr />

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
        <h4 class="full-width">Aplicar pago a los siguientes cargos:</h4>
        <div v-for="cargo in cargosPendientes" :key="cargo.id" class="cargo-a-pagar">
           <input type="checkbox" v-model="cargosSeleccionados" :value="cargo.id" />
           <label>
             {{ cargo.nombre_concepto }} - <strong>Saldo: ${{ cargo.saldo_pendiente }}</strong>
           </label>
        </div>
        <button type="submit" class="full-width">Registrar Pago</button>
      </form>
    </div>

    <hr />

    <h3>Cargos Asociados</h3>
    <table v-if="cargos.length > 0">
      <thead>
        <tr>
          <th>Concepto</th>
          <th>Monto Original</th>
          <th>Descuento</th>
          <th>Saldo Pendiente</th>
          <th>Estatus</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cargo in cargos" :key="cargo.id" :class="{ 'pagado': cargo.saldo_pendiente <= 0 }">
          <td>{{ cargo.nombre_concepto }}</td>
          <td>${{ cargo.monto_original }}</td>
          <td>${{ cargo.monto_descuento }}</td>
          <td><strong>${{ cargo.saldo_pendiente }}</strong></td>
          <td>{{ cargo.saldo_pendiente <= 0 ? 'Pagado' : cargo.estatus }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Este alumno no tiene cargos registrados.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from "vue-toastification";
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue'; // <-- Importamos el spinner

const toast = useToast();
const route = useRoute();
const alumno = ref(null);
const cargos = ref([]);
const todosLosConceptos = ref([]);
const cargando = ref(true); // <-- Variable para controlar el spinner

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

const fetchAlumnoData = async () => {
  const alumnoId = route.params.id;
  try {
    const [alumnoRes, cargosRes] = await Promise.all([
      apiClient.get(`/alumnos/${alumnoId}`),
      apiClient.get(`/alumnos/${alumnoId}/cargos`),
    ]);
    alumno.value = alumnoRes.data;
    cargos.value = cargosRes.data;
  } catch (error) {
    toast.error("No se pudieron cargar los datos del alumno.");
    console.error('Error al cargar los datos del alumno:', error);
  }
};

const fetchConceptos = async () => {
    try {
        const response = await apiClient.get('/conceptos');
        todosLosConceptos.value = response.data;
    } catch (error)
        {
        console.error('Error al obtener los conceptos:', error);
    }
};

const crearNuevoCargo = async () => {
  const alumnoId = route.params.id;
  try {
    await apiClient.post(`/alumnos/${alumnoId}/cargos`, {
        ...nuevoCargo.value,
        alumno_id: alumnoId
    });
    await fetchAlumnoData();
    toast.success("Cargo generado exitosamente.");
    nuevoCargo.value.concepto_id = '';
    nuevoCargo.value.fecha_vencimiento = '';
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Error desconocido';
    toast.error(`Error al crear el cargo: ${errorMessage}`);
    console.error('Error al crear el cargo:', error.response?.data);
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
    await fetchAlumnoData();
    nuevoRecibo.value.folio = '';
    nuevoRecibo.value.monto_total_recibido = 0;
    cargosSeleccionados.value = [];
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Error desconocido';
    toast.error(`Error al registrar el pago: ${errorMessage}`);
    console.error("Error al registrar el pago:", error.response?.data);
  }
};

onMounted(async () => {
  cargando.value = true; // <-- Inicia la carga
  try {
    await Promise.all([fetchAlumnoData(), fetchConceptos()]);
  } catch (error) {
    toast.error("Error al inicializar la página.");
  } finally {
    cargando.value = false; // <-- Termina la carga
  }
});
</script>

<style scoped>
.alumno-detalle-view { max-width: 900px; margin: 0 auto; }
.card { background-color: #f9f9f9; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; align-items: end; }
.form-grid-pago { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { display: flex; flex-direction: column; }
.cargo-a-pagar { grid-column: 1 / -1; display: flex; align-items: center; gap: 0.5rem; }
.full-width { grid-column: 1 / -1; }
table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
th, td { border: 1px solid #ddd; padding: 8px; }
th { background-color: #f2f2f2; }
tr.pagado td { background-color: #e6ffed; color: #2d6a4f; }
hr { margin: 2rem 0; }
.header-detalle { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; } /* Añadimos margin-bottom */
.btn-primary { background-color: #3751FF; color: white; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; }
.header-detalle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-primary {
  background-color: #3751FF;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  white-space: nowrap; /* Evita que el texto del botón se parta */
}
</style>
