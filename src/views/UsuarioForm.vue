<template>
  <div class="usuario-form-view">
    <SpinnerLoader v-if="cargando" />
    <div v-if="!cargando">
      <div class="header">
        <h1>{{ titulo }}</h1>
        <RouterLink to="/config/usuarios" class="btn-secondary">← Volver a la lista</RouterLink>
      </div>

      <div class="card">
        <form @submit.prevent="guardarUsuario">
          <fieldset>
            <legend>Información Principal</legend>
            <div class="form-group">
              <label>Nombre Completo*</label>
              <input v-model="usuario.nombre_completo" required />
            </div>
            <div class="form-group">
              <label>Nombre de Usuario (username)*</label>
              <input v-model="usuario.username" required />
            </div>
            <div class="form-group">
              <label>Contraseña</label>
              <input type="password" v-model="usuario.password" :placeholder="esEdicion ? 'Dejar en blanco para no cambiar' : 'Requerido'" :required="!esEdicion" />
            </div>
          </fieldset>

          <fieldset class="permisos-grid">
            <legend>Permisos del Sistema</legend>

            <div class="permiso-grupo">
              <strong>Módulo: Alumnos</strong>
              <label><input type="checkbox" v-model="usuario.permissions.alumnos_ver" /> Ver Alumnos</label>
              <label><input type="checkbox" v-model="usuario.permissions.alumnos_crear" /> Crear Alumnos</label>
              <label><input type="checkbox" v-model="usuario.permissions.alumnos_editar" /> Editar Alumnos</label>
              <label><input type="checkbox" v-model="usuario.permissions.alumnos_eliminar" /> Eliminar Alumnos</label>
              <label><input type="checkbox" v-model="usuario.permissions.alumnos_importar" /> Importar (Carga Masiva)</label>
            </div>
            
            <div class="permiso-grupo">
              <strong>Módulo: Pagos</strong>
              <label><input type="checkbox" v-model="usuario.permissions.pagos_recibir" /> Recibir Pagos</label>
              <label><input type="checkbox" v-model="usuario.permissions.pagos_ver_recibos" /> Consultar Recibos</label>
              <label><input type="checkbox" v-model="usuario.permissions.pagos_ver_historial" /> Ver Historial (en Ficha)</label>
              <label><input type="checkbox" v-model="usuario.permissions.pagos_ver_estado_cuenta" /> Ver Estado de Cuenta</label>
            </div>

            <div class="permiso-grupo">
              <strong>Módulo: Reportes</strong>
              <label><input type="checkbox" v-model="usuario.permissions.reportes_ver_adeudos" /> Ver Reporte Adeudos</label>
              <label><input type="checkbox" v-model="usuario.permissions.reportes_ver_ingresos" /> Ver Reporte Ingresos</label>
              <label><input type="checkbox" v-model="usuario.permissions.reportes_generar_certificados" /> Generar Certificados</label>
            </div>

            <div class="permiso-grupo">
              <strong>Módulo: Herramientas</strong>
              <label><input type="checkbox" v-model="usuario.permissions.herramientas_generar_xml" /> Generar XML</label>
            </div>

            <div class="permiso-grupo">
              <strong>Módulo: Configuración</strong>
              <label><input type="checkbox" v-model="usuario.permissions.config_ver_ciclos" /> Ver Ciclos</label>
              <label><input type="checkbox" v-model="usuario.permissions.config_ver_licenciaturas" /> Ver Licenciaturas</label>
              <label><input type="checkbox" v-model="usuario.permissions.config_ver_conceptos" /> Ver Conceptos</label>
              <label><input type="checkbox" v-model="usuario.permissions.config_ver_planes" /> Ver Planes de Pago</label>
              <label><input type="checkbox" v-model="usuario.permissions.config_ver_usuarios" /> Ver Gestión de Usuarios</label>
              <label><input type="checkbox" v-model="usuario.permissions.usuarios_crear" /> Crear Usuarios</label>
              <label><input type="checkbox" v-model="usuario.permissions.usuarios_editar" /> Editar Usuarios</label>
              <label><input type="checkbox" v-model="usuario.permissions.usuarios_eliminar" /> Eliminar Usuarios</label>
            </div>

          </fieldset>

          <div class="form-actions">
            <button type="submit" class="btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const cargando = ref(true);
const usuarioId = ref(route.params.id || null);
const esEdicion = computed(() => !!usuarioId.value);
const titulo = computed(() => esEdicion.value ? 'Editar Usuario' : 'Crear Nuevo Usuario');

// Define la estructura por defecto de un usuario nuevo
const usuarioDefault = {
  nombre_completo: '',
  username: '',
  password: '',
  permissions: {
    // Pon los permisos mínimos que un usuario nuevo debería tener
    "alumnos_ver": true,
    "pagos_recibir": true
  }
};
const usuario = ref(JSON.parse(JSON.stringify(usuarioDefault))); // Copia profunda

onMounted(async () => {
  if (esEdicion.value) {
    // Modo Edición: Cargar datos del usuario
    try {
      const response = await apiClient.get(`/usuarios/${usuarioId.value}`);
      usuario.value = response.data;
      usuario.value.password = ''; // Limpiar campo de contraseña
    } catch (error) {
      toast.error('Error al cargar el usuario para editar.');
      router.push('/config/usuarios');
    }
  } else {
    // Modo Creación: Ya estamos listos
    usuario.value = JSON.parse(JSON.stringify(usuarioDefault));
  }
  cargando.value = false;
});

const guardarUsuario = async () => {
  cargando.value = true;
  try {
    const payload = { ...usuario.value };
    
    // Si la contraseña está vacía en modo edición, no la enviamos
    if (esEdicion.value && (!payload.password || payload.password.trim() === '')) {
      delete payload.password;
    }

    if (esEdicion.value) {
      // --- ACTUALIZAR ---
      await apiClient.put(`/usuarios/${usuarioId.value}`, payload);
      toast.success('Usuario actualizado exitosamente.');
    } else {
      // --- CREAR ---
      await apiClient.post('/usuarios', payload);
      toast.success('Usuario creado exitosamente.');
    }
    router.push('/config/usuarios');

  } catch (error) {
    const msg = error.response?.data?.error || 'Error al guardar el usuario.';
    toast.error(msg);
    cargando.value = false;
  }
};
</script>

<style scoped>
.usuario-form-view { max-width: 1000px; margin: 0 auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.card { background-color: #fff; border: 1px solid #DFE0EB; border-radius: 8px; padding: 2rem; }
form { display: flex; flex-direction: column; gap: 2rem; }
fieldset { border: 1px solid #DFE0EB; border-radius: 8px; padding: 1.5rem; }
legend { font-weight: bold; font-size: 1.1rem; padding: 0 0.5rem; color: #3751FF; }

/* Grid para info principal */
fieldset:first-of-type {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.form-group { display: flex; flex-direction: column; }
.form-group label { margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: bold; }
.form-group input { padding: 0.6rem; border-radius: 6px; border: 1px solid #DFE0EB; }

/* Grid para permisos */
.permisos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}
.permiso-grupo { display: flex; flex-direction: column; gap: 0.75rem; }
.permiso-grupo strong { margin-bottom: 0.5rem; }
.permiso-grupo label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }

.form-actions { display: flex; justify-content: flex-end; }
button { padding: 0.8rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; }
.btn-primary { background-color: #3751FF; color: white; }
.btn-secondary { background-color: #6c757d; color: white; text-decoration: none; padding: 0.5rem 1rem; }
</style>