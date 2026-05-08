import { api } from '../lib/axios'
import { setAccessToken } from '../store/auth.store'

export async function register(storeName: string, email: string, password: string) {
  const { data } = await api.post('/auth/register', { storeName, email, password })
  setAccessToken(data.accessToken)
}

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password })
  setAccessToken(data.accessToken)
}

export async function logout() {
  setAccessToken(null)
}

export async function restoreSession() {
  const { data } = await api.post('/auth/refresh')
  setAccessToken(data.accessToken)
}