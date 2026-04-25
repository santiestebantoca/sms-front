// stores/coleccion/sms.js
import { defineStore } from 'pinia'
import { enviosApi } from '@/api/envios'
import { ref } from 'vue'

export const useEnviosStore = defineStore('envios', () => {
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })
  const data = ref([])

  const get = async (params) => {
    status.value.loading = true
    const result = await enviosApi.getAll(params)
    data.value = result
    status.value.loaded = true
    status.value.loading = false
  }

  return { data, status, get }
})