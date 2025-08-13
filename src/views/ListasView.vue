<template>
  <div class="listas-view">
    <h1>Gestión de Planes de Pago (Listas de Precios)</h1>
    <form @submit.prevent="crearNuevaLista" class="form-container">
      <input 
        v-model="nuevaLista.nombre_lista" 
        type="text" 
        placeholder="Nombre del nuevo plan" 
        required 
      />
      <button type="submit">Crear Plan</button>
    </form>
    <hr />
    <h2>Planes Existentes</h2>
    <SpinnerLoader v-if="cargando" />
    <ul v-else-if="listas.length > 0" class="lista-container">
      <li v-for="lista in listas" :key="lista.id">
        <span>{{ lista.nombre_lista }} (ID: {{ lista.id }})</span>
        <div class="acciones">
            <RouterLink :to="`/listas-precios/${lista.id}`" class="btn-edit">Editar</RouterLink>
            <button class="btn-delete" @click="abrirModalConfirmacion(lista.id)">Borrar</button>
        </div>
      </li>
    </ul>
    <p v-else>No hay planes de pago registrados.</p>
  </div>

  <ConfirmModal
    :show="mostrarModal"
    title="Confirmar Eliminación"
    message="¿Estás seguro de que deseas eliminar este plan? No se podrá eliminar si está asignado a algún alumno."
    @confirm="eliminarLista"
    @cancel="cerrarModalConfirmacion"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import { RouterLink } from 'vue-router';

const toast = useToast();
const listas = ref([]);
const nuevaLista = ref({ nombre_lista: '' });
const cargando = ref(true);
const mostrarModal = ref(false);
const listaAEliminar = ref(null);

const fetchListas = async () => {
  cargando.value = true;
  try {
    const response = await apiClient.get('/listas-precios');
    listas.value = response.data;
  } catch (error) {
    toast.error("Error al obtener los planes de pago.");
  } finally {
    cargando.value = false;
  }
};

const crearNuevaLista = async () => {
  try {
    await apiClient.post('/listas-precios', nuevaLista.value);
    toast.success("Plan de pago creado exitosamente.");
    await fetchListas();
    nuevaLista.value.nombre_lista = '';
  } catch (error) {
    toast.error("Ocurrió un error al crear el plan de pago.");
  }
};

const abrirModalConfirmacion = (id) => {
  listaAEliminar.value = id;
  mostrarModal.value = true;
};

const cerrarModalConfirmacion = () => {
  mostrarModal.value = false;
  listaAEliminar.value = null;
};

const eliminarLista = async () => {
  try {
    await apiClient.delete(`/listas-precios/${listaAEliminar.value}`);
    toast.success("Plan de pago eliminado exitosamente.");
    await fetchListas();
  } catch (error) {
    toast.error("Error al eliminar el plan de pago. Asegúrate de que no esté en uso.");
  } finally {
    cerrarModalConfirmacion();
  }
};

onMounted(fetchListas);
</script>

<style scoped>
.listas-view { max-width: 800px; margin: 0 auto; }
.form-container { display: flex; gap: 1rem; align-items: center; margin-bottom: 2rem; padding: 1rem; background-color: #f9f9f9; border-radius: 8px; }
input[type="text"] { flex-grow: 1; padding: 0.5rem; }
hr { margin: 2rem 0; }
.lista-container { list-style-type: none; padding: 0; }
.lista-container li { display: flex; justify-content: space-between; align-items: center; background-color: #fff; border: 1px solid #ddd; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px; }
.acciones { display: flex; gap: 0.5rem; align-items: center; }
.btn-delete { background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
.btn-edit { background-color: #ffc107; color: black; padding: 5px 10px; border-radius: 4px; text-decoration: none; font-size: 0.875rem; }
</style>