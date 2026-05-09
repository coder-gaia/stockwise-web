import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../../hooks/useAuth'
import { Sidebar } from './Sidebar'
import { useOfflineSync } from '../../hooks/useOfflineSync'

export function AppLayout() {
  const { pendingCount, setPendingCount } = useOfflineSync()
  
  if (!isAuthenticated()) return <Navigate to="/login" replace />


  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar pendingCount={pendingCount}/>

      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <Outlet context={{setPendingCount}}/>
        </div>
      </main>
    </div>
  )
}