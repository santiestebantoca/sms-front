<script lang="ts" setup>
const props = defineProps({
  plantillaId: Number,
  back: Function
})

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
    toast.create({ body: 'Plantilla eliminada.', variant: 'success' }).show()
    model.value = false
  })
  .catch((err) => {
    toast.create({ body: 'No se pudo ejecutar la acción.', variant: 'danger' }).show()
  })
</script>

<template>
  <BModal v-model="model" title="Eliminar plantilla" @hidden="back">
    <p>
      Se eliminará la plantilla permanentemente.
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