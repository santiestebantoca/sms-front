import axios from './axios'
import { ref, nextTick } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('componer-previo', () => {
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })
  const data = ref({})
  const setData = _data => {
    data.value = _data
  }
  const get = id =>
    axios
      .get(`/componer/previo/${id}`)
      .then(res => {
        setData(res.data)
        status.value.loaded = true
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  const $reset = () => {
    status.value.resetting = true
    data.value = {}
    nextTick(() => status.value.resetting = false) // otherwise, resetting is false in query watcher
  }
  return { data, get, status, $reset }
})
