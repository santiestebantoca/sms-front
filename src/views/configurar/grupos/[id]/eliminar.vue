<script lang="ts" setup>
const props = defineProps({ grupoId: Number, back: Function, forward: Function })

import { useGrupoDelete } from '@/stores/grupos'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const deleted = ref(false)
const toast = useToast()
const { mutateAsync: eliminarGrupo, asyncStatus } = useGrupoDelete()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const submit = () => (eliminarGrupo as any)(props.grupoId)
  .then(() => {
    toast.create({ body: 'Grupo eliminado.', variant: 'success' })
    deleted.value = true
    model.value = false
  })
  .catch((err) => {
    toast.create({ body: 'No se pudo ejecutar la acción.', variant: 'danger' })
  })
const hidden = () => {
  if (deleted.value) props.forward()
  else props.back()
}
</script>

<template>
  <BModal v-model="model" title="Eliminar grupo" @hidden="hidden">
    <p>
      Esta acción eliminará permanentemente:
    </p>
    <ul>
      <li>El grupo seleccionado</li>
      <li>Grupos pertenecientes a él (grupos hijos)</li>
      <li>Suscriptores pertenecientes a estos grupos</li>
    </ul>
    <p class="text-danger fw-semibold">Esta acción no se puede deshacer.</p>
    <template #footer>
      <BButton variant="secondary" @click="model = false">
        Cancelar
      </BButton>
      <BButton variant="danger" @click="submit" :loading="loading" loading-fill class="w-90">
        Eliminar
      </BButton>
    </template>
  </BModal>
</template>