// stores/coleccion/sms.js
import { deepPatch } from '@/utils/deepPatch'
import { defineStore } from 'pinia'
import { useGruposStore as useItemsStore } from '.'
import { gruposApi as api } from '@/api/grupos'
import { ref, nextTick } from 'vue'

export const useGrupoStore = defineStore('grupo', () => {
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })

  const data = ref({})

  const get = async (id, params = {}) => {
    status.value.loading = true
    const result = await api.getById(id, params)
    deepPatch(data.value, result) // actualiza solo lo que cambió
    status.value.loaded = true
    status.value.loading = false
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

  return { data, status, get, put, reset }
})