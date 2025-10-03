import axios from './axios'
import { ref, watch, nextTick } from 'vue'
import { defineStore } from 'pinia'


const useSuscriptorStore = defineStore('config-suscriptores-suscriptor', () => {
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
      .get(`/config_suscriptor/suscriptores/${id}`)
      .then(res => {
        setData(res.data)
        status.value.loaded = true
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  const put = ({ id, data }) =>
    axios
      .put(`/config_suscriptor/suscriptores/${id}`, data)
      .catch(() => { })
  const del = id =>
    axios
      .delete(`/config_suscriptor/suscriptores/${id}`)
      .catch(() => { })
  return { data, get, put, del, status }
})

export default defineStore('config-suscriptores', () => {
  const suscriptor = useSuscriptorStore()
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
      nombre: d[1],
      telefono: d[2],
      activo: d[3] === 'T',
      correo: d[4],
    }))
  }
  const get = () => {
    const params = { ...query.value }
    status.value.loading = true
    return axios
      .get('/config_suscriptor/suscriptores', { params })
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
      .post('/config_suscriptor/suscriptores', data)
      .catch(() => { })
  return { data, get, post, status, query, $reset, suscriptor }
})
