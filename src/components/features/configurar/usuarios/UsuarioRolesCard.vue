<script lang="ts" setup>
const props = defineProps({ usuarioId: Number })

import { useAuthMembershipQuery } from '@/stores/auth-membership'
import { ref, watchEffect } from 'vue'

const { groups, isPending, usuarioId } = useAuthMembershipQuery()

const acciones = ref<Array<{ texto: string; icon?: string; to?: any; disabled?: boolean }>>([
  {
    texto: "Seleccionar",
    icon: "bi-check2-square",
    to: { name: 'configurar-usuario-grupos-editar' }
  },
])

watchEffect(() => usuarioId.value = props.usuarioId)
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
      <div v-if="!groups.length" class="mt-2">
        Usuario básico sin roles especiales asignados.
      </div>
      <RootTree v-else list>
        <TreeNode v-for="data in groups" :data="data" :key="data.id">
          <template #default="{ data }">
            <UIcon name="bi-people" class="text-teal" />
            <span v-text="data.role" class="text-truncate capitalize" />
          </template>
        </TreeNode>
      </RootTree>
    </div>
  </template>
</template>