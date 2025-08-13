<template>
  <div class="concepto-editar-view">
    <SpinnerLoader v-if="cargando" />
    <div v-if="!cargando && concepto.id">
      <h1>Editando Concepto</h1>
      <div class="card">
        <form @submit.prevent="actualizarConcepto">
            <div class="form-group">
                <label for="nombre_concepto">Nombre del Concepto</label>
                <input id="nombre_concepto" v-model="concepto.nombre_concepto" required />
            </div>
            <div class="form-group checkbox">
                <input type="checkbox" v-model="concepto.aplica_beca" id="aplica_beca"/>
                <label for="aplica_beca">Aplica para Beca</label>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-primary">Guardar Cambios</button>
                <RouterLink to="/conceptos" class="btn-secondary">Cancelar</RouterLink>
            </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const concepto = ref({});
const cargando = ref(true);

onMounted(async () => {
    const conceptoId = route.params.id;
    try {
        const response = await apiClient.get(`/conceptos/${conceptoId}`);
        concepto.value = response.data;
    } catch (error) {
        toast.error("Error al cargar el concepto.");
        router.push('/conceptos');
    } finally {
        cargando.value = false;
    }
});

const actualizarConcepto = async () => {
    try {
        await apiClient.put(`/conceptos/${concepto.value.id}`, concepto.value);
        toast.success("Concepto actualizado exitosamente.");
        router.push('/conceptos');
    } catch (error) {
        toast.error("Error al actualizar el concepto.");
    }
};
</script>

<style scoped>
.concepto-editar-view { max-width: 600px; margin: auto; }
.card { background-color: #fff; padding: 2rem; border-radius: 8px; border: 1px solid #DFE0EB; }
h1 { margin-bottom: 1.5rem; }
.form-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; }
.form-group label { margin-bottom: 0.5rem; font-weight: bold; }
.form-group input[type="text"] { padding: 0.5rem; border-radius: 6px; border: 1px solid #DFE0EB; }
.form-group.checkbox { flex-direction: row; align-items: center; gap: 0.5rem; }
.form-actions { display: flex; gap: 1rem; margin-top: 2rem; }
.btn-primary { background-color: #3751FF; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: bold; border: none; cursor: pointer; }
.btn-secondary { background-color: #6c757d; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: bold; border: none; display: inline-flex; align-items: center; justify-content: center; }
</style>