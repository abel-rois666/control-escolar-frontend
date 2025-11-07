<template>
  <div class="app-container">
    <aside class="sidebar">
      <RouterLink to="/dashboard" class="sidebar-header">
        <img :src="logo" alt="Logo CUOM" class="logo" />
        <h2>Control Escolar y de Cobranza CUOM</h2>
      </RouterLink>

      <nav class="main-nav">
        <RouterLink to="/dashboard">Panel de Control</RouterLink>
        
        <RouterLink v-if="authStore.hasPermission('alumnos_ver')" to="/alumnos">Alumnos</RouterLink>
        <RouterLink v-if="authStore.hasPermission('pagos_recibir')" to="/recibir-pagos">Recibir Pagos</RouterLink>
        <RouterLink v-if="authStore.hasPermission('pagos_ver_recibos')" to="/consultar-recibos">Consultar Recibos</RouterLink>
        <RouterLink v-if="authStore.hasPermission('reportes_ver_adeudos')" to="/reportes">Reportes</RouterLink>
        <RouterLink v-if="authStore.hasPermission('reportes_generar_certificados')" to="/reportes/generar-certificados">Generar Certificados</RouterLink>
        
        <RouterLink v-if="authStore.hasPermission('herramientas_generar_xml')" to="/herramientas/generar-xml">Generar XML desde Excel</RouterLink> 
        <RouterLink v-if="authStore.hasPermission('alumnos_importar')" to="/alumnos/carga-masiva">Carga Masiva de Alumnos</RouterLink> 
        
        <a 
          v-if="authStore.hasPermission('config_ver_ciclos') || authStore.hasPermission('config_ver_licenciaturas') || authStore.hasPermission('config_ver_conceptos') || authStore.hasPermission('config_ver_planes') || authStore.hasPermission('config_ver_usuarios')"
          @click="toggleConfigMenu" 
          class="submenu-toggle"
        >
          Configuración
          <span class="arrow" :class="{ 'open': isConfigOpen }">▶</span>
        </a>
        <div v-if="isConfigOpen" class="submenu">
          <RouterLink v-if="authStore.hasPermission('config_ver_ciclos')" to="/config/ciclos">Ciclos Escolares</RouterLink>
          <RouterLink v-if="authStore.hasPermission('config_ver_licenciaturas')" to="/config/licenciaturas">Licenciaturas</RouterLink>
          <RouterLink v-if="authStore.hasPermission('config_ver_conceptos')" to="/conceptos">Conceptos de Cobro</RouterLink>
          <RouterLink v-if="authStore.hasPermission('config_ver_planes')" to="/listas-precios">Planes de Pago</RouterLink>
          <RouterLink v-if="authStore.hasPermission('config_ver_usuarios')" to="/config/usuarios">Gestión de Usuarios</RouterLink>
        </div>
        </nav>

      <div class="sidebar-footer">
        <a @click="logout" class="logout-button">
          Cerrar Sesión ({{ authUser }})
        </a>
      </div>
    </aside>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

// src/layouts/MainLayout.vue

<script setup>
import { ref, computed } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router'; 
import logo from '@/assets/05-Logo_CUOM_v3_ConFondoBlanco.png';

// --- INICIO: Bloque modificado ---
import { useAuthStore } from '../stores/auth.js'; 
const authStore = useAuthStore(); 
const router = useRouter(); // <-- CORRECTO (aquí sí es seguro usarlo)
// --- FIN: Bloque modificado ---

const isConfigOpen = ref(false);

const toggleConfigMenu = () => {
  isConfigOpen.value = !isConfigOpen.value;
};

const authUser = computed(() => {
  return authStore.user ? authStore.user.nombre_completo : 'Admin';
});

const logout = () => {
  authStore.logout(); // 1. El Store limpia el estado
  router.push('/login'); // 2. El Layout redirige
};
</script>

<style scoped>
.app-container { display: flex; min-height: 100vh; }
.sidebar {
  width: 260px;
  background-color: #192A4E;
  color: #A4A6B3;
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #2d3e5e;
  text-decoration: none;
}
.logo {
    max-width: 80px;
    margin-bottom: 1rem;
}
.sidebar-header h2 {
    font-size: 1rem;
    font-weight: bold;
    color: #fff;
}
.main-nav { display: flex; flex-direction: column; flex-grow: 1; padding-top: 1rem; }
.main-nav a {
  color: #A4A6B3;
  text-decoration: none;
  padding: 18px 24px;
  border-left: 3px solid transparent;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.main-nav a:hover {
  background-color: #2d3e5e;
}
.main-nav a.router-link-exact-active {
  background-color: rgba(159, 162, 180, 0.08);
  color: #DDE2FF;
  border-left-color: #DDE2FF;
}
.main-content {
  flex-grow: 1;
  padding: 2rem;
  background-color: #F7F8FC;
}
.submenu-toggle {
  cursor: pointer;
}
.arrow {
  transition: transform 0.3s ease;
}
.arrow.open {
  transform: rotate(90deg);
}
.submenu a {
  padding-left: 48px;
  background-color: #12213e;
}
.submenu a.router-link-exact-active {
  color: #fff;
  background-color: #0b1529;
}

/* --- REGLAS DE IMPRESIÓN MEJORADAS --- */
@media print {
  .sidebar {
    display: none !important; /* Ocultar la barra lateral al imprimir */
  }
  .main-content {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }
}

/* --- INICIO: Estilos añadidos para Cerrar Sesión --- */
.sidebar-footer {
  padding: 1rem 24px;
  border-top: 1px solid #2d3e5e;
  margin-top: auto; /* Empuja el footer hacia abajo */
}

.logout-button {
  display: block;
  color: #A4A6B3;
  text-decoration: none;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  border-radius: 8px;
}
.logout-button:hover {
  color: #DDE2FF;
  background-color: #2d3e5e;
}
/* --- FIN: Estilos añadidos --- */
</style>