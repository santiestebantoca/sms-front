<script setup>
const props = defineProps({ back: Function })

import usePrevio from '@/stores/componer-previo'
import { ref } from 'vue'
const previoStore = usePrevio()

const model = ref(true)
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back" scrollable>
      <bs-dialog-header label="Notificados" />
      <bs-dialog-body>
        <ul class="ul">
          <li v-for="d in previoStore.data.notificados" class="li">
            <i class="bi-person-fill text-secondary" />
            <span v-text="d.suscriptor" />
            <span class="text-secondary" v-text="'..\\' + d.grupo" />
          </li>
        </ul>
      </bs-dialog-body>
    </bs-dialog>
  </Teleport>
</template>

<style scoped>
.ul {
  margin: 0;
  padding: 0;
}

.ul li {
  list-style-type: none;
  /*  */
  height: 32px;
  padding: 1px 6px;
  display: flex;
  gap: 6px;
}
</style>