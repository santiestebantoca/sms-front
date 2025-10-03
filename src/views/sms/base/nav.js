import { ref } from 'vue'

export default function useNavOptions() {
  const options = ref([
    {
      to: { name: 'sms-componer' },
      icon: 'envelope-plus',
      label: 'Componer',
      name: 'componer'
    },
    {
      to: { name: 'sms-coleccion' },
      icon: 'collection',
      label: 'Colección',
      name: 'coleccion',
      count: null
    }
  ])
  return { options }
}
