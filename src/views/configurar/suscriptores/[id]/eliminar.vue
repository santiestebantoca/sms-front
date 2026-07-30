<script setup>
const props = defineProps({ suscriptorId: Number, back: Function, forward: Function })


import { useSuscriptorDelete } from '@/stores/suscriptores'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const deleted = ref(false)
const toast = useToast()
const { mutateAsync: eliminarSuscriptor, asyncStatus } = useSuscriptorDelete()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const submit = () => eliminarSuscriptor(props.suscriptorId)
  .then(() => {
    toast.create({ body: 'Suscriptor eliminado.', variant: 'success' })
    deleted.value = true
    model.value = false
  })
  .catch((err) => {
    toast.create({ body: 'No se pudo ejecutar la acción.', variant: 'danger' })
  })
const hidden = () => {
  if (deleted.value) props.forward()
  else props.back()
}
</script>

<template>
  <BModal v-model="model" title="Eliminar suscriptor" @hidden="hidden">
    <p>
      Esta acción eliminará permanentemente al suscriptor pero
      mantendrá los registros históricos asociados a él.
    </p>
    <p class="text-danger fw-semibold">Esta acción no se puede deshacer.</p>
    <template #footer>
      <BButton variant="secondary" @click="model = false">
        Cancelar
      </BButton>
      <BButton variant="danger" @click="submit" :loading="loading" loading-fill style="width: 90px;">
        Eliminar
      </BButton>
    </template>
  </BModal>
</template>