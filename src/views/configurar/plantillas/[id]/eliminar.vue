<script setup>
const props = defineProps({ plantillaId: Number, back: Function })

import { usePlantillaDelete } from '@/stores/plantillas'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const toast = useToast()
const { mutateAsync: eliminarPlantilla, asyncStatus } = usePlantillaDelete()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const submit = () => eliminarPlantilla(props.plantillaId)
  .then(() => {
    toast.create({ body: 'Plantilla eliminada.', variant: 'success' })
    model.value = false
  })
  .catch((err) => {
    toast.create({ body: 'No se pudo ejecutar la acción.', variant: 'danger' })
  })
</script>

<template>
  <BModal v-model="model" title="Eliminar plantilla" @hidden="back">
    <p>
      Se eliminará la plantilla permanentemente.
    </p>
    <template #footer>
      <BButton variant="secondary" @click="model = false">
        Cancelar
      </BButton>
      <BButton variant="danger" @click="submit" :loading="loading" loading-fill class="w-90">
        Eliminar
      </BButton>
    </template>
  </BModal>
</template>