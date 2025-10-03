<script setup>
const props = defineProps({ id: Number, back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useGrupos from '@/stores/config-grupos'
import { ref, computed, watch, inject } from 'vue'

const loading = inject('app:loading')
const process = useHandleSubmit()
const model = ref(null)
const grupos = useGrupos()
const data = computed(() => grupos.grupo.data.suscriptores?.find(d => d.id === props.id))
const form = ref({
  nombre: null,
  cargo: null,
  telefono: null,
  correo: null,
})
const errors = ref({})
watch(data, d => {
  if (d) {
    form.value.nombre = d.nombre
    form.value.cargo = d.cargo
    form.value.telefono = d.telefono
    form.value.correo = d.correo
    model.value = true
  }
}, { immediate: true })
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
  loading.value++
  await grupos.grupo.suscriptores.put({ id: props.id, data: form.value })
    .then(res => process.PUT(res.data,
      () => grupos.grupo.get(data.value.grupo).then(() => model.value = false),
      errs => errors.value = errs))
  loading.value--
}
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back">
      <bs-dialog-header label="Editar suscriptor" />
      <bs-dialog-body>
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
          </div><br>
          <bs-btn type="submit" color="primary" label="Aceptar" />
        </form>
      </bs-dialog-body>
    </bs-dialog>
  </Teleport>
</template>

<style scoped>
.form-label {
  color: var(--bs-teal);
  font-weight: 600;
  font-size: .875em;
}
</style>