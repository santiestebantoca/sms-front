<script setup>
const props = defineProps({ back: Function })

import { isValidationError } from '@/api/client'
import { usePlantillaCreate } from '@/stores/plantillas'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, inject, onMounted } from 'vue'

const model = ref(false)
const filtro = inject('plantillas:filtro')
const toast = useToast()
const { mutateAsync: crearPlantilla, asyncStatus } = usePlantillaCreate(filtro.value)
const loading = computed(() => asyncStatus.value === 'loading')
const form = ref({
  texto: null,
})
const errors = ref({})

onMounted(() => model.value = true)

const validate = () => {
  errors.value = {}
  if (!form.value.texto) errors.texto = 'Este campo no puede estar vacío'
  return !Object.keys(errors.value = {}).length
}
const submit = async () => {
  if (!validate()) return
  crearPlantilla(form.value)
    .then(nuevaPlantilla => {
      toast.create({ body: 'Nueva plantilla creada.', variant: 'success' })
      model.value = false
    })
    .catch(err => {
      isValidationError(err) && (errors.value = err.errors)
      errors.value.form = 'Error al crear la plantilla.'
    })
}
</script>

<template>
  <BModal v-model="model" title="Crear plantilla" @hidden="back">
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Texto</label>
        <textarea rows="8" class="form-control" v-model.trim="form.texto" @input="errors.texto = null" />
        <div class="small text-danger" v-text="errors.texto" />
      </div>
    </form>
    <template #footer>
      <BButton @click="submit" :loading="loading" loading-fill style="width: 90px;">
        Crear
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