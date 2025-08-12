<template>
  <div class="app-container">
    <aside class="sidebar">
      <RouterLink to="/dashboard" class="sidebar-header">
        <img :src="logo" alt="Logo CUOM" class="logo" />
        <h2>Control Escolar y de Cobranza CUOM</h2>
      </RouterLink>

      <nav class="main-nav">
        <RouterLink to="/dashboard">Panel de Control</RouterLink>
        <RouterLink to="/alumnos">Alumnos</RouterLink>
        <RouterLink to="/recibir-pagos">Recibir Pagos</RouterLink>
        <RouterLink to="/reportes">Reportes</RouterLink>

        <a @click="toggleConfigMenu" class="submenu-toggle">
          Configuración
          <span class="arrow" :class="{ 'open': isConfigOpen }">▶</span>
        </a>
        <div v-if="isConfigOpen" class="submenu">
          <RouterLink to="/config/ciclos">Ciclos Escolares</RouterLink>
          <RouterLink to="/config/licenciaturas">Licenciaturas</RouterLink>
          <RouterLink to="/conceptos">Conceptos de Cobro</RouterLink>
          <RouterLink to="/listas-precios">Planes de Pago</RouterLink>
        </div>
      </nav>
    </aside>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import logo from '@/assets/05-Logo_CUOM_v3_ConFondoBlanco.png';

const isConfigOpen = ref(false);

const toggleConfigMenu = () => {
  isConfigOpen.value = !isConfigOpen.value;
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
/* Estilos para que el header se comporte como un enlace */
.sidebar-header {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #2d3e5e;
  text-decoration: none; /* Quitamos el subrayado del enlace */
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
</style>