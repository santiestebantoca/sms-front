<script setup>
const value = defineModel()

import { useGruposNotificablesQuery } from '@/stores/grupos'
import { ref, watch } from 'vue'

const model = ref(false)
const {
  grupos, // jerárquico (tree)
  isPending,
  options
} = useGruposNotificablesQuery()

watch(value, () => model.value = false)

const open = () => model.value = true
</script>

<template>
  <slot :options="options" :open="open" />
  <BModal v-model="model" title="Grupos" no-footer>
    <div v-if="isPending" class="p-5 text-center">
      <BSpinner />
    </div>
    <RootTree v-model="value" v-else class="sms-tree">
      <TreeNode v-for="data in grupos" :data="data" :key="data.id">
        <template #default="{ data, open, toggle, ident, isActive, isDescendantActive }">
          <BListGroupItem class="hstack" :class="{ active: isActive, track: isDescendantActive && !open }"
            :style="{ paddingLeft: ident }">
            <TreeItemToggle v-if="data.children.length" :open="open" @click.stop="toggle" />
            <BFormCheckbox v-model="value" :value="data.id" class="me-2" />
            <ILucideSquaresUnite class="text-yellow" />
            {{ data.nombre }}
          </BListGroupItem>
        </template>
      </TreeNode>
    </RootTree>
  </BModal>
</template>