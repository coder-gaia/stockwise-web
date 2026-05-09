import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'
import { getPendingMovements, getPendingCount, removeFromQueue } from '../lib/db'
import { registerMovement } from '../api/products.api'

export function useOfflineSync() {
  const queryClient = useQueryClient()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    getPendingCount().then(setPendingCount)
  }, [])

  useEffect(() => {
    async function drainQueue() {
      const pending = await getPendingMovements()
      if (pending.length === 0) return

      const toastId = toast.loading(`Sincronizando ${pending.length} operação(ões)...`)
      let synced = 0

      for (const movement of pending) {
        try {
          await registerMovement(movement.productId, {
            type: movement.type,
            quantity: movement.quantity,
            note: movement.note,
            idempotencyKey: movement.idempotencyKey,
          })
          await removeFromQueue(movement.idempotencyKey)
          synced++
        } catch (err: unknown) {
            const error = err as AxiosError
            if (!error.response) break
            await removeFromQueue(movement.idempotencyKey)
            synced++
        }
      }

      toast.dismiss(toastId)

      if (synced > 0) {
        queryClient.invalidateQueries({ queryKey: ['products'] })
        toast.success(`${synced} operação(ões) sincronizada(s)`)
        setPendingCount(0)
      }
    }

    window.addEventListener('online', drainQueue)
    return () => window.removeEventListener('online', drainQueue)
  }, [queryClient])

  return { pendingCount, setPendingCount }
}