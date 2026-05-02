import { useState, useEffect, useMemo } from 'react'
import { reservationService } from '../../api/reservationService'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import htm12pdf from 'html2pdf.js'

const SORT_OPTIONS = [
  { value: 'reservationCount', label: 'Por Cantidad de Reservas' },
  { value: 'totalPassengers', label: 'Por Cantidad de Pasajeros' },
  { value: 'totalSales', label: 'Por Monto de Ventas' },
]

export default function AdminReports() {
  const [tab, setTab] = useState('packages')
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [includeCancelled, setIncludeCancelled] = useState(false)
  const [packagesError, setPackagesError] = useState('')

  const [rankingStartDate, setRankingStartDate] = useState('')
  const [rankingEndDate, setRankingEndDate] = useState('')
  const [sortBy, setSortBy] = useState('reservationCount')
  const [rankingError, setRankingError] = useState('')

  useEffect(() => {
    reservationService
      .getAllReservations()
      .then(setReservations)
      .catch(() => setError('Error cargando reservas'))
      .finally(() => setLoading(false))
  }, [])

  const validateDates = (start, end) => {
    if (!start || !end) {
      return { valid: false, message: 'Ambas fechas son requeridas' }
    }
    const startD = new Date(start)
    const endD = new Date(end)
    if (startD > endD) {
      return { valid: false, message: 'La fecha de inicio no puede ser posterior a la fecha de fin' }
    }
    return { valid: true }
  }

  const filterReservationsByPeriod = (reservations, startDate, endDate, includeCancelled) => {
    return reservations.filter(res => {
      const hasValidStatus = res.status && ['COMPLETED', 'PAID', 'CONFIRMED'].includes(res.status)
      if (!hasValidStatus) return false

      const resDate = new Date(res.reservedDate)
      const startD = new Date(startDate)
      const endD = new Date(endDate)

      if (resDate < startD || resDate > endD) return false

      if (!includeCancelled && res.status === 'CANCELLED') return false

      return true
    })
  }

  const packagesData = useMemo(() => {
    const validation = validateDates(startDate, endDate)
    if (!validation.valid) {
      setPackagesError(validation.message)
      return []
    }
    setPackagesError('')
    return filterReservationsByPeriod(reservations, startDate, endDate, includeCancelled)
  }, [startDate, endDate, includeCancelled, reservations])

  const rankingData = useMemo(() => {
    const validation = validateDates(rankingStartDate, rankingEndDate)
    if (!validation.valid) {
      setRankingError(validation.message)
      return []
    }
    setRankingError('')

    const filtered = filterReservationsByPeriod(reservations, rankingStartDate, rankingEndDate, false)

    const grouped = filtered.reduce((acc, res) => {
      const pkgName = res.reservedPackage?.packageName || 'Sin Nombre'
      if (!acc[pkgName]) {
        acc[pkgName] = {
          packageName: pkgName,
          reservationCount: 0,
          totalPassengers: 0,
          totalSales: 0,
        }
      }

      acc[pkgName].reservationCount += 1
      acc[pkgName].totalPassengers += res.passengerCount || 0
      acc[pkgName].totalSales += res.totalPriceCLP || 0

      return acc
    }, {})

    const sorted = Object.values(grouped).sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]

      if (aVal === bVal) {
        return a.packageName.localeCompare(b.packageName)
      }

      return bVal - aVal
    })

    return sorted
  }, [rankingStartDate, rankingEndDate, sortBy, reservations])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">Reportes</h1>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-6 border-b border-surface-200 dark:border-surface-700">
        <button
          onClick={() => setTab('packages')}
          className={`px-4 py-3 font-medium border-b-2 transition-all ${
            tab === 'packages'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
          }`}
        >
          Paquetes por Período
        </button>
        <button
          onClick={() => setTab('ranking')}
          className={`px-4 py-3 font-medium border-b-2 transition-all ${
            tab === 'ranking'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
          }`}
        >
          Ranking de Ventas
        </button>
      </div>

      {tab === 'packages' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 p-6">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Filtros</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCancelled}
                    onChange={(e) => setIncludeCancelled(e.target.checked)}
                    className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                    Incluir Canceladas
                  </span>
                </label>
              </div>
            </div>

            {packagesError && (
              <div className="mt-4 text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
                {packagesError}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200/50 dark:border-surface-700/50 bg-surface-50 dark:bg-surface-700/30">
                    <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-400">
                      Cliente
                    </th>
                    <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">
                      Paquete
                    </th>
                    <th className="text-center px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">
                      Pasajeros
                    </th>
                    <th className="text-right px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">
                      Valor Total
                    </th>
                    <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {packagesData.map((res, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-surface-100 dark:border-surface-700/30 hover:bg-surface-50 dark:hover:bg-surface-700/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-surface-900 dark:text-white">
                        {res.accountId || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-surface-600 dark:text-surface-300">
                        {res.reservedPackage?.packageName || 'Sin Nombre'}
                      </td>
                      <td className="px-4 py-4 text-center text-surface-600 dark:text-surface-300">
                        {res.passengerCount || 0}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-surface-900 dark:text-white">
                        ${(res.totalPriceCLP || 0).toLocaleString('es-CL')}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            res.status === 'CANCELLED'
                              ? 'bg-danger/20 text-danger'
                              : 'bg-success/20 text-success'
                          }`}
                        >
                          {res.status || 'Desconocido'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {packagesData.length === 0 && !packagesError && (
              <div className="text-center py-12 text-surface-400 dark:text-surface-500">
                Selecciona un rango de fechas para ver resultados
              </div>
            )}
          </div>

          {packagesData.length > 0 && (
            <div className="bg-surface-50 dark:bg-surface-700/30 rounded-lg p-4 text-sm text-surface-600 dark:text-surface-400">
              <strong>Total:</strong> {packagesData.length} reservas encontradas | Valor total:{' '}
              <strong>
                ${packagesData.reduce((sum, r) => sum + (r.totalPriceCLP || 0), 0).toLocaleString('es-CL')}
              </strong>
            </div>
          )}
        </div>
      )}

      {tab === 'ranking' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 p-6">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Filtros y Ordenamiento</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={rankingStartDate}
                  onChange={(e) => setRankingStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={rankingEndDate}
                  onChange={(e) => setRankingEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Ordenar por
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-surface-500" />
                </div>
              </div>
            </div>

            {rankingError && (
              <div className="mt-4 text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
                {rankingError}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200/50 dark:border-surface-700/50 bg-surface-50 dark:bg-surface-700/30">
                    <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-400">
                      Ranking
                    </th>
                    <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">
                      Paquete
                    </th>
                    <th className="text-center px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">
                      Reservas
                    </th>
                    <th className="text-center px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">
                      Pasajeros
                    </th>
                    <th className="text-right px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">
                      Ventas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rankingData.map((pkg, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-surface-100 dark:border-surface-700/30 hover:bg-surface-50 dark:hover:bg-surface-700/20 transition-colors ${
                        idx === 0 ? 'bg-amber-50/50 dark:bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            idx === 0
                              ? 'bg-amber-200 text-amber-900'
                              : idx === 1
                                ? 'bg-slate-200 text-slate-900'
                                : idx === 2
                                  ? 'bg-orange-200 text-orange-900'
                                  : 'bg-surface-200 text-surface-700'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium text-surface-900 dark:text-white">
                        {pkg.packageName}
                      </td>
                      <td className="px-4 py-4 text-center text-surface-600 dark:text-surface-300">
                        {pkg.reservationCount}
                      </td>
                      <td className="px-4 py-4 text-center text-surface-600 dark:text-surface-300">
                        {pkg.totalPassengers}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-surface-900 dark:text-white">
                        ${pkg.totalSales.toLocaleString('es-CL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rankingData.length === 0 && !rankingError && (
              <div className="text-center py-12 text-surface-400 dark:text-surface-500">
                Selecciona un rango de fechas para ver resultados
              </div>
            )}
          </div>

          {rankingData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface-50 dark:bg-surface-700/30 rounded-lg p-4">
                <p className="text-xs text-surface-500 dark:text-surface-400 uppercase font-semibold mb-1">
                  Paquetes Únicos
                </p>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{rankingData.length}</p>
              </div>
              <div className="bg-surface-50 dark:bg-surface-700/30 rounded-lg p-4">
                <p className="text-xs text-surface-500 dark:text-surface-400 uppercase font-semibold mb-1">
                  Total Reservas
                </p>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">
                  {rankingData.reduce((sum, r) => sum + r.reservationCount, 0)}
                </p>
              </div>
              <div className="bg-surface-50 dark:bg-surface-700/30 rounded-lg p-4">
                <p className="text-xs text-surface-500 dark:text-surface-400 uppercase font-semibold mb-1">
                  Ventas Totales
                </p>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">
                  ${rankingData.reduce((sum, r) => sum + r.totalSales, 0).toLocaleString('es-CL')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}