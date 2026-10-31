<script lang="ts" setup>
const props = defineProps({ grupoId: Number, back: Function })

import { useGruposNotificablesQuery } from '@/stores/grupos'
import { useNotificadosDelGrupoQuery, useNotificadosUpdate } from '@/stores/notificados'
import { NotificadosUpdate } from '@/types/models';
import { ref, computed, watchEffect, onMounted } from 'vue'

const model = ref(false)
const form = ref<NotificadosUpdate>({
  id: props.grupoId,
  grupo_b: []
})
const { grupos, isPending: notificablesPendientes } = useGruposNotificablesQuery()
const { notificados, isPending: notificadosPendientes } = useNotificadosDelGrupoQuery(props.grupoId)
const { mutateAsync: actualizarNotificados, asyncStatus } = useNotificadosUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => {
  form.value.grupo_b = (notificados.value || []).map(d => d.id)
})
onMounted(() => model.value = true)

const submit = () => actualizarNotificados(form.value)
  .then(() => model.value = false)
</script>

<template>
  <BModal v-model="model" title="Notificados" @hidden="back">
    <div v-if="notificablesPendientes || notificadosPendientes" class="p-5 text-center">
      <BSpinner />
    </div>
    <RootTree v-else class="sms-tree">
      <TreeNode v-for="data in grupos" :data="data" :key="data.id">
        <template #default="{ data, open, toggle, ident }">
          <BListGroupItem class="hstack" :style="{ paddingLeft: ident }">
            <TreeItemToggle v-if="data.children.length" :open="open" @click.stop="toggle" />
            <BFormCheckbox v-model="form.grupo_b" :value="data.id" class="me-2" />
            <ILucideSquaresUnite class="text-yellow" />
            {{ data.nombre }}
          </BListGroupItem>
        </template>
      </TreeNode>
    </RootTree>
    <template #footer>
      <BButton @click="submit" variant="primary w-90" :loading="loading" loading-fill>
        Guardar
      </BButton>
      <BButton variant="emphasis w-90" @click="model = false">
        Cancelar
      </BButton>
    </template>
  </BModal>
</template>