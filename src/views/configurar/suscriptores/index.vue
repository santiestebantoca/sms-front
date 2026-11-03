<script lang="ts" setup>
const props = defineProps({
  showLista: Boolean,
  suscriptorId: Number,
  setSuscriptorId: Function,
  linkCrear: Object,
})

import { useSuscriptoresQuery } from '@/stores/suscriptores'
import { ref, watchEffect } from 'vue'

const { suscriptores, isPending } = useSuscriptoresQuery()
const active = ref(props.suscriptorId)
watchEffect(() => active.value = props.suscriptorId)
</script>

<template>
  <div class="root">
    <div class="border-end overflow-auto">
      <div class="title">
        SUSCRIPTORES
        <BButton :to="linkCrear" variant="emphasis wh-34" v-tippy="'Crear suscriptor'">
          <ILucidePlus class="center" />
        </BButton>
      </div>
      <div v-if="isPending" class="mt-5 text-center">
        <BSpinner />
      </div>
      <div v-else class="px-1 py-3">
        <RootTree v-model="active" class="sms-tree">
          <TreeNode v-for="item in suscriptores" :data="item" :key="item.id">
            <template #default="{ data, isActive }">
              <BListGroupItem type="button" @click="setSuscriptorId(data.id)" class="text-truncate"
                :class="{ active: isActive }">
                <ILucideUser v-if="data.activo" class="text-success-400" />
                <ILucideUserX v-else class="text-danger" />
                <span :class="{ 'text-danger': !data.activo }">
                  {{ data.nombre }}
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
          Seleccione un suscriptor para mostrarlo aquí.
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