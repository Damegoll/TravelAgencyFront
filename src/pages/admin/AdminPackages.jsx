import { useState, useEffect } from 'react'
import { packageService } from '../../api/packageService'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'

const TRAVEL_TYPES = ['CULTURAL', 'ADVENTURE', 'GASTRONOMIC', 'RURAL', 'BEACH']
const TRAVEL_SEASONS = ['SUMMER', 'WINTER', 'AUTUMN', 'SPRING']
const PACKAGE_TYPES = ['LUXURY', 'BUDGET', 'FAMILY']
const PACKAGE_STATUSES = ['ACTIVE', 'ARCHIVED', 'SOLD_OUT']

const emptyForm = {
  packageName: '',
  packageDestiny: '',
  packageDescription: '',
  travelType: 'CULTURAL',
  travelSeason: 'SUMMER',
  packageType: 'BUDGET',
  packageStartDate: '',
  packageEndDate: '',
  packagePrice: '',
  availableSpots: '',
}

export default function AdminPackages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = () => {
    setLoading(true)
    packageService
      .getAllPackagesAdmin()
      .then(setPackages)
      .catch(() => setError('Error cargando paquetes'))
      .finally(() => setLoading(false))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowModal(true)
    setError('')
    setSuccess('')
  }

  const openEdit = (pkg) => {
    setForm({
      packageName: pkg.packageName || '',
      packageDestiny: pkg.packageDestiny || '',
      packageDescription: pkg.packageDescription || '',
      travelType: pkg.travelType || 'CULTURAL',
      travelSeason: pkg.travelSeason || 'SUMMER',
      packageType: pkg.packageType || 'BUDGET',
      packageStartDate: pkg.packageStartDate || '',
      packageEndDate: pkg.packageEndDate || '',
      packagePrice: pkg.packagePrice || '',
      availableSpots: pkg.availableSpots || '',
    })
    setEditingId(pkg.packageId)
    setShowModal(true)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      packagePrice: parseInt(form.packagePrice),
      availableSpots: parseInt(form.availableSpots),
    }

    try {
      if (editingId) {
        await packageService.updatePackage(editingId, payload)
        setSuccess('Paquete actualizado exitosamente')
      } else {
        await packageService.createPackage(payload)
        setSuccess('Paquete creado exitosamente')
      }
      setShowModal(false)
      loadPackages()
    } catch (err) {
      console.error('Package save error:', err.response?.data || err.message)
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Error al guardar el paquete'
      setError(errorMsg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este paquete?')) return
    try {
      await packageService.deletePackage(id)
      setSuccess('Paquete eliminado')
      loadPackages()
    } catch {
      setError('Error al eliminar el paquete')
    }
  }

  const handleStatusChange = async (pkg, newStatus) => {
    try {
      await packageService.updatePackageStatus(pkg.packageId, newStatus)
      loadPackages()
    } catch {
      setError('Error al cambiar estado')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Paquetes</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Agregar Paquete
        </button>
      </div>

      {error && <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6">{error}</div>}
      {success && <div className="bg-success/10 border border-success/30 text-success text-sm rounded-xl px-4 py-3 mb-6">{success}</div>}

      <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200/50 dark:border-surface-700/50">
                <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-400">Nombre</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Destino</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Precio</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Temporada</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Tipo</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Cupos</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Estado</th>
                <th className="text-right px-6 py-4 font-semibold text-surface-600 dark:text-surface-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.packageId} className="border-b border-surface-100 dark:border-surface-700/30">
                  <td className="px-6 py-4 font-medium text-surface-900 dark:text-white">{pkg.packageName}</td>
                  <td className="px-4 py-4 text-surface-600 dark:text-surface-300">{pkg.packageDestiny}</td>
                  <td className="px-4 py-4 text-surface-600 dark:text-surface-300">${pkg.packagePrice?.toLocaleString('es-CL')}</td>
                  <td className="px-4 py-4"><span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">{pkg.travelSeason}</span></td>
                  <td className="px-4 py-4"><span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">{pkg.packageType}</span></td>
                  <td className="px-4 py-4 text-surface-600 dark:text-surface-300">{pkg.availableSpots}</td>
                  <td className="px-4 py-4">
                    <select
                      value={pkg.packageStatus}
                      onChange={(e) => handleStatusChange(pkg, e.target.value)}
                      className="text-xs px-2 py-1 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-700 dark:text-surface-300 cursor-pointer"
                    >
                      {PACKAGE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(pkg)} className="p-1.5 rounded-lg text-primary-500 hover:bg-primary-500/10 transition-colors" title="Editar">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(pkg.packageId)} className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors" title="Eliminar">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {packages.length === 0 && <div className="text-center py-12 text-surface-400 dark:text-surface-500">No hay paquetes</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">
                {editingId ? 'Editar Paquete' : 'Agregar Paquete'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                <XMarkIcon className="w-5 h-5 text-surface-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Nombre</label>
                  <input type="text" name="packageName" value={form.packageName} onChange={handleChange} required
                    className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Destino</label>
                  <input type="text" name="packageDestiny" value={form.packageDestiny} onChange={handleChange} required
                    className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Descripción</label>
                <textarea name="packageDescription" value={form.packageDescription} onChange={handleChange} rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tipo de Viaje</label>
                  <select name="travelType" value={form.travelType} onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {TRAVEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Temporada</label>
                  <select name="travelSeason" value={form.travelSeason} onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {TRAVEL_SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tipo de Paquete</label>
                  <select name="packageType" value={form.packageType} onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {PACKAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Fecha Inicio</label>
                  <input type="date" name="packageStartDate" value={form.packageStartDate} onChange={handleChange} required
                    className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Fecha Fin</label>
                  <input type="date" name="packageEndDate" value={form.packageEndDate} onChange={handleChange} required
                    className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Precio (CLP)</label>
                  <input type="number" name="packagePrice" value={form.packagePrice} onChange={handleChange} required min="0"
                    className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Cupos Disponibles</label>
                  <input type="number" name="availableSpots" value={form.availableSpots} onChange={handleChange} required min="0"
                    className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-medium rounded-xl transition-colors">
                  {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
