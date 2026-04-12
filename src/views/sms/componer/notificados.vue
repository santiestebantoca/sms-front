<script setup>
const props = defineProps({ back: Function })

import useNotificados from '@/stores/componer-notificados'
import { useToast } from 'bootstrap-vue-next'
import { ref, onMounted, watch } from 'vue'

const { create: showToast } = useToast()
const notificados = useNotificados()
const model = ref(false)
onMounted(() => {
  if (notificados.data.length) model.value = true
  else props.back()
})
const checkChildren = (grupoId, checked) => {
  const grupo = notificados.data.find(d => d.id === grupoId)
  grupo.suscriptores.forEach(d => d.checked = checked)
}
watch(() => notificados.suscriptores?.counter, val => {
  if (val === 0)
    showToast({ body: 'Debe haber al menos un suscriptor seleccionado.', variant: 'warning' })
})
</script>

<template>
  <BModal v-model="model" @hidden="back" scrollable title="Grupos notificados">
    <RootTree :childrenNames="['suscriptores']">
      <TreeNode v-for="data in notificados.data" :data="data" :key="data.id">
        <template #default="{ data }">
          <template v-if="data.tipo === 'grupo'">
            <input type="checkbox" v-model="data.checked" @input="checkChildren(data.id, $event.target.checked)" />
            <UIcon name="bi-subtract" style="color:var(--bs-yellow)" />
            <span v-text="data.apodo || data.nombre" class="text-truncate" />
          </template>
          <template v-else>
            <input type="checkbox" v-model="data.checked" />
            <span v-text="data.nombre" class="text-truncate" />
            <span v-text="data.telefono" style="color:var(--bs-pink)" />
          </template>
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