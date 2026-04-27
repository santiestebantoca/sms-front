// stores/coleccion/sms.js
import { defineStore } from 'pinia'
import { notificadosApi as api } from '@/api/grupos-notificados'
import { ref, computed, nextTick } from 'vue'

export const useGruposNotificadosStore = defineStore('grupos-notificados', () => {
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })
  const data = ref([])
  const total = computed(() => data.value.length)

  const get = async (params) => {
    status.value.loading = true
    const result = await api.getAll(params)
    data.value = result
    status.value.loaded = true
    status.value.loading = false
  }

  const post = async (_data) => {
    status.value.loading = true
    const result = await api.create(_data)
    status.value.loading = false
    return result
  }

  const reset = () => {
    status.value.loaded = status.value.resetting = true
    data.value = []
    nextTick(() => status.value.resetting = false)
  }

  return {
    data,
    get,
    status,
    total,
    post,
    reset
  }
})