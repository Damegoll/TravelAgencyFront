import { useState, useEffect } from 'react'
import { packageService } from '../../api/packageService'
import { reservationService } from '../../api/reservationService'
import { CubeIcon, ClipboardDocumentListIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function Dashboard() {
  const [stats, setStats] = useState({ packages: 0, reservations: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      packageService.getAllPackagesAdmin(),
      reservationService.getAllReservations(),
    ])
    .then(([packages, reservations]) =>
      setStats({
        packages: packages.length,
        reservations: reservations.length,
      })
    )
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
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Paquetes en total', value: stats.packages, Icon: CubeIcon },
          { label: 'Reservas', value: stats.reservations, Icon: ClipboardDocumentListIcon },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 p-6">
            <item.Icon className="w-8 h-8 text-primary-500" />
            <p className="text-surface-600 dark:text-surface-400 text-sm mt-2">{item.label}</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
