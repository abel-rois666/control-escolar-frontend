// src/main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import ConceptosView from './views/ConceptosView.vue'
import ListasView from './views/ListasView.vue'
import ListaDetalleView from './views/ListaDetalleView.vue'
import AlumnosView from './views/AlumnosView.vue'
import AlumnoDetalleView from './views/AlumnoDetalleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/alumnos'
    },
    {
      path: '/conceptos',
      name: 'conceptos',
      component: ConceptosView
    },
    {
      path: '/listas-precios',
      name: 'listas-precios',
      component: ListasView
    },
    {
      path: '/listas-precios/:id',
      name: 'lista-detalle',
      component: ListaDetalleView
    },
    {
      path: '/alumnos',
      name: 'alumnos',
      component: AlumnosView
    },
    {
      path: '/alumnos/:id',
      name: 'alumno-detalle',
      component: AlumnoDetalleView
    }
  ]
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')