// stores/coleccion/sms.js
import { defineStore } from 'pinia'
import { notificadosApi } from '@/api/grupos-notificados'
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
    const result = await notificadosApi.getAll(params)
    data.value = result
    status.value.loaded = true
    status.value.loading = false
  }

  const reset = () => {
    status.value.resetting = true
    data.value = []
    nextTick(() => status.value.resetting = false)
  }

  // const post = (data) => { } //gruposApi.create(data)

  return {
    data,
    get,
    status,
    total,
    // post,
    reset
  }
})