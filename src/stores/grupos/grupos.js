// stores/coleccion/sms.js
import { deepPatch } from '@/utils/deepPatch'
import { defineStore } from 'pinia'
import { useGrupoStore as useItemStore } from '.'
import { gruposApi as api } from '@/api/grupos'
import { ref, nextTick } from 'vue'

export const useGruposStore = defineStore('grupos', () => {
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })
  const data = ref([])

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
    // data.value.push(result)
    status.value.loading = false
    return result
  }

  const del = async (id) => {
    status.value.loading = true
    const result = await api.delete(id)
    // data.value = data.value.filter(item => item.id !== id)
    data.value = _filter(data.value, id)
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
    // const index = data.value.findIndex(i => i.id === item.id)
    // if (index !== -1) deepPatch(data.value[index], item)
    // else data.value.push(item) // Opcional
    deepPatch(_find(data.value, item.id), item)
  }

  const _filter = (tree, id) => {
    return tree
      .filter(item => item.id !== id)
      .map(item => ({
        ...item,
        children: item.children ? _filter(item.children, id) : []
      }))
  }

  const _find = (tree, id) => {
    for (const node of tree) {
      if (node.id === id) return node
      if (node.children) {
        const found = _find(node.children, id)
        if (found) return found
      }
    }
    return null
  }

  return { data, status, get, post, del, reset, replace }
})