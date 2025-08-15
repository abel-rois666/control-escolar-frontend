<template>
    <div class="recibo-template">
        <table class="main-table">
            <thead>
                <tr>
                    <td colspan="4" class="header-cell">
                        <img src="@/assets/06-Logo_CUOM_v3_ConFondoAmpliado.jpg" alt="Logo CUOM" class="logo" />
                        <span>CENTRO UNIVERSITARIO ORIENTE DE MÉXICO</span>
                    </td>
                    <td colspan="2" class="folio-cell"><strong>N° Folio:</strong> {{ recibo.folio }}</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="label">RECIBIMOS DE:</td>
                    <td colspan="3">{{ alumno.nombre_completo }}</td>
                    <td class="label">FECHA DE PAGO:</td>
                    <td>{{ formatDate(recibo.fecha_pago) }}</td>
                </tr>
                <tr>
                    <td class="label">ALUMNO (A) DEL:</td>
                    <td>{{ alumno.grado || 'N/A' }}</td>
                    <td class="label">TURNO:</td>
                    <td>{{ alumno.turno || 'N/A' }}</td>
                    <td class="label">FECHA DE RECIBO:</td>
                    <td>{{ formatDate(recibo.created_at) }}</td>
                </tr>
                <tr>
                    <td class="label">LICENCIATURA:</td>
                    <td colspan="3">{{ alumno.carrera }}</td>
                    <td colspan="2" style="border: none;"></td>
                </tr>
                
                <tr>
                    <td colspan="6" class="nested-table-cell">
                        <table>
                            <thead>
                                <tr>
                                    <th>CANT.</th>
                                    <th>CONCEPTO</th>
                                    <th>FORMA DE PAGO</th>
                                    <th>BANCO</th>
                                    <th>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="detalle in recibo.detalles" :key="detalle.nombre_concepto">
                                    <td>1</td>
                                    <td>
                                        <span v-if="parseFloat(detalle.monto_aplicado) < parseFloat(detalle.monto_total_cargo)">
                                            Abono a: {{ detalle.nombre_concepto }}
                                        </span>
                                        <span v-else>
                                            {{ detalle.nombre_concepto }}
                                        </span>
                                    </td>
                                    <td>{{ recibo.forma_pago }}</td>
                                    <td>{{ recibo.banco || 'N/A' }}</td>
                                    <td>${{ parseFloat(detalle.monto_aplicado).toFixed(2) }}</td>
                                </tr>
                                <tr v-for="n in (2 - recibo.detalles.length)" :key="n">
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>

                <tr class="footer-row">
                    <td colspan="3" class="firma-cell">
                        <div class="firma-linea"></div>
                        FIRMA CAJERO
                    </td>
                    <td class="label total-label">TOTAL:</td>
                    <td colspan="2" class="total-amount">${{ parseFloat(recibo.monto_total_recibido).toFixed(2) }}</td>
                </tr>
                 <tr>
                    <td colspan="6" class="disclaimer">
                        RECIBO SIN VALOR FISCAL, ÚNICAMENTE PARA CONTROL ESCOLAR
                    </td>
                </tr>
                <tr>
                    <td colspan="6" class="copia-info">
                        {{ copia }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const props = defineProps({
    recibo: Object,
    alumno: Object,
    copia: String
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC'
  });
};
</script>

<style scoped>
.recibo-template {
    border: 1px solid #000;
    font-family: Arial, Helvetica, sans-serif;
    page-break-inside: avoid;
    line-height: 1.2;
}
.main-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 7.5pt;
}
.main-table td {
    border: 1px solid #000;
    padding: 2px 4px;
    vertical-align: top;
}
.header-cell {
    text-align: center;
    font-size: 9pt;
    font-weight: bold;
}
.folio-cell {
    text-align: center;
    vertical-align: middle;
}
.logo {
    height: 30px;
    float: left;
    margin-right: 10px;
}
.label {
    font-weight: bold;
    background-color: #f2f2f2;
    width: 12%;
}
.nested-table-cell {
    padding: 0;
}
.nested-table-cell table {
    width: 100%;
    border-collapse: collapse;
}
.nested-table-cell th, .nested-table-cell td {
    border: 1px solid #ccc;
    padding: 3px;
    text-align: center;
}
.nested-table-cell th {
    font-weight: bold;
    background-color: #f2f2f2;
}
.footer-row {
    height: 45px;
}
.firma-cell {
    text-align: center;
    padding-top: 20px;
    font-size: 6.5pt;
}
.firma-linea {
    border-bottom: 1px solid #000;
    width: 60%;
    margin: 0 auto 2px auto;
}
.total-label {
    text-align: right;
    vertical-align: middle;
}
.total-amount {
    font-weight: bold;
    font-size: 9pt;
    text-align: center;
    vertical-align: middle;
}
.disclaimer {
    text-align: center;
    font-weight: bold;
    font-size: 6.5pt;
    padding: 1px;
}
.copia-info {
    text-align: right;
    font-size: 6.5pt;
    font-style: italic;
    border: none;
    padding: 1px 4px;
}
</style>