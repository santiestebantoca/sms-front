import axios from './axios'
// import usePagination from '@/use/usePagination'
import { ref, watch, nextTick, /*reactive*/ } from 'vue'
// import { groupBy } from '@tidyjs/tidy'
import { defineStore } from 'pinia'

const useNavStore = defineStore('coleccion-nav', () => {
  const data = ref(0)
  const get = () =>
    axios
      .get('/coleccion/nav')
      .then(res => data.value = res.data)
      .catch(() => { })
  return { data, get }
})

const useNotificados = defineStore('coleccion-sms-notificados', () => {
  // Pattern 2: query is passed to get function
  // const suscriptores = useSuscriptores()
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })
  const data = ref([])
  const setData = _data => {
    data.value = _data.data.map(d => ({
      suscriptor: d[0],
      grupo: d[1]
    }))
  }
  const get = params => {
    status.value.loading = true
    return axios
      .get('/coleccion/notificados', { params })
      .then(res => {
        setData(res.data)
        status.value.loaded = true
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  }
  return { data, get, status }
})

const useSmsStore = defineStore('coleccion-sms', () => {
  const notificados = useNotificados()
  const put = ({ id, data }) =>
    axios
      .put(`/coleccion/mensajes/${id}`, data)
      .catch(() => { })
  return { put, notificados }
})

export default defineStore('coleccion', () => {
  // Server side pagination & filtering // ordering not implemented!
  const sms = useSmsStore()
  const nav = useNavStore()
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })
  const data = ref([])
  const query = ref({})
  // const page = reactive(usePagination())
  const setData = _data => {
    data.value = _data.data.map(d => ({
      id: d[0],
      de: d[1],
      en: d[2],
      texto: d[3],
      continua: d[4] === 'T',
      previo: d[5],
      subgrupo: d[6] || d[0]
    }))
    // page.total = _data.total
  }
  const get = () => {
    // const params = { limit: page.range, ...query.value }
    const params = { ...query.value }
    status.value.loading = true
    return axios
      .get(`/coleccion/mensajes`, { params })
      .then(res => {
        setData(res.data)
        status.value.loaded = true
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  }
  watch(query, () => {
    if (status.value.resetting) return
    // page.first()
    get()
  })
  const $reset = () => {
    status.value.resetting = true
    query.value = {}
    data.value = []
    page.first()
    nextTick(() => status.value.resetting = false) // otherwise, resetting is false in query watcher
  }
  // return { data, page, get, status, query, $reset, sms }
  return { data, get, status, query, $reset, sms, nav }
})
