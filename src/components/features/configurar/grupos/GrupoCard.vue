<script lang="ts" setup>
const props = defineProps({ grupoId: Number })

import { useGrupoQuery } from '@/stores/grupos'
import { ref, watchEffect } from 'vue'

const { grupo, isPending, grupoId } = useGrupoQuery()
const acciones = ref([
  {
    texto: "Editar",
    to: { name: 'configurar-grupo-editar' },
    icon: "bi-pencil"
  },
  {
    texto: "Eliminar",
    to: { name: 'configurar-grupo-eliminar' },
    icon: "bi-trash"
  },
])

watchEffect(() => grupoId.value = props.grupoId)
</script>

<template>
  <div v-if="isPending" class="text-center p-5">
    <BSpinner />
  </div>
  <template v-else>
    <div class="mt-2 hstack gap-2 justify-content-end">
      <BButton v-for="accion in acciones" variant="flat-outline-dark" :to="accion.to" class="btn-sm">
        <UIcon :name="accion.icon" /> {{ accion.texto }}
      </BButton>
    </div>
    <div class="px-3 py-2">
      <div class="label-value">
        <label>Nombre</label>
        <div class="value" v-text="grupo.nombre" />
      </div>
      <div class="label-value">
        <label>Alias</label>
        <div class="value" v-text="grupo.apodo || '-'" />
      </div>
      <div class="label-value">
        <label>Etiquetas</label>
        <div class="value" v-text="grupo.label || '-'" />
      </div>
      <div class="label-value">
        <label>Descripción</label>
        <div v-text="grupo.descripcion || '-'" />
      </div>
    </div>
  </template>
</template>