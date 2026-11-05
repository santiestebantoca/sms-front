<script lang="ts" setup>
const props = defineProps({
  forward: Function,
  back: Function
})

import { isValidationError } from '@/api/client'
import { useAuthGroupsQuery } from '@/stores/auth-groups'
import { useUsuarioCreate } from '@/stores/usuarios'
import type { UsuarioCreate } from '@/types/models'
import { useNotificaciones } from '@/composables/useNotificaciones'
import { ref, computed } from 'vue'

const { exito } = useNotificaciones()
const form = ref<UsuarioCreate>({
  first_name: null,
  last_name: null,
  username: null,
  grupos: [],
})
const errors = ref<Record<string, any>>({})
const errorState = computed(() => ({
  first_name: {
    state: errors.value.first_name ? false : null,
    invalidFeedback: errors.value.first_name,
    onInput: () => errors.value.first_name = null
  },
  last_name: {
    state: errors.value.last_name ? false : null,
    invalidFeedback: errors.value.last_name,
    onInput: () => errors.value.last_name = null
  },
  username: {
    state: errors.value.username ? false : null,
    invalidFeedback: errors.value.username,
    onInput: () => errors.value.username = null
  },
}))
const { mutateAsync: crearUsuario, asyncStatus } = useUsuarioCreate()
const loading = computed(() => asyncStatus.value === 'loading')
const { groups } = useAuthGroupsQuery()

const validate = () => {
  errors.value = {}
  if (!form.value.first_name) errors.value.nombre = 'Este campo no puede estar vacío.'
  if (!form.value.last_name) errors.value.nombre = 'Este campo no puede estar vacío.'
  if (!form.value.username) errors.value.nombre = 'Este campo no puede estar vacío.'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  crearUsuario(form.value)
    .then((nuevoUsuario) => {
      exito('Nuevo usuario creado.')
      props.forward(nuevoUsuario.id) // props.back()
    })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al crear el registro.'
    })
}
</script>

<template>
  <div class="max-w-500 px-3">
    <h5 class="mb-5">Nuevo usuario</h5>

    <BForm @submit.prevent="submit" density="3">
      <BFormGroup label="Nombre" v-bind="errorState.first_name">
        <BFormInput v-model="form.first_name" trim />
      </BFormGroup>
      <BFormGroup label="Apellidos" v-bind="errorState.last_name">
        <BFormInput v-model="form.last_name" trim />
      </BFormGroup>
      <BFormGroup label="Nombre de usuario" v-bind="errorState.username">
        <BFormInput v-model="form.username" trim />
      </BFormGroup>
      <BFormGroup v-slot="{ ariaDescribedby }" label="Grupos">
        <BFormCheckboxGroup v-model="form.grupos" :aria-describedby="ariaDescribedby" class="form-control-border">
          <BFormCheckbox v-for="group in groups" :value="group.id" class="mb-3">
            <div class="text-capitalize"> {{ group.role }} </div>
            <div class="small text-secondary"> {{ group.description }} </div>
          </BFormCheckbox>
        </BFormCheckboxGroup>
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