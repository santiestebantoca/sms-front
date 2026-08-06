<script setup>
const props = defineProps({ suscriptorId: Number })

import { useSuscriptorQuery } from '@/stores/suscriptores'
import { ref, watchEffect } from 'vue'

const { suscriptor, isPending, suscriptorId } = useSuscriptorQuery()

const meta = ref(false)
const acciones = ref([
  {
    texto: "Editar",
    icon: "bi-pencil",
    action: {
      to: { name: 'configurar-suscriptor-editar' }
    },
  },
  {
    texto: "Eliminar",
    icon: "bi-trash",
    action: {
      to: { name: 'configurar-suscriptor-eliminar' }
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

watchEffect(() => suscriptorId.value = props.suscriptorId)
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
        <div class="value" v-text="suscriptor.nombre" />
      </div>
      <div class="label-value">
        <label>Teléfono</label>
        <div class="value" v-text="suscriptor.telefono || '-'" />
      </div>
      <div class="label-value">
        <label>Correo</label>
        <div class="value" v-text="suscriptor.correo || '-'" />
      </div>
      <div class="label-value">
        <label>Cargo</label>
        <div class="value" v-text="suscriptor.cargo || '-'" />
      </div>
      <div class="label-value">
        <label>Grupo</label>
        <div v-if="suscriptor.grupo" class="hstack" style="height: 32px;">
          <UIcon name="bi-subtract me-2" style="color:var(--bs-yellow);flex-shrink: 0;" />
          <span v-text="suscriptor.grupo" class="text-truncate" />
        </div>
        <div v-else>-</div>
      </div>
      <div class="label-value">
        <label>Activo</label>
        <div class="value" v-text="suscriptor.activo ? 'Sí' : 'No'" />
      </div>
      <div class="label-value">
        <label>Suplente</label>
        <div v-if="suscriptor.suplente" class="hstack" style="height: 32px;">
          <UIcon class="bi-person text-secondary me-2" />
          <span v-text="suscriptor.suplente" />
        </div>
        <div v-else>-</div>
      </div>
    </div>
    <BModal v-model="meta" title="Información del registro" no-footer>
      <div class="label-value">
        <label>Creado en</label>
        <div class="value" v-text="suscriptor.created_on || '-'" />
      </div>
      <div class="label-value">
        <label>Creado por</label>
        <div class="value" v-text="suscriptor.created_by || '-'" />
      </div>
      <div class="label-value">
        <label>Modificado en</label>
        <div class="value" v-text="suscriptor.modified_on || '-'" />
      </div>
      <div class="label-value">
        <label>Modificado por</label>
        <div class="value" v-text="suscriptor.modified_by || '-'" />
      </div>
    </BModal>
  </template>
</template>