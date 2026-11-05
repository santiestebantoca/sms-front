<script lang="ts" setup>
const props = defineProps({
  grupoId: Number,
  back: Function,
  forward: Function
})

import { useGrupoDelete } from '@/stores/grupos'
import { useNotificaciones } from '@/composables/useNotificaciones'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const deleted = ref(false)
const { exito, errorDeApi } = useNotificaciones()
const { mutateAsync: eliminarGrupo, asyncStatus } = useGrupoDelete()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const submit = () => eliminarGrupo(props.grupoId)
  .then(() => {
    exito('Grupo eliminado.')
    deleted.value = true
    model.value = false
  })
  .catch((err) => {
    errorDeApi(err, 'No se pudo ejecutar la acción.')
  })
const hidden = () => {
  if (deleted.value) props.forward()
  else props.back()
}
</script>

<template>
  <BModal v-model="model" title="Eliminar grupo" @hidden="hidden">
    <p>
      Se eliminarán permanentemente:
    </p>
    <ul>
      <li>El grupo seleccionado,</li>
      <li>los grupos pertenecientes a él (grupos hijos) y</li>
      <li>los suscriptores pertenecientes a estos grupos.</li>
    </ul>
    <p class="text-danger fw-semibold">
      Esta acción no se puede deshacer.
    </p>
    <template #footer>
      <BButton variant="emphasis" @click="model = false">
        Cancelar
      </BButton>
      <BButton variant="danger w-90" @click="submit" :loading="loading" loading-fill>
        Eliminar
      </BButton>
    </template>
  </BModal>
</template>