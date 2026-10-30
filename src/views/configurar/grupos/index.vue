<script lang="ts" setup>
const props = defineProps({
  showLista: Boolean,
  grupoId: Number,
  setGrupoId: Function,
  linkCrear: Object,
})

import { useGruposQuery } from '@/stores/grupos'
import { ref, watchEffect } from 'vue'

const { grupos, isPending } = useGruposQuery()
const active = ref(props.grupoId)
watchEffect(() => active.value = props.grupoId)
</script>

<template>
  <div class="root">
    <div class="border-end overflow-auto">
      <div class="title">
        GRUPOS
        <BButton :to="linkCrear" variant="emphasis wh-34" v-tippy="'Crear grupo'">
          <ILucidePlus class="center" />
        </BButton>
      </div>
      <div v-if="isPending" class="mt-5 text-center">
        <BSpinner />
      </div>
      <div v-else class="px-1 py-3">
        <RootTree v-model="active" class="sms-tree">
          <TreeNode v-for="item in grupos" :data="item" :key="item.id">
            <template #default="{ data, toggle, open, ident, isActive, isDescendantActive }">
              <BListGroupItem type="button" @click="setGrupoId(data.id)" class="text-truncate"
                :class="{ active: isActive, track: isDescendantActive && !open }" :style="{ paddingLeft: ident }">
                <TreeItemToggle v-if="data.children.length" :open="open" @click.stop="toggle" />
                <ILucideSquaresUnite :class="data.label === 'origen' ? 'text-success-400' : 'text-yellow'" />
                {{ data.nombre }}
              </BListGroupItem>
            </template>
          </TreeNode>
        </RootTree>
      </div>
    </div>
    <div class="container ms-0 max-w-700">
      <div v-if="showLista" class="mt-5 text-center">
        Seleccione un grupo para mostrarlo aquí.
      </div>
      <router-view />
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