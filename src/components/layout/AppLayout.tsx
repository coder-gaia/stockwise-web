import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../../hooks/useAuth'
import { Sidebar } from './Sidebar'
import { MobileHeader } from './MobileHeader'
import { BottomNav } from './BottomNav'
import { useOfflineSync } from '../../hooks/useOfflineSync'

export function AppLayout() {
  const { pendingCount, setPendingCount } = useOfflineSync()

  if (!isAuthenticated()) return <Navigate to="/login" replace />


  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar pendingCount={pendingCount} />
      <div className="flex-1 flex flex-col min-h-0">
        <MobileHeader pendingCount={pendingCount} />
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
            <Outlet context={{ setPendingCount }} />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}