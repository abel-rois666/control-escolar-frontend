<template>
  <div class="licenciaturas-view">
    <h1>Gestión de Licenciaturas</h1>
    <p>Crea y administra las licenciaturas o especialidades que ofrece la institución.</p>

    <div class="card form-container">
      <h3>Crear Nueva Licenciatura</h3>
      <form @submit.prevent="crearNuevaLicenciatura" class="form-inline">
        <div class="form-group">
          <label for="nombre">Nombre de la Licenciatura*</label>
          <input id="nombre" v-model="nuevaLicenciatura.nombre" placeholder="Ej: Psicología Organizacional" required />
        </div>
        <button type="submit">Guardar Licenciatura</button>
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="licenciatura in licenciaturas" :key="licenciatura.id">
          <td>{{ licenciatura.id }}</td>
          <td>{{ licenciatura.nombre }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No hay licenciaturas registradas.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const toast = useToast();
const licenciaturas = ref([]);
const cargando = ref(true);

const nuevaLicenciatura = ref({
  nombre: '',
});

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

const crearNuevaLicenciatura = async () => {
  if (!nuevaLicenciatura.value.nombre.trim()) {
    toast.warning("El nombre no puede estar vacío.");
    return;
  }
  try {
    await apiClient.post('/licenciaturas', nuevaLicenciatura.value);
    toast.success("Licenciatura creada exitosamente.");
    await fetchLicenciaturas(); // Recargamos la lista
    nuevaLicenciatura.value.nombre = ''; // Limpiamos el formulario
  } catch (error) {
    toast.error("Error al crear la licenciatura. Es posible que ya exista.");
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
button { padding: 0.6rem 1.5rem; border: none; background-color: #3751FF; color: white; border-radius: 8px; cursor: pointer; }
hr { border: none; border-top: 1px solid #DFE0EB; margin: 2rem 0; }
table { width: 100%; border-collapse: collapse; }
th, td { border-bottom: 1px solid #DFE0EB; padding: 12px; text-align: left; }
th { color: #9FA2B4; font-size: 0.9rem; }
</style>