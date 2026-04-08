
export type Season = 'SUMMER' | 'WINTER' | 'AUTUMN' | 'SPRING'

export type PackageType = 'LUXURY' | 'BUDGET' | 'FAMILY'

export type TravelType = 'CULTURAL' | 'ADVENTURE' | 'GASTRONOMIC' | 'RURAL' | 'BEACH'

export type PackageStatus = 'ACTIVE' | 'ARCHIVED' | 'SOLD_OUT'

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export type AccountStatus = 'ACTIVE' | 'DISABLED'


export interface TravelPackage {
  packageId: string
  packageName: string
  packageDestiny: string
  packageDescription: string
  travelType: TravelType
  travelSeason: Season
  packageType: PackageType
  packageStartDate: string
  packageEndDate: string
  packagePrice: number
  availableSpots: number
  packageStatus: PackageStatus
}

export interface User {
  accountId: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  phone?: string
  emailVerified: boolean
}

export interface Account {
  id: string
  firstName: string
  lastName: string
  email: string
  roles: string[]
  status: AccountStatus
}

export interface Reservation {
  reserveId: string
  accountId: string
  reservedPackage: TravelPackage
  reservedDate: string
  reservedCheckIn: string
  reservedCheckOut: string
  status: ReservationStatus
  totalPriceCLP: number
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

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface CreateReservationData {
  packageId: string
  reservedCheckIn: string
  reservedCheckOut: string
}
