<script setup>
const props = defineProps({ pertenece: Number, back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useGrupos from '@/stores/config-grupos'
import { ref, inject } from 'vue'

const loading = inject('app:loading')
const process = useHandleSubmit()
const model = ref(true)
const grupos = useGrupos()
const form = ref({
  nombre: null,
  apodo: null,
  label: null,
  descripcion: null,
  pertenece: props.pertenece,
})
const errors = ref({})
const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  loading.value++
  await grupos.post(form.value)
    .then(res => process.POST(res.data,
      () => Promise.all([
        grupos.get(),
        ...props.pertenece === grupos.grupo.data.id
          ? [grupos.grupo.get(props.pertenece)]
          : []
      ]).then(() => model.value = false),
      errs => errors.value = errs))
  loading.value--
}
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back">
      <bs-dialog-header label="Nuevo grupo" />
      <bs-dialog-body>
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input class="form-control" v-model.trim="form.nombre" @input="errors.nombre = null" />
            <div class="small text-danger" v-text="errors.nombre" />
          </div>
          <div class="mb-3">
            <label class="form-label">Alias</label>
            <input class="form-control" v-model.trim="form.apodo" @input="errors.apodo = null" />
            <div class="small text-danger" v-text="errors.apodo" />
          </div>
          <div class="mb-3">
            <label class="form-label">Etiquetas</label>
            <input class="form-control" v-model.trim="form.label" />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" v-model.trim="form.descripcion" />
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