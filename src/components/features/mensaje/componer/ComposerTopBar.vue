<script setup>
defineProps({
  continua: Boolean,
  saveEnabled: { type: Boolean, default: false }
})
const emit = defineEmits(['submit', 'update:continua', 'toggle-plantillas', 'save-plantilla'])
</script>

<template>
  <div class="composer-topbar">
    <!-- Top Bar 1 -->
    <div class="composer-topbar__main">
      <BButton v-tippy="'Enviar mensaje'" variant="flat-outline-primary" class="py-3 px-4 composer-topbar__send"
        @click="emit('submit')">
        <UIcon name="bi-send" class="fs-5" />
      </BButton>
      <label class="ps-4 composer-topbar__para">Para</label>
      <div class="flex-fill">
        <div class="d-flex gap-2 mb-3">
          <slot name="type-buttons" />
        </div>
        <slot name="selection" />
      </div>
    </div>
    <!-- Top Bar 2 -->
    <div class="composer-topbar__footer">
      <BFormCheckbox :model-value="continua" @update:model-value="v => emit('update:continua', v)">
        Mensaje con continuación
      </BFormCheckbox>
      <!-- Plantillas -->
      <div class="mx-auto">
        <BButton variant="flat-dark" class="py-1" @click="emit('toggle-plantillas')" v-tippy="'Ver plantillas'">
          <UIcon name="bi-card-text" /> Plantillas
        </BButton>
        <BButton variant="flat-dark" class="py-1" :disabled="!saveEnabled" @click="emit('save-plantilla')"
          v-tippy="'Guardar texto en plantillas'">
          <UIcon name="bi-floppy" />
        </BButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.composer-topbar__main {
  border-bottom: 1px solid var(--bs-border-color);
  display: flex;
  gap: .25rem;
  padding: .5rem;
  background-color: var(--bs-surface-1);
}

.composer-topbar__send {
  height: 80px;
}

.composer-topbar__para {
  position: relative;
  top: 2px;
}

.composer-topbar__footer {
  border-bottom: 1px solid var(--bs-border-color);
  display: flex;
  align-items: center;
  padding: .25rem .5rem;
  background-color: var(--bs-surface-2);
}

@media (min-width: 768px) {
  .composer-topbar__main {
    gap: 1rem;
    padding: 1rem;
  }

  .composer-topbar__footer {
    padding: .25rem 1rem;
  }
}
</style>