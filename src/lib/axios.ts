import axios from 'axios'
import { getAccessToken, setAccessToken } from '../store/auth.store'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL ?? 'http://localhost:3333'}/auth/refresh`,
        {},
        { withCredentials: true }
      )

      setAccessToken(data.accessToken)
      original.headers.Authorization = `Bearer ${data.accessToken}`
      return api(original)
    }

    return Promise.reject(error)
  }
)