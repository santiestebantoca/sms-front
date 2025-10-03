<script setup>
const props = defineProps({ back: Function })

import useStore from '@/stores/config-grupos'
import { ref, computed, provide } from 'vue'

const grupos = useStore()
const data = computed(() => grupos.grupo.data)
const active = ref({
  children: null,
  suscriptores: null,
  notifica: null,
})
provide('grupo:active', active)
const to = computed(() => ({
  general: {
    edit: { name: 'configurar-grupo-edit' },
    new: { name: 'configurar-grupo.new' },
    del: { name: 'configurar-grupo-del' }
  },
  children: {
    new: { name: 'configurar-grupo-children-new' },
    edit: { name: 'configurar-grupo-child-edit', params: { child: active.value.children } },
    del: { name: 'configurar-grupo-child-del', params: { child: active.value.children } }
  },
  suscriptores: {
    new: { name: 'configurar-grupo-suscriptores-new' },
    edit: { name: 'configurar-grupo-suscriptor-edit', params: { suscriptor: active.value.suscriptores } },
    del: { name: 'configurar-grupo-suscriptor-del', params: { suscriptor: active.value.suscriptores } },
  },
  notifica: {
    sel: { name: 'configurar-grupo-notifica-sel' },
  },
}))
const tab = ref('general')
</script>

<template>
  <div>
    <bs-tabs v-model="tab" class="tabs">
      <bs-tab name="general" label="General" />
      <bs-tab name="grupos" label="Grupos" />
      <bs-tab name="suscriptores" label="Suscriptores" />
      <bs-tab name="notifica" label="Notifica" />
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
            <div class="value" v-text="data.nombre" />
          </div>
          <div class="label-value">
            <label>Alias</label>
            <div class="value" v-text="data.apodo || '-'" />
          </div>
          <div class="label-value">
            <label>Etiquetas</label>
            <div class="value" v-text="data.label || '-'" />
          </div>
          <div class="label-value">
            <label>Descripción</label>
            <div v-text="data.descripcion || '-'" />
          </div>
        </div>
      </bs-tab-pane>
      <bs-tab-pane name="grupos">
        <div class="mt-2 hstack gap-2 justify-content-center">
          <bs-btn color="secondary" :to="to.children.new" flat label="Nuevo" icon="plus-lg" />
          <bs-btn color="secondary" :to="to.children.edit" flat label="Editar" icon="pencil"
            :disable="!active.children" />
          <bs-btn color="secondary" :to="to.children.del" flat label="Eliminar" icon="trash"
            :disable="!active.children" />
        </div>
        <div class="px-3 py-2">
          <div v-if="!data.children.length" class="mt-2">
            No hay grupos aquí.
          </div>
          <ul v-else class="ul">
            <li v-for="{ id, nombre } in data.children" :key="id" @click="active.children = id"
              :class="{ active: active.children === id }" class="li li-win">
              <bs-icon name="subtract" style="color:var(--bs-yellow)" />
              <span v-text="nombre" class="tree-span" />
              <span class="mx-auto" />
            </li>
          </ul>
        </div>
      </bs-tab-pane>
      <bs-tab-pane name="suscriptores">
        <div class="mt-2 hstack gap-2 justify-content-center">
          <bs-btn color="secondary" :to="to.suscriptores.new" flat label="Nuevo" icon="plus-lg" />
          <bs-btn color="secondary" :to="to.suscriptores.edit" flat label="Editar" icon="pencil"
            :disable="!active.suscriptores" />
          <bs-btn color="secondary" :to="to.suscriptores.del" flat label="Eliminar" icon="trash"
            :disable="!active.suscriptores" />
        </div>
        <div class="px-3 py-2">
          <div v-if="!data.suscriptores.length" class="mt-2">
            No hay suscriptores aquí.
          </div>
          <ul v-else class="ul">
            <li v-for="{ id, nombre, cargo, telefono, correo } in data.suscriptores" :key="id"
              @click="active.suscriptores = id" :class="{ active: active.suscriptores === id }" class="li li-win"
              style="gap:10px">
              <bs-icon name="person-fill" style="color:var(--bs-gray-600)" />
              <span v-text="nombre" />
              <span v-text="telefono" style="color:var(--bs-pink)" />
              <span v-if="correo" v-text="`<${correo}>`" class="text-secondary" />
              <span class="mx-auto" />
            </li>
          </ul>
        </div>
      </bs-tab-pane>
      <bs-tab-pane name="notifica">
        <div class="mt-2 hstack gap-2 justify-content-center">
          <bs-btn color="secondary" flat :to="to.notifica.sel" label="Seleccionar" icon="check2-square" />
        </div>
        <div class="px-3 py-2">
          <div v-if="!data.notifica.length" class="mt-2">
            No hay grupos aquí.
          </div>
          <ul v-else class="ul">
            <li v-for="{ id, nombre } in data.notifica" :key="id" @click="active.notifica = id"
              :class="{ active: active.notifica === id }" class="li li-win">
              <bs-icon name="subtract" style="color:var(--bs-yellow)" />
              <span v-text="nombre" class="tree-span" />
              <span class="mx-auto" />
            </li>
          </ul>
        </div>
      </bs-tab-pane>
    </bs-tab-content>
  </div>
  <router-view />
</template>

<style scoped>
.tabs :deep(.nav-link) {
  font-size: .875em !important;
  text-transform: uppercase !important;
}
</style>

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

.ul {
  margin: 0;
  padding: 0;
}

.li {
  list-style-type: none;
}

.li-win {
  --border-color: transparent;
  border: solid 1px var(--border-color);
  --bg-color: transparent;
  background-color: var(--bg-color);
}

.li-win:hover {
  --bg-color: rgba(var(--bs-info-rgb), .1);
}

.li-win.active {
  --bg-color: rgba(var(--bs-info-rgb), .2);
}

.li-win.active:hover {
  --border-color: rgba(var(--bs-info-rgb), .3);
}

.li {
  height: 32px;
  padding: 1px 6px;
  display: flex;
  gap: 6px;
  cursor: pointer;
  text-decoration: none;
}
</style>
