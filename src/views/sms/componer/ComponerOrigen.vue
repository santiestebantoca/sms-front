<script setup>
const props = defineProps({ back: Function })

import TreeItemCheckable from './TreeItemCheckable.vue'
import useGrupos from '@/stores/componer-grupos'
import { ref, watch, inject, provide, onUnmounted } from 'vue'

const loading = inject('app:loading')
const selection = inject('componer:selection')
const grupos = useGrupos()
const active = ref([])
provide('tree:active', active)
const model = ref(null)
const submit = async () => {
  selection.value.grupos = active.value.map(id => grupos.find(id))
  model.value = false
}
// Initial
watch(() => grupos.status.loading, val => {
  if (val) loading.value++
  else {
    loading.value--
    model.value = true
  }
})
grupos.query = { label: 'origen' } // it makes a get
onUnmounted(() => grupos.$reset())
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back" scrollable>
      <bs-dialog-header label="Seleccionar origen" />
      <bs-dialog-body>
        <ul class="ul">
          <TreeItemCheckable v-for="data in grupos.data" :data="data" :key="data.id" leaf />
        </ul>
      </bs-dialog-body>
      <bs-dialog-footer>
        <bs-btn label="Listo" icon="check2" class="me-auto" color="primary" @click="submit" :disable="!active.length" />
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