// stores/coleccion/sms.js
import { defineStore } from 'pinia'
import { smssApi } from '@/api/smss'

export const useSmsStore = defineStore('sms', () => {

  const get = async (id, params = {}) => {
    const result = await smssApi.getById(id, params)
    return result
  }

  const put = async (id, _data) => {
    const result = await smssApi.update(id, _data)
    return result
  }

  const post = (data) => smssApi.send(data)

  return { put, post, get }
})