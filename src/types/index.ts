export interface Place {
  id: string
  name: string
  location: string
}

export interface Booking {
  id: string
  userId: string
  placeId: string
  startDate: string
  endDate: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
}

export interface User {
  id: string
  email: string
  name: string
  role: 'CUSTOMER' | 'ADMIN'
}

export interface ApiResponse<T> {
  data: T
  message: string
  timestamp: string
}
