<script setup>
const props = defineProps({ back: Function })

import { useGruposOrigenesQuery } from '@/stores/grupos'
import { ref, inject, onMounted } from 'vue'

const model = ref(false)
const origenes = inject('componer:origenes')
const { grupos, isPending } = useGruposOrigenesQuery()
const origenesTmp = ref([])

onMounted(() => model.value = true)

const submit = async () => {
  origenes.value = origenesTmp.value
  model.value = false
}
</script>

<template>
  <BModal title="Seleccionar origen" v-model="model" @hidden="back">
    <div v-if="isPending" class="p-5 text-center">
      <BSpinner />
    </div>
    <RootTree v-else :childrenNames="['hijos']">
      <TreeNode v-for="data in grupos" :data="data" :key="data.id">
        <template #default="{ data }">
          <input v-if="data.label == 'origen'" type="checkbox" v-model="origenesTmp" :value="data" />
          <UIcon name="bi-subtract" style="flex-shrink:0"
            :style="{ color: data.label === 'origen' ? 'var(--bs-teal)' : 'var(--bs-yellow)' }" />
          <span v-text="data.nombre" class="text-truncate" />
        </template>
      </TreeNode>
    </RootTree>
    <template #footer>
      <BButton variant="primary" @click="submit" :disabled="!origenesTmp.length">
        <UIcon name="bi-check2" /> Listo
      </BButton>
    </template>
  </BModal>
</template>