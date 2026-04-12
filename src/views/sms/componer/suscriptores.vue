<script setup>
const props = defineProps({ back: Function })

import useNotificados from '@/stores/componer-notificados'
import { ref, onMounted, computed } from 'vue'

const notificados = useNotificados()
const model = ref(false)
onMounted(() => {
  if (notificados.data.length) model.value = true
  else props.back()
})
const treeData = computed(() => notificados.data
  .reduce((a, d) => [...a, ...d.suscriptores], []))
</script>

<template>
  <BModal v-model="model" @hidden="back" scrollable title="Suscriptores notificados">
    <RootTree list>
      <TreeNode v-for="data in treeData" :data="data" :key="data.id">
        <template #default="{ data }">
          <input type="checkbox" v-model="data.checked" />
          <span v-text="data.nombre" class="text-truncate" />
          <span v-text="data.telefono" style="color:var(--bs-pink)" />
        </template>
      </TreeNode>
    </RootTree>
    <template #footer>
      <BButton variant="primary" @click="model = false">
        <UIcon name="bi-check2" /> Listo
      </BButton>
    </template>
  </BModal>
</template>