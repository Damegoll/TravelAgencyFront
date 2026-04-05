import type { TravelPackage } from '../types'
import { useCart } from '../context/CartContext'
import { packageGradients, seasonLabels, packageTypeLabels } from '../data/mockData'
import { formatCLP } from '../utils/format'
import { useState } from 'react'

interface PackageCardProps {
  pkg: TravelPackage
  compact?: boolean
}

export default function PackageCard({ pkg, compact = false }: PackageCardProps) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const typeInfo = packageTypeLabels[pkg.type]
  const gradient = packageGradients[pkg.id] || 'from-gray-400 to-gray-600'

  const handleAddToCart = () => {
    addToCart(pkg)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="group relative bg-white dark:bg-surface-800/80 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-surface-200/50 dark:border-surface-700/50">
      <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
        <img
          src={pkg.imageUrl}
          alt={pkg.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${typeInfo.bgColor} ${typeInfo.color} backdrop-blur-sm`}>
          {typeInfo.label}
        </span>

        <div className="absolute top-3 right-3 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < pkg.rating ? 'text-amber-400' : 'text-white/30'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm font-medium">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {pkg.location}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {pkg.name}
        </h3>

        {!compact && (
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-3 line-clamp-2">
            {pkg.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {pkg.seasons.map(season => {
            const info = seasonLabels[season]
            return (
              <span
                key={season}
                className="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300"
              >
              </span>
            )
          })}
        </div>

        <p className="text-xs text-surface-400 dark:text-surface-500 mb-4">
          {pkg.duration}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-surface-900 dark:text-white">
              {formatCLP(pkg.price)}
            </span>
            <span className="text-sm text-surface-400 dark:text-surface-500 ml-1">
              / persona
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${added
                ? 'bg-success text-white scale-95'
                : 'bg-primary-600 hover:bg-primary-500 text-white hover:shadow-primary hover:-translate-y-0.5 active:translate-y-0'
              }`}
          >
            {added ? '✓ Añadido' : 'Añadir al Carrito'}
          </button>
        </div>
      </div>
    </div>
  )
}
