import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'

import { Button } from '../ui/button'
import { FormField } from '../shared/FormField'

import { registerMovement } from '../../api/products.api'
import { addToQueue } from '../../lib/db'

import type { Product } from '../../types'

import { cn } from '../../lib/utils'

interface MovementDialogProps {
  open: boolean
  onClose: () => void
  product: Product
}

interface OutletContext {
  setPendingCount: React.Dispatch<React.SetStateAction<number>>
}

export function MovementDialog({
  open,
  onClose,
  product,
}: MovementDialogProps) {
  const queryClient = useQueryClient()

  const { setPendingCount } =
    useOutletContext<OutletContext>()

  const [type, setType] =
    useState<'IN' | 'OUT'>('IN')

  const [quantity, setQuantity] = useState('1')

  const [note, setNote] = useState('')

  const [idempotencyKey] = useState(() =>
    crypto.randomUUID()
  )

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      registerMovement(product.id, {
        type,
        quantity: Number(quantity),
        note: note || undefined,
        idempotencyKey,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      })

      toast.success(
        type === 'IN'
          ? 'Entrada registrada'
          : 'Saída registrada'
      )

      onClose()
    },

    onError: (err: unknown) => {
      const error =
        err as AxiosError<{ error?: string }>

      const msg = error.response?.data?.error

      toast.error(
        msg === 'Insufficient stock'
          ? 'Estoque insuficiente para esta saída'
          : 'Erro ao registrar movimentação'
      )
    },
  })

  const handleSubmit = async () => {
    if (!navigator.onLine) {
      await addToQueue({
        idempotencyKey,
        productId: product.id,
        type,
        quantity: Number(quantity),
        note: note || undefined,
      })

      queryClient.setQueryData(
        ['products'],
        (old: Product[] = []) =>
          old.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  currentStock:
                    p.currentStock +
                    (type === 'IN'
                      ? Number(quantity)
                      : -Number(quantity)),
                }
              : p
          )
      )

      setPendingCount((n) => n + 1)

      toast.warning(
        'Sem conexão — operação salva e será sincronizada quando voltar online'
      )

      onClose()

      return
    }

    mutate()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Movimentação — {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex gap-2">
            {(['IN', 'OUT'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  'flex-1 rounded-md border py-2 text-sm font-medium transition-colors',

                  type === t &&
                    t === 'IN' &&
                    'border-emerald-300 bg-emerald-50 text-emerald-700',

                  type === t &&
                    t === 'OUT' &&
                    'border-red-300 bg-red-50 text-red-600',

                  type !== t &&
                    'border-border text-muted-foreground hover:bg-secondary'
                )}
              >
                {t === 'IN'
                  ? 'Entrada'
                  : 'Saída'}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            <span>Estoque atual</span>

            <span className="font-medium text-foreground">
              {product.currentStock} unidades
            </span>
          </div>

          <FormField
            id="quantity"
            label="Quantidade"
            type="number"
            placeholder="1"
            value={quantity}
            onChange={setQuantity}
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="note"
              className="text-sm font-medium"
            >
              Observação{' '}
              <span className="font-normal text-muted-foreground">
                (opcional)
              </span>
            </label>

            <textarea
              id="note"
              value={note}
              onChange={(e) =>
                setNote(e.target.value)
              }
              placeholder="Ex: Reposição semanal"
              rows={2}
              className="flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={
              isPending || Number(quantity) < 1
            }
            className={cn(
              type === 'OUT' &&
                'bg-red-600 hover:bg-red-700'
            )}
          >
            {isPending
              ? 'Registrando...'
              : type === 'IN'
                ? 'Registrar entrada'
                : 'Registrar saída'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}