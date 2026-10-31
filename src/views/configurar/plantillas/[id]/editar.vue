<script lang="ts" setup>
const props = defineProps({
  plantillaId: Number,
  back: Function
})

import { isValidationError } from '@/api/client'
import { usePlantillaQuery, usePlantillaUpdate } from '@/stores/plantillas'
import type { PlantillaUpdate } from '@/types/models'
import { ref, computed, onMounted, watchEffect } from 'vue'

const model = ref(false)
const form = ref<PlantillaUpdate>({
  id: props.plantillaId,
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
const { plantilla, isLoading } = usePlantillaQuery(props.plantillaId)
const { mutateAsync: actualizarPlantilla, asyncStatus } = usePlantillaUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => {
  if (plantilla.value) {
    form.value.texto = plantilla.value.texto
  }
})
onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.texto) errors.value.texto = 'Este campo no puede estar vacío.'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  actualizarPlantilla(form.value)
    .then(() => model.value = false)
    .catch(err => {
      if (isValidationError(err)) errors.value = err.errors
      errors.value.form = 'Error al actualizar el grupo.'
    })
}
</script>

<template>
  <BModal v-model="model" title="Editar plantilla" @hidden="back">
    <BForm id="form-plantilla-editar" @submit.prevent="submit" density="3">
      <BFormGroup label="Texto" v-bind="errorState.texto">
        <BFormTextarea v-model="form.texto" no-resize rows="6" />
      </BFormGroup>
    </BForm>
    <template #footer>
      <BButton type="submit" form="form-plantilla-editar" variant="primary w-90" :loading="loading" loading-fill>
        Guardar
      </BButton>
      <BButton variant="emphasis w-90" @click="model = false">
        Cancelar
      </BButton>
    </template>
  </BModal>
</template>