<template>
  <div class="generar-cargos-view">
    <SpinnerLoader v-if="cargando" />
    <div v-if="!cargando && alumno">
      <div class="success-message">
        <span class="checkmark">✓</span>
        <h2>¡Alumno {{ alumno.nombre_completo }} creado exitosamente!</h2>
      </div>

      <div class="card">
        <h3>Siguiente Paso: Generar Cargos del Ciclo</h3>
        <p>
          Asigna una fecha de vencimiento a cada concepto del plan de pago <strong>"{{ plan.nombre_lista }}"</strong>.
        </p>
        <p class="subtle">
          Si prefieres, puedes omitir este paso y hacerlo más tarde desde la ficha del alumno.
        </p>

        <div class="form-group-ciclo">
            <label>Ciclo Escolar donde se aplicarán los cargos:</label>
            <select v-model="cicloSeleccionadoId" required>
                <option v-for="ciclo in ciclos" :key="ciclo.id" :value="ciclo.id">
                    {{ ciclo.codigo }} - {{ ciclo.descripcion }}
                </option>
            </select>
        </div>
        
        <h4>Conceptos a generar:</h4>
        <ul class="conceptos-lista">
            <li v-for="cargo in cargosParaGenerar" :key="cargo.concepto_id">
                <span>{{ cargo.nombre_concepto }} - <strong>${{ parseFloat(cargo.monto).toFixed(2) }}</strong></span>
                <div class="form-group-fecha">
                    <label :for="`fecha-${cargo.concepto_id}`">Fecha de Vencimiento:</label>
                    <input :id="`fecha-${cargo.concepto_id}`" type="date" v-model="cargo.fecha_vencimiento" required />
                </div>
            </li>
        </ul>

        <div class="form-actions">
          <button @click="generarCargos" class="btn-primary">Generar Cargos</button>
          <RouterLink to="/alumnos/gestion" class="btn-secondary">Hacerlo más tarde</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '../services/api.js';
import SpinnerLoader from '../components/SpinnerLoader.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const cargando = ref(true);
const alumno = ref(null);
const plan = ref({ items: [] });
const ciclos = ref([]);
const cicloSeleccionadoId = ref(null);
const cargosParaGenerar = ref([]);

onMounted(async () => {
  const alumnoId = route.params.id;
  try {
    const [alumnoRes, ciclosRes] = await Promise.all([
        apiClient.get(`/alumnos/${alumnoId}`),
        apiClient.get('/ciclos-escolares')
    ]);
    
    alumno.value = alumnoRes.data;
    ciclos.value = ciclosRes.data;

    if (ciclos.value.length > 0) {
      const hoy = new Date();
      const cicloActual = ciclos.value.find(c => hoy >= new Date(c.fecha_inicio) && hoy <= new Date(c.fecha_fin));
      cicloSeleccionadoId.value = cicloActual ? cicloActual.id : ciclos.value[0].id;
    }
    
    if (alumno.value) {
        const planRes = await apiClient.get(`/listas-precios/${alumno.value.lista_de_precios_id}`);
        plan.value = planRes.data;

        // Preparamos el arreglo con fechas por defecto
        cargosParaGenerar.value = plan.value.items.map(item => ({
            ...item,
            fecha_vencimiento: new Date().toISOString().split('T')[0]
        }));
    }

  } catch (error) {
    toast.error("Error al cargar la información.");
  } finally {
    cargando.value = false;
  }
});

const generarCargos = async () => {
    if (!cicloSeleccionadoId.value) {
        toast.warning("Por favor, selecciona un ciclo escolar.");
        return;
    }

    // Filtramos para enviar solo los datos necesarios
    const payload = cargosParaGenerar.value.map(cargo => ({
        concepto_id: cargo.concepto_id,
        fecha_vencimiento: cargo.fecha_vencimiento
    }));
    
    cargando.value = true;
    try {
        await apiClient.post(`/alumnos/${alumno.value.id}/generar-cargos`, {
            ciclo_id: cicloSeleccionadoId.value,
            cargos: payload
        });
        toast.success("Cargos del plan generados exitosamente.");
        router.push(`/alumnos/${alumno.value.id}`);
    } catch (error) {
        toast.error("Error al generar los cargos.");
        cargando.value = false;
    }
};
</script>

<style scoped>
.generar-cargos-view { max-width: 800px; margin: auto; }
.success-message { text-align: center; margin-bottom: 2rem; }
.success-message h2 { color: #28a745; }
.checkmark {
  display: inline-block;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #28a745;
  color: white;
  font-size: 2rem;
  line-height: 50px;
  margin-bottom: 1rem;
}
.card { background-color: #fff; border: 1px solid #DFE0EB; border-radius: 8px; padding: 2rem; text-align: center; }
.subtle { color: #6c757d; font-size: 0.9rem; }
.form-group-ciclo { text-align: left; margin-bottom: 2rem; }
.form-group-ciclo label { font-weight: bold; margin-bottom: 0.5rem; display: block; }
.form-group-ciclo select { width: 100%; padding: 0.6rem; border-radius: 6px; border: 1px solid #DFE0EB; }
.conceptos-lista { list-style: none; padding: 0; margin: 1rem 0 2rem 0; text-align: left; }
.conceptos-lista li { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    background-color: #f8f9fa; 
    padding: 0.75rem; 
    border-radius: 4px; 
    margin-bottom: 0.75rem; 
}
.form-group-fecha { display: flex; align-items: center; gap: 0.5rem; }
.form-group-fecha label { font-size: 0.9rem; }
.form-group-fecha input { padding: 0.4rem; border-radius: 6px; border: 1px solid #DFE0EB; }
.form-actions { display: flex; justify-content: center; gap: 1rem; }
.btn-primary { background-color: #3751FF; color: white; }
.btn-secondary { background-color: #6c757d; color: white; text-decoration: none; }
button, .btn-secondary { padding: 0.8rem 1.5rem; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; }
</style>