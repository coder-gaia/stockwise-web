export type Role = 'OWNER' | 'STAFF'
export type MovementType = 'IN' | 'OUT'

export interface Product {
  id: string
  name: string
  currentStock: number
  minStock: number
  expiresAt?: string | null
  createdAt: string
}

export interface Movement {
  id: string
  productId: string
  type: MovementType
  quantity: number
  note?: string | null
  createdAt: string
  user: { email: string; role: Role }
}

export interface MovementHistoryResponse {
  movements: Movement[]
  total: number
  page: number
  limit: number
}