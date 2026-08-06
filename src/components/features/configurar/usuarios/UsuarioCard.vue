<script setup>
const props = defineProps({ usuarioId: Number })

import { useUsuarioQuery } from '@/stores/usuarios'
import { ref, watchEffect } from 'vue'

const { usuario, isPending, usuarioId } = useUsuarioQuery()

const meta = ref(false)
const acciones = ref([
  {
    texto: "Editar",
    icon: "bi-pencil",
    action: {
      to: { name: 'configurar-usuario-editar' }
    },
  },
  {
    texto: "Eliminar",
    icon: "bi-trash",
    action: {
      to: { name: 'configurar-usuario-eliminar' }
    },
  },
  {
    icon: "bi-info-circle",
    tippy: 'Información del registro',
    action: {
      onClick: () => meta.value = true
    }
  },
])

watchEffect(() => usuarioId.value = props.usuarioId)
</script>

<template>
  <div v-if="isPending" class="text-center p-5">
    <BSpinner />
  </div>
  <template v-else>
    <div class="mt-2 hstack gap-2 justify-content-end">
      <BButton v-for="accion in acciones" variant="flat-outline-dark" v-bind="accion.action" v-tippy="accion.tippy"
        class="btn-sm">
        <UIcon :name="accion.icon" /> {{ accion.texto }}
      </BButton>
    </div>
    <div class="px-3 py-2">
      <div class="label-value">
        <label>Nombre</label>
        <div class="value" v-text="`${usuario.first_name} ${usuario.last_name}`" />
      </div>
      <div class="label-value">
        <label>Nombre de usuario</label>
        <div class="value" v-text="usuario.username" />
      </div>
      <div class="label-value">
        <label>Clave de registro</label>
        <div class="value capitalize" v-text="usuario.registration_key || 'Activo'" />
      </div>
    </div>
    <BModal v-model="meta" title="Información del registro" no-footer>
      <div class="label-value">
        <label>Creado en</label>
        <div class="value" v-text="usuario.created_on || '-'" />
      </div>
      <div class="label-value">
        <label>Creado por</label>
        <div class="value" v-text="usuario.created_by || '-'" />
      </div>
      <div class="label-value">
        <label>Modificado en</label>
        <div class="value" v-text="usuario.modified_on || '-'" />
      </div>
      <div class="label-value">
        <label>Modificado por</label>
        <div class="value" v-text="usuario.modified_by || '-'" />
      </div>
    </BModal>
  </template>
</template>