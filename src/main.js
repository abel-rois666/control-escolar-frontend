import './assets/main.css';
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import MainLayout from './layouts/MainLayout.vue' // Importamos el layout
import Toast from "vue-toastification"; // <-- 1. IMPORTAR PLUGIN
import "vue-toastification/dist/index.css"; // <-- 2. IMPORTAR ESTILOS



// Importamos todas las vistas
import DashboardView from './views/DashboardView.vue'
import AlumnosView from './views/AlumnosView.vue'
import AlumnoDetalleView from './views/AlumnoDetalleView.vue'
import RecibirPagosView from './views/RecibirPagosView.vue'
import ReportesView from './views/ReportesView.vue'
import ConceptosView from './views/ConceptosView.vue'
import ListasView from './views/ListasView.vue'
import ListaDetalleView from './views/ListaDetalleView.vue'
import EstadoCuentaView from './views/EstadoCuentaView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      redirect: '/dashboard',
      children: [
        { path: 'dashboard', name: 'dashboard', component: DashboardView },
        { path: 'alumnos', name: 'alumnos', component: AlumnosView },
        { path: 'alumnos/:id', name: 'alumno-detalle', component: AlumnoDetalleView },
        { path: 'recibir-pagos', name: 'recibir-pagos', component: RecibirPagosView },
        { path: 'reportes', name: 'reportes', component: ReportesView },
        { path: 'conceptos', name: 'conceptos', component: ConceptosView },
        { path: 'listas-precios', name: 'listas-precios', component: ListasView },
        { path: 'listas-precios/:id', name: 'lista-detalle', component: ListaDetalleView },
        { path: 'alumnos/:id/estado-de-cuenta', name: 'estado-cuenta', component: EstadoCuentaView},
        
      ]
    }
  ]
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Toast); // <-- 3. USAR EL PLUGIN
app.mount('#app')