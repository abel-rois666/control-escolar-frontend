<template>
  <div class="alumno-detalle-view" v-if="alumno">
    <h1>Detalle del Alumno: {{ alumno.nombre_completo }}</h1>
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

        <h4>Aplicar pago a los siguientes cargos:</h4>
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
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '../services/api.js';

const route = useRoute();
const alumno = ref(null);
const cargos = ref([]);
const todosLosConceptos = ref([]);

const nuevoCargo = ref({ /* ... se mantiene igual ... */ });

// --- NUEVO: Modelo para el formulario de recibo ---
const nuevoRecibo = ref({
  folio: '',
  alumno_id: null,
  monto_total_recibido: 0,
  fecha_pago: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
  forma_pago: 'Efectivo',
  detalles: [],
});
const cargosSeleccionados = ref([]); // Guardará los IDs de los cargos a pagar

// Propiedad computada que filtra solo los cargos con saldo pendiente
const cargosPendientes = computed(() => {
    return cargos.value.filter(c => parseFloat(c.saldo_pendiente) > 0);
});

const fetchAlumnoData = async () => { /* ... se mantiene igual ... */ };
const fetchConceptos = async () => { /* ... se mantiene igual ... */ };
const crearNuevoCargo = async () => { /* ... se mantiene igual ... */ };

// --- NUEVA FUNCIÓN: Lógica para registrar el pago ---
const registrarPago = async () => {
  nuevoRecibo.value.alumno_id = alumno.value.id;

  let montoRestante = nuevoRecibo.value.monto_total_recibido;
  const detalles = [];

  // Recorremos los cargos seleccionados para aplicar el pago
  for (const cargoId of cargosSeleccionados.value) {
    if (montoRestante <= 0) break;

    const cargo = cargos.value.find(c => c.id === cargoId);
    if (cargo) {
        const saldo = parseFloat(cargo.saldo_pendiente);
        const montoAAplicar = Math.min(montoRestante, saldo);

        detalles.push({
            cargo_id: cargoId,
            monto_aplicado: montoAAplicar,
        });
        montoRestante -= montoAAplicar;
    }
  }

  if (detalles.length === 0) {
    alert("Por favor, selecciona al menos un cargo para aplicar el pago.");
    return;
  }

  nuevoRecibo.value.detalles = detalles;

  try {
    await apiClient.post('/recibos', nuevoRecibo.value);
    alert('¡Pago registrado exitosamente!');
    await fetchAlumnoData(); // Recargamos todo para ver el saldo actualizado
    // Limpiar formulario de recibo
    nuevoRecibo.value.folio = '';
    nuevoRecibo.value.monto_total_recibido = 0;
    cargosSeleccionados.value = [];

  } catch (error) {
    console.error("Error al registrar el pago:", error.response?.data);
    alert(`Error: ${error.response?.data?.error || 'Error desconocido'}`);
  }
};

onMounted(() => {
  fetchAlumnoData();
  fetchConceptos();
});
</script>

<style scoped>
/* ... (los estilos anteriores se mantienen) ... */
.form-grid-pago { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.cargo-a-pagar { grid-column: 1 / -1; display: flex; align-items: center; gap: 0.5rem; }
.full-width { grid-column: 1 / -1; }
</style>