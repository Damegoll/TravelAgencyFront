import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { reservationService } from '../../api/reservationService'
import { packageTypeLabels, travelTypeGradients, travelTypeImages, discountRules } from '../../data/mockData'
import { formatCLP } from '../../utils/format'

export default function Cart() {
  const { items, subtotal, appliedDiscounts, total, removeFromCart, updateQuantity, clearCart, itemCount } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [checkingOut, setCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setCheckingOut(true)
    setCheckoutError('')

    try {
      for (const item of items) {
        for (let i = 0; i < item.quantity; i++) {
          await reservationService.createReservation({
            packageId: item.packageData.packageId,
            reservedCheckIn: item.packageData.packageStartDate,
            reservedCheckOut: item.packageData.packageEndDate,
          })
        }
      }
      setCheckoutSuccess(true)
      clearCart()
    } catch (err) {
      setCheckoutError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Error al procesar la reserva. Intenta de nuevo.'
      )
    } finally {
      setCheckingOut(false)
    }
  }

  if (checkoutSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center animate-fade-in">
        <p className="text-6xl mb-6">🎉</p>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-3">¡Reserva confirmada!</h1>
        <p className="text-surface-500 dark:text-surface-400 mb-8 max-w-md mx-auto">
          Tus paquetes han sido reservados exitosamente. Puedes ver tus reservas en tu perfil.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/my-reservations"
            className="inline-flex px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-primary hover:-translate-y-0.5"
          >
            Ver mis reservas
          </Link>
          <Link
            to="/search"
            className="inline-flex px-8 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 font-semibold rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200"
          >
            Seguir explorando
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center animate-fade-in">
        <p className="text-6xl mb-6">🛒</p>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-3">Tu carrito está vacío</h1>
        <p className="text-surface-500 dark:text-surface-400 mb-8 max-w-md mx-auto">
          Parece que no has agregado ningún paquete de viaje todavía. ¡Empieza a explorar y encuentra tu escapada perfecta!
        </p>
        <Link
          to="/search"
          className="inline-flex px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-primary hover:-translate-y-0.5"
        >
          Explorar paquetes
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
          Tu carrito
          <span className="text-lg font-normal text-surface-400 ml-2">({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-danger hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow space-y-4">
          {items.map(({ packageData: pkg, quantity }) => {
            const typeInfo = packageTypeLabels[pkg.packageType]
            const gradient = travelTypeGradients[pkg.travelType] || 'from-gray-400 to-gray-600'
            const imageUrl = travelTypeImages[pkg.travelType]

            return (
              <div
                key={pkg.packageId}
                className="flex flex-col sm:flex-row bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className={`sm:w-48 h-32 sm:h-auto bg-gradient-to-br ${gradient} flex-shrink-0 relative`}>
                  <img
                    src={imageUrl}
                    alt={pkg.packageName}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>

                <div className="flex-grow p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-surface-900 dark:text-white">{pkg.packageName}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${typeInfo.bgColor} ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">
                      {pkg.packageDestiny} · {new Date(pkg.packageStartDate).toLocaleDateString('es-CL')} → {new Date(pkg.packageEndDate).toLocaleDateString('es-CL')}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(pkg.packageId, quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors text-lg font-bold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold text-surface-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(pkg.packageId, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors text-lg font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-surface-900 dark:text-white text-lg">
                        {formatCLP(pkg.packagePrice * quantity)}
                      </p>
                      {quantity > 1 && (
                        <p className="text-xs text-surface-400">{formatCLP(pkg.packagePrice)} c/u</p>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(pkg.packageId)}
                      className="p-2 text-surface-400 hover:text-danger transition-colors"
                      aria-label={`Remove ${pkg.packageName}`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <aside className="lg:w-80 flex-shrink-0">
          <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 p-6 sticky top-24 space-y-5">
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">
              Resumen del pedido
            </h2>

            <div className="flex justify-between text-surface-600 dark:text-surface-400">
              <span>Subtotal</span>
              <span>{formatCLP(subtotal)}</span>
            </div>

            {appliedDiscounts.length > 0 && (
              <div className="space-y-2 border-t border-surface-200/50 dark:border-surface-700/50 pt-4">
                {appliedDiscounts.map(({ discount, amount }) => (
                  <div key={discount.id} className="flex justify-between text-sm">
                    <span className="text-success flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-success rounded-full" />
                      {discount.name} ({discount.percentage}%)
                    </span>
                    <span className="text-success font-medium">-{formatCLP(amount)}</span>
                  </div>
                ))}
              </div>
            )}

            {discountRules.filter(rule => !rule.condition(items)).length > 0 && (
              <div className="space-y-2 border-t border-surface-200/50 dark:border-surface-700/50 pt-4">
                <p className="text-xs font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                  Descuentos disponibles
                </p>
                {discountRules
                  .filter(rule => !rule.condition(items))
                  .map(rule => (
                    <div key={rule.id} className="flex items-start gap-2 text-xs text-surface-400 dark:text-surface-500">
                      <span className="inline-block w-2 h-2 mt-1 bg-surface-300 dark:bg-surface-600 rounded-full flex-shrink-0" />
                      <span>{rule.description}</span>
                    </div>
                  ))}
              </div>
            )}

            <div className="border-t border-surface-200/50 dark:border-surface-700/50 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-surface-900 dark:text-white">Total</span>
                <span className="text-2xl font-bold text-surface-900 dark:text-white">
                  {formatCLP(total)}
                </span>
              </div>
              {appliedDiscounts.length > 0 && (
                <p className="text-xs text-success mt-1 text-right">
                  ¡Estás ahorrando {formatCLP(subtotal - total)}!
                </p>
              )}
            </div>

            {checkoutError && (
              <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3">
                {checkoutError}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-primary hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingOut
                ? 'Procesando...'
                : isAuthenticated
                ? 'Proceder al pago'
                : 'Inicia sesión para reservar'}
            </button>

            <Link
              to="/search"
              className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              ← Seguir comprando
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
