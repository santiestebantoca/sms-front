<script setup>
const props = defineProps({ grupoId: Number, hijoId: Number, back: Function })

import { useGruposStore, useGrupoStore } from '@/stores/grupos'
import { useToast } from 'bootstrap-vue-next'
import { ref, onMounted } from 'vue'

const model = ref(false)
const grupos = useGruposStore()
const grupo = useGrupoStore()
const toast = useToast()
onMounted(() => model.value = true)
//
const submit = async () => {
  await grupos.del(props.hijoId)
    .then(res => {
      grupo.get(props.grupoId, { include: 'hijos' })
      model.value = false
    })
    .catch(() => toast.create({ body: 'No se pudo ejecutar la acción.', variant: 'warning' }))
}
</script>

<template>
  <BModal v-model="model" title="Eliminar grupo" @hidden="back">
    <p>
      Esta acción eliminará permanentemente:
    </p>
    <ul>
      <li>El grupo seleccionado</li>
      <li>Grupos pertenecientes a él (grupos hijos)</li>
      <li>Suscriptores pertenecientes a estos grupos</li>
    </ul>
    <p class="text-danger fw-semibold">Esta acción no se puede deshacer.</p>
    <template #footer>
      <BButton variant="primary" @click="submit">
        Aceptar
      </BButton>
    </template>
  </BModal>
</template>