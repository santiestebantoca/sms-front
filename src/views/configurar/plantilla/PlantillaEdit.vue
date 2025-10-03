<script setup>
const props = defineProps({ id: Number, back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import usePlantillas from '@/stores/config-plantillas'
import { ref, computed, watch, inject } from 'vue'

const loading = inject('app:loading')
const process = useHandleSubmit()
const model = ref(null)
const plantillas = usePlantillas()
const data = computed(() => plantillas.plantilla.data)
plantillas.plantilla.get(props.id)
const form = ref({
  texto: null,
})
const errors = ref({})
watch(data, d => {
  if (d) {
    form.value.texto = d.texto
    model.value = true
  }
}, { immediate: true })
const validate = () => {
  errors.value = {}
  if (!form.value.texto) errors.value.texto = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value).length
}
const submit = async () => {
  if (!validate()) return
  loading.value++
  await plantillas.plantilla.put({ id: data.value.id, data: form.value })
    .then(res => process.PUT(res.data,
      () => {
        Promise.all([
          plantillas.get(),
          plantillas.plantilla.get(data.value.id)
        ]).then(() => model.value = false)
      },
      errs => errors.value = errs))
  loading.value--
}
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back" scrollable>
      <bs-dialog-header label="Editar plantilla" />
      <bs-dialog-body>
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label class="form-label">Texto</label>
            <textarea rows="8" class="form-control" v-model.trim="form.texto" @input="errors.texto = null" />
            <div class="small text-danger" v-text="errors.first_name" />
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