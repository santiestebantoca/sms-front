<script setup>
const props = defineProps({ back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useGrupos from '@/stores/config-grupos'
import { ref, computed, watch, inject } from 'vue'

const loading = inject('app:loading')
const process = useHandleSubmit()
const model = ref(null)
const grupos = useGrupos()
const data = computed(() => grupos.grupo.data)
const form = ref({
  nombre: null,
  apodo: null,
  label: null,
  descripcion: null
})
const errors = ref({})
watch(data, d => {
  if (d) {
    form.value.nombre = d.nombre
    form.value.apodo = d.apodo
    form.value.label = d.label
    form.value.descripcion = d.descripcion
    model.value = true
  }
}, { immediate: true })
const validate = () => {
  errors.value = {}
  if (!form.value.nombre) errors.value.nombre = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  loading.value++
  await grupos.grupo.put({ id: data.value.id, data: form.value })
    .then(res => process.PUT(res.data,
      () => {
        Promise.all([
          grupos.get(),
          grupos.grupo.get(data.value.id)
        ]).then(() => model.value = false)
      },
      errs => errors.value = errs))
  loading.value--
}
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back">
      <bs-dialog-header label="Editar grupo" />
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