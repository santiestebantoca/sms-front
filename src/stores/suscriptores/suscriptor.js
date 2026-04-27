// stores/coleccion/sms.js
import { deepPatch } from '@/utils/deepPatch'
import { defineStore } from 'pinia'
import { useSuscriptoresStore as useItemsStore } from '.'
import { suscriptoresApi as api } from '@/api/suscriptores'
import { ref, nextTick } from 'vue'

export const useSuscriptorStore = defineStore('suscriptor', () => {
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })

  const data = ref({})

  const get = async (id, params = {}) => {
    // try { // puede no existir el recurso
    //   status.value.loading = true
    //   const result = await api.getById(id, params)
    //   data.value = result
    // } finally {
    //   status.value.loaded = true
    //   status.value.loading = false
    // }
  }

  const refresh = async (id, params = {}) => {
    // const result = await api.getById(id, params)
    // if (data.value.id === result.id)
    //   deepPatch(data.value, result) // actualiza solo lo que cambió
  }

  const put = async (id, _data) => {
    status.value.loading = true
    const result = await api.update(id, _data)
    deepPatch(data.value, result)
    useItemsStore().replace(result) // Opcional
    status.value.loading = false
    return result
  }

  const reset = (id) => {
    if (id && id !== data.value?.id) return
    status.value.resetting = true
    status.value.loaded = false
    data.value = {}
    nextTick(() => status.value.resetting = false)
  }

  return { data, status, get, refresh, put, reset }
})