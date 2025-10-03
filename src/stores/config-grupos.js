import axios from './axios'
import { ref, watch, nextTick } from 'vue'
import { defineStore } from 'pinia'

const useGrupoNotificaStore = defineStore('config-grupos-grupo-notifica', () => {
  const post = data =>
    axios
      .post('/config_grupo/notifica', data)
      .catch(() => { })
  return { post }
})

const useGrupoSuscriptoresStore = defineStore('config-grupos-grupo-suscriptores', () => {
  const post = data =>
    axios
      .post('/config_grupo/suscriptores', data)
      .catch(() => { })
  const del = id =>
    axios
      .delete(`/config_grupo/suscriptores/${id}`)
      .catch(() => { })
  const put = ({ id, data }) =>
    axios
      .put(`/config_grupo/suscriptores/${id}`, data)
      .catch(() => { })
  return { post, del, put }
})

const useGrupoBackgroundStore = defineStore('config-grupos-grupo-background', () => {
  // this store allows us to work with one `grupo` while showing another one.
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
      .get(`/config_grupo/grupos/${id}`)
      .then(res => {
        setData(res.data)
        status.value.loaded = true
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  const put = ({ id, data }) =>
    axios
      .put(`/config_grupo/grupos/${id}`, data)
      .catch(() => { })
  const del = id =>
    axios
      .delete(`/config_grupo/grupos/${id}`)
      .catch(() => { })
  return { data, get, put, del, status }
})

const useGrupoStore = defineStore('config-grupos-grupo', () => {
  const background = useGrupoBackgroundStore()
  const suscriptores = useGrupoSuscriptoresStore()
  const notifica = useGrupoNotificaStore()
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
      .get(`/config_grupo/grupos/${id}`)
      .then(res => {
        setData(res.data)
        status.value.loaded = true
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  const put = ({ id, data }) =>
    axios
      .put(`/config_grupo/grupos/${id}`, data)
      .catch(() => { })
  const del = id =>
    axios
      .delete(`/config_grupo/grupos/${id}`)
      .catch(() => { })
  return { data, get, put, del, status, suscriptores, background, notifica }
})

export default defineStore('config-grupos', () => {
  const grupo = useGrupoStore()
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
      .get('/config_grupo/grupos', { params })
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
      .post('/config_grupo/grupos', data)
      .catch(() => { })
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
  const dataOpen = active => {
    active.forEach(id => {

    })
    return data.value
  }
  return { data, get, find, post, status, query, $reset, grupo }
})
