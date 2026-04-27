// stores/coleccion/sms.js
import { defineStore } from 'pinia'
import { useSuscriptorStore as useItemStore } from '.'
import { suscriptoresApi as api } from '@/api/suscriptores'
import { ref, nextTick } from 'vue'

export const useSuscriptoresStore = defineStore('suscriptores', () => {
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })
  const data = ref([])

  const get = async (params) => {
    // status.value.loading = true
    // const result = await api.getAll(params)
    // data.value = result
    // status.value.loaded = true
    // status.value.loading = false
  }

  const post = async (_data) => {
    status.value.loading = true
    const result = await api.create(_data)
    status.value.loading = false
    return result
  }

  const del = async (id) => {
    status.value.loading = true
    const result = await api.delete(id)
    data.value = data.value.filter(item => item.id !== id)
    useItemStore().reset(id) // Opcional
    status.value.loading = false
    return result
  }

  const reset = () => {
    // status.value.resetting = true
    // data.value = []
    // nextTick(() => status.value.resetting = false)
  }

  const replace = (item) => {
    // const index = data.value.findIndex(i => i.id === item.id)
    // if (index !== -1) deepPatch(data.value[index], item)
    // else data.value.push(item) // Opcional
  }

  return { data, status, get, post, del, reset, replace }
})