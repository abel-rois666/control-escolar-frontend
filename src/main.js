// src/main.js
import './assets/main.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import MainLayout from './layouts/MainLayout.vue'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Vistas
import DashboardView from './views/DashboardView.vue'
import AlumnosHomeView from './views/AlumnosHomeView.vue'
import AlumnoConsultaView from './views/AlumnoConsultaView.vue'; // <-- VISTA NUEVA
import AlumnoCrearView from './views/AlumnoCrearView.vue'
import AlumnoDetalleView from './views/AlumnoDetalleView.vue'
import AlumnoPagoView from './views/AlumnoPagoView.vue';
import RecibirPagosView from './views/RecibirPagosView.vue'
import ReportesView from './views/ReportesView.vue'
import ConceptosView from './views/ConceptosView.vue'
import ListasView from './views/ListasView.vue'
import ListaDetalleView from './views/ListaDetalleView.vue'
import EstadoCuentaView from './views/EstadoCuentaView.vue';
import CiclosView from './views/CiclosView.vue';
import LicenciaturasView from './views/LicenciaturasView.vue';
import AlumnoGestionView from './views/AlumnoGestionView.vue';
import AlumnoEditarFormView from './views/AlumnoEditarFormView.vue';
import ReciboView from './views/ReciboView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      redirect: '/dashboard',
      children: [
        { path: 'dashboard', name: 'dashboard', component: DashboardView },
        
        { path: 'alumnos', name: 'alumnos', component: AlumnosHomeView },
        { path: 'alumnos/consulta-ficha', name: 'alumnos-consulta-ficha', component: AlumnoConsultaView }, // <-- RUTA NUEVA
        { path: 'alumnos/crear', name: 'alumnos-crear', component: AlumnoCrearView },
        { path: 'alumnos/gestion', name: 'alumnos-gestion', component: AlumnoGestionView },
        { path: 'alumnos/:id/editar', name: 'alumnos-editar', component: AlumnoEditarFormView },
        { path: 'alumnos/:id', name: 'alumno-detalle', component: AlumnoDetalleView },
        { path: 'alumnos/:id/recibir-pago', name: 'alumno-pago', component: AlumnoPagoView },
      
        { path: 'config/ciclos', name: 'config-ciclos', component: CiclosView },
        { path: 'config/licenciaturas', name: 'config-licenciaturas', component: LicenciaturasView },
        
        { path: 'recibir-pagos', name: 'recibir-pagos', component: RecibirPagosView },
        { path: 'reportes', name: 'reportes', component: ReportesView },
        { path: 'conceptos', name: 'conceptos', component: ConceptosView },
        { path: 'listas-precios', name: 'listas-precios', component: ListasView },
        { path: 'listas-precios/:id', name: 'lista-detalle', component: ListaDetalleView },
        { path: 'alumnos/:id/estado-de-cuenta', name: 'estado-cuenta', component: EstadoCuentaView },
        { path: 'recibos/:id', name: 'recibo-detalle', component: ReciboView },
      ]
    }
  ]
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast);

app.mount('#app')