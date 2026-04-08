import { useState, useEffect } from 'react'
import { packageService } from '../../api/packageService'

export default function AdminPackages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    packageService
      .getAllPackagesAdmin()
      .then(setPackages)
      .catch(() => setError('Error cargando paquetes'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">Paquetes</h1>
      {error && <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6">{error}</div>}
      <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200/50 dark:border-surface-700/50">
                <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-400">Nombre</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Destino</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Precio</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Estado</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.packageId} className="border-b border-surface-100 dark:border-surface-700/30">
                  <td className="px-6 py-4 font-medium text-surface-900 dark:text-white">{pkg.packageName}</td>
                  <td className="px-4 py-4 text-surface-600 dark:text-surface-300">{pkg.packageDestiny}</td>
                  <td className="px-4 py-4 text-surface-600 dark:text-surface-300">${pkg.packagePrice.toLocaleString()}</td>
                  <td className="px-4 py-4"><span className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-600 dark:text-primary-400">{pkg.packageStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {packages.length === 0 && <div className="text-center py-12 text-surface-400 dark:text-surface-500">No hay paquetes</div>}
      </div>
    </div>
  )
}
