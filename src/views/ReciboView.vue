<template>
  <div class="recibo-page">
    <SpinnerLoader v-if="cargando" />
    
    <div v-if="!cargando && recibo">
      <div class="screen-only">
        <div class="recibo-controls">
            <button @click="imprimirRecibo" class="btn-primary">Imprimir Recibo</button>
            <RouterLink :to="`/alumnos/${recibo.alumno_id}`" class="btn-secondary">Volver a la Ficha del Alumno</RouterLink>
        </div>
        <div class="hoja-carta-container">
          <div class="recibo-wrapper">
            <ReciboTemplate :recibo="recibo" :alumno="alumno" copia="Documento de Muestra" />
          </div>
        </div>
      </div>

      <div class="print-only">
        <ReciboTemplate v-for="copia in copias" :key="copia.para" :recibo="recibo" :alumno="alumno" :copia="copia.para"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';

// Definimos el template del recibo como un componente separado para reutilizarlo
const ReciboTemplate = defineAsyncComponent(() => import('../components/ReciboTemplate.vue'));

const route = useRoute();
const toast = useToast();
const recibo = ref(null);
const alumno = ref(null);
const cargando = ref(true);

const copias = ref([
    { para: 'Copia: Control Escolar' },
    { para: 'Copia: Coordinación Financiera' },
    { para: 'Copia: Alumno' }
]);

onMounted(async () => {
  const reciboId = route.params.id;
  try {
    const reciboRes = await apiClient.get(`/recibos/${reciboId}`);
    recibo.value = reciboRes.data;
    if (recibo.value) {
      const alumnoRes = await apiClient.get(`/alumnos/${recibo.value.alumno_id}`);
      alumno.value = alumnoRes.data;
    }
  } catch (error) {
    toast.error("Error al cargar la información del recibo.");
  } finally {
    cargando.value = false;
  }
});

const imprimirRecibo = () => {
  window.print();
};
</script>

<style>
/* --- ESTILOS GLOBALES PARA IMPRESIÓN --- */
@media print {
  /* Oculta las notificaciones de toast al imprimir */
  .Vue-Toastification__container {
    display: none !important;
  }

  @page {
    size: letter portrait;
    margin: 0.5in;
  }
  
  body, html {
    background: #fff;
  }
  
  .print-only {
    display: block !important;
    position: relative;
    width: 100%;
    height: 100vh;
  }

  .screen-only {
    display: none !important;
  }

  /* Posicionamiento absoluto para forzar el layout */
  .recibo-template:nth-child(1) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .recibo-template:nth-child(2) {
    position: absolute;
    top: 33.33%;
    left: 0;
    width: 100%;
  }
  .recibo-template:nth-child(3) {
    position: absolute;
    top: 66.66%;
    left: 0;
    width: 100%;
  }
}
</style>

<style scoped>
/* --- ESTILOS PARA LA VISTA EN PANTALLA --- */
.recibo-page {
  max-width: 850px;
  margin: 0 auto;
}
.recibo-controls {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
}
.hoja-carta-container {
  background: white;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  border-radius: 8px;
}

/* Por defecto, la sección de impresión está oculta */
.print-only {
    display: none;
}

.btn-primary, .btn-secondary {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    border: none;
    cursor: pointer;
}
.btn-primary { background-color: #3751FF; color: white; }
.btn-secondary { background-color: #6c757d; color: white; }
</style>