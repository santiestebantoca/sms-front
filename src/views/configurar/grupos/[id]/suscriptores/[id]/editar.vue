<script lang="ts" setup>
const props = defineProps({ suscriptorId: Number, back: Function })

import { MOVIL_PATRON, EMAIL_PATRON } from '@/constants';
import { isValidationError } from '@/api/client'
import { useSuscriptorQuery, useSuscriptorUpdate } from '@/stores/suscriptores'
import type { SuscriptorUpdate } from '@/types/models'
import { ref, computed, onMounted, watchEffect } from 'vue'

const model = ref(false)
const form = ref<SuscriptorUpdate>({
  id: props.suscriptorId,
  nombre: null,
  cargo: null,
  telefono: null,
  correo: null,
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  nombre: {
    state: errors.value.nombre ? false : null,
    invalidFeedback: errors.value.nombre,
    onInput: () => errors.value.nombre = null
  },
  telefono: {
    state: errors.value.telefono ? false : null,
    invalidFeedback: errors.value.telefono,
    onInput: () => errors.value.telefono = null
  },
  correo: {
    state: errors.value.correo ? false : null,
    invalidFeedback: errors.value.correo,
    onInput: () => errors.value.correo = null
  },
}))
const { suscriptor, isPending } = useSuscriptorQuery(props.suscriptorId)
const { mutateAsync: actualizarSuscriptor, asyncStatus } = useSuscriptorUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => {
  if (suscriptor.value) {
    form.value.nombre = suscriptor.value.nombre
    form.value.cargo = suscriptor.value.cargo
    form.value.telefono = suscriptor.value.telefono
    form.value.correo = suscriptor.value.correo
  }
})
onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío'
  if (!form.value.telefono) errors.value.telefono = 'Este campo no puede estar vacío'
  else if (!MOVIL_PATRON.test(form.value.telefono)) errors.value.telefono = 'Formato no válido'
  if (form.value.correo && !EMAIL_PATRON.test(form.value.correo)) errors.value.correo = 'Formato no válido'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  actualizarSuscriptor(form.value)
    .then(() => model.value = false)
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar el grupo.'
    })
}
</script>

<template>
  <BModal v-model="model" title="Editar suscriptor" @hidden="back">
    <BForm id="form-suscriptor-editar" @submit.prevent="submit" density="3">
      <BFormGroup label="Nombre" v-bind="errorState.nombre">
        <BFormInput v-model="form.nombre" trim />
      </BFormGroup>
      <BFormGroup label="Cargo">
        <BFormInput v-model="form.cargo" trim />
      </BFormGroup>
      <BFormGroup label="Teléfono" v-bind="errorState.telefono">
        <BFormInput v-model="form.telefono" trim />
      </BFormGroup>
      <BFormGroup label="Correo" v-bind="errorState.correo">
        <BFormInput v-model="form.correo" trim />
      </BFormGroup>
    </BForm>
    <template #footer>
      <BButton type="submit" form="form-suscriptor-editar" variant="primary w-90" :loading="loading" loading-fill>
        Guardar
      </BButton>
      <BButton variant="emphasis w-90" @click="back">
        Cancelar
      </BButton>
    </template>
  </BModal>
</template>

<style scoped>
.form-label {
  color: var(--bs-teal);
  font-weight: 600;
  font-size: .875em;
}
</style>