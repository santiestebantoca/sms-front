<script setup>
const props = defineProps({ grupoId: Number, suscriptorId: Number, back: Function })

import { isValidationError } from '@/api/client'
import { useSuscriptorQuery, useSuscriptorUpdate } from '@/stores/suscriptores'
import { useGrupoExpandidoQuery } from '@/stores/grupos'
import { ref, computed, onMounted, watchEffect } from 'vue'

const model = ref(false)
const form = ref({
  nombre: null,
  cargo: null,
  telefono: null,
  correo: null,
  grupo: null
})
const errors = ref({})
const { grupo, isPending } = useGrupoExpandidoQuery(props.grupoId)
const suscriptor = computed(() => grupo.value?.suscriptores.find(d => d.id === props.suscriptorId))
const { mutateAsync: actualizarSuscriptor, asyncStatus } = useSuscriptorUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => {
  if (suscriptor.value) {
    form.value.nombre = suscriptor.value.nombre
    form.value.cargo = suscriptor.value.cargo
    form.value.telefono = suscriptor.value.telefono
    form.value.correo = suscriptor.value.correo
    form.value.grupo = suscriptor.value.grupo
  }
})
onMounted(() => model.value = true)

const validate = () => {
  const telefono = /^(\+53|53)?\d{8}$/
  const correo = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío'
  if (!form.value.telefono) errors.value.telefono = 'Este campo no puede estar vacío'
  else if (!telefono.test(form.value.telefono)) errors.value.telefono = 'Formato no válido'
  if (form.value.correo && !correo.test(form.value.correo)) errors.value.correo = 'Formato no válido'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  actualizarSuscriptor({ id: suscriptor.value.id, ...form.value })
    .then(() => model.value = false)
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al actualizar el grupo.'
    })
}
</script>

<template>
  <BModal v-model="model" title="Editar suscriptor" @hidden="back">
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input class="form-control" v-model.trim="form.nombre" @input="errors.nombre = null" />
        <div class="small text-danger" v-text="errors.nombre" />
      </div>
      <div class="mb-3">
        <label class="form-label">Cargo</label>
        <input class="form-control" v-model.trim="form.cargo" />
      </div>
      <div class="mb-3">
        <label class="form-label">Teléfono</label>
        <input class="form-control" v-model.trim="form.telefono" @input="errors.telefono = null" />
        <div class="small text-danger" v-text="errors.telefono" />
      </div>
      <div class="mb-3">
        <label class="form-label">Correo</label>
        <input class="form-control" v-model.trim="form.correo" @input="errors.correo = null" />
        <div class="small text-danger" v-text="errors.correo" />
      </div>
    </form>
    <template #footer>
      <BButton variant="primary" @click="submit">
        Aceptar
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