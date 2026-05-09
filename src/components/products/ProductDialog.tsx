import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { FormField } from '../shared/FormField'
import { createProduct, updateProduct } from '../../api/products.api'
import type { Product } from '../../types'

interface ProductDialogProps {
  open: boolean
  onClose: () => void
  product?: Product
}

export function ProductDialog({ open, onClose, product }: ProductDialogProps) {
  const isEditing = !!product
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [minStock, setMinStock] = useState('0')
  const [expiresAt, setExpiresAt] = useState('')

  useEffect(() => {
    if (open) {
      setName(product?.name ?? '')
      setMinStock(String(product?.minStock ?? 0))
      setExpiresAt(product?.expiresAt ? product.expiresAt.split('T')[0] : '')
    }
  }, [open, product])

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const payload = {
        name,
        minStock: Number(minStock),
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      }
      return isEditing ? updateProduct(product!.id, payload) : createProduct(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(isEditing ? 'Produto atualizado' : 'Produto criado')
      onClose()
    },
    onError: () => toast.error('Erro ao salvar produto'),
  })

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar produto' : 'Novo produto'}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <FormField id="name" label="Nome" placeholder="Ex: Arroz 5kg" value={name} onChange={setName} />
          <FormField id="minStock" label="Estoque mínimo" type="number" placeholder="0" value={minStock} onChange={setMinStock} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="expiresAt" className="text-sm font-medium">
              Validade <span className="text-muted-foreground font-normal">(opcional)</span>
            </label>
            <input
              id="expiresAt"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => mutate()} disabled={isPending || !name.trim()}>
            {isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}