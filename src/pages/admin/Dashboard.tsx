import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { reservationService } from '../../api/reservationService'
import { accountService } from '../../api/accountService'
import { packageService } from '../../api/packageService'
import { formatCLP } from '../../utils/format'
import type { Reservation } from '../../types'

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pendiente', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  CONFIRMED: { label: 'Confirmada', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  CANCELLED: { label: 'Cancelada', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
  COMPLETED: { label: 'Completada', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalReservations: 0,
    activeAccounts: 0,
    totalRevenue: 0,
    totalPackages: 0,
  })
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      reservationService.getAllReservations(),
      accountService.getAllAccounts(),
      packageService.getAllPackagesAdmin(),
    ])
      .then(([reservations, accounts, packages]) => {
        const revenue = reservations
          .filter(r => r.status !== 'CANCELLED')
          .reduce((sum, r) => sum + r.totalPriceCLP, 0)

        setStats({
          totalReservations: reservations.length,
          activeAccounts: accounts.filter(a => a.status === 'ACTIVE').length,
          totalRevenue: revenue,
          totalPackages: packages.length,
        })


        setRecentReservations(
          [...reservations]
            .sort((a, b) => new Date(b.reservedDate).getTime() - new Date(a.reservedDate).getTime())
            .slice(0, 5)
        )
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Reservas', value: stats.totalReservations.toString(), color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-500/10', link: '/admin/reservations' },
          { label: 'Cuentas Activas', value: stats.activeAccounts.toString(), color: 'text-success', bg: 'bg-success/10', link: '/admin/accounts' },
          { label: 'Ingresos', value: formatCLP(stats.totalRevenue), color: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-500/10', link: '/admin/reservations' },
          { label: 'Paquetes', value: stats.totalPackages.toString(), color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10', link: '/admin/packages' },
        ].map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className="bg-white dark:bg-surface-800/60 p-6 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-3`}>
              <span className={`text-sm font-semibold ${card.color}`}>{card.label}</span>
            </div>
            <p className={`text-3xl font-bold ${card.color} mt-1`}>{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/packages" className="flex items-center gap-3 bg-white dark:bg-surface-800/60 p-4 rounded-xl border border-surface-200/50 dark:border-surface-700/50 hover:shadow-md transition-all group">
          <span className="text-2xl">📦</span>
          <div>
            <p className="font-semibold text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Gestionar Paquetes</p>
            <p className="text-xs text-surface-400">Crear, editar y archivar paquetes</p>
          </div>
        </Link>
        <Link to="/admin/reservations" className="flex items-center gap-3 bg-white dark:bg-surface-800/60 p-4 rounded-xl border border-surface-200/50 dark:border-surface-700/50 hover:shadow-md transition-all group">
          <span className="text-2xl">📋</span>
          <div>
            <p className="font-semibold text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Gestionar Reservas</p>
            <p className="text-xs text-surface-400">Confirmar, cancelar y completar</p>
          </div>
        </Link>
        <Link to="/admin/accounts" className="flex items-center gap-3 bg-white dark:bg-surface-800/60 p-4 rounded-xl border border-surface-200/50 dark:border-surface-700/50 hover:shadow-md transition-all group">
          <span className="text-2xl">👥</span>
          <div>
            <p className="font-semibold text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Gestionar Cuentas</p>
            <p className="text-xs text-surface-400">Ver y administrar usuarios</p>
          </div>
        </Link>
      </div>

      {/* Recent reservations */}
      <div className="bg-white dark:bg-surface-800/60 p-6 rounded-2xl border border-surface-200/50 dark:border-surface-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">Actividad Reciente</h2>
          <Link to="/admin/reservations" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            Ver todas →
          </Link>
        </div>

        {recentReservations.length > 0 ? (
          <div className="space-y-3">
            {recentReservations.map(res => {
              const status = statusConfig[res.status] || statusConfig.PENDING
              return (
                <div key={res.reserveId} className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-700/30 last:border-0">
                  <div>
                    <p className="font-medium text-surface-900 dark:text-white text-sm">
                      {res.reservedPackage?.packageName ?? 'Reserva'}
                    </p>
                    <p className="text-xs text-surface-400">
                      {new Date(res.reservedDate).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-surface-900 dark:text-white text-sm">
                      {formatCLP(res.totalPriceCLP)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-surface-500 dark:text-surface-400">No hay actividad reciente</p>
        )}
      </div>
    </div>
  )
}
