<script lang="ts" setup>
const props = defineProps({
  usuarioId: Number,
  editar: Object,
  eliminar: Object,
})

import { formatTime } from '@/composables/useDates'
import { useUsuarioQuery } from '@/stores/usuarios'
import { computed, provide } from 'vue'

const usuarioId = computed(() => props.usuarioId)
const { usuario, isLoading } = useUsuarioQuery(usuarioId)

provide('usuario:usuario', usuario)
</script>

<template>
  <BOverlay :show="isLoading" variant="transparent" class="h-50">
    <template v-if="usuario">
      <BTabs :key="usuarioId" class="pt-2">
        <BTab title="General">
          <div class="hstack gap-2 justify-content-end py-2">
            <BButton :to="editar" variant="flat">
              <ILucidePenLine /> Editar
            </BButton>
            <BButton :to="eliminar" variant="flat">
              <ILucideTrash /> Eliminar
            </BButton>
          </div>
          <div class="vstack gap-4 px-3">
            <div class="w-100">
              <label class="form-label">Nombre</label>
              <div>
                {{ usuario.first_name }} {{ usuario.last_name }}
              </div>
            </div>
            <div class="w-100">
              <label class="form-label">Nombre de usuario</label>
              <div>
                {{ usuario.username }}
              </div>
            </div>
            <div class="w-100">
              <label class="form-label">Grupos</label>
              <div class="text-capitalize">
                {{usuario.grupos.map((grupo) => grupo.role).join(', ') || '-'}}
              </div>
            </div>
            <div class="w-100">
              <label class="form-label">Estado del registro</label>
              <div>
                {{ usuario.registration_key === 'blocked' ? 'Bloqueado' : (usuario.registration_key || 'Normal') }}
              </div>
            </div>
            <template v-if="usuario.modified_by">
              <div class="pt-3 border-top">
                <label class="form-label">Modificado</label>
                <div>
                  {{ usuario.modified_by }},
                  {{ formatTime(usuario.modified_on) }}
                </div>
              </div>
            </template>
          </div>
        </BTab>
      </BTabs>
      <router-view />
    </template>
  </BOverlay>
</template>