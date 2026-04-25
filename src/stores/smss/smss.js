// stores/coleccion/principal.js
import { ref, watch, nextTick } from 'vue'
import { defineStore } from 'pinia'
import { smssApi } from '@/api/smss'
import { useSmssFiltrosStore } from './filtros'

export const useSmssStore = defineStore('smss', () => {
  const filtros = useSmssFiltrosStore()
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })
  const data = ref([])

  const get = async () => {
    status.value.loading = true
    const result = await smssApi.getAll(filtros.queryParams)
    data.value = result // Tendrá que llegar a esto (recomendado): { items: [...], total: 120, page: 1 }
    status.value.loaded = true
    status.value.loading = false
  }

  watch(() => filtros.queryParams, () => {
    if (status.value.resetting) return
    get()
  })

  const del = (id) => {
    data.value = data.value.filter(item => item.id !== id)
  }

  const reset = () => {
    status.value.resetting = true
    filtros.search = null
    data.value = []
    nextTick(() => status.value.resetting = false)
  }

  return { data, status, get, del, reset }
})