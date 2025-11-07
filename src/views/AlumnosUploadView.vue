<template>
  <div class="upload-container">
    <h2>Carga Masiva de Alumnos</h2>
    <p>
      Selecciona un archivo en formato JSON o CSV para registrar nuevos alumnos en el sistema.
      La estructura del archivo debe coincidir con la plantilla de datos de alumnos.
    </p>

    <div class="upload-box" @dragover.prevent @drop.prevent="handleDrop">
      <input type="file" ref="fileInput" @change="handleFileSelect" accept=".json, .csv" style="display: none;" />
      <div v-if="!selectedFile">
        <button @click="$refs.fileInput.click()">Seleccionar Archivo</button>
        <p class="drop-text">o arrastra y suelta el archivo aquí</p>
      </div>
      <div v-else class="file-info">
        <p><strong>Archivo seleccionado:</strong> {{ selectedFile.name }}</p>
        <p><strong>Tamaño:</strong> {{ (selectedFile.size / 1024).toFixed(2) }} KB</p>
        <button @click="uploadFile" :disabled="isLoading">
          <span v-if="isLoading">
            <SpinnerLoader /> Subiendo...
          </span>
          <span v-else>
            Subir y Procesar Archivo
          </span>
        </button>
        <button class="cancel-btn" @click="clearFile" :disabled="isLoading">Cancelar</button>
      </div>
    </div>

    <div v-if="uploadResult" class="result-message" :class="uploadResult.error ? 'error' : 'success'">
      <h3>Resultado de la Carga</h3>
      <p>{{ uploadResult.message }}</p>
      <p v-if="!uploadResult.error">
        Se encontraron <strong>{{ uploadResult.totalRecords }}</strong> registros en el archivo. <br/>
        Se insertaron <strong>{{ uploadResult.newRecordsInserted }}</strong> nuevos alumnos.
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const selectedFile = ref(null);
const isLoading = ref(false);
const uploadResult = ref(null);
const fileInput = ref(null);

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file && (file.type === 'application/json' || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel')) {
    selectedFile.value = file;
    uploadResult.value = null;
  } else {
    alert('Por favor, selecciona un archivo JSON o CSV válido.');
  }
};

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0];
   if (file && (file.type === 'application/json' || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel')) {
    selectedFile.value = file;
    uploadResult.value = null;
    if (fileInput.value) {
      fileInput.value.files = event.dataTransfer.files;
    }
  } else {
    alert('Por favor, suelta un archivo JSON o CSV válido.');
  }
};

const clearFile = () => {
  selectedFile.value = null;
  uploadResult.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const uploadFile = async () => {
  if (!selectedFile.value) return;

  isLoading.value = true;
  uploadResult.value = null;
  const formData = new FormData();
  formData.append('alumnosFile', selectedFile.value);

  try {
    const response = await api.post('/alumnos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    uploadResult.value = { ...response.data, error: false };
  } catch (error) {
    uploadResult.value = { 
      message: error.response?.data?.message || 'Ocurrió un error al subir el archivo.', 
      error: true 
    };
    console.error('Error al subir archivo:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.upload-container {
  padding: 2rem;
  max-width: 800px;
  margin: auto;
}
.upload-box {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background-color: #f9f9f9;
  margin-top: 1.5rem;
}
.drop-text {
  color: #777;
  margin-top: 0.5rem;
}
.file-info p {
  margin: 0.5rem 0;
}
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0.5rem;
  transition: background-color 0.3s;
}
button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background-color: #0056b3;
}
.cancel-btn {
  background-color: #6c757d;
}
.cancel-btn:hover:not(:disabled) {
  background-color: #5a6268;
}
.result-message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}
.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>