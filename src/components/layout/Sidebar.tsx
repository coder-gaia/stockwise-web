import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Bell, LogOut, Wifi, WifiOff } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useLogout } from '../../hooks/useAuth'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Produtos', icon: Package },
  { to: '/alerts', label: 'Alertas', icon: Bell },
]

interface SidebarProps {
  pendingCount: number
}

export function Sidebar({ pendingCount }: SidebarProps) {
  const logout = useLogout()
  const isOnline = useOnlineStatus()

  return (
    <aside className="hidden md:flex w-60 h-screen flex-col border-r border-border bg-card px-4 py-6 shrink-0">
      <div className="px-2 mb-8">
        <span className="text-lg font-semibold tracking-tight">Stockwise</span>
        <p className="text-xs text-muted-foreground mt-0.5">Gestão de estoque</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-3 pt-4 border-t border-border">
        <div className={cn(
          'flex items-center justify-between px-3 py-1.5 rounded-md text-xs',
          isOnline ? 'text-muted-foreground' : 'bg-destructive/10 text-destructive'
        )}>
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          {!isOnline && pendingCount > 0 && (
            <span className="bg-destructive text-destructive-foreground text-[10px] font-medium px-1.5 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  )
}