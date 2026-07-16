<script setup>
const props = defineProps({ plantillaId: Number, back: Function })

import { usePlantillasQuery, usePlantillaDelete } from '@/stores/plantillas'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, inject, onMounted } from 'vue'

const model = ref(false)
const filtro = inject('plantillas:filtro')
const toast = useToast()
const { plantillas, isPending } = usePlantillasQuery()
const plantilla = computed(() => plantillas.value?.find(d => d.id === props.plantillaId))
const { mutateAsync: eliminarPlantilla, asyncStatus } = usePlantillaDelete(filtro.value)
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const submit = () => eliminarPlantilla(plantilla.value)
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
      <BButton variant="secondary" @click="model = false" :disabled="loading">
        Cancelar
      </BButton>
      <BButton variant="danger" @click="submit" :loading="loading" loading-fill style="width: 90px;">
        Eliminar
      </BButton>
    </template>
  </BModal>
</template>