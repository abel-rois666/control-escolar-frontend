<template>
  <SpinnerLoader v-if="cargando" />
  <div class="lista-detalle-view" v-if="!cargando && lista">
    <h1>Detalle de: {{ lista.nombre_lista }}</h1>
    <p><strong>ID:</strong> {{ lista.id }}</p>

    <hr />

    <h3>Añadir Concepto al Plan</h3>
    <form @submit.prevent="agregarItem" class="form-container">
      <select v-model="nuevoItem.concepto_id" required>
        <option disabled value="">Selecciona un concepto</option>
        <option v-for="concepto in todosLosConceptos" :key="concepto.id" :value="concepto.id">
          {{ concepto.nombre_concepto }}
        </option>
      </select>
      <input 
        v-model.number="nuevoItem.monto" 
        type="number" 
        step="0.01" 
        placeholder="Monto" 
        required 
      />
      <button type="submit">Añadir Item</button>
    </form>

    <hr />

    <h3>Items en este Plan</h3>
    <table v-if="lista.items && lista.items.length > 0">
      <thead>
        <tr>
          <th>Concepto</th>
          <th>Monto</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in lista.items" :key="item.id">
          <td>{{ item.nombre_concepto }}</td>
          <td>${{ item.monto }}</td>
          <td>
            <button class="btn-delete" @click="abrirModalConfirmacion(item.id)">Quitar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>Este plan de pago aún no tiene items.</p>
  </div>

  <ConfirmModal
    :show="mostrarModal"
    title="Confirmar Acción"
    message="¿Estás seguro de que deseas quitar este item del plan?"
    @confirm="eliminarItem"
    @cancel="cerrarModalConfirmacion"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const toast = useToast();
const route = useRoute();
const lista = ref(null);
const todosLosConceptos = ref([]);
const nuevoItem = ref({ concepto_id: '', monto: 0 });
const cargando = ref(true);
const mostrarModal = ref(false);
const itemAEliminar = ref(null);

const fetchListaDetalle = async () => {
  const listaId = route.params.id;
  try {
    const response = await apiClient.get(`/listas-precios/${listaId}`);
    lista.value = response.data;
  } catch (error) {
    toast.error('Error al obtener el detalle del plan.');
  }
};

const fetchTodosLosConceptos = async () => {
    try {
        const response = await apiClient.get('/conceptos');
        todosLosConceptos.value = response.data;
    } catch (error) {
        toast.error('Error al obtener la lista de conceptos.');
    }
};

const agregarItem = async () => {
  const listaId = route.params.id;
  try {
    await apiClient.post(`/listas-precios/${listaId}/items`, nuevoItem.value);
    await fetchListaDetalle();
    toast.success("Item añadido al plan exitosamente.");
    nuevoItem.value.concepto_id = '';
    nuevoItem.value.monto = 0;
  } catch (error) {
    toast.error("Error al agregar el item.");
  }
};

const abrirModalConfirmacion = (id) => {
  itemAEliminar.value = id;
  mostrarModal.value = true;
};

const cerrarModalConfirmacion = () => {
  mostrarModal.value = false;
  itemAEliminar.value = null;
};

const eliminarItem = async () => {
  const listaId = route.params.id;
  try {
    await apiClient.delete(`/listas-precios/${listaId}/items/${itemAEliminar.value}`);
    toast.success("Item eliminado del plan.");
    await fetchListaDetalle();
  } catch (error) {
    toast.error("Error al eliminar el item.");
  } finally {
    cerrarModalConfirmacion();
  }
};

onMounted(async () => {
  cargando.value = true;
  try {
    await Promise.all([fetchListaDetalle(), fetchTodosLosConceptos()]);
  } catch(error) {
    toast.error("Error al cargar la página.");
  } finally {
    cargando.value = false;
  }
});
</script>

<style scoped>
.lista-detalle-view { max-width: 800px; margin: 0 auto; }
.form-container, table { margin-top: 1rem; margin-bottom: 1rem; }
.btn-delete { background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
</style>