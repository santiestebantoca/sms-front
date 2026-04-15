<script setup>
const props = defineProps({ back: Function, forward: Function })

import useHandleSubmit from '@/composables/useHandleSubmit.js'
import useGrupos from '@/stores/config-grupos'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted } from 'vue'

const process = useHandleSubmit()
const model = ref(false)
const deleted = ref(false)
const toast = useToast()
const grupos = useGrupos()
const data = computed(() => grupos.grupo.data)
onMounted(() => model.value = true)
//
const submit = async () => {
  // loading.value++
  await grupos.grupo.del(data.value.id)
    .then(res => process.DELETE(res.data,
      async () => {
        await grupos.get()
        toast.create({ body: 'Grupo eliminado', variant: 'success' })
        deleted.value = true
        model.value = false
      },
      () => { }))
  // loading.value--
}
const hidden = () => {
  if (deleted.value) props.forward()
  else props.back()
}
</script>

<template>
  <BModal v-model="model" title="Eliminar grupo" @hidden="hidden">
    <p>
      Se eliminará el grupo y se eliminarán los grupos que pertenecen a él.
      Se eliminarán también los suscriptores que pertenecen a estos grupos.
    </p>
    <p>
      ¿Desea continuar?
    </p>
    <template #footer>
      <BButton variant="primary" @click="submit">
        Aceptar
      </BButton>
    </template>
  </BModal>
</template>