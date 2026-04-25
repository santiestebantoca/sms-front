<script setup>
const props = defineProps({ back: Function })

import { useGruposNotificadosStore, useNotificadosCheckedStore } from '@/stores/grupos-notificados'
import { useToast } from 'bootstrap-vue-next'
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

const { create: showToast } = useToast()
const notificados = useGruposNotificadosStore()
const { gruposIds, destinatariosIds } = storeToRefs(useNotificadosCheckedStore())
const model = ref(false)

onMounted(() => model.value = true)

watch(destinatariosIds, val => {
  if (val.length === 0)
    showToast({ body: 'Debe haber al menos un suscriptor seleccionado.', variant: 'warning' })
})
</script>

<template>
  <BModal v-model="model" @hidden="back" title="Grupos notificados">
    <RootTree :childrenNames="['suscriptores']">
      <TreeNode v-for="data in notificados.data" :data="data" :key="data.id">
        <template #default="{ data }">
          <template v-if="!data.grupo">
            <input type="checkbox" v-model="gruposIds" :value="data.id" />
            <UIcon name="bi-subtract" style="color:var(--bs-yellow);flex-shrink: 0;" />
            <span v-text="data.apodo || data.nombre" class="text-truncate" />
          </template>
          <template v-else>
            <input type="checkbox" v-model="destinatariosIds" :value="data.id" />
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