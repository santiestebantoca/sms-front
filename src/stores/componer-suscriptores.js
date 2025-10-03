import axios from './axios'
import { ref, watch, nextTick } from 'vue'
import { defineStore } from 'pinia'


export default defineStore('suscriptores', () => {
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })
  const data = ref([])
  const query = ref({})
  const setData = _data => {
    data.value = _data
  }
  const get = () => {
    const params = { ...query.value }
    status.value.loading = true
    return axios
      .get('/suscriptor/suscriptores', { params })
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
  return { data, get, status, query, $reset }
})
