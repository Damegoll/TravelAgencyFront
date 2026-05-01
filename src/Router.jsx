import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/customer/Home'
import Search from './pages/customer/Search'
import Cart from './pages/customer/Cart'
import Payment from './pages/customer/Payment'
import MyReservations from './pages/customer/MyReservations'
import Profile from './pages/customer/Profile'
import Login from './pages/auth/Login'

import Dashboard from './pages/admin/Dashboard'
import AdminPackages from './pages/admin/AdminPackages'
import AdminDiscounts from './pages/admin/AdminDiscounts'
import AdminReservations from './pages/admin/AdminReservations'
import AdminAccounts from './pages/admin/AdminAccounts'
import AdminLayout from './pages/admin/Layout'
import NotFound from './pages/customer/NotFound'

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-reservations"
          element={
            <ProtectedRoute>
              <MyReservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/login" element={<Login />} />


      <Route element={<AdminLayout />}>
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin/packages"
          element={<ProtectedRoute requireAdmin><AdminPackages /></ProtectedRoute>}
        />
        <Route
          path="/admin/discounts"
          element={<ProtectedRoute requireAdmin><AdminDiscounts /></ProtectedRoute>}
        />
        <Route
          path="/admin/reservations"
          element={<ProtectedRoute requireAdmin><AdminReservations /></ProtectedRoute>}
        />
        <Route
          path="/admin/accounts"
          element={<ProtectedRoute requireAdmin><AdminAccounts /></ProtectedRoute>}
        />
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
