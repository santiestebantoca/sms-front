<script lang="ts" setup>
const props = defineProps({ usuarioId: Number, back: Function })

import { useAuthGroupsQuery } from '@/stores/auth-groups'
import { useAuthMembershipQuery, useAuthMembershipUpdate } from '@/stores/auth-membership'
import { ref, computed, watchEffect, onMounted } from 'vue'

const model = ref(false)
const form = ref<Record<string, any>>({
  group_id: []
})
const { groups, isPending: groupsPendientes } = useAuthGroupsQuery()
const { groups: membership, isPending: membershipPendiente } = useAuthMembershipQuery(props.usuarioId)
const { mutateAsync: actualizarMembership, asyncStatus } = useAuthMembershipUpdate()
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => {
  form.value.group_id = (membership.value || []).map(d => d.id)
})
onMounted(() => model.value = true)

const submit = () => actualizarMembership({ id: props.usuarioId, ...form.value })
  .then(() => model.value = false)
</script>

<template>
  <BModal v-model="model" title="Roles asignados" @hidden="back">
    <div v-if="groupsPendientes || membershipPendiente" class="p-5 text-center">
      <BSpinner />
    </div>
    <RootTree v-else list>
      <TreeNode v-for="data in groups" :data="data" :key="data.id">
        <template #default="{ data }">
          <input type="checkbox" v-model="form.group_id" :value="data.id" />
          <span v-text="data.role" class="text-truncate capitalize" />
        </template>
      </TreeNode>
    </RootTree>
    <template #footer>
      <BButton variant="primary" @click="submit" :loading="loading">
        <UIcon name="bi-check2" /> Listo
      </BButton>
    </template>
  </BModal>
</template>

<style scoped>
.form-label {
  color: var(--bs-teal);
  font-weight: 600;
  font-size: .875em;
}
</style>
