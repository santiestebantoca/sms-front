<script setup>
const props = defineProps({ grupoId: Number })

import { useSuscriptoresDelGrupoQuery } from '@/stores/suscriptores'
import { ref, computed, watchEffect } from 'vue'

const { suscriptores, isPending, grupoId } = useSuscriptoresDelGrupoQuery()

const active = ref(null)
const acciones = computed(() => [
  {
    texto: "Nuevo",
    to: { name: 'configurar-grupo-suscriptores-crear' },
    icon: "bi-plus-lg"
  },
  {
    texto: "Editar",
    to: active.value
      ? { name: 'configurar-grupo-suscriptor-editar', params: { suscriptorId: active.value } }
      : undefined,
    icon: "bi-pencil",
    disabled: !active.value
  },
  {
    texto: "Eliminar",
    to: active.value
      ? { name: 'configurar-grupo-suscriptor-eliminar', params: { suscriptorId: active.value } }
      : undefined,
    icon: "bi-trash",
    disabled: !active.value
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
      <div v-if="!suscriptores.length" class="mt-2">
        No hay suscriptores aquí.
      </div>
      <RootTree v-else list selectable v-model="active">
        <TreeNode v-for="data in suscriptores" :data="data" :key="data.id">
          <template #default="{ data }">
            <div class="hstack gap-2">
              <UIcon name="bi-person" class="text-teal" />
              {{ data.nombre }}
              <span v-text="data.telefono" class="text-pink" />
              <span v-if="data.correo" v-text="`<${data.correo}>`" class="text-secondary" />
            </div>
          </template>
        </TreeNode>
      </RootTree>
    </div>
  </template>
</template>