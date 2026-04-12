<!-- 
Watch data is just a pattern but unnecesary here since
this compo is shown only if `grupos.grupo.status.loaded`
-->
<script setup>
const props = defineProps({ back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useGrupos from '@/stores/config-grupos'
import { ref, computed, watch, inject, provide } from 'vue'

const loading = inject('app:loading')
const process = useHandleSubmit()
const model = ref(true)
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
    model.value = true
  }
}, { immediate: true })
provide('tree:active', computed({
  get: () => form.value.grupo_b,
  set: val => form.value.grupo_b = val
}))
const submit = async () => {
  loading.value++
  await grupos.grupo.notifica.post(form.value)
    .then(res => process.POST(res.data,
      () => grupos.grupo.get(form.value.grupo_a).then(() => model.value = false),
      () => { }))
  loading.value--
}
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back" scrollable>
      <bs-dialog-header label="Notifica" />
      <bs-dialog-body>
        <ul class="ul">
          <!-- <TreeItemCheckable v-for="data in grupos.data" :data="data" :key="data.id" /> -->
        </ul>
      </bs-dialog-body>
      <bs-dialog-footer>
        <bs-btn label="Listo" icon="check2" class="me-auto" color="primary" @click="submit" />
      </bs-dialog-footer>
    </bs-dialog>
  </Teleport>
</template>