import { api } from '../lib/axios'

export async function getProducts() {
  const { data } = await api.get('/products')
  return data
}

export async function createProduct(payload: {
  name: string
  minStock: number
  expiresAt?: string
}) {
  const { data } = await api.post('/products', payload)
  return data
}

export async function updateProduct(id: string, payload: {
  name?: string
  minStock?: number
  expiresAt?: string | null
}) {
  const { data } = await api.put(`/products/${id}`, payload)
  return data
}

export async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`)
}

export async function registerMovement(productId: string, payload: {
  type: 'IN' | 'OUT'
  quantity: number
  note?: string
  idempotencyKey: string
}) {
  const { data } = await api.post(`/products/${productId}/movements`, payload)
  return data
}

export async function getMovementHistory(productId: string, page = 1, limit = 20) {
  const { data } = await api.get(`/products/${productId}/movements`, {
    params: { page, limit },
  })
  return data
}

export async function getLowStockAlerts() {
  const { data } = await api.get('/products/alerts')
  return data
}