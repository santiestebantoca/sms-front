import { useQuery, defineQuery } from '@pinia/colada'
import { mensajesApi as api } from '@/api/mensajes'
import { queryKeys } from '@/lib/query-keys'
import { useDateFormat } from '@vueuse/core'
import { tidy, groupBy } from '@tidyjs/tidy'
import { ref, computed } from 'vue'

export const useMensajesQuery = () => {
  const _query = ref<Record<string, any>>({})
  const query = computed({
    get: () => _query.value,
    set: (val) => {
      _query.value = val !== null && typeof val === 'object' && !Array.isArray(val)
        ? val
        : {}
    }
  })
  const { data, isLoading, refresh } = useQuery({
    key: () => (queryKeys.mensajes.lista(query.value) as any),
    query: () => api.getAll(query.value),
    enabled: computed(() => Object.keys(query.value).length > 0),
  })

  const conversaciones = computed(() => {
    const items = (data.value || []) as any[]
    const out: Record<string, any[]> = {}
    for (const it of items) {
      const key = it?.subgrupo ?? ''
      if (!out[key]) out[key] = []
      out[key].push(it)
    }
    return out
  })

  return {
    mensajes: computed(() => data.value || []),
    conversaciones,
    isLoading,
    refresh,
    query
  }
}

export const useMensajesFilter = () => {
  const desde = ref(null)
  const hasta = ref(null)

  const search = ref(null)

  const _continua = ref(null)
  const continua = computed({
    get: () => _continua.value,
    set: (val) => {
      _continua.value = val
      if (val) {
        desde.value = null
        hasta.value = null
      } else {
        const ahora = new Date()
        const empieza = new Date()
        const ayer = empieza.getHours() < 8
        empieza.setDate(empieza.getDate() - (ayer ? 1 : 0))
        empieza.setHours(8, 0, 0, 0)
        ahora.setHours(23, 59, 59, 0)
        desde.value = useDateFormat(empieza, 'YYYY-MM-DD HH:mm:ss').value
        hasta.value = useDateFormat(ahora, 'YYYY-MM-DD HH:mm:ss').value
      }
    }
  })

  const filter = computed(() => ({
    ...continua.value ? { continua: continua.value } : {},
    ...desde.value ? { desde: desde.value } : {},
    ...hasta.value ? { hasta: hasta.value } : {},
    ...search.value ? { search: search.value } : {}
  }))

  return {
    continua,
    search,
    filter
  }
}