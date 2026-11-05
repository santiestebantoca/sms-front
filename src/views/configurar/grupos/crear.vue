<script lang="ts" setup>
const props = defineProps({
  forward: Function,
  back: Function
})

import { isValidationError } from '@/api/client'
import { useGrupoCreate } from '@/stores/grupos'
import type { GrupoCreate } from '@/types/models'
import { useNotificaciones } from '@/composables/useNotificaciones'
import { ref, computed } from 'vue'

const { exito } = useNotificaciones()
const form = ref<GrupoCreate>({
  nombre: null,
  apodo: null,
  label: null,
  descripcion: null,
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  nombre: {
    state: errors.value.nombre ? false : null,
    invalidFeedback: errors.value.nombre,
    onInput: () => errors.value.nombre = null
  },
}))
const { mutateAsync: crearGrupo, asyncStatus } = useGrupoCreate()
const loading = computed(() => asyncStatus.value === 'loading')

const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío.'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  crearGrupo(form.value)
    .then((nuevoGrupo) => {
      exito('Nuevo grupo creado.')
      props.forward(nuevoGrupo.id) // props.back()
    })
    .catch(err => {
      if (isValidationError(err)) errors.value = err.errors
      errors.value.form = 'Error al crear el grupo.'
    })
}
</script>

<template>
  <div class="max-w-500 p-3">
    <h5 class="mb-5"> Nuevo grupo </h5>

    <BForm @submit.prevent="submit" density="3">
      <BFormGroup label="Nombre" v-bind="errorState.nombre">
        <BFormInput v-model="form.nombre" trim />
      </BFormGroup>
      <BFormGroup label="Alias">
        <BFormInput v-model="form.apodo" trim />
      </BFormGroup>
      <BFormGroup label="Etiquetas">
        <BFormInput v-model="form.label" trim />
      </BFormGroup>
      <BFormGroup label="Descripción">
        <BFormTextarea v-model="form.descripcion" no-resize />
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