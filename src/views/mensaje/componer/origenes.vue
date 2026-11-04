<script lang="ts" setup>
const props = defineProps({
  back: Function
})

import { useGruposOrigenesQuery } from '@/stores/grupos'
import { ref, inject, onMounted, Ref } from 'vue'

const model = ref(false)
const origenes = inject<Ref<any[]>>('componer:origenes')
const { grupos, isPending } = useGruposOrigenesQuery()
const origenesTmp = ref<any[]>([])

onMounted(() => model.value = true)

const submit = () => {
  origenes.value = origenesTmp.value
  model.value = false
}
</script>

<template>
  <BModal title="Seleccionar origen" v-model="model" @hidden="back">
    <div v-if="isPending" class="p-5 text-center">
      <BSpinner />
    </div>
    <RootTree v-else class="sms-tree">
      <TreeNode v-for="data in grupos" :data="data" :key="data.id">
        <template #default="{ data, open, toggle, ident, isActive, isDescendantActive }">
          <BListGroupItem class="hstack" :class="{ active: isActive, track: isDescendantActive && !open }"
            :style="{ paddingLeft: ident }">
            <TreeItemToggle v-if="data.children.length" :open="open" @click.stop="toggle" />
            <BFormCheckbox v-if="data.label == 'origen'" v-model="origenesTmp" :value="data" class="me-2" />
            <ILucideSquaresUnite :class="data.label === 'origen' ? 'text-success-400' : 'text-yellow'" />
            {{ data.nombre }}
          </BListGroupItem>
        </template>
      </TreeNode>
    </RootTree>
    <template #footer>
      <BButton variant="primary" @click="submit" :disabled="!origenesTmp.length">
        <ILucideSquareCheckBig /> Listo
      </BButton>
    </template>
  </BModal>
</template>