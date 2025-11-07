<template>
  <div class="carga-masiva-view">
    <h1>Carga Masiva de Alumnos</h1>
    <p>
      Sube un archivo <strong>.csv</strong> o <strong>.json</strong> para importar o actualizar alumnos de forma masiva.
    </p>
    <p>
      Asegúrate de que las columnas del archivo coincidan con los campos de la base de datos (ej: 'matricula', 'nombre', 'apellido_paterno', 'lista_de_precios_id', etc.).
    </p>

    <div class="card">
      <SpinnerLoader v-if="cargando" />
      
      <div class="upload-container">
        <input
          type="file"
          @change="handleFileSelect"
          accept=".csv,application/json"
          ref="fileInput"
          style="display: none"
        />
        <button @click="triggerFileInput" class="btn-secondary">
          Seleccionar Archivo (.csv o .json)
        </button>
      </div>

      <div v-if="file" class="file-list">
        <h4>Archivo seleccionado:</h4>
        <p>{{ file.name }}</p>
        <button @click="subirArchivo" :disabled="cargando" class="btn-primary">
          {{ cargando ? `Procesando...` : 'Iniciar Carga Masiva' }}
        </button>
      </div>

      <div v-if="resultadoImportacion" class="results">
        <h4>Resultados de la Importación</h4>
        <p class="success-message">{{ resultadoImportacion.message }}</p>
        <div v-if="resultadoImportacion.errors && resultadoImportacion.errors.length > 0" class="error-list">
          <strong>Errores encontrados (estos registros se omitieron):</strong>
          <ul>
            <li v-for="(error, index) in resultadoImportacion.errors" :key="index">
              {{ error }}
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const toast = useToast();
const file = ref(null);
const fileInput = ref(null);
const cargando = ref(false);
const resultadoImportacion = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  file.value = event.target.files[0];
  resultadoImportacion.value = null; // Limpiar resultados anteriores
};

const subirArchivo = async () => {
  if (!file.value) {
    toast.warning('Por favor, selecciona un archivo.');
    return;
  }

  cargando.value = true;
  resultadoImportacion.value = null;
  const formData = new FormData();
  // El nombre 'archivo' debe coincidir con el middleware de Multer en el backend
  formData.append('archivo', file.value);

  try {
    const response = await apiClient.post('/alumnos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // El backend debe responder con un JSON { message: "...", errors: [...] }
    resultadoImportacion.value = response.data;
    toast.success(response.data.message || 'Carga completada.');

    // Limpiar el input
    file.value = null;
    if(fileInput.value) fileInput.value.value = '';

  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error desconocido al subir el archivo.';
    toast.error(errorMessage);
    resultadoImportacion.value = { message: 'Error en la carga.', errors: [errorMessage] };
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.carga-masiva-view { max-width: 800px; margin: 0 auto; }
.card { background-color: #fff; border: 1px solid #dfe0eb; border-radius: 8px; padding: 2rem; margin-top: 2rem; }
.upload-container { text-align: center; margin-bottom: 2rem; }
.file-list { margin-top: 1.5rem; text-align: center; }
.btn-primary, .btn-secondary { padding: 0.8rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: bold; border: none; cursor: pointer; }
.btn-primary { background-color: #3751ff; color: white; width: 100%; margin-top: 1rem; }
.btn-primary:disabled { background-color: #9fa2b4; }
.btn-secondary { background-color: #6c757d; color: white; }

.results {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #dfe0eb;
}
.success-message {
  font-weight: bold;
  color: #28a745;
}
.error-list {
  margin-top: 1rem;
  background-color: #fbebee;
  border: 1px solid #dc3545;
  border-radius: 4px;
  padding: 1rem;
}
.error-list strong {
  color: #dc3545;
}
.error-list ul {
  padding-left: 20px;
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}
</style>