<template>
  <div class="generar-xml-view">
    <h1>Generador de XML para Historiales</h1>
    <p>
      Sube un archivo Excel con los datos del alumno para generar el XML
      necesario para el certificado.
    </p>

    <div class="card">
      <div class="upload-container">
        <input
          type="file"
          @change="handleFileSelect"
          accept=".xlsx, .xls"
          ref="fileInput"
          style="display: none"
        />
        <button @click="triggerFileInput" class="btn-secondary">
          Seleccionar Archivo Excel
        </button>
        <a href="/plantilla_historial.xlsx" download class="btn-info">Descargar Plantilla</a>
      </div>

      <div v-if="file" class="file-list">
        <h4>Archivo seleccionado:</h4>
        <p>{{ file.name }}</p>
        <button @click="generarXML" :disabled="cargando" class="btn-primary">
          {{ cargando ? `Generando...` : 'Generar y Descargar XML' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';

const toast = useToast();
const file = ref(null);
const fileInput = ref(null);
const cargando = ref(false);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  file.value = event.target.files[0];
};

const generarXML = async () => {
  if (!file.value) {
    toast.warning('Por favor, selecciona un archivo Excel.');
    return;
  }

  cargando.value = true;
  const formData = new FormData();
  formData.append('excelFile', file.value);

  try {
    const response = await apiClient.post('/herramientas/generar-xml-desde-excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    
    // Extraer el nombre del archivo de la respuesta del servidor
    const contentDisposition = response.headers['content-disposition'];
    let fileName = `historial.xml`;
    if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2)
            fileName = fileNameMatch[1];
    }

    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success('XML generado exitosamente.');
    
  } catch (error) {
    toast.error('Error al generar el XML.');
    console.error(error);
  } finally {
    cargando.value = false;
    file.value = null;
    if(fileInput.value) fileInput.value.value = '';
  }
};
</script>

<style scoped>
.generar-xml-view { max-width: 800px; margin: 0 auto; }
.card { background-color: #fff; border: 1px solid #dfe0eb; border-radius: 8px; padding: 2rem; margin-top: 2rem; }
.upload-container { text-align: center; margin-bottom: 2rem; display: flex; gap: 1rem; justify-content: center;}
.file-list { margin-top: 1.5rem; text-align: center; }
.btn-primary, .btn-secondary, .btn-info { padding: 0.8rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: bold; border: none; cursor: pointer; }
.btn-primary { background-color: #3751ff; color: white; width: 100%; margin-top: 1rem; }
.btn-primary:disabled { background-color: #9fa2b4; }
.btn-secondary { background-color: #6c757d; color: white; }
.btn-info { background-color: #17a2b8; color: white; }
</style>