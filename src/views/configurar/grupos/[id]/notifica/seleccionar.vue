<script setup>
const props = defineProps({ back: Function })

import { flatToTree } from '@/utils'
import { useGrupoStore, useGruposStore } from '@/stores/grupos'
import { gruposApi } from '@/api/grupos'
import { useGruposNotificadosStore } from '@/stores/grupos-notificados'
import { ref, computed, watchEffect, onMounted } from 'vue'

const model = ref(false)
// const grupos = useGruposStore()
const loading = ref(true)
const grupos = ref([])
const grupo = useGrupoStore()
const notificados = useGruposNotificadosStore()
const form = ref({
  grupo_a: null,
  grupo_b: []
})

watchEffect(() => {
  form.value.grupo_a = grupo.data.id
  form.value.grupo_b = (grupo.data.notifica || []).map(d => d.grupo_b)
})
onMounted(async () => {
  model.value = true
  const result = await gruposApi.getAll({ label: 'grupo,centro' })
  grupos.value = flatToTree(result, { parentKey: 'pertenece' })
  loading.value = false
})

const submit = async () => {
  await notificados.post(form.value)
    .then(() => grupo.refresh(grupo.data.id, { include: 'notificados' }))
    .then(() => model.value = false)
}
</script>

<template>
  <BModal v-model="model" title="Notifica" @hidden="back">
    <div v-if="loading" class="p-5 text-center">
      <BSpinner />
    </div>
    <RootTree v-else>
      <TreeNode v-for="data in grupos" :data="data" :key="data.id">
        <template #default="{ data }">
          <input type="checkbox" v-model="form.grupo_b" :value="data.id" />
          <UIcon name="bi-subtract" style="color:var(--bs-yellow);flex-shrink: 0;" />
          <span v-text="data.nombre" class="text-truncate" />
        </template>
      </TreeNode>
    </RootTree>
    <template #footer>
      <BButton variant="primary" @click="submit">
        <UIcon name="bi-check2" /> Listo
      </BButton>
    </template>
  </BModal>
</template>