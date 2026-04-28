<script setup>
const props = defineProps({ back: Function })

// import { useGruposStore } from '@/stores/grupos'
import { flatToTree } from '@/utils'
import { gruposApi } from '@/api/grupos'
import { ref, watch, inject, onMounted, onUnmounted } from 'vue'

const origen = inject('componer:origen')
// const grupos = useGruposStore()
const loading = ref(true)
const grupos = ref([])
const active = ref([])
const model = ref(null)
const submit = async () => {
  origen.value = active.value
  model.value = false
}

onMounted(async () => {
  model.value = true
  const result = await gruposApi.getAll({ label: 'centro,origen' })
  grupos.value = flatToTree(result, { parentKey: 'pertenece' })
  loading.value = false
})
</script>

<template>
  <BModal title="Seleccionar origen" v-model="model" @hidden="back">
    <div v-if="loading" class="p-5 text-center">
      <BSpinner />
    </div>
    <RootTree v-else>
      <TreeNode v-for="data in grupos" :data="data" :key="data.id">
        <template #default="{ data }">
          <input v-if="data.label == 'origen'" type="checkbox" v-model="active" :value="data" />
          <UIcon name="bi-subtract" style="flex-shrink:0"
            :style="{ color: data.label === 'origen' ? 'var(--bs-teal)' : 'var(--bs-yellow)' }" />
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