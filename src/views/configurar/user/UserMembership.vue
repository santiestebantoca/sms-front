<script setup>
const props = defineProps({ back: Function })

import useHandleSubmit from '@/use/useHandleSubmit.js'
import useUsers from '@/stores/config-users'
import { ref, computed, watch, inject } from 'vue'

const loading = inject('app:loading')
const process = useHandleSubmit()
const model = ref(null)
const users = useUsers()
const data = computed(() => users.user.data)
const options = computed(() => users.authgroup.data)
users.authgroup.get()
const form = ref({
  user_id: null,
  group_id: []
})
watch(data, d => {
  if (users.user.status.loaded) {
    form.value.user_id = d.id
    form.value.group_id = d.membership.map(e => e.id)
    model.value = true
  }
}, { immediate: true })
//
const submit = async () => {
  loading.value++
  await users.user.membership.post(form.value)
    .then(res => process.POST(res.data,
      () => users.user.get(form.value.user_id).then(() => model.value = false),
      () => { }))
  loading.value--
}
</script>

<template>
  <Teleport to="body">
    <bs-dialog v-model="model" @hidden="back" scrollable>
      <bs-dialog-header label="Roles" />
      <bs-dialog-body>
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label class="form-label">Grupos</label>
            <div v-for="{ id, role, description } in options" :key="id" class="form-check" type="button">
              <input type="checkbox" class="form-check-input" :id="role" :value="id" v-model="form.group_id" />
              <label class="form-check-label" :for="role">
                <span class="text-capitalize" v-text="role" /><br />
                <span class="form-text" v-text="description" />
              </label>
            </div>
          </div><br>
          <bs-btn type="submit" color="primary" label="Aceptar" />
        </form>
      </bs-dialog-body>
    </bs-dialog>
  </Teleport>
</template>

<style scoped>
.form-label {
  color: var(--bs-teal);
  font-weight: 600;
  font-size: .875em;
}
</style>
