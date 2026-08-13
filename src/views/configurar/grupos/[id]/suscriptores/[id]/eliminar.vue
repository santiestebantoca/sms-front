<script lang="ts" setup>
const props = defineProps({ suscriptorId: Number, back: Function })

import { useSuscriptorDelete } from '@/stores/suscriptores'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const toast = useToast()
const { mutateAsync: eliminarSuscriptor, asyncStatus } = useSuscriptorDelete()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const submit = () => eliminarSuscriptor(props.suscriptorId)
  .then(() => model.value = false)
  .catch((err) => {
    console.log(err)
    toast.create({ body: 'No se pudo ejecutar la acción.', variant: 'danger' })
  })
</script>

<template>
  <BModal v-model="model" title="Eliminar suscriptor" @hidden="back">
    <p>
      Esta acción eliminará permanentemente al suscriptor seleccionado.
    </p>
    <p class="text-danger fw-semibold">Esta acción no se puede deshacer.</p>
    <template #footer>
      <BButton variant="secondary" @click="model = false">
        Cancelar
      </BButton>
      <BButton variant="danger" @click="submit" :loading="loading" loading-fill class="w-90">
        Aceptar
      </BButton>
    </template>
  </BModal>
</template>