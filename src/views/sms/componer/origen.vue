<script setup>
const props = defineProps({ back: Function })

import useGrupos from '@/stores/componer-grupos'
import { ref, watch, inject, onUnmounted } from 'vue'

// const loading = inject('app:loading')
const selection = inject('componer:selection')
const grupos = useGrupos()
const active = ref([])
const model = ref(null)
const submit = async () => {
  selection.value.grupos = active.value.map(id => grupos.find(id))
  model.value = false
}
// Initial
watch(() => grupos.status.loading, val => !val && (model.value = true))
//   if (val) loading.value++
//   else {
//     loading.value--
//     model.value = true
//   }
// })
grupos.query = { label: 'origen' } // it makes a get
onUnmounted(() => grupos.$reset())
</script>

<template>
  <BModal title="Seleccionar origen" v-model="model" @hidden="back">
    <RootTree>
      <TreeNode v-for="data in grupos.data" :data="data" :key="data.id">
        <template #default="{ data, leaf }">
          <input v-if="leaf" type="checkbox" v-model="active" :value="data.id" />
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