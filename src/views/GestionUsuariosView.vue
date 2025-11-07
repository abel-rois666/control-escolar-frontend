<template>
  <div class="gestion-usuarios-view">
    <h1>Gestión de Usuarios</h1>
    <p>Crea, edita y asigna permisos a los usuarios del sistema.</p>
    
    <div class="card">
      <SpinnerLoader v-if="cargando" />
      <table v-else>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Usuario (username)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td>{{ usuario.nombre_completo }}</td>
            <td>{{ usuario.username }}</td>
            <td>
              <button class="btn-edit" @click="editarUsuario(usuario.id)">Editar</button>
              <button 
                class="btn-delete" 
                @click="confirmarEliminacion(usuario.id)" 
                :disabled="usuario.id === 1 || usuario.id === authStore.user.userId"
              >
                Borrar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ConfirmModal
    :show="mostrarModal"
    title="Confirmar Eliminación"
    message="¿Estás seguro de que deseas eliminar a este usuario? Esta acción es permanente."
    @confirm="eliminarUsuario"
    @cancel="cerrarModal"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import { useAuthStore } from '../stores/auth.js';
// (Opcional: import { useRouter } from 'vue-router';)

const toast = useToast();
// const router = useRouter(); // (Opcional: para redirigir a la pág. de edición)
const authStore = useAuthStore(); // Para deshabilitar el borrado de uno mismo

const usuarios = ref([]);
const cargando = ref(true);
const mostrarModal = ref(false);
const usuarioAEliminar = ref(null);

const fetchUsuarios = async () => {
  cargando.value = true;
  try {
    const response = await apiClient.get('/usuarios');
    usuarios.value = response.data;
  } catch (error) {
    toast.error('Error al cargar la lista de usuarios.');
  } finally {
    cargando.value = false;
  }
};

onMounted(fetchUsuarios);

const editarUsuario = (id) => {
  // (Paso futuro: redirigir al formulario de edición)
  // router.push(`/config/usuarios/${id}/editar`);
  toast.info('La edición de usuarios se implementará en el siguiente paso.');
};

const confirmarEliminacion = (id) => {
  usuarioAEliminar.value = id;
  mostrarModal.value = true;
};

const cerrarModal = () => {
  usuarioAEliminar.value = null;
  mostrarModal.value = false;
};

const eliminarUsuario = async () => {
  if (!usuarioAEliminar.value) return;
  try {
    await apiClient.delete(`/usuarios/${usuarioAEliminar.value}`);
    toast.success('Usuario eliminado exitosamente.');
    fetchUsuarios(); // Recargar la lista
  } catch (error) {
    const msg = error.response?.data?.error || 'Error al eliminar el usuario.';
    toast.error(msg);
  } finally {
    cerrarModal();
  }
};
</script>

<style scoped>
.gestion-usuarios-view { max-width: 900px; margin: auto; }
.card { background-color: #fff; border: 1px solid #DFE0EB; border-radius: 8px; padding: 1.5rem; }
table { width: 100%; border-collapse: collapse; }
th, td { border-bottom: 1px solid #ddd; padding: 12px; text-align: left; }
th { background-color: #f8f9fa; }
button { padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px; }
.btn-edit { background-color: #ffc107; color: black; }
.btn-delete { background-color: #dc3545; color: white; }
.btn-delete:disabled { background-color: #9FA2B4; cursor: not-allowed; }
</style>