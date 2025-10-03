<script setup>
const props = defineProps({ data: Object })

import useGrupos from '@/stores/config-grupos'
import { ref, inject } from 'vue'

const loading = inject('app:loading')
const grupos = useGrupos()
const to = ref({
  edit: { name: 'configurar-grupo.suscriptores.edit', query: { id: props.data.id } },
})
const del = async (id, grupo) => {
  loading.value++
  await grupos.grupo.suscriptores.del(id).then(() => grupos.grupo.get(grupo))
  loading.value--
}
</script>

<template>
  <li class="li li-win" @mouseleave="$refs.el.hide()">
    <div class="text-truncate" v-text="data.nombre" />
    <div class="text-truncate text-secondary" v-text="data.telefono" />
    <div class="text-truncate text-secondary" v-text="data.cargo" />
    <bs-dropdown class="d-hover">
      <bs-dropdown-toggle ref="el" @click.stop>
        <bs-btn-icon size="26px" icon="three-dots" color="secondary" flat style="margin-bottom: 1px;" />
      </bs-dropdown-toggle>
      <bs-dropdown-menu end @click.stop>
        <bs-dropdown-item label="Editar" :to="to.edit" />
        <bs-dropdown-item label="Eliminar" @click.stop="del(data.id, data.grupo)" />
      </bs-dropdown-menu>
    </bs-dropdown>
  </li>
</template>

<style scoped></style>