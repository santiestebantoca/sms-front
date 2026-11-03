<script lang="ts" setup>
const props = defineProps({
  back: Function
})

import { isValidationError } from '@/api/client'
import { usePlantillaCreate } from '@/stores/plantillas'
import type { PlantillaCreate } from '@/types/models'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed } from 'vue'

const toast = useToast()
const form = ref<PlantillaCreate>({
  texto: null,
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  texto: {
    state: errors.value.texto ? false : null,
    invalidFeedback: errors.value.texto,
    onInput: () => errors.value.texto = null
  },
}))
const { mutateAsync: crearPlantilla, asyncStatus } = usePlantillaCreate()
const loading = computed(() => asyncStatus.value === 'loading')

const validate = () => {
  errors.value = {}
  if (!form.value.texto) errors.value.texto = 'Este campo no puede estar vacío.'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  crearPlantilla(form.value)
    .then(() => {
      toast.create({ body: 'Nueva plantilla creada.', variant: 'success' })
      props.back()
    })
    .catch(err => {
      if (isValidationError(err)) errors.value = err.errors
      errors.value.form = 'Error al crear la plantilla.'
    })
}
</script>

<template>
  <div class="max-w-700 py-3">
    <h5 class="mb-5"> Nueva plantilla </h5>

    <BForm @submit.prevent="submit" density="3">
      <BFormGroup label="Texto" v-bind="errorState.texto">
        <BFormTextarea v-model="form.texto" no-resize rows="6" />
      </BFormGroup>
      <BFormButtons class="py-4">
        <BButton type="submit" variant="primary w-90" :loading="loading" loading-fill>
          Crear
        </BButton>
        <BButton variant="emphasis w-90" @click="back">
          Cancelar
        </BButton>
      </BFormButtons>
    </BForm>
  </div>
</template>