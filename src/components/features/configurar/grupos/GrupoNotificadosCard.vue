<script lang="ts" setup>
import { useNotificadosDelGrupoQuery } from '@/stores/notificados'
import { computed, inject, Ref } from 'vue'

const grupo = inject<Ref<any>>('grupo:grupo')
const grupoId = computed(() => grupo.value?.id)
const { notificados, isLoading } = useNotificadosDelGrupoQuery(grupoId)
</script>

<template>
  <BOverlay :show="isLoading" variant="transparent" class="h-50">
    <div class="hstack gap-2 justify-content-end py-2">
      <BButton variant="flat" :to="{ name: 'configurar-grupo-notificados-editar' }">
        <ILucideSquareCheckBig /> Seleccionar
      </BButton>
    </div>
    <div v-if="notificados" class="vstack gap-4">
      <div v-if="!notificados.length" class="mt-2 px-3">
        No hay grupos aquí.
      </div>
      <RootTree v-else class="sms-tree">
        <TreeNode v-for="data in notificados" :data="data" :key="data.id">
          <template #default="{ data }">
            <BListGroupItem class="hstack h-40">
              <ILucideSquaresUnite class="text-yellow" />
              <span class="text-truncate">{{ data.nombre }}</span>
            </BListGroupItem>
          </template>
        </TreeNode>
      </RootTree>
    </div>
  </BOverlay>
</template>