import { Routes, Route, Navigate } from 'react-router-dom'
import CustomerLayout from './pages/customer/Layout'
import AdminLayout from './pages/admin/Layout'
import Home from './pages/customer/Home'
import Search from './pages/customer/Search'
import Dashboard from './pages/admin/Dashboard'
import NotFound from './pages/customer/NotFound'

export default function Router() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
