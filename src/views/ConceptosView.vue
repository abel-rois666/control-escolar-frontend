<template>
  <div class="conceptos-view">
    <h1>Gestión de Conceptos de Cobro</h1>

    <form @submit.prevent="crearNuevoConcepto" class="form-container">
      <input 
        v-model="nuevoConcepto.nombre_concepto" 
        type="text" 
        placeholder="Nombre del nuevo concepto" 
        required 
      />
      <label>
        <input v-model="nuevoConcepto.aplica_beca" type="checkbox" />
        ¿Aplica para beca?
      </label>
      <button type="submit">Crear Concepto</button>
    </form>

    <hr />

    <h2>Conceptos Existentes</h2>
    <SpinnerLoader v-if="cargando" />
    <table v-else-if="conceptos.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre del Concepto</th>
          <th>Aplica Beca</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="concepto in conceptos" :key="concepto.id">
          <td>{{ concepto.id }}</td>
          <td>{{ concepto.nombre_concepto }}</td>
          <td>{{ concepto.aplica_beca ? 'Sí' : 'No' }}</td>
          <td>
            <button class="btn-delete" @click="abrirModalConfirmacion(concepto.id)">Borrar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No hay conceptos registrados.</p>
  </div>

  <ConfirmModal
    :show="mostrarModal"
    title="Confirmar Eliminación"
    message="¿Estás seguro de que deseas eliminar este concepto? Esta acción no se puede deshacer."
    @confirm="eliminarConcepto"
    @cancel="cerrarModalConfirmacion"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const toast = useToast();
const conceptos = ref([]);
const nuevoConcepto = ref({ nombre_concepto: '', aplica_beca: false });
const cargando = ref(true);
const mostrarModal = ref(false);
const conceptoAEliminar = ref(null);

const fetchConceptos = async () => {
  cargando.value = true;
  try {
    const response = await apiClient.get('/conceptos');
    conceptos.value = response.data;
  } catch (error) {
    toast.error("Error al obtener los conceptos.");
  } finally {
    cargando.value = false;
  }
};

const crearNuevoConcepto = async () => {
  try {
    await apiClient.post('/conceptos', nuevoConcepto.value);
    toast.success(`Concepto "${nuevoConcepto.value.nombre_concepto}" creado exitosamente.`);
    await fetchConceptos();
    nuevoConcepto.value.nombre_concepto = '';
    nuevoConcepto.value.aplica_beca = false;
  } catch (error) {
    toast.error("Ocurrió un error al crear el concepto.");
  }
};

const abrirModalConfirmacion = (id) => {
  conceptoAEliminar.value = id;
  mostrarModal.value = true;
};

const cerrarModalConfirmacion = () => {
  mostrarModal.value = false;
  conceptoAEliminar.value = null;
};

const eliminarConcepto = async () => {
  try {
    await apiClient.delete(`/conceptos/${conceptoAEliminar.value}`);
    toast.success("Concepto eliminado exitosamente.");
    await fetchConceptos();
  } catch (error) {
    toast.error("Error al eliminar el concepto. Puede que esté en uso en un plan de pago.");
  } finally {
    cerrarModalConfirmacion();
  }
};

onMounted(fetchConceptos);
</script>

<style scoped>
.conceptos-view { max-width: 800px; margin: 0 auto; }
.form-container { display: flex; gap: 1rem; align-items: center; margin-bottom: 2rem; padding: 1rem; background-color: #f9f9f9; border-radius: 8px; }
input[type="text"] { flex-grow: 1; padding: 0.5rem; }
hr { margin: 2rem 0; }
table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background-color: #f2f2f2; }
.btn-delete { background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
</style>