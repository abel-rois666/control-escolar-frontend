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

          <div class="form-group form-group-curp">
            <label>CURP</label>
            <input v-model="nuevoAlumno.curp" placeholder="Clic en 'Generar'..." />
            <button type="button" @click="generarCURP" class="btn-generar">Generar</button>
          </div>

          <div class="form-group">
            <label>Fecha de Nacimiento</label>
            <input type="date" v-model="nuevoAlumno.fecha_nacimiento" />
          </div>
          <div class="form-group">
            <label>Edad</label>
            <input type="number" v-model.number="nuevoAlumno.edad" readonly disabled />
          </div>
          <div class="form-group">
            <label>Sexo</label>
            <select v-model="nuevoAlumno.sexo">
              <option value="">Selecciona...</option>
              <option v-for="g in generos" :key="g.clave" :value="g.nombre">{{ g.nombre }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Estado Civil</label>
            <select v-model="nuevoAlumno.estado_civil">
              <option value="">Selecciona...</option>
              <option v-for="e in estadosCiviles" :key="e" :value="e">{{ e }}</option>
            </select>
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
            <select v-model="nuevoAlumno.estado_nacimiento">
              <option value="">Selecciona un estado...</option>
              <option v-for="estado in estadosDeMexico" :key="estado.clave" :value="estado.nombre">
                {{ estado.nombre }}
              </option>
            </select>
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
            <select v-model="nuevoAlumno.estado">
              <option value="">Selecciona un estado...</option>
              <option v-for="estado in estadosDeMexico" :key="estado.clave" :value="estado.nombre">
                {{ estado.nombre }}
              </option>
            </select>
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
            <select v-model="nuevoAlumno.estado_escolaridad">
              <option value="">Selecciona un estado...</option>
              <option v-for="estado in estadosDeMexico" :key="estado.clave" :value="estado.nombre">
                {{ estado.nombre }}
              </option>
            </select>
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
import { ref, onMounted, watch } from 'vue'; 
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import { useRouter, RouterLink } from 'vue-router';
import SpinnerLoader from '../components/SpinnerLoader.vue';
import { generar, getGeneros, getEstados } from 'curp';

const toast = useToast();
const router = useRouter();
const listasDePrecios = ref([]);
const licenciaturas = ref([]);
const cargando = ref(true);

// --- INICIO: Listas de opciones ---
const estadosCiviles = ref([
  'Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'En concubinato'
]);

// Se declaran como constantes, sin ref()
const estadosDeMexico = getEstados();
const generos = getGeneros(); 
// --- FIN: Listas de opciones ---

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
  email_personal: '',
  telefono_celular: '',
  nombre_tutor: '',
  porcentaje_beca: 0,
  estatus: 'Activo',
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
  nacionalidad: 'Mexicana', 
  escuela_procedencia: '',
  escolaridad_procedencia: '',
  estado_escolaridad: '',
  fecha_egreso: null,
  fecha_ingreso: null,
  promedio_esc_anterior: null,
  como_conocio_escuela: '',
  enlace_expediente_digital: ''
});

// --- INICIO: FUNCIÓN PARA GENERAR CURP ---
const generarCURP = () => {
  try {
    if (!nuevoAlumno.value.nombre || !nuevoAlumno.value.apellido_paterno || !nuevoAlumno.value.fecha_nacimiento || !nuevoAlumno.value.sexo || !nuevoAlumno.value.estado_nacimiento) {
      toast.warning('Faltan datos para generar la CURP: Nombre, Apellido Paterno, Fecha Nacimiento, Sexo y Estado de Nacimiento.');
      return;
    }
    
    const estadoNacimiento = estadosDeMexico.find(e => e.nombre === nuevoAlumno.value.estado_nacimiento);
    if (!estadoNacimiento) {
        toast.error("Estado de nacimiento no válido.");
        return;
    }

    const persona = {
      nombre: nuevoAlumno.value.nombre,
      apellidoPaterno: nuevoAlumno.value.apellido_paterno,
      apellidoMaterno: nuevoAlumno.value.apellido_materno || '',
      genero: nuevoAlumno.value.sexo === 'Masculino' ? 'HOMBRE' : 'MUJER',
      fechaNacimiento: nuevoAlumno.value.fecha_nacimiento.replace(/-/g, '/'), // Formato DD/MM/YYYY
      estado: estadoNacimiento.clave 
    };

    const curpGenerada = generar(persona);
    nuevoAlumno.value.curp = curpGenerada;
    toast.success("CURP generada exitosamente.");

  } catch (error) {
    console.error("Error al generar CURP:", error);
    toast.error(`Error al generar CURP: ${error.message}`);
  }
};
// --- FIN: FUNCIÓN PARA GENERAR CURP ---

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
    const payload = { ...nuevoAlumno.value };
    for (const key in payload) {
      if (payload[key] === null || payload[key] === '') {
        payload[key] = null; 
      }
    }
    payload.edad = payload.edad ? parseInt(payload.edad) : null;
    payload.porcentaje_beca = payload.porcentaje_beca ? parseFloat(payload.porcentaje_beca) : 0;
    payload.promedio_esc_anterior = payload.promedio_esc_anterior ? parseFloat(payload.promedio_esc_anterior) : null;

    const response = await apiClient.post('/alumnos', payload);
    const alumnoCreado = response.data;
    
    router.push({ 
        name: 'generar-cargos', 
        params: { id: alumnoCreado.id } 
    });

  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Error desconocido';
    toast.error(`Error al crear alumno: ${errorMessage}`);
  }
};

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) {
    nuevoAlumno.value.edad = null;
    return;
  }
  try {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    if (nacimiento > hoy) {
        nuevoAlumno.value.edad = null;
        return;
    }
    
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    nuevoAlumno.value.edad = edad > 0 ? edad : 0;
  } catch(e) {
      nuevoAlumno.value.edad = null;
  }
};

watch(() => nuevoAlumno.value.fecha_nacimiento, (nuevaFecha) => {
  calcularEdad(nuevaFecha);
});

onMounted(fetchRequiredData);
</script>

<style scoped>
.crear-alumno-view { max-width: 1200px; margin: 0 auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.card { background-color: #fff; border: 1px solid #DFE0EB; border-radius: 8px; padding: 2rem; position: relative; min-height: 200px; }

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
  background-color: #fff; 
  color: #2c3e50; /* <-- CORRECCIÓN: Asegura texto oscuro en el <select> */
}
/* CORRECCIÓN: Asegura que las opciones también tengan texto oscuro */
.form-group select option {
  background-color: #fff;
  color: #2c3e50;
}

.form-group textarea { min-height: 80px; }

.form-group input:disabled {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.form-group-curp {
  position: relative;
}
.form-group-curp input {
  padding-right: 80px; 
}
.btn-generar {
  position: absolute;
  right: 5px;
  top: 30px; 
  height: calc(1.2rem + 10px); 
  padding: 0 0.5rem;
  font-size: 0.75rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-group.wide { grid-column: span 2; }
.form-group.full { grid-column: span 3; }

.full-width { 
  grid-column: 1 / -1; 
  margin-top: 1rem; 
}
.btn-secondary { background-color: #6c757d; color: white; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; }
button { padding: 0.8rem 1.5rem; border: none; background-color: #3751FF; color: white; border-radius: 8px; cursor: pointer; font-size: 1rem; }
</style>