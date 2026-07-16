<script setup>
const model = defineModel()
const props = defineProps({
  placeholder: { type: String, default: 'Buscar...' },
  searchIcon: Boolean,
  resetIcon: { type: Boolean, default: true },
})

import { computed } from 'vue';

const rootStyle = computed(() => ({
  '--c-padding-left': props.searchIcon ? '2rem' : '0.75rem',
  '--c-padding-right': props.resetIcon ? '2rem' : '0.75rem',
}))
</script>

<template>
  <div class="search-group" :style="rootStyle">
    <input v-model="model" class="form-control" :placeholder="placeholder">
    <UIcon v-if="searchIcon" name="bi-search" />
    <BButton v-if="model" variant="flat-dark" class="btn-sm" @click="model = ''">
      <UIcon name="bi-x-lg" font-size="12px" />
    </BButton>
  </div>
</template>

<style scoped>
.form-control {
  padding-left: var(--c-padding-left);
  padding-left: var(--c-padding-left);

}

.search-group {
  position: relative;
  flex-grow: 1;
}

.search-group .btn {
  position: absolute;
  top: 50%;
  right: 4px;
  height: 30px;
  width: 30px;
  padding: 0 !important;
  transform: translateY(-50%);
}

.search-group>svg {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: var(--bs-gray-600);
  left: 10px;
  font-size: .9em;
}
</style>
