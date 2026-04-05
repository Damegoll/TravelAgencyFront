import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { CartItem, CartState, Discount, TravelPackage } from '../types'
import { discountRules } from '../data/mockData'

type CartAction =
  | { type: 'ADD_ITEM'; payload: TravelPackage }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }

function calculateDiscounts(items: CartItem[]): { discount: Discount; amount: number }[] {
  if (items.length === 0) return []

  const subtotal = items.reduce(
    (sum, item) => sum + item.packageData.price * item.quantity,
    0
  )

  const applied: { discount: Discount; amount: number }[] = []

  for (const rule of discountRules) {
    if (rule.condition(items)) {
      if (rule.id === 'disc-3') {
        const familyWinterTotal = items
          .filter(item => item.packageData.type === 'FAMILY' && item.packageData.seasons.includes('WINTER'))
          .reduce((sum, item) => sum + item.packageData.price * item.quantity, 0)
        applied.push({ discount: rule, amount: familyWinterTotal * (rule.percentage / 100) })
      } else {
        applied.push({ discount: rule, amount: subtotal * (rule.percentage / 100) })
      }
    }
  }

  return applied
}

function computeState(items: CartItem[]): CartState {
  const subtotal = items.reduce(
    (sum, item) => sum + item.packageData.price * item.quantity,
    0
  )
  const appliedDiscounts = calculateDiscounts(items)
  const totalDiscount = appliedDiscounts.reduce((sum, d) => sum + d.amount, 0)

  return {
    items,
    subtotal,
    appliedDiscounts,
    total: Math.max(0, subtotal - totalDiscount),
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        item => item.packageData.id === action.payload.id
      )
      const newItems = existing
        ? state.items.map(item =>
            item.packageData.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state.items, { packageData: action.payload, quantity: 1 }]
      return computeState(newItems)
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        item => item.packageData.id !== action.payload
      )
      return computeState(newItems)
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter(
          item => item.packageData.id !== action.payload.id
        )
        return computeState(newItems)
      }
      const newItems = state.items.map(item =>
        item.packageData.id === action.payload.id
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

interface CartContextValue extends CartState {
  addToCart: (pkg: TravelPackage) => void
  removeFromCart: (packageId: string) => void
  updateQuantity: (packageId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const loadInitialState = (): CartState => {
    try {
      const saved = localStorage.getItem('travel-agency-cart')
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[]
        return computeState(parsed)
      }
    } catch {
    }
    return computeState([])
  }

  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState)

  useEffect(() => {
    localStorage.setItem('travel-agency-cart', JSON.stringify(state.items))
  }, [state.items])

  const value: CartContextValue = {
    ...state,
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
