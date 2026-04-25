// stores/coleccion/nav.js
import { defineStore } from 'pinia'
import { smssApi } from '@/api/smss'
import { deepPatch } from '@/utils/deepPatch'
import { ref, onUnmounted } from 'vue'

export const useSmssMetaStore = defineStore('smss-meta', () => {
  const data = ref({
    pendientes: 0
  })

  const defaultParams = { include: 'pendientes' }

  const get = async (params = defaultParams) => {
    const result = await smssApi.meta(params)
    deepPatch(data.value, result)
  }

  // const interval = setInterval(get, 30000)
  get()

  // onUnmounted(() => clearInterval(interval))

  return { data, get }
})