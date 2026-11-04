<script lang="ts" setup>
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
      <BButton v-tippy="'Enviar mensaje'" variant="flat-primary outline" class=" composer-topbar__send"
        @click="emit('submit')">
        <IBiSendFill class="fs-5 center" />
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
      <BFormCheckbox :model-value="continua" @update:model-value="v => emit('update:continua', v)" class="mb-0">
        Mensaje con continuación
      </BFormCheckbox>
      <!-- Plantillas -->
      <div class="mx-auto">
        <BButton variant="flat" class="h-36" @click="emit('toggle-plantillas')" style="padding-top: 5px;"
          v-tippy="'Ver plantillas'">
          <ILucideText /> Plantillas
        </BButton>
        <BButton variant="flat" class="wh-36" :disabled="!saveEnabled" @click="emit('save-plantilla')"
          v-tippy="'Guardar texto en plantillas'">
          <ILucideSave class="center" />
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
  /* height: 80px; */
  width: 76px;
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