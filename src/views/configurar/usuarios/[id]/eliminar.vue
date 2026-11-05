<script lang="ts" setup>
const props = defineProps({
  usuarioId: Number,
  back: Function,
  forward: Function
})

import { useUsuarioDelete } from '@/stores/usuarios'
import { useNotificaciones } from '@/composables/useNotificaciones'
import { ref, computed, onMounted } from 'vue'

const model = ref(false)
const deleted = ref(false)
const { exito, errorDeApi } = useNotificaciones()
const { mutateAsync: eliminarUsuario, asyncStatus } = useUsuarioDelete()
const loading = computed(() => asyncStatus.value === 'loading')

onMounted(() => model.value = true)

const submit = () => eliminarUsuario(props.usuarioId)
  .then(() => {
    exito('Usuario eliminado.')
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
  <BModal v-model="model" title="Eliminar usuario" @hidden="hidden">
    <p>
      Se eliminarán permanentemente:
    </p>
    <ul>
      <li>El usuario seleccionado y</li>
      <li>sus mensajes enviados.</li>
    </ul>
    <p class="text-danger fw-semibold">
      Esta acción no se puede deshacer.
    </p>
    <p>
      Puede bloquear la autenticación del usuario,
      <router-link :to="{ name: 'configurar-usuario-editar' }">
        editando su clave de registro</router-link>.
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