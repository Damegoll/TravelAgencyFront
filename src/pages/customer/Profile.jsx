import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../api/authService'
import { reservationService } from '../../api/reservationService'
import { ClipboardDocumentListIcon, MapPinIcon, CalendarDaysIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

const PHONE_REGEX = /^\+56\d{9}$/

export default function Profile() {
  const { user, updateUser } = useAuth()

  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [isEditingPhone, setIsEditingPhone] = useState(false)

  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setPhone(user.phone || '')
    }

    reservationService
      .getUserReservations()
      .then(setReservations)
      .catch(() => setError('Error al cargar tus reservas, puede que no tengas o el sistema este caido'))
      .finally(() => setLoading(false))
  }, [user])

  const handleEditPhone = () => {
    setIsEditingPhone(true)
    setError('')
    setSuccess('')
    setPhoneError('')
  }

  const handleCancelEdit = () => {
    setPhone(user?.phone || '')
    setIsEditingPhone(false)
    setError('')
    setPhoneError('')
  }

  const handlePhoneChange = (e) => {
    let value = e.target.value
    value = value.replace(/[^+\d\s]/g, '')
    setPhone(value)
    setPhoneError('')
  }

  const handleSavePhone = async () => {
    const cleanPhone = phone.replace(/\s/g, '')

    if (!PHONE_REGEX.test(cleanPhone)) {
      setPhoneError('Formato: +56912345678 (9 dígitos después de +56)')
      return
    }

    setError('')
    setSuccess('')
    setSaving(true)

    try {
      await authService.updateKeycloakPhone(cleanPhone)
      updateUser({ ...user, phone: cleanPhone })
      setPhone(cleanPhone)
      setSuccess('Teléfono actualizado exitosamente')
      setIsEditingPhone(false)
    } catch (err) {
      setError(err.message || 'Error al actualizar el teléfono')
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Nombre
                </label>
                <div className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400">
                  {user?.firstName || '—'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Apellido
                </label>
                <div className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400">
                  {user?.lastName || '—'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Email
                </label>
                <div className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400">
                  {user?.email || '—'}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                    Teléfono
                  </label>
                  {!isEditingPhone && (
                    <button
                      onClick={handleEditPhone}
                      className="text-primary-500 hover:text-primary-400 transition-colors"
                      title="Editar teléfono"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isEditingPhone ? (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        maxLength={15}
                        placeholder="+56912345678"
                        className={`flex-1 px-4 py-2 rounded-lg border ${phoneError ? 'border-danger' : 'border-primary-400 dark:border-primary-600'} bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        autoFocus
                      />
                      <button
                        onClick={handleSavePhone}
                        disabled={saving}
                        className="p-2 bg-success/20 text-success hover:bg-success/30 rounded-lg transition-colors disabled:opacity-50"
                        title="Guardar"
                      >
                        {saving ? (
                          <div className="w-5 h-5 border-2 border-success/30 border-t-success rounded-full animate-spin" />
                        ) : (
                          <CheckIcon className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 bg-danger/20 text-danger hover:bg-danger/30 rounded-lg transition-colors"
                        title="Cancelar"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                    {phoneError && (
                      <p className="text-xs text-danger mt-1">{phoneError}</p>
                    )}
                  </div>
                ) : (
                  <div className="w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400">
                    {user?.phone || '—'}
                  </div>
                )}
              </div>
            </div>
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
                <ClipboardDocumentListIcon className="w-12 h-12 mx-auto mb-4 text-surface-400 dark:text-surface-500" />
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
                          <MapPinIcon className="w-4 h-4 inline mr-1" />{res.reservedPackage.packageDestiny}
                        </p>
                        <p className="text-sm text-surface-600 dark:text-surface-300 mt-2">
                          <CalendarDaysIcon className="w-4 h-4 inline mr-1" />{new Date(res.reservedCheckIn).toLocaleDateString('es-CL')} - {new Date(res.reservedCheckOut).toLocaleDateString('es-CL')}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <span className={`inline-block text-xs px-3 py-1.5 rounded-full font-medium mb-2 ${res.status === 'CONFIRMED' ? 'bg-success/20 text-success' :
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
