import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { reservationService } from '../../api/reservationService'
import { formatCLP } from '../../utils/format'
import { CreditCardIcon } from '@heroicons/react/24/outline'
import Receipt from './Receipt'

function normalizeCardNumber(value) {
  return value.replace(/\s+/g, '')
}

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function formatCvv(value) {
  return value.replace(/\D/g, '').slice(0, 3)
}

function isValidCardNumber(value) {
  const digits = normalizeCardNumber(value)
  return /^\d{16}$/.test(digits)
}

function isFutureMonth(value) {
  if (!value) return false
  const [monthPart, yearPart] = value.split('/')
  if (!monthPart || !yearPart || monthPart.length !== 2 || yearPart.length !== 2) return false

  const month = Number(monthPart)
  const year = Number(`20${yearPart}`)
  if (!year || !month || month < 1 || month > 12) return false

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  if (year > currentYear) return true
  if (year === currentYear && month >= currentMonth) return true
  return false
}

function normalizeDateTime(value) {
  if (!value) return value
  if (value.includes('T')) return value
  return `${value}T00:00:00`
}

export default function Payment() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (items.length === 0) {
      setError('Tu carrito esta vacio. Agrega un paquete antes de pagar.')
      return
    }

    if (!isValidCardNumber(cardNumber)) {
      setError('Numero de tarjeta invalido. Usa una tarjeta valida de 16 digitos.')
      return
    }

    if (!isFutureMonth(expiry)) {
      setError('Fecha de expiracion invalida.')
      return
    }

    if (!/^\d{3}$/.test(cvv)) {
      setError('CVV invalido.')
      return
    }

    setProcessing(true)

    try {
      const createdReservations = []
      for (const item of items) {
        const reservation = await reservationService.createReservation({
          packageId: item.packageData.packageId,
          reservedCheckIn: normalizeDateTime(item.packageData.packageStartDate),
          reservedCheckOut: normalizeDateTime(item.packageData.packageEndDate),
          passengerCount: item.quantity,
        })
        createdReservations.push(reservation)
      }

      clearCart()
      setSuccess(createdReservations)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Error al crear la reserva. Intenta de nuevo.'
      )
    } finally {
      setProcessing(false)
    }
  }

  if (success) {
    return <Receipt reservations={success} total={total} />
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center animate-fade-in">
        <CreditCardIcon className="w-16 h-16 mx-auto mb-6 text-surface-400 dark:text-surface-500" />
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-3">Tu carrito esta vacio</h1>
        <p className="text-surface-500 dark:text-surface-400 mb-8 max-w-md mx-auto">
          Agrega un paquete antes de continuar con el pago.
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
    <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Pago</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-2">
            Completa el pago simulado para confirmar tu reserva.
          </p>
        </div>
        <button
          onClick={() => navigate('/cart')}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          Volver al carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <CreditCardIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-surface-900 dark:text-white">Datos de la tarjeta</h2>
              <p className="text-sm text-surface-500 dark:text-surface-400">Por favor, ingrese los datos correctamente.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Numero de tarjeta</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Vencimiento</label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/AA"
                value={expiry}
                onChange={(event) => setExpiry(formatExpiry(event.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">CVV</label>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                value={cvv}
                onChange={(event) => setCvv(formatCvv(event.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-primary hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Procesando...' : 'Pagar y confirmar reserva'}
          </button>
        </form>

        <aside className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 p-6 h-fit space-y-4">
          <div className="border-t border-surface-200/50 dark:border-surface-700/50 pt-4">
            <p className="text-sm text-surface-500 dark:text-surface-400">Total a pagar</p>
            <p className="text-3xl font-bold text-surface-900 dark:text-white">{formatCLP(total)}</p>
          </div>
          <div className="text-xs text-surface-400 dark:text-surface-500">
            Recibiras la confirmacion inmediatamente despues del pago.
          </div>
        </aside>
      </div>
    </div>
  )
}