<template>
  <div class="app-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Control Escolar</h2>
      </div>
      <nav class="main-nav">
        <RouterLink to="/dashboard">Panel de Control</RouterLink>
        <RouterLink to="/alumnos">Alumnos</RouterLink>
        <RouterLink to="/recibir-pagos">Recibir Pagos</RouterLink>
        <RouterLink to="/reportes">Reportes</RouterLink>
        <div class="nav-divider">Configuración</div>
        <RouterLink to="/conceptos">Asignar Concepto</RouterLink>
        <RouterLink to="/listas-precios">Plan de Pago</RouterLink>
      </nav>
    </aside>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 260px;
  background-color: #363740; /* <-- Color oscuro del diseño */
  color: #A4A6B3; /* <-- Color de texto grisáceo */
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  padding: 1.5rem;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #4a4a4a;
}
.main-nav {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-top: 1rem;
}
.main-nav a {
  color: #A4A6B3;
  text-decoration: none;
  padding: 18px 24px;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}
.main-nav a:hover {
  background-color: rgba(159, 162, 180, 0.08);
  color: #DDE2FF;
}
.main-nav a.router-link-exact-active {
  background-color: rgba(159, 162, 180, 0.08);
  color: #DDE2FF;
  border-left-color: #DDE2FF;
}
.nav-divider {
  padding: 18px 24px;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #5e606b;
}
.main-content {
  flex-grow: 1;
  padding: 2rem;
}
</style>