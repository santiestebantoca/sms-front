<script setup>
const props = defineProps({ back: Function })

import { useGruposStore } from '@/stores/grupos'
import { ref, watch, inject, onMounted, onUnmounted } from 'vue'

const origen = inject('componer:origen')
const grupos = useGruposStore()
const active = ref([])
const model = ref(null)
const submit = async () => {
  origen.value = active.value
  model.value = false
}
//
onMounted(() => model.value = true)
grupos.get({ label: 'origen' })
onUnmounted(() => grupos.reset())
</script>

<template>
  <BModal title="Seleccionar origen" v-model="model" @hidden="back">
    <div v-if="grupos.status.loading" class="p-5 text-center">
      <BSpinner />
    </div>
    <RootTree v-else>
      <TreeNode v-for="data in grupos.data" :data="data" :key="data.id">
        <template #default="{ data, leaf }">
          <input v-if="leaf" type="checkbox" v-model="active" :value="data" />
          <UIcon v-else name="bi-subtract" style="color:var(--bs-yellow);flex-shrink: 0;" />
          <span v-text="data.nombre" class="text-truncate" />
        </template>
      </TreeNode>
    </RootTree>
    <template #footer>
      <BButton variant="primary" @click="submit" :disabled="!active.length">
        <UIcon name="bi-check2" /> Listo
      </BButton>
    </template>
  </BModal>
</template>