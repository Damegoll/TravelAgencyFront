import { useCart } from '../context/CartContext'
import { seasonLabels, packageTypeLabels, travelTypeLabels, travelTypeGradients, travelTypeImages } from '../data/mockData'
import { formatCLP } from '../utils/format'
import { useState } from 'react'
import { BuildingLibraryIcon, BoltIcon, FireIcon, GlobeAltIcon, SunIcon } from '@heroicons/react/24/outline'

const travelTypeIcons = {
  CULTURAL: BuildingLibraryIcon,
  ADVENTURE: BoltIcon,
  GASTRONOMIC: FireIcon,
  RURAL: GlobeAltIcon,
  BEACH: SunIcon,
}

export default function PackageCard({ pkg, compact = false }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const typeInfo = packageTypeLabels[pkg.packageType]
  const seasonInfo = seasonLabels[pkg.travelSeason]
  const travelInfo = travelTypeLabels[pkg.travelType]
  const gradient = travelTypeGradients[pkg.travelType] || 'from-gray-400 to-gray-600'
  const imageUrl = travelTypeImages[pkg.travelType]

  const isSoldOut = pkg.packageStatus === 'SOLD_OUT'
  const isArchived = pkg.packageStatus === 'ARCHIVED'
  const isUnavailable = isSoldOut || isArchived

  // Calculate duration from dates
  const startDate = new Date(pkg.packageStartDate)
  const endDate = new Date(pkg.packageEndDate)
  const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  const nights = Math.max(0, days - 1)
  const durationLabel = `${days} día${days > 1 ? 's' : ''} / ${nights} noche${nights !== 1 ? 's' : ''}`

  const handleAddToCart = () => {
    if (isUnavailable) return
    addToCart(pkg)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className={`group relative bg-white dark:bg-surface-800/80 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-surface-200/50 dark:border-surface-700/50 ${isUnavailable ? 'opacity-70' : ''}`}>
      <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
        <img
          src={imageUrl}
          alt={pkg.packageName}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onLoad={(e) => { e.target.style.opacity = '1' }}
          onError={(e) => { e.target.style.display = 'none' }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeInfo.bgColor} ${typeInfo.color} backdrop-blur-sm`}>
            {typeInfo.label}
          </span>
          {isSoldOut && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 backdrop-blur-sm">
              Agotado
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs bg-black/30 text-white backdrop-blur-sm flex items-center gap-1">
          {(() => { const TIcon = travelTypeIcons[pkg.travelType]; return TIcon ? <TIcon className="w-3.5 h-3.5" /> : null })()}
          {travelInfo.label}
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm font-medium">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {pkg.packageDestiny}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {pkg.packageName}
        </h3>

        {!compact && (
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-3 line-clamp-2">
            {pkg.packageDescription}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300">
            {seasonInfo.label}
          </span>
          {pkg.availableSpots > 0 && pkg.availableSpots <= 5 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
              ¡Solo {pkg.availableSpots} cupo{pkg.availableSpots > 1 ? 's' : ''}!
            </span>
          )}
        </div>

        <p className="text-xs text-surface-400 dark:text-surface-500 mb-4">
          {durationLabel} · {new Date(pkg.packageStartDate).toLocaleDateString('es-CL')} → {new Date(pkg.packageEndDate).toLocaleDateString('es-CL')}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-surface-900 dark:text-white">
              {formatCLP(pkg.packagePrice)}
            </span>
            <span className="text-sm text-surface-400 dark:text-surface-500 ml-1">
              / persona
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isUnavailable}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${isUnavailable
                ? 'bg-surface-300 dark:bg-surface-600 text-surface-500 dark:text-surface-400 cursor-not-allowed'
                : added
                ? 'bg-success text-white scale-95'
                : 'bg-primary-600 hover:bg-primary-500 text-white hover:shadow-primary hover:-translate-y-0.5 active:translate-y-0'
              }`}
          >
            {isUnavailable ? 'No disponible' : added ? '✓ Añadido' : 'Añadir al Carrito'}
          </button>
        </div>
      </div>
    </div>
  )
}
