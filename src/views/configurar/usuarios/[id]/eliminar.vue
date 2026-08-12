<script lang="ts" setup>
const props = defineProps({ usuarioId: Number, back: Function, forward: Function })

import { useUsuarioDelete } from '@/stores/usuarios'
import { useToast } from 'bootstrap-vue-next'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const deleted = ref(false)
const toast = useToast()
const { mutateAsync: eliminarUsuario, asyncStatus } = useUsuarioDelete()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const submit = () => (eliminarUsuario as any)(props.usuarioId)
  .then(() => {
    toast.create({ body: 'Usuario eliminado.', variant: 'success' })
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
  <BModal v-model="model" title="Eliminar usuario" @hidden="hidden">
    <p>
      Esta acción eliminará permanentemente al usuario
      y eliminará sus registros históricos asociados tales como,
      mensajes enviados.
    </p>
    <p class="text-danger fw-semibold">Esta acción no se puede deshacer.</p>
    <p class="bg-light rounded p-2 mx-n1">
      Si solo busca desactivar al usuario,
      actualice el campo "Clave de registro" con el valor "blocked".
    </p>
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