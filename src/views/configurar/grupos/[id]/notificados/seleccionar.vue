<script setup>
const props = defineProps({ grupoId: Number, back: Function })

import { useGruposNotificablesQuery, useGrupoExpandidoQuery } from '@/stores/grupos'
import { useNotificadosUpdate } from '@/stores/notificados'
import { ref, computed, watchEffect, onMounted } from 'vue'

const model = ref(false)
const form = ref({
  grupo_b: []
})
const { grupos, isPending } = useGruposNotificablesQuery()
const { grupo } = useGrupoExpandidoQuery(props.grupoId)
const { mutateAsync: actualizarNotificados, asyncStatus } = useNotificadosUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => {
  form.value.grupo_b = (grupo.value?.notificados || []).map(d => d.grupo_b)
})
onMounted(() => model.value = true)

const submit = () => actualizarNotificados({ id: props.grupoId, ...form.value })
  .then(() => model.value = false)
</script>

<template>hola
  <BModal v-model="model" title="Notificados" @hidden="back">
    <div v-if="isPending" class="p-5 text-center">
      <BSpinner />
    </div>
    <RootTree v-else :childrenNames="['hijos']">
      <TreeNode v-for="data in grupos" :data="data" :key="data.id">
        <template #default="{ data }">
          <input type="checkbox" v-model="form.grupo_b" :value="data.id" />
          <UIcon name="bi-subtract" style="color:var(--bs-yellow);flex-shrink: 0;" />
          <span v-text="data.nombre" class="text-truncate" />
        </template>
      </TreeNode>
    </RootTree>
    <template #footer>
      <BButton variant="primary" @click="submit" :loading="loading">
        <UIcon name="bi-check2" /> Listo
      </BButton>
    </template>
  </BModal>
</template>