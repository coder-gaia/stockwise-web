import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import DashboardPage from './pages/Dashboard'
import ProductsPage from './pages/Products'
import AlertsPage from './pages/Alerts'
import { AppLayout } from './components/layout/AppLayout'

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}