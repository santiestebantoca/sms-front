// stores/coleccion/sms.js
import { flatToTree } from '@/utils'
import { defineStore } from 'pinia'
import { useGrupoStore as useItemStore } from '.'
import { gruposApi as api } from '@/api/grupos'
import { ref, nextTick, watchEffect } from 'vue'

export const useGruposStore = defineStore('grupos', () => {
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })
  const data = ref([])
  const tree = ref([])

  watchEffect(() => tree.value = flatToTree(data.value, { parentKey: 'pertenece' }))

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
    data.value.push(result)
    status.value.loading = false
    return result
  }

  const del = async (id) => {
    status.value.loading = true
    const result = await api.delete(id)
    await get() // filter funciona en estructuras no jerárquicas
    useItemStore().reset(id) // Opcional
    status.value.loading = false
    return result
  }

  const reset = () => {
    status.value.resetting = true
    data.value = []
    nextTick(() => status.value.resetting = false)
  }

  const replace = (item) => {
    const index = data.value.findIndex(i => i.id === item.id)
    if (index !== -1) data.value[index] = item // deepPatch en otras estructuras
  }

  return { data, tree, status, get, post, del, reset, replace }
})