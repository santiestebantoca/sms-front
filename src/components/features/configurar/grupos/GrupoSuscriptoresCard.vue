<script lang="ts" setup>
import { useSuscriptoresDelGrupoQuery } from '@/stores/suscriptores'
import { computed, inject, Ref } from 'vue'

const grupo = inject<Ref<any>>('grupo:grupo')
const grupoId = computed(() => grupo.value?.id)
const { suscriptores, isLoading } = useSuscriptoresDelGrupoQuery(grupoId)

const linkEditar = (suscriptorId) => ({ name: 'configurar-grupo-suscriptor-editar', params: { suscriptorId } })
const linkEliminar = (suscriptorId) => ({ name: 'configurar-grupo-suscriptor-eliminar', params: { suscriptorId } })
</script>

<template>
  <BOverlay :show="isLoading" variant="transparent" class="h-50">
    <div class="hstack gap-2 justify-content-end py-2">
      <BButton variant="flat" :to="{ name: 'configurar-grupo-suscriptores-crear' }">
        <ILucidePlus /> Nuevo
      </BButton>
    </div>
    <div v-if="suscriptores" class="vstack gap-4">
      <div v-if="!suscriptores.length" class="mt-2 px-3">
        No hay suscriptores aquí.
      </div>
      <RootTree v-else class="sms-tree">
        <TreeNode v-for="data in suscriptores" :data="data" :key="data.id">
          <template #default="{ data }">
            <BListGroupItem class="hstack h-40">
              <ILucideUser class="text-teal" />
              <span class="text-truncate">{{ data.nombre }}</span>
              <span class="text-pink mx-3">{{ data.telefono }}</span>
              <span v-if="data.correo" class="text-secondary">{{ `<${data.correo}>` }}</span>
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