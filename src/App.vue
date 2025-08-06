<template>
  <header>
    <nav>
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/conceptos">Conceptos</RouterLink>
      <RouterLink to="/listas-precios">Listas de Precios</RouterLink>
      <RouterLink to="/alumnos">Alumnos</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<style scoped>
header {
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}
nav {
  display: flex;
  gap: 1rem;
  font-size: 1.2rem;
}
nav a {
  text-decoration: none;
  color: #0d6efd;
}
nav a.router-link-exact-active {
  color: #000;
  font-weight: bold;
}
main {
  padding: 2rem;
}
</style>