<template>
  <div class="licenciaturas-view">
    <h1>Gestión de Licenciaturas</h1>
    <p>Crea y administra las licenciaturas o especialidades que ofrece la institución.</p>

    <div class="card form-container">
      <h3>{{ editando ? 'Editando Licenciatura' : 'Crear Nueva Licenciatura' }}</h3>
      <form @submit.prevent="guardarLicenciatura" class="form-inline">
        <div class="form-group">
          <label for="nombre">Nombre de la Licenciatura*</label>
          <input id="nombre" v-model="licenciaturaActual.nombre" placeholder="Ej: Psicología Organizacional" required />
        </div>
        <div class="form-actions">
            <button type="submit">{{ editando ? 'Guardar Cambios' : 'Guardar Licenciatura' }}</button>
            <button v-if="editando" @click="cancelarEdicion" type="button" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>

    <hr />

    <h2>Licenciaturas Existentes</h2>
    <SpinnerLoader v-if="cargando" />
    <table v-else-if="licenciaturas.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="licenciatura in licenciaturas" :key="licenciatura.id">
          <td>{{ licenciatura.id }}</td>
          <td>{{ licenciatura.nombre }}</td>
          <td class="acciones">
            <button @click="iniciarEdicion(licenciatura)" class="btn-edit">Editar</button>
            <button @click="confirmarEliminacion(licenciatura.id)" class="btn-delete">Borrar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No hay licenciaturas registradas.</p>
  </div>
  <ConfirmModal 
    :show="mostrarModal"
    title="Confirmar Eliminación"
    message="¿Estás seguro de que deseas eliminar esta licenciatura?"
    @confirm="eliminarLicenciatura" 
    @cancel="cancelarEliminacion"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

const toast = useToast();
const licenciaturas = ref([]);
const cargando = ref(true);
const editando = ref(false);
const mostrarModal = ref(false);
const licenciaturaAEliminar = ref(null);

const licenciaturaVacia = { nombre: '' };
const licenciaturaActual = ref({ ...licenciaturaVacia });

const fetchLicenciaturas = async () => {
  cargando.value = true;
  try {
    const response = await apiClient.get('/licenciaturas');
    licenciaturas.value = response.data;
  } catch (error) {
    toast.error("Error al cargar las licenciaturas.");
  } finally {
    cargando.value = false;
  }
};

const iniciarEdicion = (lic) => {
    editando.value = true;
    licenciaturaActual.value = { ...lic };
    window.scrollTo(0, 0);
};

const cancelarEdicion = () => {
    editando.value = false;
    licenciaturaActual.value = { ...licenciaturaVacia };
};

const guardarLicenciatura = async () => {
  if (!licenciaturaActual.value.nombre.trim()) {
    toast.warning("El nombre no puede estar vacío.");
    return;
  }
  try {
    if (editando.value) {
        await apiClient.put(`/licenciaturas/${licenciaturaActual.value.id}`, licenciaturaActual.value);
        toast.success("Licenciatura actualizada exitosamente.");
    } else {
        await apiClient.post('/licenciaturas', licenciaturaActual.value);
        toast.success("Licenciatura creada exitosamente.");
    }
    await fetchLicenciaturas();
    cancelarEdicion();
  } catch (error) {
    toast.error("Error al guardar la licenciatura. Es posible que ya exista.");
  }
};

const confirmarEliminacion = (id) => {
    licenciaturaAEliminar.value = id;
    mostrarModal.value = true;
};

const cancelarEliminacion = () => {
    mostrarModal.value = false;
    licenciaturaAEliminar.value = null;
};

const eliminarLicenciatura = async () => {
    try {
        await apiClient.delete(`/licenciaturas/${licenciaturaAEliminar.value}`);
        toast.success("Licenciatura eliminada exitosamente.");
        await fetchLicenciaturas();
    } catch (error) {
        toast.error("Error al eliminar. Asegúrate de que no esté en uso por algún alumno.");
    } finally {
        cancelarEliminacion();
    }
};

onMounted(fetchLicenciaturas);
</script>

<style scoped>
.licenciaturas-view { max-width: 800px; margin: 0 auto; }
.card { background-color: #fff; border: 1px solid #DFE0EB; border-radius: 8px; padding: 1.5rem; }
.form-container { margin-bottom: 2rem; }
.form-inline { display: flex; align-items: flex-end; gap: 1rem; }
.form-group { display: flex; flex-direction: column; flex-grow: 1; }
.form-group label { margin-bottom: 0.5rem; font-size: 0.9rem; }
.form-group input { padding: 0.5rem; border-radius: 6px; border: 1px solid #DFE0EB; }
.form-actions { display: flex; gap: 1rem; }
button { padding: 0.6rem 1.5rem; border: none; background-color: #3751FF; color: white; border-radius: 8px; cursor: pointer; }
.btn-secondary { background-color: #6c757d; }
hr { border: none; border-top: 1px solid #DFE0EB; margin: 2rem 0; }
table { width: 100%; border-collapse: collapse; }
th, td { border-bottom: 1px solid #DFE0EB; padding: 12px; text-align: left; }
th { color: #9FA2B4; font-size: 0.9rem; }
.acciones { display: flex; gap: 0.5rem; }
.acciones button { padding: 5px 10px; }
.btn-edit { background-color: #ffc107; color: black; }
.btn-delete { background-color: #dc3545; color: white; }
</style>