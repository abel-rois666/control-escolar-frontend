<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>{{ title }}</h3>
      <p v-html="message"></p>
      <div class="modal-actions">
        <button class="btn-secondary" @click="$emit('secondaryAction')">{{ secondaryText }}</button>
        <button class="btn-primary" @click="$emit('primaryAction')">{{ primaryText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: 'Aviso' },
  message: { type: String, default: '¿Qué deseas hacer?' },
  primaryText: { type: String, default: 'Aceptar' },
  secondaryText: { type: String, default: 'Cancelar' },
});

defineEmits(['close', 'primaryAction', 'secondaryAction']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 450px;
  text-align: center;
}
.modal-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}
button {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}
.btn-primary {
  background-color: #3751FF;
  color: white;
}
.btn-secondary {
  background-color: #6c757d;
  color: white;
}
</style>