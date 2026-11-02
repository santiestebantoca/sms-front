<script lang="ts" setup>
import { formatTime } from '@/composables/useDates'
import { ref, inject, Ref } from 'vue'

const suscriptor = inject<Ref<any>>('suscriptor:suscriptor')
const acciones = ref([
  {
    texto: "Editar",
    icon: "lucide-pen-line",
    to: { name: 'configurar-suscriptor-editar' }
  },
  {
    texto: "Eliminar",
    icon: "lucide-trash",
    to: { name: 'configurar-suscriptor-eliminar' }
  }
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
          {{ suscriptor.nombre }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Teléfono</label>
        <div>
          {{ suscriptor.telefono || '-' }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Correo</label>
        <div>
          {{ suscriptor.correo || '-' }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Cargo</label>
        <div>
          {{ suscriptor.cargo || '-' }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Grupo</label>
        <div>
          {{ suscriptor.grupo || '-' }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Activo</label>
        <div>
          {{ suscriptor.activo ? 'Sí' : 'No' }}
        </div>
      </div>
      <div class="w-100">
        <label class="form-label">Suplente</label>
        <div>
          {{ suscriptor.suplente }}
        </div>
      </div>
      <template v-if="suscriptor.modified_by">
        <div class="pt-3 border-top">
          <label class="form-label">Modificado</label>
          <div>
            {{ suscriptor.modified_by }},
            {{ formatTime(suscriptor.modified_on) }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>