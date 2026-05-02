import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use((r) => r, (error) => {
  const status = error?.response?.status
  const message = error?.response?.data?.message || 'Request failed'
  if (status === 401) { useAuthStore.getState().logout(); window.location.href = '/login' }
  if (status === 403) toast.error('Access Denied')
  if ([500, 502, 503].includes(status)) toast.error(message)
  return Promise.reject(error)
})

export default api
