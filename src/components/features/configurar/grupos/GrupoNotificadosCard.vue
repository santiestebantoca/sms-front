<script setup>
const props = defineProps({ grupoId: Number })

import { useGrupoNotificadosQuery } from '@/stores/grupos'
import { ref, computed, watchEffect } from 'vue'

const { notificados, isPending, grupoId } = useGrupoNotificadosQuery()

const active = ref(null)
const acciones = computed(() => [
  {
    texto: "Seleccionar",
    to: { name: 'configurar-grupo-notificados-seleccionar' },
    icon: "bi-check2-square"
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
      <BButton v-for="accion in acciones" variant="flat-outline-dark" :to="accion.to" :disabled="accion.disabled"
        class="btn-sm">
        <UIcon :name="accion.icon" /> {{ accion.texto }}
      </BButton>
    </div>
    <div class="px-3 py-2">
      <div v-if="!notificados.length" class="mt-2">
        No hay grupos aquí.
      </div>
      <RootTree v-else list selectable v-model="active">
        <TreeNode v-for="data in notificados" :data="data" :key="data.id">
          <template #default="{ data }">
            <UIcon name="bi-subtract" style="color:var(--bs-yellow);flex-shrink: 0;" />
            <span v-text="data.nombre" class="text-truncate" />
          </template>
        </TreeNode>
      </RootTree>
    </div>
  </template>
</template>