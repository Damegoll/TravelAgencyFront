import { useState, useEffect } from 'react'
import { reservationService } from '../../api/reservationService'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'

export default function MyReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    reservationService
      .getUserReservations()
      .then(setReservations)
      .catch(() => setError('Error al cargar tus reservas, puede que no tengas o el sistema este caido'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-8">Mis Reservas</h1>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-800/40 rounded-2xl border border-surface-200/50 dark:border-surface-700/50">
          <ClipboardDocumentListIcon className="w-12 h-12 mx-auto mb-4 text-surface-400 dark:text-surface-500" />
          <p className="text-surface-500 dark:text-surface-400">No tienes reservas aún</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reservations.map(res => (
            <div key={res.reserveId} className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white">
                    {res.reservedPackage.packageName}
                  </h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    {new Date(res.reservedCheckIn).toLocaleDateString('es-CL')} - {new Date(res.reservedCheckOut).toLocaleDateString('es-CL')}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${res.status === 'CONFIRMED' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                    }`}>
                    {res.status}
                  </span>
                  <p className="text-lg font-bold text-surface-900 dark:text-white mt-2">
                    ${res.totalPriceCLP.toLocaleString('es-CL')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
