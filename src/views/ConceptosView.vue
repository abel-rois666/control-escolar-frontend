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
    <table v-if="conceptos.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre del Concepto</th>
          <th>Aplica Beca</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="concepto in conceptos" :key="concepto.id">
          <td>{{ concepto.id }}</td>
          <td>{{ concepto.nombre_concepto }}</td>
          <td>{{ concepto.aplica_beca ? 'Sí' : 'No' }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No hay conceptos registrados.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api.js';

const conceptos = ref([]);

// Variable reactiva para los datos del nuevo concepto del formulario
const nuevoConcepto = ref({
  nombre_concepto: '',
  aplica_beca: false,
});

// Función para cargar los conceptos desde la API
const fetchConceptos = async () => {
  try {
    const response = await apiClient.get('/conceptos');
    conceptos.value = response.data;
  } catch (error) {
    console.error('Error al obtener los conceptos:', error);
  }
};

// --- NUEVA FUNCIÓN ---
// Se ejecuta cuando se envía el formulario
const crearNuevoConcepto = async () => {
  try {
    // Hacemos la petición POST a la API con los datos del formulario
    await apiClient.post('/conceptos', nuevoConcepto.value);

    // Si la creación es exitosa, volvemos a cargar la lista para ver el nuevo concepto
    await fetchConceptos();

    // Limpiamos los campos del formulario para el siguiente
    nuevoConcepto.value.nombre_concepto = '';
    nuevoConcepto.value.aplica_beca = false;

  } catch (error) {
    console.error('Error al crear el concepto:', error);
  }
};

// onMounted ahora solo llama a la función de carga inicial
onMounted(fetchConceptos);
</script>

<style scoped>
.conceptos-view {
  max-width: 800px;
  margin: 0 auto;
}
.form-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}
input[type="text"] {
  flex-grow: 1;
  padding: 0.5rem;
}
hr {
  margin: 2rem 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
</style>