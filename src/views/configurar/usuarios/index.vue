<script setup>
const props = defineProps({
  usuarioId: Number,
  setUsuarioId: Function,
  flows: Object
})

import { useUsuariosQuery } from '@/stores/usuarios'
import CrearUsuario from '@/views/configurar/usuarios/_flows/crear.vue'
import { computed } from 'vue'

const { usuarios, isPending } = useUsuariosQuery()
const active = computed({
  get: () => props.usuarioId,
  set: (value) => props.setUsuarioId(value)
})
</script>

<template>
  <div class="root">
    <div class="border-end overflow-auto">
      <div class="hstack sticky-top p-1 ps-3">
        <span class="small fw-semibold me-auto">USUARIOS</span>
        <BButton @click="flows.crear.go" variant="primary" v-tippy="'Crear usuario'" class="btn-sm h-32 w-33">
          <UIcon name="bi-plus-lg" />
        </BButton>
      </div>
      <div v-if="isPending" class="mt-5 text-center">
        <BSpinner />
      </div>
      <div v-else class="px-1 py-3">
        <RootTree v-model="active" selectable list>
          <TreeNode v-for="item in usuarios" :data="item" :key="item.id">
            <template #default="{ data }">
              <UIcon name="bi-person" class="flex-shrink-0 text-success-400" />
              <span v-text="data.name" class="text-truncate" />
              <BBadge v-if="data.registration_key === 'blocked'" variant="danger">Inactivo</BBadge>
            </template>
          </TreeNode>
        </RootTree>
      </div>
    </div>
    <div class="overflow-auto px-3 pt-1 pb-4">
      <div v-if="!usuarioId" class="mt-5 text-center">
        Seleccione un usuario para mostrarlo aquí.
      </div>
      <router-view v-else />
    </div>
    <CrearUsuario v-if="flows.crear.active" :back="flows.crear.back" :forward="flows.crear.forward" />
  </div>
</template>

<style scoped lang="scss">
.root {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 3fr;
  overflow: hidden;

  .sticky-top {
    background-color: white;
    box-shadow: 0px 8px 10px 1px white;
  }
}
</style>