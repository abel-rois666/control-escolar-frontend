<template>
  <div class="editar-alumno-view">
    <SpinnerLoader v-if="cargando" />
    <div v-if="!cargando && alumno.id">
      <div class="header">
        <h1>Editando a: {{ alumnoOriginal.nombre_completo }}</h1>
        <RouterLink to="/alumnos/gestion" class="btn-secondary">← Volver a la búsqueda</RouterLink>
      </div>

      <div class="card">
        <form @submit.prevent="actualizarAlumno" class="form-editar-alumno">
          
          <fieldset>
            <legend>Datos Personales</legend>
            <div class="form-group">
              <label>Apellido Paterno*</label>
              <input v-model="alumno.apellido_paterno" required />
            </div>
            <div class="form-group">
              <label>Apellido Materno</label>
              <input v-model="alumno.apellido_materno" />
            </div>
            <div class="form-group">
              <label>Nombre(s)*</label>
              <input v-model="alumno.nombre" required />
            </div>

            <div class="form-group form-group-curp">
              <label>CURP</label>
              <input v-model="alumno.curp" placeholder="Clic en 'Generar'..." />
              <button type="button" @click="generarCURP" class="btn-generar">Generar</button>
            </div>

            <div class="form-group">
              <label>Fecha de Nacimiento</label>
              <input type="date" v-model="alumno.fecha_nacimiento" />
            </div>
            <div class="form-group">
              <label>Edad</label>
              <input type="number" v-model.number="alumno.edad" readonly disabled />
            </div>
            <div class="form-group">
              <label>Sexo</label>
              <select v-model="alumno.sexo">
                <option value="">Selecciona...</option>
                <option v-for="g in generos" :key="g.clave" :value="g.nombre">{{ g.nombre }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Estado Civil</label>
              <select v-model="alumno.estado_civil">
                <option value="">Selecciona...</option>
                <option v-for="e in estadosCiviles" :key="e" :value="e">{{ e }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nacionalidad</label>
              <input v-model="alumno.nacionalidad" />
            </div>
            <div class="form-group">
              <label>Lugar de Nacimiento</label>
              <input v-model="alumno.lugar_nacimiento" />
            </div>
            <div class="form-group">
              <label>Estado (Nacimiento)</label>
              <select v-model="alumno.estado_nacimiento">
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
              <input v-model="alumno.matricula" required />
            </div>
            <div class="form-group">
              <label>Licenciatura*</label>
              <select v-model="alumno.carrera" required>
                <option v-for="lic in licenciaturas" :key="lic.id" :value="lic.nombre">{{ lic.nombre }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Plan de Pago*</label>
              <select v-model="alumno.lista_de_precios_id" required>
                <option v-for="lista in listasDePrecios" :key="lista.id" :value="lista.id">{{ lista.nombre_lista }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Estatus</label>
              <select v-model="alumno.estatus" required>
                <option>Activo</option>
                <option>Baja</option>
                <option>Egresado</option>
              </select>
            </div>
            <div class="form-group">
              <label>Grado</label>
              <input v-model="alumno.grado" />
            </div>
            <div class="form-group">
              <label>Grupo</label>
              <input v-model="alumno.grupo" />
            </div>
            <div class="form-group">
              <label>Turno</label>
              <input v-model="alumno.turno" />
            </div>
            <div class="form-group">
              <label>Beca (%)</label>
              <input type="number" v-model.number="alumno.porcentaje_beca" max="100" min="0" />
            </div>
            <div class="form-group">
              <label>Fecha de Ingreso</label>
              <input type="date" v-model="alumno.fecha_ingreso" />
            </div>
             <div class="form-group">
              <label>Fecha de Baja</label>
              <input type="date" v-model="alumno.fecha_baja" />
            </div>
            <div class="form-group wide">
              <label>Motivo de Baja</label>
              <input v-model="alumno.motivo_baja" />
            </div>
          </fieldset>
          
          <fieldset>
            <legend>Datos de Contacto y Domicilio</legend>
            <div class="form-group">
              <label>Email Personal</label>
              <input type="email" v-model="alumno.email_personal" />
            </div>
            <div class="form-group">
              <label>Email Institucional</label>
              <input type="email" v-model="alumno.email_institucional" />
            </div>
            <div class="form-group">
              <label>Teléfono Celular</label>
              <input v-model="alumno.telefono_celular" />
            </div>
            <div class="form-group">
              <label>Teléfono Fijo</label>
              <input v-model="alumno.telefono_fijo" />
            </div>
            <div class="form-group">
              <label>Nombre del Tutor</label>
              <input v-model="alumno.nombre_tutor" />
            </div>
            <div class="form-group wide">
              <label>Calle y Número</label>
              <input v-model="alumno.calle_y_numero" />
            </div>
            <div class="form-group">
              <label>C.P.</label>
              <input v-model="alumno.cp" />
            </div>
            <div class="form-group">
              <label>Municipio</label>
              <input v-model="alumno.municipio" />
            </div>
            <div class="form-group">
              <label>Estado (Domicilio)</label>
              <select v-model="alumno.estado">
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
              <input v-model="alumno.escuela_procedencia" />
            </div>
            <div class="form-group">
              <label>Escolaridad (Procedencia)</label>
              <input v-model="alumno.escolaridad_procedencia" />
            </div>
            <div class="form-group">
              <label>Estado (Procedencia)</label>
              <select v-model="alumno.estado_escolaridad">
                <option value="">Selecciona un estado...</option>
                <option v-for="estado in estadosDeMexico" :key="estado.clave" :value="estado.nombre">
                  {{ estado.nombre }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Promedio Anterior</label>
              <input type="number" step="0.01" v-model.number="alumno.promedio_esc_anterior" />
            </div>
            <div class="form-group">
              <label>Fecha Egreso (Procedencia)</label>
              <input type="date" v-model="alumno.fecha_egreso" />
            </div>
            <div class="form-group">
              <label>¿Cómo conoció la escuela?</label>
              <input v-model="alumno.como_conocio_escuela" />
            </div>
            <div class="form-group wide">
              <label>Enlace Expediente Digital</label>
              <input v-model="alumno.enlace_expediente_digital" />
            </div>
            <div class="form-group wide">
              <label>Observaciones</label>
              <textarea v-model="alumno.observaciones"></textarea>
            </div>
          </fieldset>

          <div class="form-actions full-width">
            <button type="submit" class="btn-primary">Guardar Cambios</button>
            <button type="button" class="btn-delete" @click="abrirModalConfirmacion">Eliminar Alumno</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="mostrarModal"
    title="Confirmar Eliminación de Alumno"
    message="¿Estás seguro? Se eliminarán todos los cargos y pagos asociados a este alumno de forma permanente."
    @confirm="eliminarAlumno"
    @cancel="cerrarModalConfirmacion"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import SpinnerLoader from '../components/SpinnerLoader.vue';
import ConfirmModal from '../components/ConfirmModal.vue';
import { generar, getGeneros, getEstados } from 'curp'; 

const toast = useToast();
const router = useRouter();
const route = useRoute();

const alumno = ref({});
const alumnoOriginal = ref({});
const listasDePrecios = ref([]);
const licenciaturas = ref([]);
const cargando = ref(true);
const mostrarModal = ref(false);

// --- INICIO: Listas de opciones ---
const estadosCiviles = ref([
  'Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'En concubinato'
]);

// Se declaran como constantes, sin ref()
const estadosDeMexico = getEstados();
const generos = getGeneros(); 
// --- FIN: Listas de opciones ---

// --- INICIO: FUNCIÓN PARA GENERAR CURP ---
const generarCURP = () => {
  try {
    if (!alumno.value.nombre || !alumno.value.apellido_paterno || !alumno.value.fecha_nacimiento || !alumno.value.sexo || !alumno.value.estado_nacimiento) {
      toast.warning('Faltan datos para generar la CURP: Nombre, Apellido Paterno, Fecha Nacimiento, Sexo y Estado de Nacimiento.');
      return;
    }

    const estadoNacimiento = estadosDeMexico.find(e => e.nombre === alumno.value.estado_nacimiento);
    if (!estadoNacimiento) {
        toast.error("Estado de nacimiento no válido.");
        return;
    }

    const persona = {
      nombre: alumno.value.nombre,
      apellidoPaterno: alumno.value.apellido_paterno,
      apellidoMaterno: alumno.value.apellido_materno || '',
      genero: alumno.value.sexo === 'Masculino' ? 'HOMBRE' : 'MUJER',
      fechaNacimiento: alumno.value.fecha_nacimiento.replace(/-/g, '/'), // Formato DD/MM/YYYY
      estado: estadoNacimiento.clave 
    };

    const curpGenerada = generar(persona);
    alumno.value.curp = curpGenerada;
    toast.success("CURP generada exitosamente.");

  } catch (error) {
    console.error("Error al generar CURP:", error);
    toast.error(`Error al generar CURP: ${error.message}`);
  }
};
// --- FIN: FUNCIÓN PARA GENERAR CURP ---


// Función para formatear fechas para inputs tipo 'date'
const formatDateForInput = (dateString) => {
  if (!dateString) return null;
  return dateString.split('T')[0];
};

onMounted(async () => {
  const alumnoId = route.params.id;
  cargando.value = true;
  try {
    const [alumnoRes, listasRes, licRes] = await Promise.all([
      apiClient.get(`/alumnos/${alumnoId}`),
      apiClient.get('/listas-precios'),
      apiClient.get('/licenciaturas')
    ]);
    
    const data = alumnoRes.data;
    data.fecha_nacimiento = formatDateForInput(data.fecha_nacimiento);
    data.fecha_ingreso = formatDateForInput(data.fecha_ingreso);
    data.fecha_baja = formatDateForInput(data.fecha_baja);
    data.fecha_egreso = formatDateForInput(data.fecha_egreso);

    alumno.value = data;
    alumnoOriginal.value = { ...data }; 
    listasDePrecios.value = listasRes.data;
    licenciaturas.value = licRes.data;

    // Calcular edad al cargar
    if (alumno.value.fecha_nacimiento) {
        calcularEdad(alumno.value.fecha_nacimiento);
    }

  } catch (error) {
    toast.error("Error al cargar los datos para la edición.");
  } finally {
    cargando.value = false;
  }
});

const actualizarAlumno = async () => {
  try {
     const payload = { ...alumno.value };
    for (const key in payload) {
      if (payload[key] === '') {
        payload[key] = null;
      }
    }
    payload.edad = payload.edad ? parseInt(payload.edad) : null;
    payload.porcentaje_beca = payload.porcentaje_beca ? parseFloat(payload.porcentaje_beca) : 0;
    payload.promedio_esc_anterior = payload.promedio_esc_anterior ? parseFloat(payload.promedio_esc_anterior) : null;

    await apiClient.put(`/alumnos/${alumno.value.id}`, payload);
    toast.success("Alumno actualizado exitosamente.");
    router.push('/alumnos/gestion');
  } catch (error) {
     const errorMessage = error.response?.data?.error || 'Error desconocido';
    toast.error(`Error al actualizar alumno: ${errorMessage}`);
  }
};

const abrirModalConfirmacion = () => { mostrarModal.value = true; };
const cerrarModalConfirmacion = () => { mostrarModal.value = false; };

const eliminarAlumno = async () => {
  try {
    await apiClient.delete(`/alumnos/${alumno.value.id}`);
    toast.success("Alumno eliminado exitosamente.");
    router.push('/alumnos/gestion');
  } catch (error) {
    toast.error("Error al eliminar el alumno.");
  } finally {
    cerrarModalConfirmacion();
  }
};

// --- INICIO: Cálculo de Edad ---
const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) {
    alumno.value.edad = null;
    return;
  }
  try {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    if (nacimiento > hoy) {
        alumno.value.edad = null;
        return;
    }
    
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    alumno.value.edad = edad > 0 ? edad : 0;
  } catch(e) {
      alumno.value.edad = null;
  }
};

// Observa el campo de fecha de nacimiento y llama a la función
watch(() => alumno.value.fecha_nacimiento, (nuevaFecha) => {
  calcularEdad(nuevaFecha);
});
// --- FIN: Cálculo de Edad ---
</script>

<style scoped>
.editar-alumno-view { max-width: 1200px; margin: 0 auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.card { background-color: #fff; border: 1px solid #DFE0EB; border-radius: 8px; padding: 2rem; position: relative; min-height: 200px; }

.form-editar-alumno {
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

.btn-secondary { background-color: #6c757d; color: white; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; }
button { padding: 0.8rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; }
.btn-primary { background-color: #3751FF; color: white; }

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.btn-delete { background-color: #dc3545; color: white; }
</style>