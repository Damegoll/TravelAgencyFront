export type Season = 'SUMMER' | 'WINTER' | 'AUTUMN' | 'SPRING'

export type PackageType = 'EXPENSIVE' | 'BUDGET' | 'FAMILY'

export interface TravelPackage {
  id: string
  name: string
  description: string
  location: string
  price: number
  type: PackageType
  seasons: Season[]
  imageUrl: string
  rating: number
  duration: string
  highlights: string[]
}

export interface CartItem {
  packageData: TravelPackage
  quantity: number
}

export interface Discount {
  id: string
  name: string
  description: string
  percentage: number
  condition: (items: CartItem[]) => boolean
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  appliedDiscounts: { discount: Discount; amount: number }[]
  total: number
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'CUSTOMER' | 'ADMIN'
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  timestamp: string
}

export interface Booking {
  id: string
  userId: string
  items: { packageId: string; quantity: number }[]
  totalPaid: number
  discountsApplied: string[]
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  createdAt: string
}
