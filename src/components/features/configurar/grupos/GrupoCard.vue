<script lang="ts" setup>
import { formatTime } from '@/composables/useDates'
import { ref, inject, Ref } from 'vue'

const grupo = inject<Ref<any>>('grupo:grupo')
const acciones = ref([
  {
    texto: "Editar",
    to: { name: 'configurar-grupo-editar' },
    icon: "lucide-pen-line"
  },
  {
    texto: "Eliminar",
    to: { name: 'configurar-grupo-eliminar' },
    icon: "lucide-trash"
  },
])
</script>

<template>
  <div>
    <div class="hstack gap-2 justify-content-end py-2">
      <BButton v-for="accion in acciones" :to="accion.to" variant="flat">
        <UIcon :name="accion.icon" /> {{ accion.texto }}
      </BButton>
    </div>
    <div class="vstack gap-4 px-3">
      <div class="w-100">
        <label class="form-label">Nombre</label>
        <div>
          {{ grupo.nombre }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Alias</label>
        <div>
          {{ grupo.apodo || '-' }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Etiquetas</label>
        <div>
          {{ grupo.label || '-' }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Descripción</label>
        <div>
          {{ grupo.descripcion || '-' }}
        </div>
      </div>
      <template v-if="grupo.modified_by">
        <div class="pt-3 border-top">
          <label class="form-label">Modificado</label>
          <div>
            {{ grupo.modified_by }},
            {{ formatTime(grupo.modified_on) }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>