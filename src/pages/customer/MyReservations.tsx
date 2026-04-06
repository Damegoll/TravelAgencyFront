import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { reservationService } from '../../api/reservationService'
import { packageTypeLabels, travelTypeLabels } from '../../data/mockData'
import { formatCLP } from '../../utils/format'
import type { Reservation } from '../../types'

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pendiente', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  CONFIRMED: { label: 'Confirmada', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  CANCELLED: { label: 'Cancelada', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
  COMPLETED: { label: 'Completada', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
}

export default function MyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = () => {
    setLoading(true)
    reservationService
      .getUserReservations()
      .then(setReservations)
      .catch(() => setError('No se pudieron cargar las reservas'))
      .finally(() => setLoading(false))
  }

  const handleCancel = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return
    setCancellingId(id)
    try {
      await reservationService.cancelReservation(id)
      setReservations(prev =>
        prev.map(r => r.reserveId === id ? { ...r, status: 'CANCELLED' } : r)
      )
    } catch {
      alert('Error al cancelar la reserva')
    } finally {
      setCancellingId(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex justify-center animate-fade-in">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center animate-fade-in">
        <p className="text-5xl mb-4">⚠️</p>
        <p className="text-surface-500 dark:text-surface-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-8">
        Mis Reservas
      </h1>

      {reservations.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-800/40 rounded-2xl border border-surface-200/50 dark:border-surface-700/50">
          <p className="text-5xl mb-4">📋</p>
          <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
            No tienes reservas
          </h3>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            ¡Empieza a explorar y reserva tu próximo viaje!
          </p>
          <Link
            to="/search"
            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-all duration-200 text-sm font-medium"
          >
            Explorar Paquetes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map(reservation => {
            const pkg = reservation.reservedPackage
            const status = statusConfig[reservation.status] || statusConfig.PENDING
            const typeInfo = pkg ? packageTypeLabels[pkg.packageType] : null
            const travelInfo = pkg ? travelTypeLabels[pkg.travelType] : null

            return (
              <div
                key={reservation.reserveId}
                className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-surface-900 dark:text-white">
                        {pkg?.packageName ?? 'Paquete'}
                      </h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-surface-500 dark:text-surface-400">
                      {pkg && (
                        <>
                          <span>📍 {pkg.packageDestiny}</span>
                          {typeInfo && <span>· {typeInfo.label}</span>}
                          {travelInfo && <span>· {travelInfo.emoji} {travelInfo.label}</span>}
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-surface-400 dark:text-surface-500">
                      <span>
                        Check-in: {new Date(reservation.reservedCheckIn).toLocaleDateString('es-CL')}
                      </span>
                      <span>
                        Check-out: {new Date(reservation.reservedCheckOut).toLocaleDateString('es-CL')}
                      </span>
                      <span>
                        Reservado: {new Date(reservation.reservedDate).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-surface-900 dark:text-white">
                        {formatCLP(reservation.totalPriceCLP)}
                      </p>
                    </div>

                    {reservation.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(reservation.reserveId)}
                        disabled={cancellingId === reservation.reserveId}
                        className="px-4 py-2 text-sm font-medium text-danger border border-danger/30 rounded-xl hover:bg-danger/10 transition-all duration-200 disabled:opacity-50"
                      >
                        {cancellingId === reservation.reserveId ? 'Cancelando...' : 'Cancelar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
