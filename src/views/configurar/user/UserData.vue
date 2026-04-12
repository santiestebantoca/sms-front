<script setup>
const props = defineProps({ back: Function })

import useStore from '@/stores/config-users'
import { ref, computed } from 'vue'

const users = useStore()
const data = computed(() => users.user.data)
const to = ref({
  general: {
    edit: { name: 'configurar-user-edit' },
    del: { name: 'configurar-user-del' }
  },
  roles: {
    edit: { name: 'configurar-user-membership' },
  },
})
const tab = ref('general')
</script>

<template>
  <div>
    <bs-tabs v-model="tab" class="tabs">
      <bs-tab name="general" label="General" />
      <bs-tab name="roles" label="Roles" />
      <bs-tab name="meta" label="Meta" />
    </bs-tabs>
    <bs-tab-content v-model="tab">
      <bs-tab-pane name="general">
        <div class="mt-2 hstack gap-2 justify-content-center">
          <bs-btn color="secondary" :to="to.general.edit" flat label="Editar" icon="pencil" />
          <bs-btn color="secondary" :to="to.general.del" flat label="Eliminar" icon="trash" />
        </div>
        <div class="px-3 py-2">
          <div class="label-value">
            <label>Nombre</label>
            <div class="value" v-text="data.name" />
          </div>
          <div class="label-value">
            <label>Nombre de usuario</label>
            <div class="value" v-text="data.username" />
          </div>
          <div class="label-value">
            <label>Bloqueado</label>
            <div class="value" v-text="data.blocked ? 'Sí' : 'No'" />
          </div>
        </div>
      </bs-tab-pane>
      <bs-tab-pane name="roles">
        <div class="mt-2 hstack gap-2 justify-content-center">
          <bs-btn color="secondary" :to="to.roles.edit" flat label="Editar" icon="pencil" />
        </div>
        <div class="px-3 py-2">
          <div class="label-value">
            <label>Roles</label>
            <div v-if="!data.membership.length" class="value">
              Usuario estándar
            </div>
            <div v-for="{ role } in data.membership">
              Usuario <span class="fw-semibold" v-text="role" />
            </div>
          </div>
        </div>
      </bs-tab-pane>
      <bs-tab-pane name="meta">
        <div class="px-3 py-2 mt-4">
          <div class="label-value">
            <label>Creado en</label>
            <div class="value" v-text="data.created_on || '-'" />
          </div>
          <div class="label-value">
            <label>Creado por</label>
            <div class="value" v-text="data.created_by || '-'" />
          </div>
          <div class="label-value">
            <label>Modificado en</label>
            <div class="value" v-text="data.modified_on || '-'" />
          </div>
          <div class="label-value">
            <label>Modificado por</label>
            <div class="value" v-text="data.modified_by || '-'" />
          </div>
        </div>
      </bs-tab-pane>
    </bs-tab-content>
  </div>
  <router-view />
</template>

<style scoped>
.label-value {
  margin-bottom: 8px;
}

.label-value>label {
  color: var(--bs-gray-600);
  font-size: .875em;
}

.label-value>div {
  padding: 2px 0;
}
</style>
