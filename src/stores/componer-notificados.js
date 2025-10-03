import axios from './axios'
import { ref, computed, nextTick } from 'vue'
import { defineStore } from 'pinia'

const useSuscriptores = defineStore('componer-notificados-suscriptores', () => {
  // Contains the final valid `suscriptores` id list...
  const notificados = useNotificados()
  const ids = computed(() =>
    notificados.data
      .filter(d => d.checked)
      .reduce((a, d) => [...a, ...d.suscriptores.filter(d => d.checked)], [])
      .map(d => d.id)
  )
  const counter = computed(() => ids.value.length)
  return { ids, counter }
})

const useNotificados = defineStore('componer-notificados', () => {
  // Pattern 2: query is passed to get function
  const suscriptores = useSuscriptores()
  const status = ref({
    loaded: false,
    loading: false,
    resetting: false,
  })
  const data = ref([])
  const setData = _data => {
    data.value = _data
    data.value.forEach(d => {
      d.checked = true
      d.suscriptores.forEach(d => d.checked = true)
    })
  }
  const get = params => {
    status.value.loading = true
    return axios
      .get('/componer/notificados', { params })
      .then(res => {
        setData(res.data)
        status.value.loaded = true
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  }
  const $reset = () => {
    status.value.resetting = true
    data.value = []
    nextTick(() => status.value.resetting = false) // otherwise, resetting is false in query watcher
  }
  const counter = computed(() => data.value.reduce((a, c) => a + (c.checked ? 1 : 0), 0))
  return { data, counter, get, status, $reset, suscriptores }
})

export default useNotificados
