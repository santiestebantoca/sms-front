<script setup>
const props = defineProps({ back: Function })

import useStore from '@/stores/config-suscriptores'
import { ref, computed } from 'vue'

const suscriptores = useStore()
const data = computed(() => suscriptores.suscriptor.data)
const to = ref({
  edit: { name: 'configurar-suscriptor-edit' },
  del: { name: 'configurar-suscriptor-del' }
})
const tab = ref('general')
</script>

<template>
  <div>
    <bs-tabs v-model="tab" class="tabs">
      <bs-tab name="general" label="General" />
      <bs-tab name="meta" label="Meta" />
    </bs-tabs>
    <bs-tab-content v-model="tab">
      <bs-tab-pane name="general">
        <div class="mt-2 hstack gap-2 justify-content-center">
          <bs-btn color="secondary" :to="to.edit" flat label="Editar" icon="pencil" />
          <bs-btn color="secondary" :to="to.del" flat label="Eliminar" icon="trash" />
        </div>
        <div class="px-3 py-2">
          <div class="label-value">
            <label>Nombre</label>
            <div class="value" v-text="data.nombre" />
          </div>
          <div class="label-value">
            <label>Teléfono</label>
            <div class="value" v-text="data.telefono || '-'" />
          </div>
          <div class="label-value">
            <label>Correo</label>
            <div class="value" v-text="data.correo || '-'" />
          </div>
          <div class="label-value">
            <label>Cargo</label>
            <div class="value" v-text="data.cargo || '-'" />
          </div>
          <div class="label-value">
            <label>Grupo</label>
            <div v-if="data.grupo" class="hstack" style="height: 32px;">
              <i class="bi-subtract me-2" style="color:var(--bs-yellow)" />
              <span v-text="data.grupo.nombre" />
            </div>
            <div v-else>-</div>
          </div>
          <div class="label-value">
            <label>Activo</label>
            <div class="value" v-text="data.activo ? 'Sí' : 'No'" />
          </div>
          <div class="label-value">
            <label>Suplente</label>
            <div v-if="data.suplente" class="hstack" style="height: 32px;">
              <i class="bi-person-fill text-secondary me-2" />
              <span v-text="data.suplente.nombre" />
            </div>
            <div v-else>-</div>
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
