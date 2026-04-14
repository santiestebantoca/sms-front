import { useDateFormat } from "@vueuse/core"
import { ref, watch } from "vue"

const getDate = val =>
  val instanceof Date
    ? val
    : val ? new Date(val) : null

const daysAgo = val => {
  const date = getDate(val)
  if (date) {
    const timeDelta = new Date().getTime() - date.getTime()
    return Math.round(timeDelta / (1000 * 3600 * 24))
  }
}

let now = new Date()
const day = ref(now.getDate())
const hour = ref(now.getHours())
// const min = ref(now.getMinutes())
setInterval(() => {
  now = new Date()
  day.value = now.getDate()
  hour.value = now.getHours()
  // min.value = now.getMinutes()
}, 1000)

export function shortTime(strDate) {
  const res = ref(null)
  const date = getDate(strDate)
  if (date) {
    watch(day, () => {
      const ago = daysAgo(date)
      if (ago === 0) res.value = 'Hoy ' + useDateFormat(date, 'HH:mm').value
      else if (ago === 1) res.value = 'Ayer ' + useDateFormat(date, 'HH:mm').value
      else res.value = useDateFormat(date, 'D MMM HH:mm').value
    }, { immediate: true })
  }
  return res
}

export function toSQLString(date) {
  if (date)
    return useDateFormat(date, 'YYYY-MM-DD HH:mm:ss').value
}
