<template>
  <div class="card">
    <div class="card-header">
      Carga Masiva de Alumnos
    </div>
    <div class="card-body">
      <p class="card-text">
        Selecciona un archivo CSV o JSON para importar múltiples alumnos a la vez.
        <br>
        Asegúrate de que las columnas coincidan con la plantilla.
      </p>

      <form @submit.prevent="handleFileUpload">
        <div class="mb-3">
          <label for="formFile" class="form-label">Seleccionar archivo (.csv, .json)</label>
          <input 
            class="form-control" 
            type="file" 
            id="formFile" 
            @change="onFileChange"
            accept=".csv, .json"
            ref="fileInput"
          >
        </div>

        <button typeV="submit" class="btn btn-primary" :disabled="!file || isLoading">
          <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{ isLoading ? 'Cargando...' : 'Subir y Procesar' }}
        </button>
      </form>

      <div v-if="message" :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-danger', 'mt-3']" role="alert">
        {{ message }}
        <ul v-if="errors.length > 0" class="mt-2">
          <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CargaMasivaAlumnos',
  emits: ['carga-exitosa'], // Evento para notificar al padre que la carga fue exitosa
  data() {
    return {
      file: null,
      isLoading: false,
      message: '',
      messageType: 'success', // 'success' o 'danger'
      errors: []
    };
  },
  methods: {
    onFileChange(event) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        if (selectedFile.type === 'text/csv' || selectedFile.type === 'application/json') {
          this.file = selectedFile;
          this.message = '';
          this.errors = [];
        } else {
          this.message = 'Error: Tipo de archivo no permitido. Sube un .csv o .json.';
          this.messageType = 'danger';
          this.$refs.fileInput.value = ''; // Resetear el input
          this.file = null;
        }
      }
    },
    async handleFileUpload() {
      if (!this.file) {
        this.message = 'Por favor, selecciona un archivo primero.';
        this.messageType = 'danger';
        return;
      }

      this.isLoading = true;
      this.message = '';
      this.errors = [];

      const formData = new FormData();
      formData.append('archivo', this.file); // 'archivo' debe coincidir con el nombre en upload.single()

      try {
        // Asegúrate de que la URL de la API sea correcta
        const response = await axios.post('/api/alumnos/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        this.message = response.data.message;
        this.messageType = 'success';
        if (response.data.errors && response.data.errors.length > 0) {
          this.errors = response.data.errors;
          this.messageType = 'warning'; // Podría ser un éxito parcial
        }
        
        // Emitir evento para que el componente padre (ej. AlumnosHomeView) recargue la lista
        this.$emit('carga-exitosa');

      } catch (error) {
        console.error('Error al subir el archivo:', error);
        this.message = error.response?.data?.message || 'Ocurrió un error inesperado durante la carga.';
        this.messageType = 'danger';
        if (error.response?.data?.errors) {
            this.errors = error.response.data.errors;
        }
      } finally {
        this.isLoading = false;
        // Limpiar el input de archivo para poder subir otro
        this.$refs.fileInput.value = '';
        this.file = null;
      }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-actions {
  margin-top: 20px;
  text-align: right;
}

.alert {
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.alert-warning {
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeeba;
}
</style>