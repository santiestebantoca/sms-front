<script lang="ts" setup>
import { useGruposDelGrupoQuery } from '@/stores/grupos'
import { computed, inject, Ref } from 'vue'

const grupo = inject<Ref<any>>('grupo:grupo')
const grupoId = computed(() => grupo.value?.id)
const { grupos, isLoading } = useGruposDelGrupoQuery(grupoId)

const linkEditar = (hijoId) => ({ name: 'configurar-grupo-hijo-editar', params: { hijoId } })
const linkEliminar = (hijoId) => ({ name: 'configurar-grupo-hijo-eliminar', params: { hijoId } })
</script>

<template>
  <BOverlay :show="isLoading" variant="transparent" class="h-50">
    <div class="hstack gap-2 justify-content-end py-2">
      <BButton variant="flat" :to="{ name: 'configurar-grupo-hijos-crear' }">
        <ILucidePlus /> Nuevo
      </BButton>
    </div>
    <div v-if="grupos" class="vstack gap-4">
      <div v-if="!grupos.length" class="mt-2 px-3">
        No hay grupos aquí.
      </div>
      <RootTree v-else class="sms-tree">
        <TreeNode v-for="data in grupos" :data="data" :key="data.id">
          <template #default="{ data }">
            <BListGroupItem class="hstack h-40">
              <ILucideSquaresUnite class="text-yellow" />
              <span class="text-truncate">{{ data.nombre }}</span>
              <span class="d-hover ms-auto me-n2">
                <BButton variant="flat" class="wh-30 me-2" :to="linkEditar(data.id)">
                  <ILucidePencilLine class="center" />
                </BButton>
                <BButton variant="flat" class="wh-30" :to="linkEliminar(data.id)">
                  <ILucideTrash class="center" />
                </BButton>
              </span>
            </BListGroupItem>
          </template>
        </TreeNode>
      </RootTree>
    </div>
  </BOverlay>
</template>