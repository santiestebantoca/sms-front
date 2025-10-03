import axios from './axios'
import { ref, watch, nextTick } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('componer-grupos', () => {
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
    // if (!status.value.loaded) {
    const params = { ...query.value }
    status.value.loading = true
    return axios
      .get('/componer/grupos', { params })
      .then(res => {
        setData(res.data)
        status.value.loaded = true
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
    // } else return Promise.resolve()
  }
  watch(query, () => {
    if (status.value.resetting) return
    get()
  })
  const find = id => {
    let res
    const fid = d => {
      if (d.id === id) res = d
      if (res) return
      if (d.children) d.children.forEach(fid)
    }
    data.value.forEach(fid)
    return res
  }
  const $reset = () => {
    status.value.resetting = true
    query.value = {}
    data.value = []
    nextTick(() => status.value.resetting = false) // otherwise, resetting is false in query watcher
  }
  return { data, get, find, status, query, $reset }
})
