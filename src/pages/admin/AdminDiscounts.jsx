import { useState, useEffect } from 'react'
import { discountService } from '../../api/discountService'
import { packageService } from '../../api/packageService'
import { packageTypeLabels, travelTypeLabels, seasonLabels } from '../../data/mockData'
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'

const DISCOUNT_TYPES = ['PASSENGER_COUNT', 'LOYAL_CUSTOMER', 'LIMITED_TIME_OFFER']
const PACKAGE_TYPES = ['LUXURY', 'BUDGET', 'FAMILY']
const TRAVEL_TYPES = ['CULTURAL', 'ADVENTURE', 'GASTRONOMIC', 'RURAL', 'BEACH']
const TRAVEL_SEASONS = ['SUMMER', 'WINTER', 'AUTUMN', 'SPRING']

const DISCOUNT_TYPE_LABELS = {
  PASSENGER_COUNT: 'Por Pasajeros',
  LOYAL_CUSTOMER: 'Cliente Fiel',
  LIMITED_TIME_OFFER: 'Oferta Limitada',
}

const emptyForm = {
  discountName: '',
  discountType: 'PASSENGER_COUNT',
  discountPercentage: '',
  isActive: true,
  startDate: '',
  endDate: '',
  minPassengers: '',
  applicablePackageId: '',
  applicablePackageType: '',
  applicableTravelType: '',
  applicableTravelSeason: '',
  cumulativeWithOthers: true,
  cumulativeCap: '',
}

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [discountsData, packagesData] = await Promise.all([
        discountService.getAllDiscounts(),
        packageService.getAllPackagesAdmin(),
      ])
      setDiscounts(discountsData)
      setPackages(packagesData)
    } catch {
      setError('Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => {
      const nextValue = type === 'checkbox' ? checked : value
      if (name === 'cumulativeWithOthers' && nextValue) {
        return { ...prev, cumulativeWithOthers: true, cumulativeCap: '' }
      }
      if (name === 'discountType') {
        if (nextValue === 'LIMITED_TIME_OFFER') {
          return {
            ...prev,
            discountType: nextValue,
            minPassengers: '',
          }
        }
        if (nextValue === 'PASSENGER_COUNT') {
          return {
            ...prev,
            discountType: nextValue,
            startDate: '',
            endDate: '',
            applicablePackageId: '',
            applicablePackageType: '',
            applicableTravelType: '',
            applicableTravelSeason: '',
          }
        }
        return {
          ...prev,
          discountType: nextValue,
          minPassengers: '',
          startDate: '',
          endDate: '',
          applicablePackageId: '',
          applicablePackageType: '',
          applicableTravelType: '',
          applicableTravelSeason: '',
        }
      }
      return {
        ...prev,
        [name]: nextValue,
      }
    })
  }

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowModal(true)
    setError('')
    setSuccess('')
  }

  const openEdit = (discount) => {
    setForm({
      discountName: discount.discountName || '',
      discountType: discount.discountType || 'PASSENGER_COUNT',
      discountPercentage: discount.discountPercentage || '',
      isActive: discount.isActive ?? true,
      startDate: discount.startDate || '',
      endDate: discount.endDate || '',
      minPassengers: discount.minPassengers || '',
      applicablePackageId: discount.applicablePackage?.packageId || '',
      applicablePackageType: discount.applicablePackageType || '',
      applicableTravelType: discount.applicableTravelType || '',
      applicableTravelSeason: discount.applicableTravelSeason || '',
      cumulativeWithOthers: discount.cumulativeWithOthers ?? true,
      cumulativeCap: discount.cumulativeCap || '',
    })
    setEditingId(discount.discountId)
    setShowModal(true)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      discountName: form.discountName,
      discountType: form.discountType,
      discountPercentage: parseInt(form.discountPercentage),
      isActive: form.isActive,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      minPassengers: form.minPassengers ? parseInt(form.minPassengers) : null,
      applicablePackageId: form.applicablePackageId ? parseInt(form.applicablePackageId) : null,
      applicablePackageType: form.applicablePackageType || null,
      applicableTravelType: form.applicableTravelType || null,
      applicableTravelSeason: form.applicableTravelSeason || null,
      cumulativeWithOthers: form.cumulativeWithOthers,
      cumulativeCap: form.cumulativeCap ? parseInt(form.cumulativeCap) : null,
    }

    try {
      if (editingId) {
        await discountService.updateDiscount(editingId, payload)
        setSuccess('Descuento actualizado exitosamente')
      } else {
        await discountService.createDiscount(payload)
        setSuccess('Descuento creado exitosamente')
      }
      setShowModal(false)
      loadData()
    } catch (err) {
      setError(err?.response?.data?.error || 'Error al guardar el descuento')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este descuento?')) return
    try {
      await discountService.deleteDiscount(id)
      setSuccess('Descuento eliminado')
      loadData()
    } catch {
      setError('Error al eliminar el descuento')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Descuentos</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Agregar Descuento
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
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Tipo</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Porcentaje</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Estado</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Paquete</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Fechas</th>
                <th className="text-right px-6 py-4 font-semibold text-surface-600 dark:text-surface-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map(d => (
                <tr key={d.discountId} className="border-b border-surface-100 dark:border-surface-700/30">
                  <td className="px-6 py-4 font-medium text-surface-900 dark:text-white">{d.discountName}</td>
                  <td className="px-4 py-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      {DISCOUNT_TYPE_LABELS[d.discountType] || d.discountType}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-surface-600 dark:text-surface-300 font-medium">{d.discountPercentage}%</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${d.isActive ? 'bg-success/20 text-success' : 'bg-surface-200 text-surface-500 dark:bg-surface-700 dark:text-surface-400'}`}>
                      {d.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-surface-600 dark:text-surface-300 text-xs">
                    {d.applicablePackage?.packageName || '—'}
                  </td>
                  <td className="px-4 py-4 text-surface-500 dark:text-surface-400 text-xs">
                    {d.startDate && d.endDate
                      ? `${new Date(d.startDate).toLocaleDateString('es-CL')} - ${new Date(d.endDate).toLocaleDateString('es-CL')}`
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg text-primary-500 hover:bg-primary-500/10 transition-colors" title="Editar">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(d.discountId)} className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors" title="Eliminar">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {discounts.length === 0 && <div className="text-center py-12 text-surface-400 dark:text-surface-500">No hay descuentos</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">
                {editingId ? 'Editar Descuento' : 'Agregar Descuento'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                <XMarkIcon className="w-5 h-5 text-surface-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Nombre</label>
                  <input type="text" name="discountName" value={form.discountName} onChange={handleChange} required
                    className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tipo</label>
                  <select name="discountType" value={form.discountType} onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {DISCOUNT_TYPES.map(t => <option key={t} value={t}>{DISCOUNT_TYPE_LABELS[t]}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Porcentaje (%)</label>
                  <input type="number" name="discountPercentage" value={form.discountPercentage} onChange={handleChange} required min="1" max="100"
                    className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tope Acumulativo (%)</label>
                  <input
                    type="number"
                    name="cumulativeCap"
                    value={form.cumulativeCap}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    placeholder="Ej: 25"
                    disabled={form.cumulativeWithOthers}
                    className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                    El limite real es el global configurado en el backend.
                  </p>
                </div>
              </div>

              {form.discountType === 'LIMITED_TIME_OFFER' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Fecha Inicio</label>
                      <input type="date" name="startDate" value={form.startDate} onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Fecha Fin</label>
                      <input type="date" name="endDate" value={form.endDate} onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Paquete Aplicable</label>
                    <select name="applicablePackageId" value={form.applicablePackageId} onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">— Ninguno —</option>
                      {packages.map(p => <option key={p.packageId} value={p.packageId}>{p.packageName}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tipo de paquete</label>
                      <select name="applicablePackageType" value={form.applicablePackageType} onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="">— Cualquiera —</option>
                        {PACKAGE_TYPES.map(type => (
                          <option key={type} value={type}>{packageTypeLabels[type]?.label || type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tipo de viaje</label>
                      <select name="applicableTravelType" value={form.applicableTravelType} onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="">— Cualquiera —</option>
                        {TRAVEL_TYPES.map(type => (
                          <option key={type} value={type}>{travelTypeLabels[type]?.label || type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Temporada</label>
                      <select name="applicableTravelSeason" value={form.applicableTravelSeason} onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="">— Cualquiera —</option>
                        {TRAVEL_SEASONS.map(season => (
                          <option key={season} value={season}>{seasonLabels[season]?.label || season}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {form.discountType === 'PASSENGER_COUNT' && (
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Mínimo de Pasajeros</label>
                  <input type="number" name="minPassengers" value={form.minPassengers} onChange={handleChange} min="1"
                    className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              )}

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300 cursor-pointer">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange}
                    className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
                  Activo
                </label>
                <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300 cursor-pointer">
                  <input type="checkbox" name="cumulativeWithOthers" checked={form.cumulativeWithOthers} onChange={handleChange}
                    className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
                  Acumulable con otros
                </label>
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
