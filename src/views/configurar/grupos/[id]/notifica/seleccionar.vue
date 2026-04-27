<script setup>
const props = defineProps({ back: Function })

import { useGrupoStore } from '@/stores/grupos'
import { gruposApi } from '@/api/grupos'
import { useGruposNotificadosStore } from '@/stores/grupos-notificados'
import { ref, computed, watchEffect, onMounted } from 'vue'

const model = ref(false)
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
  const result = await gruposApi.getAll({ notificables: true })
  grupos.value = result
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
    <div v-if="loading" class="text-center p-5">
      <BSpinner />
    </div>
    <template v-else>
      <RootTree>
        <TreeNode v-for="data in grupos" :data="data" :key="data.id"
          :filtro="d => d.children?.length || !d.label?.includes('origen')">
          <template #default="{ data }">
            <input type="checkbox" v-model="form.grupo_b" :value="data.id" />
            <UIcon name="bi-subtract" style="color:var(--bs-yellow);flex-shrink: 0;" />
            <span v-text="data.nombre" class="text-truncate" />
          </template>
        </TreeNode>
      </RootTree>
    </template>
    <template v-if="!loading" #footer>
      <BButton variant="primary" @click="submit">
        <UIcon name="bi-check2" /> Listo
      </BButton>
    </template>
  </BModal>
</template>