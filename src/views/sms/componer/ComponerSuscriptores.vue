<script setup>
const props = defineProps({ back: Function })

import useNotificados from '@/stores/componer-notificados'
import { ref } from 'vue'

const notificados = useNotificados()
const model = ref(notificados.data.length)
!notificados.data.length && props.back()
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back" scrollable>
      <bs-dialog-header label="Suscriptores notificados" />
      <bs-dialog-body>
        <ul class="ul">
          <template v-for="d in notificados.data.filter(d => d.checked)">
            <li v-for="s in d.suscriptores" class="li li-win">
              <input type="checkbox" v-model="s.checked" :disabled="!d.checked" />
              <span v-text="s.nombre" class="tree-span text-truncate" />
              <span v-text="s.telefono" class="tree-span" style="color:var(--bs-pink)" />
              <span class="mx-auto" />
            </li>
          </template>
        </ul>
      </bs-dialog-body>
      <bs-dialog-footer>
        <bs-btn label="Listo" icon="check2" class="me-auto" color="primary" @click="model = false" />
      </bs-dialog-footer>
    </bs-dialog>
  </Teleport>
</template>

<style scoped>
.ul {
  margin: 0;
  padding: 0;
}

.li {
  list-style-type: none;
  --paddind-times: 0;
  padding-left: calc(12px * var(--paddind-times) + 4px) !important;
}

li.level-3 {
  --paddind-times: 3;
}

.empty>.bi-chevron {
  visibility: hidden;
}

.li-win {
  --border-color: transparent;
  border: solid 1px var(--border-color);
  --bg-color: transparent;
  background-color: var(--bg-color);
}

.li-win:hover {
  --bg-color: rgba(var(--bs-info-rgb), .1);
}

.li-win.active {
  --bg-color: rgba(var(--bs-info-rgb), .2);
}

.li-win.active:hover {
  --border-color: rgba(var(--bs-info-rgb), .3);
}

.li {
  height: 32px;
  padding: 1px 6px;
  display: flex;
  gap: 6px;
  cursor: pointer;
  text-decoration: none;
}

.bi-chevron {
  font-size: .875em;
  color: var(--bs-secondary);
}

.bi-chevron:hover {
  color: var(--bs-primary);
}

.bi-chevron::before {
  content: "\f285";
}

.open>.bi-chevron::before {
  content: "\f282";
}
</style>