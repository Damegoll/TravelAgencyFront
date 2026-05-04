import { createContext, useContext, useReducer, useEffect, useMemo, useState } from 'react'
import { discountService } from '../api/discountService'
import { useAuth } from './AuthContext'

const GLOBAL_CUMULATIVE_DISCOUNT_CAP = 50

function parseDate(value) {
  if (!value) return null
  return new Date(`${value}T00:00:00`)
}

function isWithinRange(date, start, end) {
  if (!date) return false
  if (start && date < start) return false
  if (end && date > end) return false
  return true
}

function matchesLimitedTime(discount, pkg, now) {
  if (discount.discountType !== 'LIMITED_TIME_OFFER') return false

  const startDate = parseDate(discount.startDate)
  const endDate = parseDate(discount.endDate)
  if (!isWithinRange(now, startDate, endDate)) return false

  if (discount.applicablePackage?.packageId) {
    return discount.applicablePackage.packageId === pkg.packageId
  }

  if (discount.applicablePackageType && discount.applicablePackageType !== pkg.packageType) return false
  if (discount.applicableTravelType && discount.applicableTravelType !== pkg.travelType) return false
  if (discount.applicableTravelSeason && discount.applicableTravelSeason !== pkg.travelSeason) return false
  return true
}

function getBestDiscount(discounts, predicate) {
  return discounts
    .filter(predicate)
    .reduce((best, current) => {
      if (!best) return current
      if ((current.discountPercentage || 0) > (best.discountPercentage || 0)) return current
      return best
    }, null)
}

function getPackageDays(pkg) {
  const start = new Date(pkg.packageStartDate)
  const end = new Date(pkg.packageEndDate)
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(1, diff)
}

function computeTotals(items, discounts) {
  const now = new Date()
  const appliedMap = new Map()
  let subtotal = 0
  let totalDiscount = 0

  for (const item of items) {
    const pkg = item.packageData
    const passengerCount = item.quantity
    const days = getPackageDays(pkg)
    const basePrice = pkg.packagePrice * passengerCount
    subtotal += basePrice

    const limitedTime = getBestDiscount(discounts, (discount) => matchesLimitedTime(discount, pkg, now))
    const passengerDiscount = getBestDiscount(
      discounts,
      (discount) =>
        discount.discountType === 'PASSENGER_COUNT' &&
        discount.minPassengers != null &&
        passengerCount >= discount.minPassengers
    )

    const exclusivePercent = limitedTime ? limitedTime.discountPercentage || 0 : 0
    const allowStacking = !limitedTime || limitedTime.cumulativeWithOthers !== false
    let cumulativePercent = 0

    if (passengerDiscount && allowStacking && passengerDiscount.cumulativeWithOthers !== false) {
      cumulativePercent = passengerDiscount.discountPercentage || 0
      if (cumulativePercent > GLOBAL_CUMULATIVE_DISCOUNT_CAP) {
        cumulativePercent = GLOBAL_CUMULATIVE_DISCOUNT_CAP
      }
    }

    const totalPercent = Math.min(100, exclusivePercent + cumulativePercent)
    const discountAmount = basePrice * (totalPercent / 100)
    totalDiscount += discountAmount

    if (limitedTime && exclusivePercent > 0) {
      const amount = basePrice * (exclusivePercent / 100)
      const existing = appliedMap.get(limitedTime.discountId) || { discount: limitedTime, amount: 0 }
      existing.amount += amount
      appliedMap.set(limitedTime.discountId, existing)
    }

    if (passengerDiscount && cumulativePercent > 0) {
      const amount = basePrice * (cumulativePercent / 100)
      const existing = appliedMap.get(passengerDiscount.discountId) || { discount: passengerDiscount, amount: 0 }
      existing.amount += amount
      appliedMap.set(passengerDiscount.discountId, existing)
    }
  }

  return {
    subtotal,
    appliedDiscounts: Array.from(appliedMap.values()),
    total: Math.max(0, subtotal - totalDiscount),
  }
}

function computeState(items) {
  return {
    items,
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        item => item.packageData.packageId === action.payload.packageId
      )
      const newItems = existing
        ? state.items.map(item =>
            item.packageData.packageId === action.payload.packageId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.items, { packageData: action.payload, quantity: 1 }]
      return computeState(newItems)
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        item => item.packageData.packageId !== action.payload
      )
      return computeState(newItems)
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter(
          item => item.packageData.packageId !== action.payload.id
        )
        return computeState(newItems)
      }
      const newItems = state.items.map(item =>
        item.packageData.packageId === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      return computeState(newItems)
    }

    case 'CLEAR_CART':
      return computeState([])

    default:
      return state
  }
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem('travel-agency-cart')
      if (saved) {
        const parsed = JSON.parse(saved)
        return computeState(parsed)
      }
    } catch {
    }
    return computeState([])
  }

  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState)
  const [discounts, setDiscounts] = useState([])

  useEffect(() => {
    let isMounted = true
    if (!isAuthenticated) {
      setDiscounts([])
    } else {
      discountService
        .getActiveDiscounts()
        .then((data) => {
          if (isMounted) setDiscounts(Array.isArray(data) ? data : [])
        })
        .catch(() => {
          if (isMounted) setDiscounts([])
        })
    }
    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  useEffect(() => {
    localStorage.setItem('travel-agency-cart', JSON.stringify(state.items))
  }, [state.items])

  const totals = useMemo(() => computeTotals(state.items, discounts), [state.items, discounts])

  const value = {
    ...state,
    ...totals,
    itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
    addToCart: (pkg) => dispatch({ type: 'ADD_ITEM', payload: pkg }),
    removeFromCart: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
    updateQuantity: (id, quantity) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
