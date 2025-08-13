<template>
  <div class="ciclos-view">
    <h1>Gestión de Ciclos Escolares</h1>
    <p>Crea y administra los periodos escolares del sistema.</p>

    <div class="card form-container">
      <h3>{{ editando ? 'Editando Ciclo Escolar' : 'Crear Nuevo Ciclo Escolar' }}</h3>
      <form @submit.prevent="guardarCiclo" class="form-grid">
        <div class="form-group">
          <label for="codigo">Código Corto*</label>
          <input id="codigo" v-model="cicloActual.codigo" placeholder="Ej: 2025-1" required />
        </div>
        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <input id="descripcion" v-model="cicloActual.descripcion" placeholder="Ej: Semestre Ene-Jun 2025" />
        </div>
        <div class="form-group">
          <label for="tipo_periodo">Tipo de Periodo</label>
          <select id="tipo_periodo" v-model="cicloActual.tipo_periodo">
            <option>Semestral</option>
            <option>Cuatrimestral</option>
            <option>Anual</option>
          </select>
        </div>
        <div class="form-group">
          <label for="fecha_inicio">Fecha de Inicio</label>
          <input id="fecha_inicio" type="date" v-model="cicloActual.fecha_inicio" />
        </div>
        <div class="form-group">
          <label for="fecha_fin">Fecha de Fin</label>
          <input id="fecha_fin" type="date" v-model="cicloActual.fecha_fin" />
        </div>
        <div class="form-actions full-width">
            <button type="submit">{{ editando ? 'Guardar Cambios' : 'Guardar Ciclo' }}</button>
            <button type="button" v-if="editando" @click="cancelarEdicion" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>

    <hr />

    <h2>Ciclos Existentes</h2>
    <SpinnerLoader v-if="cargando" />
    <table v-else-if="ciclos.length > 0">
      <thead>
        <tr>
          <th>Código</th>
          <th>Descripción</th>
          <th>Periodo</th>
          <th>Inicio</th>
          <th>Fin</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ciclo in ciclos" :key="ciclo.id">
          <td>{{ ciclo.codigo }}</td>
          <td>{{ ciclo.descripcion }}</td>
          <td>{{ ciclo.tipo_periodo }}</td>
          <td>{{ formatDate(ciclo.fecha_inicio) }}</td>
          <td>{{ formatDate(ciclo.fecha_fin) }}</td>
          <td class="acciones">
            <button @click="iniciarEdicion(ciclo)" class="btn-edit">Editar</button>
            <button @click="confirmarEliminacion(ciclo.id)" class="btn-delete">Borrar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No hay ciclos escolares registrados.</p>
  </div>
  
  <ConfirmModal 
    :show="mostrarModal"
    title="Confirmar Eliminación"
    message="¿Estás seguro de que deseas eliminar este ciclo?"
    @confirm="eliminarCiclo" 
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
const ciclos = ref([]);
const cargando = ref(true);
const editando = ref(false);
const mostrarModal = ref(false);
const cicloAEliminar = ref(null);

const cicloVacio = { codigo: '', descripcion: '', tipo_periodo: 'Semestral', fecha_inicio: '', fecha_fin: '' };
const cicloActual = ref({ ...cicloVacio });

const fetchCiclos = async () => {
  cargando.value = true;
  try {
    const response = await apiClient.get('/ciclos-escolares');
    ciclos.value = response.data;
  } catch (error) {
    toast.error("Error al cargar los ciclos escolares.");
  } finally {
    cargando.value = false;
  }
};

const iniciarEdicion = (ciclo) => {
  editando.value = true;
  // Aseguramos que las fechas tengan el formato YYYY-MM-DD para el input[type=date]
  cicloActual.value = { 
    ...ciclo, 
    fecha_inicio: ciclo.fecha_inicio?.split('T')[0], 
    fecha_fin: ciclo.fecha_fin?.split('T')[0] 
  };
  window.scrollTo(0, 0); // Opcional: lleva al usuario arriba para ver el formulario
};

const cancelarEdicion = () => {
  editando.value = false;
  cicloActual.value = { ...cicloVacio };
};

const guardarCiclo = async () => {
  try {
    if (editando.value) {
      await apiClient.put(`/ciclos-escolares/${cicloActual.value.id}`, cicloActual.value);
      toast.success("Ciclo actualizado exitosamente.");
    } else {
      await apiClient.post('/ciclos-escolares', cicloActual.value);
      toast.success("Ciclo escolar creado exitosamente.");
    }
    await fetchCiclos();
    cancelarEdicion();
  } catch (error) {
    toast.error("Error al guardar el ciclo escolar.");
  }
};

const confirmarEliminacion = (id) => {
  cicloAEliminar.value = id;
  mostrarModal.value = true;
};

const cancelarEliminacion = () => {
  mostrarModal.value = false;
  cicloAEliminar.value = null;
};

const eliminarCiclo = async () => {
  try {
    await apiClient.delete(`/ciclos-escolares/${cicloAEliminar.value}`);
    toast.success("Ciclo eliminado exitosamente.");
    await fetchCiclos();
  } catch (error) {
    toast.error("Error al eliminar el ciclo. Puede que esté en uso.");
  } finally {
    cancelarEliminacion();
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  });
};

onMounted(fetchCiclos);
</script>

<style scoped>
.ciclos-view { max-width: 1000px; margin: 0 auto; }
.card { background-color: #fff; border: 1px solid #DFE0EB; border-radius: 8px; padding: 1.5rem; }
.form-container { margin-bottom: 2rem; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; }
.form-group label { margin-bottom: 0.5rem; font-size: 0.9rem; }
.form-group input, .form-group select { padding: 0.5rem; border-radius: 6px; border: 1px solid #DFE0EB; }
.full-width { grid-column: 1 / -1; }
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