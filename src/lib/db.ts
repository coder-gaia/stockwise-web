import { openDB, type DBSchema } from 'idb'

interface StockwiseDB extends DBSchema {
  pending_movements: {
    key: string
    value: {
      idempotencyKey: string
      productId: string
      type: 'IN' | 'OUT'
      quantity: number
      note?: string
      createdAt: number
    }
    indexes: { 'by-created': number }
  }
}

const dbPromise = openDB<StockwiseDB>('stockwise', 1, {
  upgrade(db) {
    const store = db.createObjectStore('pending_movements', {
      keyPath: 'idempotencyKey',
    })
    store.createIndex('by-created', 'createdAt')
  },
})

export async function addToQueue(
  movement: Omit<StockwiseDB['pending_movements']['value'], 'createdAt'>
) {
  const db = await dbPromise
  await db.add('pending_movements', { ...movement, createdAt: Date.now() })
}

export async function getPendingMovements() {
  const db = await dbPromise
  return db.getAllFromIndex('pending_movements', 'by-created')
}

export async function removeFromQueue(idempotencyKey: string) {
  const db = await dbPromise
  await db.delete('pending_movements', idempotencyKey)
}

export async function getPendingCount() {
  const db = await dbPromise
  return db.count('pending_movements')
}