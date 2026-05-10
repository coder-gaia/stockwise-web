import { Wifi, WifiOff, LogOut } from 'lucide-react'
import { useLogout } from '../../hooks/useAuth'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { cn } from '../../lib/utils'

interface MobileHeaderProps {
  pendingCount: number
}

export function MobileHeader({ pendingCount }: MobileHeaderProps) {
  const logout = useLogout()
  const isOnline = useOnlineStatus()

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
      <span className="text-base font-semibold tracking-tight">Stockwise</span>
      <div className="flex items-center gap-3">
        <div className={cn(
          'flex items-center gap-1.5 text-xs',
          isOnline ? 'text-muted-foreground' : 'text-destructive'
        )}>
          {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
          {!isOnline && pendingCount > 0 && (
            <span className="bg-destructive text-destructive-foreground text-[10px] font-medium px-1.5 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </div>
        <button
          onClick={logout}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  )
}