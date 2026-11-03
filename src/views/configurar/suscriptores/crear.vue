<script lang="ts" setup>
const props = defineProps({
  forward: Function,
  back: Function
})

import SeleccionarGrupo from '@/components/features/configurar/suscriptores/SeleccionarGrupo.vue'
import { isValidationError } from '@/api/client'
import {
  useSuscriptoresQuery, // Para seleccionar el suplente
  useSuscriptorCreate
} from '@/stores/suscriptores'
import type { SuscriptorCreate } from '@/types/models'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed } from 'vue'

const toast = useToast()
const form = ref<SuscriptorCreate>({
  nombre: null,
  cargo: null,
  telefono: null,
  correo: null,
  grupo: null,
  activo: true,
  suplente: null,
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
  grupo: {
    state: errors.value.grupo ? false : null,
    invalidFeedback: errors.value.grupo,
    onInput: () => errors.value.grupo = null // No funciona, el input se genera fuera 
  },
}))
const { options: suscriptores } = useSuscriptoresQuery()
const { mutateAsync: crearSuscriptor, asyncStatus } = useSuscriptorCreate()
const loading = computed(() => asyncStatus.value === 'loading')

const validate = () => {
  const telefono = /^(\+53|53)?\d{8}$/
  const correo = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío.'
  if (!form.value.grupo) errors.value.grupo = 'Este campo no puede estar vacío.'
  if (!form.value.telefono) errors.value.telefono = 'Este campo no puede estar vacío.'
  else if (!telefono.test(form.value.telefono)) errors.value.telefono = 'Formato no válido.'
  if (form.value.correo && !correo.test(form.value.correo)) errors.value.correo = 'Formato no válido.'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  crearSuscriptor(form.value)
    .then(nuevoSuscriptor => {
      toast.create({ body: 'Nuevo suscriptor creado.', variant: 'success' })
      props.forward(nuevoSuscriptor.id) // props.back()
    })
    .catch(err => {
      if (isValidationError(err)) errors.value = err.errors
      errors.value.form = 'Error al crear el suscriptor.'
    })
}
</script>

<template>
  <div class="max-w-500 p-3">
    <h5 class="mb-5"> Nuevo suscriptor </h5>

    <BForm @submit.prevent="submit" density="3">
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
      <SeleccionarGrupo v-model="form.grupo" #default="{ options, open }">
        <BFormGroup label="Grupo" v-bind="errorState.grupo" @click="open">
          <BFormSelect v-model="form.grupo" :options="options" no-events />
        </BFormGroup>
      </SeleccionarGrupo>
      <BFormGroup label="Activo">
        <div class="form-control-border">
          <BFormCheckbox v-model="form.activo" class="mb-0">
            {{ form.activo ? 'Sí' : 'No' }}
          </BFormCheckbox>
        </div>
      </BFormGroup>
      <BFormGroup label="Suplente">
        <BFormSelect v-model="form.suplente" :options="suscriptores" />
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