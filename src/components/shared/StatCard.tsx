import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  description?: string
  variant?: 'default' | 'warning' | 'destructive'
}

export function StatCard({ title, value, icon: Icon, description, variant = 'default' }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-lg border bg-card p-5',
      variant === 'warning' && 'border-yellow-200 bg-yellow-50/40',
      variant === 'destructive' && 'border-red-200 bg-red-50/40'
    )}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className={cn(
          'p-2 rounded-md',
          variant === 'default' && 'bg-primary/10 text-primary',
          variant === 'warning' && 'bg-yellow-100 text-yellow-700',
          variant === 'destructive' && 'bg-red-100 text-red-600'
        )}>
          <Icon size={15} />
        </div>
      </div>
      <p className={cn(
        'text-3xl font-semibold tracking-tight',
        variant === 'warning' && 'text-yellow-700',
        variant === 'destructive' && 'text-red-600'
      )}>{value}</p>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </div>
  )
}