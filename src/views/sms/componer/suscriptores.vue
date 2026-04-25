<script setup>
const props = defineProps({ back: Function })

import { useGruposNotificadosStore, useNotificadosCheckedStore } from '@/stores/grupos-notificados'
import { useToast } from 'bootstrap-vue-next'
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

const { create: showToast } = useToast()
const notificados = useGruposNotificadosStore()
const { destinatariosIds } = storeToRefs(useNotificadosCheckedStore())
const model = ref(false)

onMounted(() => model.value = true)

watch(destinatariosIds, val => {
  if (val.length === 0)
    showToast({ body: 'Debe haber al menos un suscriptor seleccionado.', variant: 'warning' })
})

const destinatarios = computed(() => notificados.data.flatMap(grupo => grupo.suscriptores))
</script>

<template>
  <BModal v-model="model" @hidden="back" title="Destinatarios">
    <RootTree list>
      <TreeNode v-for="data in destinatarios" :data="data" :key="data.id">
        <template #default="{ data }">
          <input type="checkbox" v-model="destinatariosIds" :value="data.id" />
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