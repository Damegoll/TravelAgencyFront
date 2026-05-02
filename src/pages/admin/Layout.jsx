import { NavLink, Outlet } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { ChartBarIcon } from '@heroicons/react/24/outline'
import { ShieldCheckIcon, CubeIcon, ClipboardDocumentListIcon, UsersIcon, TagIcon, HomeIcon } from '@heroicons/react/24/outline'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', Icon: HomeIcon },
  { to: '/admin/packages', label: 'Paquetes', Icon: CubeIcon },
  { to: '/admin/reservations', label: 'Reservas', Icon: ClipboardDocumentListIcon },
  { to: '/admin/discounts', label: 'Descuentos', Icon: TagIcon },
  { to: '/admin/accounts', label: 'Usuarios', Icon: UsersIcon },
  { to: '/admin/reports', label: 'Reportes', Icon: ChartBarIcon },
]

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
        <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
          <ShieldCheckIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <p className="text-primary-700 dark:text-primary-300 text-sm font-medium">Admin Panel</p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {adminLinks.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white dark:bg-surface-800/60 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>

        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
