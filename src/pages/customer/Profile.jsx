import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { accountService } from '../../api/accountService'
import { reservationService } from '../../api/reservationService'

export default function Profile() {
  const { user, updateUser } = useAuth()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  })
  
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      })
    }
    
    reservationService
      .getUserReservations()
      .then(setReservations)
      .catch(() => setError('Error al cargar tus reservas'))
      .finally(() => setLoading(false))
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const updated = await accountService.updateAccount(user.accountId, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      })
      updateUser(updated)
      setSuccess('Perfil actualizado exitosamente')
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || 'Error al actualizar el perfil'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-8">Mi Perfil</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 p-6">
            <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6">Información Personal</h2>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-success/10 border border-success/30 text-success text-sm rounded-xl px-4 py-3 mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400 focus:outline-none cursor-not-allowed"
                />
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">No se puede cambiar el email</p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full mt-6 px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-600/50 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 p-6">
            <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6">Mis Reservas</h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
              </div>
            ) : reservations.length === 0 ? (
              <div className="text-center py-12 bg-surface-50 dark:bg-surface-700/30 rounded-xl border border-surface-200 dark:border-surface-600">
                <p className="text-5xl mb-4">📋</p>
                <p className="text-surface-500 dark:text-surface-400">No tienes reservas aún</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map(res => (
                  <div key={res.reserveId} className="border border-surface-200 dark:border-surface-700 rounded-xl p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-surface-900 dark:text-white">
                          {res.reservedPackage.packageName}
                        </h3>
                        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                          📍 {res.reservedPackage.packageDestiny}
                        </p>
                        <p className="text-sm text-surface-600 dark:text-surface-300 mt-2">
                          🗓️ {new Date(res.reservedCheckIn).toLocaleDateString('es-CL')} - {new Date(res.reservedCheckOut).toLocaleDateString('es-CL')}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <span className={`inline-block text-xs px-3 py-1.5 rounded-full font-medium mb-2 ${
                          res.status === 'CONFIRMED' ? 'bg-success/20 text-success' : 
                          res.status === 'PENDING' ? 'bg-warning/20 text-warning' :
                          'bg-danger/20 text-danger'
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
        </div>
      </div>
    </div>
  )
}
