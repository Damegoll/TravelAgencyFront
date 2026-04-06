import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface ValidationRule {
  label: string
  test: (value: string) => boolean
}

const passwordRules: ValidationRule[] = [
  { label: 'Al menos 8 caracteres', test: (v) => v.length >= 8 },
  { label: 'Una mayúscula', test: (v) => /[A-Z]/.test(v) },
  { label: 'Una minúscula', test: (v) => /[a-z]/.test(v) },
  { label: 'Un número', test: (v) => /[0-9]/.test(v) },
  { label: 'Un caracter especial (!@#$%^&*)', test: (v) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v) },
]

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const touch = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const validation = useMemo(() => {
    return {
      firstName: form.firstName.trim().length >= 2,
      lastName: form.lastName.trim().length >= 2,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
      password: passwordRules.every(rule => rule.test(form.password)),
      confirmPassword: form.password.length > 0 && form.password === form.confirmPassword,
    }
  }, [form])

  const allValid = Object.values(validation).every(Boolean)

  const fieldClass = (field: keyof typeof validation) => {
    if (!touched[field]) return ''
    return validation[field] ? 'input-valid' : 'input-error'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    })

    if (!allValid) {
      setError('Por favor, arregla los errores mencionados')
      return
    }

    setError('')
    setLoading(true)

    const result = await register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
    })

    if (result.success) {
      navigate('/login')
    } else {
      setError(result.error || 'Registro fallido')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-surface-50 via-primary-50/30 to-surface-100 dark:from-surface-950 dark:via-primary-950/30 dark:to-surface-900">
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-gradient">
            TravelAgency
          </Link>
          <p className="text-surface-500 dark:text-surface-400 mt-2">
            Crea tu cuenta
          </p>
        </div>

        <div className="bg-white dark:bg-surface-800/80 rounded-2xl shadow-xl border border-surface-200/50 dark:border-surface-700/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 animate-slide-down">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-first" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  Nombre
                </label>
                <div className="relative">
                  <input
                    id="reg-first"
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    onBlur={() => touch('firstName')}
                    placeholder="John"
                    className={`w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all ${fieldClass('firstName')}`}
                  />
                  {touched.firstName && validation.firstName && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-success text-lg">✓</span>
                  )}
                </div>
                {touched.firstName && !validation.firstName && (
                  <p className="text-xs text-danger mt-1">Mínimo 2 caracteres</p>
                )}
              </div>

              <div>
                <label htmlFor="reg-last" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  Apellido
                </label>
                <div className="relative">
                  <input
                    id="reg-last"
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                    onBlur={() => touch('lastName')}
                    placeholder="Registros"
                    className={`w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all ${fieldClass('lastName')}`}
                  />
                  {touched.lastName && validation.lastName && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-success text-lg">✓</span>
                  )}
                </div>
                {touched.lastName && !validation.lastName && (
                  <p className="text-xs text-danger mt-1">Mínimo 2 caracteres</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  onBlur={() => touch('email')}
                  placeholder="supercorreo@ejemplo.com"
                  className={`w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all ${fieldClass('email')}`}
                />
                {touched.email && validation.email && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-success text-lg">✓</span>
                )}
              </div>
              {touched.email && !validation.email && (
                <p className="text-xs text-danger mt-1">Ingresa un correo válido</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  onBlur={() => touch('password')}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-20 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all ${fieldClass('password')}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                  {touched.password && validation.password && (
                    <span className="text-success text-lg">✓</span>
                  )}
                </div>
              </div>

              {(touched.password || form.password.length > 0) && !validation.password && (
                <ul className="mt-2 space-y-1">
                  {passwordRules.map((rule, i) => {
                    const passes = rule.test(form.password)
                    return (
                      <li
                        key={i}
                        className={`flex items-center gap-2 text-xs transition-colors ${passes ? 'text-success' : 'text-surface-400 dark:text-surface-500'
                          }`}
                      >
                        <span>{passes ? '✓' : '○'}</span>
                        {rule.label}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  onBlur={() => touch('confirmPassword')}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-20 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all ${fieldClass('confirmPassword')}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowConfirm(prev => !prev)}
                    className="p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                    tabIndex={-1}
                    aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showConfirm ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                  {touched.confirmPassword && validation.confirmPassword && (
                    <span className="text-success text-lg">✓</span>
                  )}
                </div>
              </div>
              {touched.confirmPassword && !validation.confirmPassword && form.confirmPassword.length > 0 && (
                <p className="text-xs text-danger mt-1">Las contraseñas no coinciden</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
