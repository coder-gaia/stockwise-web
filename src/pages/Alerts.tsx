import { useQuery } from '@tanstack/react-query'
import { CheckCircle2 } from 'lucide-react'
import { PageHeader } from '../components/shared/PageHeader'
import { EmptyState } from '../components/shared/EmptyState'
import { getLowStockAlerts } from '../api/products.api'
import type { Product } from '../types'
import { cn } from '../lib/utils'

export default function AlertsPage() {
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['products', 'alerts'],
    queryFn: getLowStockAlerts,
    refetchInterval: 1000 * 60,
  })

  const sorted = [...alerts].sort((a: Product, b: Product) => a.currentStock - b.currentStock)

  return (
    <div>
      <PageHeader title="Alertas" description="Produtos que precisam de reposição" />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="Nenhum alerta no momento" description="Todos os produtos estão acima do estoque mínimo" />
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((product: Product) => (
            <div key={product.id} className={cn(
              'flex items-center justify-between px-4 py-4 rounded-lg border',
              product.currentStock === 0 ? 'border-red-200 bg-red-50/40' : 'border-yellow-200 bg-yellow-50/30'
            )}>
              <div>
                <p className="text-sm font-medium truncate max-w-[180px] sm:max-w-none">{product.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Mínimo: {product.minStock} unidades</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  'text-2xl font-semibold tabular-nums',
                  product.currentStock === 0 ? 'text-red-600' : 'text-yellow-700'
                )}>
                  {product.currentStock}
                </span>
                <span className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full border',
                  product.currentStock === 0
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                )}>
                  {product.currentStock === 0 ? 'Sem estoque' : 'Estoque baixo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}