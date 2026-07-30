<script setup>
const props = defineProps({ data: Object })
</script>

<template>
  <div style="height: 39px;"></div>
  <div class="px-3 py-2">
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
</template>