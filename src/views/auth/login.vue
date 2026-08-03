<script setup>
const props = defineProps({ next: Function })

import { useLogin } from '@/stores/auth'
import { ref, computed, watch, watchEffect } from 'vue'
import { useToast } from 'bootstrap-vue-next'
import { transition } from '@vueuse/core'

const { create: showToast } = useToast()
const errors = ref({})
const type = ref('password')
const formDefault = {
  username: null,
  password: null,
}
const form = ref({ ...formDefault })
const alert = ref(0)
const { mutateAsync: login, state: loginState, asyncStatus } = useLogin()
const loading = computed(() => asyncStatus.value === 'loading')

watchEffect(() => loginState.value.error ? alert.value = 5000 : 0)

const validate = () => {
  errors.value = {}
  if (!form.value.username) errors.value.username = 'Valor requerido'
  if (!form.value.password) errors.value.password = 'Valor requerido'
  return !Object.keys(errors.value).length
}
const submit = () => {
  if (!validate()) return
  login(form.value).then(() => props.next())
}
const toggleType = () => type.value = type.value === 'password' ? 'text' : 'password'
</script>

<template>
  <div class="grid">
    <div class="content">
      <h5 class="text-primary-emphasis fw-semibold">Inicio de sesión</h5>
      <div class="text-muted" style="line-height: 21px; padding: 12px 2px">
        Usuario del dominio "etecsa.cu"
      </div>
      <BToast v-model="alert" variant="warning" class="mb-3">
        Credenciales no válidas
      </BToast>
      <form @submit.prevent>
        <div class="position-relative mb-3">
          <UIcon name="bi-person" class="p-icon" />
          <input type="text" class="form-control" name="username" placeholder="Nombre de usuario"
            v-model="form.username" @input="errors.username = null" />
          <div class="invalid-feedback d-block" v-text="errors.username" />
        </div>
        <div class="position-relative mb-3">
          <UIcon name="bi-lock" class="p-icon" />
          <input :type="type" class="form-control" name="password" placeholder="Contraseña" v-model="form.password"
            @input="errors.password = null">
          <div class="invalid-feedback d-block" v-text="errors.password" />
          <div class="position-absolute top-0 end-0" @click.stop="toggleType">
            <UIcon :name="type === 'password' ? 'bi-eye' : 'bi-eye-slash'" class="eye-icon" />
          </div>
        </div>
        <div class="mt-4">
          <BButton @click="submit" variant="primary" :disabled="loading" class="w-100 lh-lg">
            {{ loading ? 'Autenticando' : 'Iniciar sesión' }}
          </BButton>
        </div>
      </form>
      <div class="alert bg-light bg-gradient small mt-4 d-flex gap-3 border">
        <span>
          <UIcon name="bi-exclamation-triangle-fill" font-size="1.2em" />
        </span>
        El registro de usuario siempre es realizado por un administrador
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  max-width: 320px;
  margin: 0 auto;
  min-height: inherit;
  display: grid;
  align-items: center;
  grid-template-rows: 1fr 72px;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  max-height: 400px;
}

[name] {
  padding-left: 38px;
}

.p-icon {
  position: absolute;
  top: 9px;
  left: 10px;
}

.eye-icon {
  margin: 10px;
}
</style>
