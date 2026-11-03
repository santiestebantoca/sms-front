<script lang="ts" setup>
const props = defineProps({
  showLista: Boolean,
  usuarioId: Number,
  setUsuarioId: Function,
  linkCrear: Object,
})

import { useUsuariosQuery } from '@/stores/usuarios'
import { ref, watchEffect } from 'vue'

const { usuarios, isPending } = useUsuariosQuery()
const active = ref(props.usuarioId)
watchEffect(() => active.value = props.usuarioId)
</script>

<template>
  <div class="root">
    <div class="border-end overflow-auto">
      <div class="title">
        USUARIOS
        <BButton :to="linkCrear" variant="emphasis wh-34" v-tippy="'Crear usuario'">
          <ILucidePlus class="center" />
        </BButton>
      </div>
      <div v-if="isPending" class="mt-5 text-center">
        <BSpinner />
      </div>
      <div v-else class="px-1 py-3">
        <RootTree v-model="active" class="sms-tree">
          <TreeNode v-for="item in usuarios" :data="item" :key="item.id">
            <template #default="{ data, isActive }">
              <BListGroupItem type="button" @click="setUsuarioId(data.id)" class="text-truncate"
                :class="{ active: isActive }">
                <ILucideUser v-if="data.registration_key !== 'blocked'" class="text-success-400" />
                <ILucideUserX v-else class="text-danger" />
                <span :class="{ 'text-danger': data.registration_key === 'blocked' }">
                  {{ data.name }}
                </span>
              </BListGroupItem>
            </template>
          </TreeNode>
        </RootTree>
      </div>
    </div>
    <div class="overflow-auto">
      <div class="container ms-0 max-w-700">
        <div v-if="showLista" class="mt-5 text-center">
          Seleccione un usuario para mostrarlo aquí.
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.root {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(320px, 1fr) 4fr;
  overflow: hidden;

  .title {
    padding: 12px 16px;
    font-weight: 600;

    .btn {
      float: right;
      margin: -5px -8px;
    }
  }
}
</style>