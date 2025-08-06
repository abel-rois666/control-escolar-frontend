<template>
  <div class="lista-detalle-view" v-if="lista">
    <h1>Detalle de: {{ lista.nombre_lista }}</h1>
    <p><strong>ID:</strong> {{ lista.id }}</p>

    <hr />

    <h3>Añadir Concepto a la Lista</h3>
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

    <h3>Items en esta Lista</h3>
    <table v-if="lista.items && lista.items.length > 0">
      <thead>
        <tr>
          <th>Concepto</th>
          <th>Monto</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in lista.items" :key="item.id">
          <td>{{ item.nombre_concepto }}</td>
          <td>${{ item.monto }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Esta lista de precios aún no tiene items.</p>
  </div>
  <div v-else>
    <p>Cargando detalles de la lista...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '../services/api.js';

const route = useRoute(); // Para acceder a los parámetros de la URL, como el ID
const lista = ref(null); // Para guardar los datos de la lista y sus items
const todosLosConceptos = ref([]); // Para el menú desplegable del formulario

const nuevoItem = ref({
  concepto_id: '',
  monto: 0,
});

// Función para cargar los detalles de esta lista específica
const fetchListaDetalle = async () => {
  const listaId = route.params.id; // Obtenemos el ID de la URL
  try {
    const response = await apiClient.get(`/listas-precios/${listaId}`);
    lista.value = response.data;
  } catch (error) {
    console.error('Error al obtener el detalle de la lista:', error);
  }
};

// Función para cargar todos los conceptos disponibles para el formulario
const fetchTodosLosConceptos = async () => {
    try {
        const response = await apiClient.get('/conceptos');
        todosLosConceptos.value = response.data;
    } catch (error) {
        console.error('Error al obtener todos los conceptos:', error);
    }
};

// Función para agregar un nuevo item a la lista
const agregarItem = async () => {
  const listaId = route.params.id;
  try {
    await apiClient.post(`/listas-precios/${listaId}/items`, nuevoItem.value);
    await fetchListaDetalle(); // Recargamos los detalles para ver el nuevo item
    // Limpiamos el formulario
    nuevoItem.value.concepto_id = '';
    nuevoItem.value.monto = 0;
  } catch (error) {
    console.error('Error al agregar el item:', error);
  }
};

// Cuando el componente se monta, cargamos todo lo necesario
onMounted(() => {
  fetchListaDetalle();
  fetchTodosLosConceptos();
});
</script>

<style scoped>
.lista-detalle-view {
  max-width: 800px;
  margin: 0 auto;
}
.form-container, table {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
/* Puedes añadir más estilos como en los otros componentes */
</style>