<template>
  <div class="alumnos-view">
    <h1>Alumnos</h1>
    <div class="cards-container">
      <RouterLink to="/alumnos/consulta-ficha" class="card consulta-card">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5q0-1.875-1.312-3.187T9.5 5Q7.625 5 6.313 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14"/></svg>
        </div>
        <h2>Consulta de Alumno</h2>
        <p>Busca y visualiza la ficha de un alumno existente.</p>
      </RouterLink>

      <RouterLink to="/alumnos/gestion" class="card crear-card">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9 12q-1.65 0-2.825-1.175T5 8q0-1.65 1.175-2.825T9 4q1.65 0 2.825 1.175T13 8q0 1.65-1.175 2.825T9 12m0 2q2.325 0 3.963 1.638T14.6 19.575q-.2.05-.4.088t-.425.037q-1.95 0-3.562-1.238T7.4 14.55q.75-1 2.2-1.55T12.45 12H9m8 4v-2h-2v-2h2V9h2v2h2v2h-2v2zM2 20v-2q0-.825.413-1.562T3.5 15.3q1.175-.8 2.638-1.25T9 13.6q2.075 0 3.813.638T15.75 16.2q.225.2.413.438T16.5 17.1q-.3.2-.625.338T15.2 17.6q-1.15-.8-2.512-1.2t-2.738-.4q-1.4 0-2.75.45T4.5 18H2Z"/></svg>
        </div>
        <h2>Crear o Editar Alumno</h2>
        <p>Registra un nuevo alumno o modifica sus datos.</p>
      </RouterLink>
    </div>
    <div class="logo-container">
      <img :src="logo" alt="Logo CUOM" class="logo-central" />
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import logo from '@/assets/06-Logo_CUOM_v3_ConFondoAmpliado.jpg';
</script>

<style scoped>
.alumnos-view { text-align: center; }
.cards-container { display: flex; justify-content: center; gap: 3rem; margin-top: 2rem; }
.card { width: 280px; height: 280px; border: 1px solid #DFE0EB; border-radius: 8px; background-color: #fff; text-decoration: none; color: #252733; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: all 0.3s ease; padding: 1.5rem; }
.card:hover { transform: translateY(-10px); border-color: #3751FF; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.card-icon { margin-bottom: 1rem; width: 64px; height: 64px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #fff; }
.consulta-card .card-icon { background-color: #29CC97; }
.crear-card .card-icon { background-color: #3751FF; }
.card h2 { font-size: 1.2rem; font-weight: bold; }
.card p { margin-top: 0.5rem; color: #9FA2B4; }
.logo-container { margin-top: 4rem; }
.logo-central { max-width: 200px; opacity: 0.5; }
</style>