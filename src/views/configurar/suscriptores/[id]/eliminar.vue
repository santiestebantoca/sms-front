<script lang="ts" setup>
const props = defineProps({
  suscriptorId: Number,
  back: Function,
  forward: Function
})

import { useSuscriptorDelete } from '@/stores/suscriptores'
import { useNotificaciones } from '@/composables/useNotificaciones'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const deleted = ref(false)
const { exito, errorDeApi } = useNotificaciones()
const { mutateAsync: eliminarSuscriptor, asyncStatus } = useSuscriptorDelete()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const submit = () => eliminarSuscriptor(props.suscriptorId)
  .then(() => {
    exito('Suscriptor eliminado.')
    deleted.value = true
    model.value = false
  })
  .catch((err) => {
    errorDeApi(err, 'No se pudo ejecutar la acción.')
  })
const hidden = () => {
  if (deleted.value) props.forward()
  else props.back()
}
</script>

<template>
  <BModal v-model="model" title="Eliminar suscriptor" @hidden="hidden">
    <p>
      Se eliminará el suscriptor permanentemente. Se mantendrán
      los registros históricos asociados a él.
    </p>
    <p class="text-danger fw-semibold">
      Esta acción no se puede deshacer.
    </p>
    <template #footer>
      <BButton variant="emphasis" @click="model = false">
        Cancelar
      </BButton>
      <BButton variant="danger w-90" @click="submit" :loading="loading" loading-fill>
        Eliminar
      </BButton>
    </template>
  </BModal>
</template>