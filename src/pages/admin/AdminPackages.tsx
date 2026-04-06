import { useState, useEffect } from 'react'
import { packageService } from '../../api/packageService'
import { packageTypeLabels, travelTypeLabels, seasonLabels } from '../../data/mockData'
import { formatCLP } from '../../utils/format'
import type { TravelPackage, PackageType, TravelType, Season, PackageStatus } from '../../types'

const statusConfig: Record<PackageStatus, { label: string; color: string; bg: string }> = {
  ACTIVE: { label: 'Activo', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  ARCHIVED: { label: 'Archivado', color: 'text-surface-500 dark:text-surface-400', bg: 'bg-surface-500/10' },
  SOLD_OUT: { label: 'Agotado', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
}

const emptyForm = {
  packageName: '',
  packageDestiny: '',
  packageDescription: '',
  travelType: 'CULTURAL' as TravelType,
  travelSeason: 'SUMMER' as Season,
  packageType: 'BUDGET' as PackageType,
  packageStartDate: '',
  packageEndDate: '',
  packagePrice: 0,
  availableSpots: 10,
  packageStatus: 'ACTIVE' as PackageStatus,
}

export default function AdminPackages() {
  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<TravelPackage | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = () => {
    setLoading(true)
    packageService
      .getAllPackagesAdmin()
      .then(setPackages)
      .catch(() => setError('Error cargando paquetes'))
      .finally(() => setLoading(false))
  }

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (pkg: TravelPackage) => {
    setEditing(pkg)
    setForm({
      packageName: pkg.packageName,
      packageDestiny: pkg.packageDestiny,
      packageDescription: pkg.packageDescription,
      travelType: pkg.travelType,
      travelSeason: pkg.travelSeason,
      packageType: pkg.packageType,
      packageStartDate: pkg.packageStartDate,
      packageEndDate: pkg.packageEndDate,
      packagePrice: pkg.packagePrice,
      availableSpots: pkg.availableSpots,
      packageStatus: pkg.packageStatus,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) {
        const updated = await packageService.updatePackage(editing.packageId, form)
        setPackages(prev => prev.map(p => p.packageId === updated.packageId ? updated : p))
      } else {
        const created = await packageService.createPackage(form as any)
        setPackages(prev => [...prev, created])
      }
      setShowForm(false)
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este paquete?')) return
    try {
      await packageService.deletePackage(id)
      setPackages(prev => prev.filter(p => p.packageId !== id))
    } catch {
      alert('Error al eliminar')
    }
  }

  const handleStatusToggle = async (pkg: TravelPackage) => {
    const next = pkg.packageStatus === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE'
    try {
      const updated = await packageService.updatePackageStatus(pkg.packageId, next)
      setPackages(prev => prev.map(p => p.packageId === updated.packageId ? updated : p))
    } catch {
      alert('Error al cambiar estado')
    }
  }

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

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
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Paquetes</h1>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-primary text-sm"
        >
          + Nuevo Paquete
        </button>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6">
              {editing ? 'Editar Paquete' : 'Nuevo Paquete'}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Nombre</label>
                  <input
                    value={form.packageName}
                    onChange={e => updateField('packageName', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Destino</label>
                  <input
                    value={form.packageDestiny}
                    onChange={e => updateField('packageDestiny', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Descripción</label>
                <textarea
                  value={form.packageDescription}
                  onChange={e => updateField('packageDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tipo Viaje</label>
                  <select
                    value={form.travelType}
                    onChange={e => updateField('travelType', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    {(Object.keys(travelTypeLabels) as TravelType[]).map(t => (
                      <option key={t} value={t}>{travelTypeLabels[t].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Temporada</label>
                  <select
                    value={form.travelSeason}
                    onChange={e => updateField('travelSeason', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    {(Object.keys(seasonLabels) as Season[]).map(s => (
                      <option key={s} value={s}>{seasonLabels[s].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tipo Paquete</label>
                  <select
                    value={form.packageType}
                    onChange={e => updateField('packageType', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    {(Object.keys(packageTypeLabels) as PackageType[]).map(t => (
                      <option key={t} value={t}>{packageTypeLabels[t].label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={form.packageStartDate}
                    onChange={e => updateField('packageStartDate', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    value={form.packageEndDate}
                    onChange={e => updateField('packageEndDate', e.target.value)}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Precio (CLP)</label>
                  <input
                    type="number"
                    value={form.packagePrice}
                    onChange={e => updateField('packagePrice', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Cupos Disponibles</label>
                  <input
                    type="number"
                    value={form.availableSpots}
                    onChange={e => updateField('availableSpots', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-400 border border-surface-300 dark:border-surface-600 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all hover:shadow-primary disabled:opacity-50"
              >
                {saving ? 'Guardando...' : editing ? 'Guardar Cambios' : 'Crear Paquete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200/50 dark:border-surface-700/50">
                <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-400">Nombre</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Destino</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Tipo</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Precio</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Cupos</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Estado</th>
                <th className="text-right px-6 py-4 font-semibold text-surface-600 dark:text-surface-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => {
                const typeInfo = packageTypeLabels[pkg.packageType]
                const travelInfo = travelTypeLabels[pkg.travelType]
                const status = statusConfig[pkg.packageStatus]
                return (
                  <tr key={pkg.packageId} className="border-b border-surface-100 dark:border-surface-700/30 hover:bg-surface-50 dark:hover:bg-surface-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-surface-900 dark:text-white">{pkg.packageName}</p>
                        <p className="text-xs text-surface-400">{travelInfo.emoji} {travelInfo.label}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-surface-600 dark:text-surface-300">{pkg.packageDestiny}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${typeInfo.bgColor} ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-surface-900 dark:text-white">{formatCLP(pkg.packagePrice)}</td>
                    <td className="px-4 py-4 text-surface-600 dark:text-surface-300">{pkg.availableSpots}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleStatusToggle(pkg)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.bg} ${status.color} hover:opacity-80 transition-opacity`}
                      >
                        {status.label}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(pkg)}
                          className="text-xs px-3 py-1.5 rounded-lg text-primary-600 dark:text-primary-400 border border-primary-500/30 hover:bg-primary-500/10 transition-all"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.packageId)}
                          className="text-xs px-3 py-1.5 rounded-lg text-danger border border-danger/30 hover:bg-danger/10 transition-all"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {packages.length === 0 && (
          <div className="text-center py-12 text-surface-400 dark:text-surface-500">
            No hay paquetes creados
          </div>
        )}
      </div>
    </div>
  )
}
