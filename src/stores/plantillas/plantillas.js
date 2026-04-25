// stores/coleccion/sms.js
import { defineStore } from 'pinia'
import { plantillasApi } from '@/api/plantillas'
import { ref, nextTick } from 'vue'

export const usePlantillasStore = defineStore('plantillas', () => {
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })
  const data = ref([])

  const get = async (params) => {
    status.value.loading = true
    const result = await plantillasApi.getAll(params)
    data.value = result
    status.value.loaded = true
    status.value.loading = false
  }

  const post = async (_data) => {
    status.value.loading = true
    const result = await plantillasApi.create(_data)
    data.value = result
    status.value.loading = false
  }

  const reset = () => {
    status.value.resetting = true
    data.value = []
    nextTick(() => status.value.resetting = false)
  }

  return { data, get, post, status, reset }
})