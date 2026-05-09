import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, ArrowLeftRight, Trash2, Package } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '../components/shared/PageHeader'
import { EmptyState } from '../components/shared/EmptyState'
import { ProductDialog } from '../components/products/ProductDialog'
import { MovementDialog } from '../components/products/MovementDialog'
import { Button } from '../components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../components/ui/alert-dialog'
import { getProducts, deleteProduct } from '../api/products.api'
import type { Product } from '../types'
import { cn } from '../lib/utils'

function StockCell({ product }: { product: Product }) {
  return (
    <span className={cn(
      'text-sm font-medium tabular-nums',
      product.currentStock === 0 && 'text-red-600',
      product.currentStock > 0 && product.currentStock <= product.minStock && 'text-yellow-600',
    )}>
      {product.currentStock}
    </span>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  )
}

export default function ProductsPage() {
  const queryClient = useQueryClient()
  const [productDialog, setProductDialog] = useState<{ open: boolean; product?: Product }>({ open: false })
  const [movementDialog, setMovementDialog] = useState<{ open: boolean; product?: Product }>({ open: false })
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; product?: Product }>({ open: false })

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteProduct(deleteDialog.product!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Produto excluído')
      setDeleteDialog({ open: false })
    },
    onError: () => toast.error('Erro ao excluir produto'),
  })

  return (
    <div>
      <PageHeader
        title="Produtos"
        description="Gerencie seu catálogo e movimentações"
        action={
          <Button size="sm" onClick={() => setProductDialog({ open: true })}>
            <Plus size={14} className="mr-1.5" /> Novo produto
          </Button>
        }
      />

      {isLoading ? <Spinner /> : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Nenhum produto cadastrado"
          description="Comece adicionando o primeiro produto do seu estoque"
          action={
            <Button size="sm" onClick={() => setProductDialog({ open: true })}>
              <Plus size={14} className="mr-1.5" /> Novo produto
            </Button>
          }
        />
      ) : (
        <div className="border border-border rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {['Produto', 'Estoque', 'Mínimo', 'Validade', ''].map((h, i) => (
                  <th key={i} className={cn(
                    'py-3 px-4 text-xs font-medium text-muted-foreground',
                    i === 0 ? 'text-left' : 'text-right'
                  )}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product: Product, i: number) => (
                <tr key={product.id} className={cn('group', i < products.length - 1 && 'border-b border-border')}>
                  <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-right"><StockCell product={product} /></td>
                  <td className="px-4 py-3 text-right text-sm text-muted-foreground">{product.minStock}</td>
                  <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                    {product.expiresAt ? new Date(product.expiresAt).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setMovementDialog({ open: true, product })} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Movimentação">
                        <ArrowLeftRight size={13} />
                      </button>
                      <button onClick={() => setProductDialog({ open: true, product })} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Editar">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setDeleteDialog({ open: true, product })} className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors" title="Excluir">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductDialog open={productDialog.open} onClose={() => setProductDialog({ open: false })} product={productDialog.product} />

      {movementDialog.product && (
        <MovementDialog open={movementDialog.open} onClose={() => setMovementDialog({ open: false })} product={movementDialog.product} />
      )}

      <AlertDialog open={deleteDialog.open} onOpenChange={(v) => !v && setDeleteDialog({ open: false })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteDialog.product?.name}</strong> e todo seu histórico serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete()} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}