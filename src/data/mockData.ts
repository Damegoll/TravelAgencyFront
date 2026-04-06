import type { Season, PackageType, TravelType, CartItem, Discount } from '../types'


export const discountRules: Discount[] = [
  {
    id: 'disc-1',
    name: 'Descuento por Múltiples Reservas',
    description: '3 o más paquetes en el carrito → 10% de descuento en todo el pedido',
    percentage: 10,
    condition: (items: CartItem[]) => {
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
      return totalQuantity >= 3
    },
  },
  {
    id: 'disc-2',
    name: 'Bono por Reserva en Volumen',
    description: '5 o más paquetes en el carrito → 5% de descuento adicional (se acumula)',
    percentage: 5,
    condition: (items: CartItem[]) => {
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
      return totalQuantity >= 5
    },
  },
  {
    id: 'disc-3',
    name: 'Oferta Familiar de Invierno',
    description: 'Cualquier paquete FAMILIAR en temporada de INVIERNO → 15% de descuento en ese paquete',
    percentage: 15,
    condition: (items: CartItem[]) => {
      return items.some(
        item => item.packageData.packageType === 'FAMILY' && item.packageData.travelSeason === 'WINTER'
      )
    },
  },
]


export const seasonLabels: Record<Season, { label: string; color: string }> = {
  SUMMER: { label: 'Verano', color: 'text-amber-500' },
  WINTER: { label: 'Invierno', color: 'text-blue-400' },
  AUTUMN: { label: 'Otoño', color: 'text-orange-500' },
  SPRING: { label: 'Primavera', color: 'text-pink-400' },
}

export const packageTypeLabels: Record<PackageType, { label: string; color: string; bgColor: string }> = {
  LUXURY: { label: 'Premium', color: 'text-amber-300', bgColor: 'bg-amber-500/20' },
  BUDGET: { label: 'Económico', color: 'text-emerald-300', bgColor: 'bg-emerald-500/20' },
  FAMILY: { label: 'Familiar', color: 'text-sky-300', bgColor: 'bg-sky-500/20' },
}

export const travelTypeLabels: Record<TravelType, { label: string; emoji: string }> = {
  CULTURAL: { label: 'Cultural', emoji: '🏛️' },
  ADVENTURE: { label: 'Aventura', emoji: '🧗' },
  GASTRONOMIC: { label: 'Gastronómico', emoji: '🍷' },
  RURAL: { label: 'Rural', emoji: '🌿' },
  BEACH: { label: 'Playa', emoji: '🏖️' },
}

export const seasonGradients: Record<Season, string> = {
  SUMMER: 'from-amber-400 via-orange-500 to-red-500',
  WINTER: 'from-blue-300 via-indigo-400 to-purple-500',
  AUTUMN: 'from-orange-400 via-red-500 to-amber-600',
  SPRING: 'from-pink-300 via-rose-400 to-fuchsia-500',
}

export const seasonDescriptions: Record<Season, string> = {
  SUMMER: 'Cualquier calor compañero',
  WINTER: 'Ta helao, abrigarse',
  AUTUMN: 'Inverno penca',
  SPRING: 'Tengo la densa alergia ayudaaaaaaa',
}


export const travelTypeGradients: Record<TravelType, string> = {
  CULTURAL: 'from-purple-400 via-indigo-500 to-blue-600',
  ADVENTURE: 'from-emerald-400 via-teal-500 to-cyan-600',
  GASTRONOMIC: 'from-amber-400 via-orange-500 to-red-600',
  RURAL: 'from-green-400 via-emerald-500 to-teal-600',
  BEACH: 'from-cyan-400 via-blue-500 to-blue-700',
}


export const travelTypeImages: Record<TravelType, string> = {
  CULTURAL: 'https://images.unsplash.com/photo-1523528283115-9bf9b1699245?w=600&h=400&fit=crop',
  ADVENTURE: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=600&h=400&fit=crop',
  GASTRONOMIC: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
  RURAL: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
  BEACH: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop',
}
