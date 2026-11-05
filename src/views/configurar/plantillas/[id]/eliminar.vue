<script lang="ts" setup>
const props = defineProps({
  plantillaId: Number,
  back: Function
})

import { usePlantillaDelete } from '@/stores/plantillas'
import { useNotificaciones } from '@/composables/useNotificaciones'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const { exito, errorDeApi } = useNotificaciones()
const { mutateAsync: eliminarPlantilla, asyncStatus } = usePlantillaDelete()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const submit = () => eliminarPlantilla(props.plantillaId)
  .then(() => {
    exito('Plantilla eliminada.')
    model.value = false
  })
  .catch((err) => {
    errorDeApi(err, 'No se pudo ejecutar la acción.')
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