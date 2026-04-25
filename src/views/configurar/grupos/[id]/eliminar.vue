<script setup>
const props = defineProps({ grupoId: Number, back: Function, forward: Function })

import { useGruposStore } from '@/stores/grupos'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const deleted = ref(false)
const toast = useToast()
const grupos = useGruposStore()
onMounted(() => model.value = true)
//
const submit = async () => {
  await grupos.del(props.grupoId)
    .then(() => {
      toast.create({ body: 'Grupo eliminado', variant: 'success' })
      deleted.value = true
      model.value = false
    })
    .catch(err => toast.create({ body: 'No se pudo ejecutar la acción.', variant: 'danger' }))
}
const hidden = () => {
  if (deleted.value) props.forward()
  else props.back()
}
</script>

<template>
  <BModal v-model="model" title="Eliminar grupo" @hidden="hidden">
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
      <BButton variant="secondary" @click="model = false">
        Cancelar
      </BButton>
      <BButton variant="danger" @click="submit">
        Aceptar
      </BButton>
    </template>
  </BModal>
</template>