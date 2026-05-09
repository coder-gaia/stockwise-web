import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { restoreSession } from './api/auth.api'
import { AppLayout } from './components/layout/AppLayout'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import DashboardPage from './pages/Dashboard'
import ProductsPage from './pages/Products'
import AlertsPage from './pages/Alerts'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 } },
})

function SessionGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    restoreSession()
      .catch(() => {})
      .finally(() => setReady(true))
  }, [])

  if (!ready) return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  )

  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionGate>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
            </Route>
          </Routes>
          <Toaster position="bottom-right" richColors closeButton />
        </SessionGate>
      </BrowserRouter>
    </QueryClientProvider>
  )
}