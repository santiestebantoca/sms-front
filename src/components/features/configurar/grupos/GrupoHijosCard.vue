<script setup>
const props = defineProps({ padreId: Number })

import { useGruposDelGrupoQuery } from '@/stores/grupos'
import { ref, computed, watchEffect } from 'vue'

const { grupos, isPending, padreId } = useGruposDelGrupoQuery()
const active = ref(null)
const acciones = computed(() => [
  {
    texto: "Nuevo",
    to: { name: 'configurar-grupo-hijos-crear' },
    icon: "bi-plus-lg"
  },
  {
    texto: "Editar",
    to: active.value
      ? { name: 'configurar-grupo-hijo-editar', params: { hijoId: active.value } }
      : undefined,
    icon: "bi-pencil",
    disabled: !active.value
  },
  {
    texto: "Eliminar",
    to: active.value
      ? { name: 'configurar-grupo-hijo-eliminar', params: { hijoId: active.value } }
      : undefined,
    icon: "bi-trash",
    disabled: !active.value
  },
])

watchEffect(() => padreId.value = props.padreId)
</script>

<template>
  <div v-if="isPending" class="text-center p-5">
    <BSpinner />
  </div>
  <template v-else>
    <div class="mt-2 hstack gap-2 justify-content-end">
      <BButton v-for="accion in acciones" variant="flat-outline-dark" :to="accion.to" :disabled="accion.disabled"
        class="btn-sm">
        <UIcon :name="accion.icon" /> {{ accion.texto }}
      </BButton>
    </div>
    <div class="px-3 py-2">
      <div v-if="!grupos.length" class="mt-2">
        No hay grupos aquí.
      </div>
      <RootTree v-else list selectable v-model="active">
        <TreeNode v-for="data in grupos" :data="data" :key="data.id">
          <template #default="{ data }">
            <UIcon name="bi-subtract" class="text-yellow flex-shrink-0" />
            <span v-text="data.nombre" class="text-truncate" />
          </template>
        </TreeNode>
      </RootTree>
    </div>
  </template>
</template>