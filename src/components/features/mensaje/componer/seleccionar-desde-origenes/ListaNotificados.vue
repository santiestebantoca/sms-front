<script lang="ts" setup>
const show = defineModel<boolean>('show')
const notificadosIds = defineModel<Array<string | number>>('notificadosIds') // Subset de ids de notificados
const destinatariosIds = defineModel<Array<string | number>>('destinatariosIds') // Subset de ids de notificados
const props = defineProps<{
  notificados?: Array<{
    id: string | number
    nombre?: string
    apodo?: string
    suscriptores?: Array<{
      id: string | number
      nombre?: string
      telefono?: string
    }>
  }>
}>()
</script>

<template>
  <BModal v-model="show" title="Grupos notificados" no-footer>
    <div v-if="!destinatariosIds.length" class="mx-n3 mt-n3 p-3 text-center small text-bg-danger">
      Seleccione al menos un destinatario
    </div>
    <RootTree :childrenNames="['suscriptores']" class="sms-tree">
      <TreeNode v-for="data in notificados" :data="data" :key="data.id">
        <template #default="{ data, open, toggle, ident, isActive, isDescendantActive }">
          <template v-if="!data.grupo">
            <!-- Es un grupo -->
            <BListGroupItem class="hstack" :class="{ active: isActive, track: isDescendantActive && !open }"
              :style="{ paddingLeft: ident }">
              <TreeItemToggle v-if="data.suscriptores.length" :open="open" @click.stop="toggle" />
              <BFormCheckbox v-model="notificadosIds" :value="data.id" class="me-2" />
              <ILucideSquaresUnite class="text-yellow" />
              {{ data.apodo || data.nombre }}
            </BListGroupItem>
          </template>
          <template v-else>
            <!-- Es un suscriptor -->
            <BListGroupItem class="hstack" :class="{ active: isActive, track: isDescendantActive && !open }"
              :style="{ paddingLeft: ident }">
              <BFormCheckbox v-model="destinatariosIds" :value="data.id" class="me-2" />
              <ILucideUser class="text-teal" />
              <span class="text-truncate me-2">
                {{ data.nombre }}
              </span>
              <span class="text-pink">
                {{ data.telefono }}
              </span>
            </BListGroupItem>
          </template>
        </template>
      </TreeNode>
    </RootTree>
  </BModal>
</template>