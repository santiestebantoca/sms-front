import axios from './axios'
import { ref, watch, nextTick } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('coleccion-plantillas', () => {
  const data = ref([])
  const query = ref({})
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })
  const setData = _data => {
    data.value = _data.data.map(d => ({ texto: d[0] }))
  }
  const get = () => {
    const params = { limit: '0,10', ...query.value }
    status.value.loading = true
    return axios
      .get(`/coleccion/plantillas`, { params })
      .then(res => {
        setData(res.data)
        status.value.loaded = true
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  }
  watch(query, () => {
    if (status.value.resetting) return
    get()
  })
  const $reset = () => {
    status.value.resetting = true
    query.value = {}
    data.value = []
    nextTick(() => status.value.resetting = false) // otherwise, resetting is false in query watcher
  }
  return { data, query, status, $reset }
})
