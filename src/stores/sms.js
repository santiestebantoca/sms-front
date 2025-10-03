import axios from './axios'
import { defineStore } from 'pinia'

export default defineStore('sms', () => {
  const post = data =>
    axios
      .post('/default/send', data)
      .catch(() => { })
  return { post }
})