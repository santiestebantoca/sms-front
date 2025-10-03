import axios from './axios'
// import usePagination from '../use/usePagination'
import { ref, watch, nextTick } from 'vue'
import { defineStore } from 'pinia'

const usePlantillaStore = defineStore('config-plantillas-plantilla', () => {
  const status = ref({
    loaded: false,
    loading: false
  })
  const data = ref({})
  const setData = _data => {
    data.value = _data
  }
  const get = id =>
    axios
      .get(`/config_plantilla/plantillas/${id}`)
      .then(res => {
        setData(res.data)
        status.value.loaded = true
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  const put = ({ id, data }) => axios.put(`/config_plantilla/plantillas/${id}`, data).catch(() => { })
  const del = id => axios.delete(`/config_plantilla/plantillas/${id}`).catch(() => { })
  return { data, get, put, del, status }
})

export default defineStore('config-plantillas', () => {
  // Server side pagination & filtering // ordering not implemented!
  const plantilla = usePlantillaStore()
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })
  const data = ref([])
  const query = ref({})
  const setData = _data => {
    data.value = _data.data.map(d => ({
      id: d[0],
      texto: d[1],
      modified_by: d[2],
    }))
  }
  const get = () => {
    const params = { ...query.value }
    status.value.loading = true
    return axios
      .get(`/config_plantilla/plantillas`, { params })
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
  const post = data =>
    axios
      .post('/config_plantilla/plantillas', data)
      .catch(() => { })
  return { data, get, post, status, query, $reset, plantilla }
})
