import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../../hooks/useAuth'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  if (!isAuthenticated()) return <Navigate to="/login" replace />

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}