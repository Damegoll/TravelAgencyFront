import { useState, useEffect } from 'react'
import { reservationService } from '../../api/reservationService'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function AdminReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showConfirmCancel, setShowConfirmCancel] = useState(false)
  const [reservationToCancel, setReservationToCancel] = useState(null)
  const [canceling, setCanceling] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    reservationService
      .getAllReservations()
      .then(setReservations)
      .catch(() => setError('Error cargando reservas'))
      .finally(() => setLoading(false))
  }, [])

  const handleCancelClick = (reservation) => {
    setReservationToCancel(reservation)
    setShowConfirmCancel(true)
  }

  const handleConfirmCancel = async () => {
    if (!reservationToCancel) return
    setCanceling(true)
    try {
      await reservationService.cancelReservation(reservationToCancel.reserveId)
      setReservations(reservations.filter(r => r.reserveId !== reservationToCancel.reserveId))
      setSuccessMessage('Reserva cancelada exitosamente')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError('Error al cancelar la reserva')
    } finally {
      setCanceling(false)
      setShowConfirmCancel(false)
      setReservationToCancel(null)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">Reservas</h1>
      {error && <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6">{error}</div>}
      {successMessage && <div className="bg-success/10 border border-success/30 text-success text-sm rounded-xl px-4 py-3 mb-6">{successMessage}</div>}
      <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200/50 dark:border-surface-700/50">
                <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-400">Paquete</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Entrada</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Salida</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Estado</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Precio</th>
                <th className="text-center px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Acción</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.reserveId} className="border-b border-surface-100 dark:border-surface-700/30">
                  <td className="px-6 py-4 font-medium text-surface-900 dark:text-white">{res.reservedPackage.packageName}</td>
                  <td className="px-4 py-4 text-surface-600 dark:text-surface-300">{new Date(res.reservedCheckIn).toLocaleDateString('es-CL')}</td>
                  <td className="px-4 py-4 text-surface-600 dark:text-surface-300">{new Date(res.reservedCheckOut).toLocaleDateString('es-CL')}</td>
                  <td className="px-4 py-4"><span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-600">{res.status}</span></td>
                  <td className="px-4 py-4 text-surface-600 dark:text-surface-300">${res.totalPriceCLP.toLocaleString('es-CL')}</td>
                  <td className="px-4 py-4 text-center">
                    {res.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleCancelClick(res)}
                        className="inline-flex items-center justify-center gap-1 text-xs px-3 py-1 rounded-full bg-danger/20 text-danger hover:bg-danger/30 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {reservations.length === 0 && <div className="text-center py-12 text-surface-400 dark:text-surface-500">No hay reservas</div>}
      </div>

      {showConfirmCancel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">
              ¿Cancelar reserva?
            </h3>
            <p className="text-sm text-surface-600 dark:text-surface-300 mb-6">
              Estás a punto de cancelar la reserva para <strong>{reservationToCancel?.reservedPackage.packageName}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmCancel(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors font-medium"
              >
                Mantener
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={canceling}
                className="flex-1 px-4 py-2 rounded-lg bg-danger text-white hover:bg-danger/90 transition-colors font-medium disabled:opacity-50"
              >
                {canceling ? 'Cancelando...' : 'Cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
