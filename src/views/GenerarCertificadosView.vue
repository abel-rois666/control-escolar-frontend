<template>
  <div class="generar-certificados-view">
    <h1>Generador Masivo de Certificados</h1>
    <p>
      Selecciona uno o varios archivos XML para generar sus respectivos
      certificados en formato PDF.
    </p>

    <div class="card">
      <div class="upload-container">
        <input
          type="file"
          @change="handleFileSelect"
          multiple
          accept=".xml"
          ref="fileInput"
          style="display: none"
        />
        <button @click="triggerFileInput" class="btn-secondary">
          Seleccionar Archivos XML
        </button>
      </div>

      <div v-if="files.length > 0" class="file-list">
        <h4>Archivos seleccionados ({{ files.length }}):</h4>
        <ul>
          <li v-for="(file, index) in files" :key="index">
            {{ file.name }}
          </li>
        </ul>
        <button @click="generarPDFs" :disabled="cargando" class="btn-primary">
          {{ cargando ? `Generando ${progreso}...` : 'Generar PDFs' }}
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
const files = ref([]);
const fileInput = ref(null);
const cargando = ref(false);
const progreso = ref('');

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  files.value = Array.from(event.target.files);
};

const generarPDFs = async () => {
  if (files.value.length === 0) {
    toast.warning('Por favor, selecciona al menos un archivo XML.');
    return;
  }

  cargando.value = true;
  let exitosos = 0;

  for (let i = 0; i < files.value.length; i++) {
    const file = files.value[i];
    progreso.value = `${i + 1} de ${files.value.length}`;

    const formData = new FormData();
    formData.append('xmlFile', file);

    try {
      const response = await apiClient.post(
        '/certificados/generar-pdf',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          responseType: 'blob', // Importante para recibir el archivo
        }
      );

      // Crear un enlace temporal para descargar el PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `certificado-${Date.now()}.pdf`;
      if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
          if (fileNameMatch.length === 2)
              fileName = fileNameMatch[1];
      }
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      exitosos++;

    } catch (error) {
      toast.error(`Error al procesar el archivo ${file.name}.`);
      console.error(error);
    }
  }

  cargando.value = false;
  progreso.value = '';
  files.value = []; // Limpiar la lista de archivos
  fileInput.value.value = ''; // Resetear el input
  
  toast.success(`${exitosos} de ${files.value.length} PDFs generados exitosamente.`);
};
</script>

<style scoped>
.generar-certificados-view {
  max-width: 800px;
  margin: 0 auto;
}
.card {
  background-color: #fff;
  border: 1px solid #dfe0eb;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;
}
.upload-container {
  text-align: center;
  margin-bottom: 2rem;
}
.file-list {
  margin-top: 1.5rem;
}
.file-list ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  max-height: 200px;
  overflow-y: auto;
  background-color: #f8f9fa;
  border: 1px solid #dfe0eb;
  border-radius: 4px;
  padding: 1rem;
}
.file-list li {
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}
.btn-primary, .btn-secondary {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
.btn-primary {
  background-color: #3751ff;
  color: white;
  width: 100%;
  margin-top: 1rem;
}
.btn-primary:disabled {
  background-color: #9fa2b4;
  cursor: not-allowed;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
}
</style>