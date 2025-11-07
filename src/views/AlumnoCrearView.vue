<template>
  <div class="crear-alumno-view">
    <div class="header">
      <h1>Crear Nuevo Alumno</h1>
      <RouterLink to="/alumnos/gestion" class="btn-secondary">← Volver a Gestión</RouterLink>
    </div>

    <div class="card">
      <SpinnerLoader v-if="cargando" />
      <form v-else @submit.prevent="crearNuevoAlumno" class="form-crear-alumno">
        
        <fieldset>
          <legend>Datos Personales</legend>
          <div class="form-group">
            <label>Apellido Paterno*</label>
            <input v-model="nuevoAlumno.apellido_paterno" required />
          </div>
          <div class="form-group">
            <label>Apellido Materno</label>
            <input v-model="nuevoAlumno.apellido_materno" />
          </div>
          <div class="form-group">
            <label>Nombre(s)*</label>
            <input v-model="nuevoAlumno.nombre" required />
          </div>
          <div class="form-group">
            <label>CURP</label>
            <input v-model="nuevoAlumno.curp" />
          </div>
          <div class="form-group">
            <label>Fecha de Nacimiento</label>
            <input type="date" v-model="nuevoAlumno.fecha_nacimiento" />
          </div>
          <div class="form-group">
            <label>Edad</label>
            <input type="number" v-model.number="nuevoAlumno.edad" />
          </div>
          <div class="form-group">
            <label>Sexo</label>
            <select v-model="nuevoAlumno.sexo">
              <option value="">Selecciona...</option>
              <option>Masculino</option>
              <option>Femenino</option>
            </select>
          </div>
          <div class="form-group">
            <label>Estado Civil</label>
            <input v-model="nuevoAlumno.estado_civil" />
          </div>
          <div class="form-group">
            <label>Nacionalidad</label>
            <input v-model="nuevoAlumno.nacionalidad" />
          </div>
           <div class="form-group">
            <label>Lugar de Nacimiento</label>
            <input v-model="nuevoAlumno.lugar_nacimiento" />
          </div>
          <div class="form-group">
            <label>Estado (Nacimiento)</label>
            <input v-model="nuevoAlumno.estado_nacimiento" />
          </div>
        </fieldset>
        
        <fieldset>
          <legend>Datos Académicos</legend>
          <div class="form-group">
            <label>Matrícula*</label>
            <input v-model="nuevoAlumno.matricula" required />
          </div>
          <div class="form-group">
            <label>Licenciatura*</label>
            <select v-model="nuevoAlumno.carrera" required>
              <option disabled value="">Selecciona una licenciatura</option>
              <option v-for="lic in licenciaturas" :key="lic.id" :value="lic.nombre">
                {{ lic.nombre }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Plan de Pago*</label>
            <select v-model="nuevoAlumno.lista_de_precios_id" required>
              <option disabled value="">Selecciona un plan</option>
              <option v-for="lista in listasDePrecios" :key="lista.id" :value="lista.id">
                {{ lista.nombre_lista }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Estatus</label>
            <select v-model="nuevoAlumno.estatus" required>
              <option>Activo</option>
              <option>Baja</option>
              <option>Egresado</option>
            </select>
          </div>
          <div class="form-group">
            <label>Grado</label>
            <input v-model="nuevoAlumno.grado" />
          </div>
          <div class="form-group">
            <label>Grupo</label>
            <input v-model="nuevoAlumno.grupo" />
          </div>
          <div class="form-group">
            <label>Turno</label>
            <input v-model="nuevoAlumno.turno" />
          </div>
           <div class="form-group">
            <label>Beca (%)</label>
            <input type="number" v-model.number="nuevoAlumno.porcentaje_beca" max="100" min="0" />
          </div>
          <div class="form-group">
            <label>Fecha de Ingreso</label>
            <input type="date" v-model="nuevoAlumno.fecha_ingreso" />
          </div>
        </fieldset>
        
        <fieldset>
          <legend>Datos de Contacto y Domicilio</legend>
          <div class="form-group">
            <label>Email Personal</label>
            <input type="email" v-model="nuevoAlumno.email_personal" />
          </div>
          <div class="form-group">
            <label>Email Institucional</label>
            <input type="email" v-model="nuevoAlumno.email_institucional" />
          </div>
          <div class="form-group">
            <label>Teléfono Celular</label>
            <input v-model="nuevoAlumno.telefono_celular" />
          </div>
          <div class="form-group">
            <label>Teléfono Fijo</label>
            <input v-model="nuevoAlumno.telefono_fijo" />
          </div>
          <div class="form-group">
            <label>Nombre del Tutor</label>
            <input v-model="nuevoAlumno.nombre_tutor" />
          </div>
          <div class="form-group wide">
            <label>Calle y Número</label>
            <input v-model="nuevoAlumno.calle_y_numero" />
          </div>
          <div class="form-group">
            <label>C.P.</label>
            <input v-model="nuevoAlumno.cp" />
          </div>
          <div class="form-group">
            <label>Municipio</label>
            <input v-model="nuevoAlumno.municipio" />
          </div>
          <div class="form-group">
            <label>Estado (Domicilio)</label>
            <input v-model="nuevoAlumno.estado" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Historial Académico y Varios</legend>
          <div class="form-group">
            <label>Escuela de Procedencia</label>
            <input v-model="nuevoAlumno.escuela_procedencia" />
          </div>
          <div class="form-group">
            <label>Escolaridad (Procedencia)</label>
            <input v-model="nuevoAlumno.escolaridad_procedencia" />
          </div>
          <div class="form-group">
            <label>Estado (Procedencia)</label>
            <input v-model="nuevoAlumno.estado_escolaridad" />
          </div>
          <div class="form-group">
            <label>Promedio Anterior</label>
            <input type="number" step="0.01" v-model.number="nuevoAlumno.promedio_esc_anterior" />
          </div>
          <div class="form-group">
            <label>Fecha Egreso (Procedencia)</label>
            <input type="date" v-model="nuevoAlumno.fecha_egreso" />
          </div>
          <div class="form-group">
            <label>¿Cómo conoció la escuela?</label>
            <input v-model="nuevoAlumno.como_conocio_escuela" />
          </div>
          <div class="form-group wide">
            <label>Enlace Expediente Digital</label>
            <input v-model="nuevoAlumno.enlace_expediente_digital" />
          </div>
          <div class="form-group wide">
            <label>Observaciones</label>
            <textarea v-model="nuevoAlumno.observaciones"></textarea>
          </div>
        </fieldset>

        <button type="submit" class="full-width">Guardar Alumno y Continuar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import { useRouter, RouterLink } from 'vue-router';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const toast = useToast();
const router = useRouter();
const listasDePrecios = ref([]);
const licenciaturas = ref([]);
const cargando = ref(true);

const nuevoAlumno = ref({
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  matricula: '',
  lista_de_precios_id: '',
  carrera: '',
  grado: '',
  grupo: '',
  turno: '',
  email_personal: '', // Corregido de email_contacto
  telefono_celular: '',
  nombre_tutor: '',
  porcentaje_beca: 0,
  estatus: 'Activo',
  // --- Nuevos Campos ---
  sexo: '',
  curp: '',
  estado_civil: '',
  fecha_nacimiento: null,
  edad: null,
  calle_y_numero: '',
  cp: '',
  municipio: '',
  estado: '',
  telefono_fijo: '',
  observaciones: '',
  email_institucional: '',
  fecha_baja: null,
  motivo_baja: '',
  lugar_nacimiento: '',
  estado_nacimiento: '',
  nacionalidad: '',
  escuela_procedencia: '',
  escolaridad_procedencia: '',
  estado_escolaridad: '',
  fecha_egreso: null,
  fecha_ingreso: null,
  promedio_esc_anterior: null,
  como_conocio_escuela: '',
  enlace_expediente_digital: ''
});

const fetchRequiredData = async () => {
  cargando.value = true;
  try {
    const [listasRes, licRes] = await Promise.all([
      apiClient.get('/listas-precios'),
      apiClient.get('/licenciaturas')
    ]);
    listasDePrecios.value = listasRes.data;
    licenciaturas.value = licRes.data;
  } catch (error) {
    toast.error("Error al cargar datos de configuración.");
  } finally {
    cargando.value = false;
  }
};

const crearNuevoAlumno = async () => {
  try {
    // Filtramos valores nulos o vacíos que puedan causar problemas
    const payload = { ...nuevoAlumno.value };
    for (const key in payload) {
      if (payload[key] === null || payload[key] === '') {
        payload[key] = null; // Enviar null explícito a la DB
      }
    }
    // Aseguramos que los campos numéricos sean números o null
    payload.edad = payload.edad ? parseInt(payload.edad) : null;
    payload.porcentaje_beca = payload.porcentaje_beca ? parseFloat(payload.porcentaje_beca) : 0;
    payload.promedio_esc_anterior = payload.promedio_esc_anterior ? parseFloat(payload.promedio_esc_anterior) : null;


    const response = await apiClient.post('/alumnos', payload);
    const alumnoCreado = response.data;
    
    // Redirige a la nueva vista para generar cargos
    router.push({ 
        name: 'generar-cargos', 
        params: { id: alumnoCreado.id } 
    });

  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Error desconocido';
    toast.error(`Error al crear alumno: ${errorMessage}`);
  }
};

onMounted(fetchRequiredData);
</script>

<style scoped>
.crear-alumno-view { max-width: 1200px; margin: 0 auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.card { background-color: #fff; border: 1px solid #DFE0EB; border-radius: 8px; padding: 2rem; position: relative; min-height: 200px; }

/* Nuevo layout del formulario */
.form-crear-alumno {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

fieldset {
  border: 1px solid #DFE0EB;
  border-radius: 8px;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

legend {
  font-weight: bold;
  font-size: 1.1rem;
  padding: 0 0.5rem;
  color: #3751FF;
}

.form-group { display: flex; flex-direction: column; }
.form-group label { margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: bold; }
.form-group input, .form-group select, .form-group textarea { 
  padding: 0.6rem; 
  border-radius: 6px; 
  border: 1px solid #DFE0EB; 
  width: 100%; 
}
.form-group textarea { min-height: 80px; }

/* Clases para anchos de columna */
.form-group.wide { grid-column: span 2; }
.form-group.full { grid-column: span 3; }


.full-width { 
  grid-column: 1 / -1; 
  margin-top: 1rem; 
}
.btn-secondary { background-color: #6c757d; color: white; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; }
button { padding: 0.8rem 1.5rem; border: none; background-color: #3751FF; color: white; border-radius: 8px; cursor: pointer; font-size: 1rem; }
</style>