<script setup>
const props = defineProps({ back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useGrupos from '@/stores/config-grupos'
import { ref, computed, watch, watchEffect, onMounted } from 'vue'

// const loading = inject('app:loading')
const process = useHandleSubmit()
const model = ref(true)
const mounted = ref(null)
const dataReady = ref(null)
const grupos = useGrupos()
const data = computed(() => grupos.grupo.data)
const form = ref({
  grupo_a: null,
  grupo_b: []
})
watch(data, d => {
  if (grupos.grupo.status.loaded) {
    form.value.grupo_a = d.id
    form.value.grupo_b = d.notifica.map(d => d.grupo_b)
    dataReady.value = true
  }
}, { immediate: true })
// provide('tree:active', computed({
//   get: () => form.value.grupo_b,
//   set: val => form.value.grupo_b = val
// }))
onMounted(() => mounted.value = true)
watchEffect(() => model.value = mounted.value && dataReady.value)
//
const submit = async () => {
  // loading.value++
  await grupos.grupo.notifica.post(form.value)
    .then(res => process.POST(res.data,
      () => grupos.grupo.get(form.value.grupo_a).then(() => model.value = false),
      () => { }))
  // loading.value--
}
</script>

<template>
  <BModal v-model="model" title="Notifica" @hidden="back">
    <RootTree>
      <TreeNode v-for="data in grupos.data" :data="data" :key="data.id">
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