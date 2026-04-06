import { useState, useEffect } from 'react'
import { reservationService } from '../../api/reservationService'
import { formatCLP } from '../../utils/format'
import type { Reservation, ReservationStatus } from '../../types'

const statusConfig: Record<ReservationStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pendiente', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  CONFIRMED: { label: 'Confirmada', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  CANCELLED: { label: 'Cancelada', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
  COMPLETED: { label: 'Completada', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
}

const allStatuses: ReservationStatus[] = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | 'ALL'>('ALL')

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = () => {
    setLoading(true)
    reservationService
      .getAllReservations()
      .then(setReservations)
      .catch(() => setError('Error cargando reservas'))
      .finally(() => setLoading(false))
  }

  const handleStatusUpdate = async (id: string, newStatus: ReservationStatus) => {
    try {
      const updated = await reservationService.updateReservation(id, { status: newStatus })
      setReservations(prev => prev.map(r => r.reserveId === id ? updated : r))
    } catch {
      alert('Error al actualizar estado')
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm('¿Cancelar esta reserva?')) return
    try {
      await reservationService.cancelReservation(id)
      setReservations(prev =>
        prev.map(r => r.reserveId === id ? { ...r, status: 'CANCELLED' as ReservationStatus } : r)
      )
    } catch {
      alert('Error al cancelar')
    }
  }

  const filtered = filterStatus === 'ALL'
    ? reservations
    : reservations.filter(r => r.status === filterStatus)

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Reservas</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === 'ALL' ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400 ring-1 ring-primary-500/30' : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700/50'}`}
          >
            Todas
          </button>
          {allStatuses.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400 ring-1 ring-primary-500/30' : 'text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700/50'}`}
            >
              {statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200/50 dark:border-surface-700/50">
                <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-400">Paquete</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Check-in</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Check-out</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Total</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Estado</th>
                <th className="text-right px-6 py-4 font-semibold text-surface-600 dark:text-surface-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(res => {
                const status = statusConfig[res.status]
                return (
                  <tr key={res.reserveId} className="border-b border-surface-100 dark:border-surface-700/30 hover:bg-surface-50 dark:hover:bg-surface-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-surface-900 dark:text-white">
                        {res.reservedPackage?.packageName ?? '—'}
                      </p>
                      <p className="text-xs text-surface-400">
                        {res.reservedPackage?.packageDestiny ?? '—'}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-surface-600 dark:text-surface-300">
                      {new Date(res.reservedCheckIn).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-4 py-4 text-surface-600 dark:text-surface-300">
                      {new Date(res.reservedCheckOut).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-4 py-4 font-medium text-surface-900 dark:text-white">
                      {formatCLP(res.totalPriceCLP)}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {res.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusUpdate(res.reserveId, 'CONFIRMED')}
                            className="text-xs px-3 py-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-all"
                          >
                            Confirmar
                          </button>
                        )}
                        {(res.status === 'PENDING' || res.status === 'CONFIRMED') && (
                          <button
                            onClick={() => handleCancel(res.reserveId)}
                            className="text-xs px-3 py-1.5 rounded-lg text-danger border border-danger/30 hover:bg-danger/10 transition-all"
                          >
                            Cancelar
                          </button>
                        )}
                        {res.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusUpdate(res.reserveId, 'COMPLETED')}
                            className="text-xs px-3 py-1.5 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-500/30 hover:bg-blue-500/10 transition-all"
                          >
                            Completar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-surface-400 dark:text-surface-500">
            No hay reservas {filterStatus !== 'ALL' ? `con estado "${statusConfig[filterStatus].label}"` : ''}
          </div>
        )}
      </div>
    </div>
  )
}
