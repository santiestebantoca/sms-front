<!-- 
Watch data is just a pattern but unnecesary here since
this compo is shown only if `grupos.grupo.status.loaded`
-->
<script setup>
const props = defineProps({ back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import TreeItemCheckable from '../base/TreeItemCheckable.vue'
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
          <TreeItemCheckable v-for="data in grupos.data" :data="data" :key="data.id" />
        </ul>
      </bs-dialog-body>
      <bs-dialog-footer>
        <bs-btn label="Listo" icon="check2" class="me-auto" color="primary" @click="submit" />
      </bs-dialog-footer>
    </bs-dialog>
  </Teleport>
</template>

<style scoped>
:deep(*:not(:hover)>.d-hover) {
  display: none;
}

.ul {
  margin: 0;
  padding: 0;
}

:deep(.li) {
  list-style-type: none;
}

:deep(.li-win) {
  --border-color: transparent;
  border: solid 1px var(--border-color);
  --bg-color: transparent;
  background-color: var(--bg-color);
}

:deep(.li-win:hover) {
  --bg-color: rgba(var(--bs-info-rgb), .1);
}

:deep(.li-win.active) {
  --bg-color: rgba(var(--bs-info-rgb), .2);
}

:deep(.li-win.active:hover) {
  --border-color: rgba(var(--bs-info-rgb), .3);
}

:deep(.li) {
  height: 32px;
  padding: 1px 6px;
  display: flex;
  gap: 6px;
  cursor: pointer;
  text-decoration: none;
}

:deep(.bi-chevron) {
  font-size: .875em;
  color: var(--bs-secondary);
}

:deep(.bi-chevron:hover) {
  color: var(--bs-primary);
}

:deep(.bi-chevron::before) {
  content: "\f285";
}

:deep(.open>.bi-chevron::before) {
  content: "\f282";
}
</style>