import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSmssFiltrosStore = defineStore('smss-filtros', () => {
  // const page = ref(1)
  // const search = ref('')
  // const category = ref('all')
  const continua = ref(null)
  const desde = ref(null)
  const hasta = ref(null)

  // Colada aceptará este objeto como parte de la query key
  const queryParams = computed(() => ({
    // page: page.value,
    // search: search.value,
    // category: category.value,
    ...continua.value ? { continua: continua.value } : {},
    ...desde.value ? { desde: desde.value } : {},
    ...hasta.value ? { hasta: hasta.value } : {},
  }))

  return {
    // page,
    // search,
    // category,
    continua,
    desde,
    hasta,
    queryParams
  }
})