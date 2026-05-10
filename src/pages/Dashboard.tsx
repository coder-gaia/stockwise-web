import { useQuery } from '@tanstack/react-query'
import { Package, AlertTriangle, XCircle, TrendingDown } from 'lucide-react'
import { PageHeader } from '../components/shared/PageHeader'
import { StatCard } from '../components/shared/StatCard'
import { EmptyState } from '../components/shared/EmptyState'
import { getProducts } from '../api/products.api'
import type { Product } from '../types'
import { cn } from '../lib/utils'

function StockBadge({ product }: { product: Product }) {
  if (product.currentStock === 0) {
    return <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">Sem estoque</span>
  }
  return (
    <span className="text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full">
      {product.currentStock} / {product.minStock} mín.
    </span>
  )
}

export default function DashboardPage() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  const lowStock = products.filter((p: Product) => p.currentStock <= p.minStock)
  const outOfStock = products.filter((p: Product) => p.currentStock === 0)
  const critical = [...lowStock]
    .sort((a: Product, b: Product) => a.currentStock - b.currentStock)
    .slice(0, 5)

  return (
    <div>
      <PageHeader title="Dashboard" description="Visão geral do estoque" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total de produtos"
          value={isLoading ? '—' : products.length}
          icon={Package}
        />
        <StatCard
          title="Alertas ativos"
          value={isLoading ? '—' : lowStock.length}
          icon={AlertTriangle}
          variant={lowStock.length > 0 ? 'warning' : 'default'}
          description={lowStock.length > 0 ? 'Abaixo do mínimo' : 'Tudo dentro do esperado'}
        />
        <StatCard
          title="Sem estoque"
          value={isLoading ? '—' : outOfStock.length}
          icon={XCircle}
          variant={outOfStock.length > 0 ? 'destructive' : 'default'}
          description={outOfStock.length > 0 ? 'Reposição imediata' : 'Nenhum produto zerado'}
        />
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3">Produtos críticos</h2>
        {critical.length === 0 ? (
          <EmptyState icon={TrendingDown} title="Nenhum produto crítico" description="Todos os produtos estão acima do estoque mínimo" />
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Produto</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Situação</th>
                </tr>
              </thead>
              <tbody>
                {critical.map((product: Product, i: number) => (
                  <tr key={product.id} className={cn(i < critical.length - 1 && 'border-b border-border')}>
                    <td className="px-4 py-3 text-sm">{product.name}</td>
                    <td className="px-4 py-3 text-right"><StockBadge product={product} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}