import axios from './axios'
// import usePagination from '../use/usePagination'
import { ref, computed, watch, nextTick, reactive } from 'vue'
import { defineStore } from 'pinia'

const useMembership = defineStore('config-users-user-membership', () => {
  const post = params => axios.post('/config_user/membership', params).catch(() => { })
  return { post }
})

const useUserStore = defineStore('config-users-user', () => {
  const membership = useMembership()
  const status = ref({
    loaded: false,
    loading: false
  })
  const data = ref({})
  const setData = _data => {
    data.value = _data
      ? {
        ..._data,
        blocked: _data.registration_key === 'blocked'
      }
      : {}
  }
  const get = id =>
    axios
      .get(`/config_user/users/${id}`)
      .then(res => {
        setData(res.data)
        status.value.loaded = true
      })
      .catch(() => { })
      .finally(() => status.value.loading = false)
  const put = ({ id, data }) => axios.put(`/config_user/users/${id}`, data).catch(() => { })
  const del = id => axios.delete(`/config_user/users/${id}`).catch(() => { })
  return { data, get, put, del, status, membership }
})


// Static
const useAuthgroupStore = defineStore('config-users-authgroup', () => {
  const status = ref({
    loaded: false,
    loading: false,
  })
  const data = ref([])
  const get = () =>
    status.value.loaded
      ? Promise.resolve()
      : (status.value.loading = true) && axios
        .get('/config_user/authgroup')
        .then(res => {
          data.value = res.data
          status.value.loaded = true
        })
        .catch(() => { })
        .finally(() => status.value.loading = false)
  return { get, data, status }
})

export default defineStore('config-users', () => {
  // Server side pagination & filtering // ordering not implemented!
  const user = useUserStore()
  const authgroup = useAuthgroupStore()
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
      nombre: `${d[1]} ${d[2]}`,
      username: d[3],
      blocked: d[3] === 'blocked'
    }))
  }
  const get = () => {
    const params = { ...query.value }
    status.value.loading = true
    return axios
      .get(`/config_user/users`, { params })
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
      .post('/config_user/users', data)
      .catch(() => { })
  return { data, get, post, status, query, $reset, user, authgroup }
})
