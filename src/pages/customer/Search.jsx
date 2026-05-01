import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PackageCard from '../../components/PackageCard'
import { seasonLabels, packageTypeLabels, travelTypeLabels } from '../../data/mockData'
import { packageService } from '../../api/packageService'
import { formatCLP } from '../../utils/format'
import { MagnifyingGlassIcon, ExclamationTriangleIcon, BuildingLibraryIcon, BoltIcon, FireIcon, GlobeAltIcon, SunIcon } from '@heroicons/react/24/outline'

const travelTypeIcons = {
  CULTURAL: BuildingLibraryIcon,
  ADVENTURE: BoltIcon,
  GASTRONOMIC: FireIcon,
  RURAL: GlobeAltIcon,
  BEACH: SunIcon,
}

const allSeasons = ['SUMMER', 'WINTER', 'AUTUMN', 'SPRING']
const allTypes = ['LUXURY', 'BUDGET', 'FAMILY']
const allTravelTypes = ['CULTURAL', 'ADVENTURE', 'GASTRONOMIC', 'RURAL', 'BEACH']

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchText, setSearchText] = useState('')
  const [selectedSeasons, setSelectedSeasons] = useState(() => {
    const param = searchParams.get('season')
    return param ? [param] : []
  })
  const [selectedTypes, setSelectedTypes] = useState(() => {
    const param = searchParams.get('type')
    return param ? [param] : []
  })
  const [selectedTravelTypes, setSelectedTravelTypes] = useState([])
  const [priceRange, setPriceRange] = useState([0, 100000000])
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    packageService
      .getAllPackages()
      .then(setPackages)
      .catch(() => setError('No se pudieron cargar los paquetes'))
      .finally(() => setLoading(false))
  }, [])

  const toggleSeason = (season) => {
    setSelectedSeasons(prev =>
      prev.includes(season) ? prev.filter(s => s !== season) : [...prev, season]
    )
  }

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const toggleTravelType = (type) => {
    setSelectedTravelTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const clearFilters = () => {
    setSearchText('')
    setSelectedSeasons([])
    setSelectedTypes([])
    setSelectedTravelTypes([])
    setPriceRange([0, 10000000])
    setSortBy('date')
    setSearchParams({})
  }

  const filteredPackages = useMemo(() => {
    let results = [...packages]

    if (searchText) {
      const query = searchText.toLowerCase()
      results = results.filter(
        pkg =>
          pkg.packageName.toLowerCase().includes(query) ||
          pkg.packageDestiny.toLowerCase().includes(query) ||
          pkg.packageDescription.toLowerCase().includes(query)
      )
    }

    if (selectedSeasons.length > 0) {
      results = results.filter(pkg => selectedSeasons.includes(pkg.travelSeason))
    }

    if (selectedTypes.length > 0) {
      results = results.filter(pkg => selectedTypes.includes(pkg.packageType))
    }

    if (selectedTravelTypes.length > 0) {
      results = results.filter(pkg => selectedTravelTypes.includes(pkg.travelType))
    }

    results = results.filter(
      pkg => pkg.packagePrice >= priceRange[0] && pkg.packagePrice <= priceRange[1]
    )

    switch (sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.packagePrice - b.packagePrice)
        break
      case 'price-desc':
        results.sort((a, b) => b.packagePrice - a.packagePrice)
        break
      case 'name':
        results.sort((a, b) => a.packageName.localeCompare(b.packageName))
        break
      case 'date':
        results.sort((a, b) => new Date(a.packageStartDate).getTime() - new Date(b.packageStartDate).getTime())
        break
    }

    return results
  }, [packages, searchText, selectedSeasons, selectedTypes, selectedTravelTypes, priceRange, sortBy])

  const hasActiveFilters = searchText || selectedSeasons.length > 0 || selectedTypes.length > 0 || selectedTravelTypes.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000000

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-8">
        Buscar Ofertas
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 p-6 sticky top-24 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Destino, nombre..."
                className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">
                Temporada
              </label>
              <div className="space-y-2">
                {allSeasons.map(season => {
                  const info = seasonLabels[season]
                  const isSelected = selectedSeasons.includes(season)
                  return (
                    <button
                      key={season}
                      onClick={() => toggleSeason(season)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${isSelected
                          ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400 ring-1 ring-primary-500/30'
                          : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700/50'
                        }`}
                    >
                      <span>{info.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">
                Tipo de Paquete
              </label>
              <div className="space-y-2">
                {allTypes.map(type => {
                  const info = packageTypeLabels[type]
                  const isSelected = selectedTypes.includes(type)
                  return (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${isSelected
                          ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400 ring-1 ring-primary-500/30'
                          : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700/50'
                        }`}
                    >
                      <span>{info.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">
                Tipo de Viaje
              </label>
              <div className="space-y-2">
                {allTravelTypes.map(type => {
                  const info = travelTypeLabels[type]
                  const isSelected = selectedTravelTypes.includes(type)
                  return (
                    <button
                      key={type}
                      onClick={() => toggleTravelType(type)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${isSelected
                          ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400 ring-1 ring-primary-500/30'
                          : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700/50'
                        }`}
                    >
                      {(() => { const TIcon = travelTypeIcons[type]; return TIcon ? <TIcon className="w-4 h-4" /> : null })()}
                      <span>{info.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                Precio Máximo: {formatCLP(priceRange[1])}
              </label>
              <input
                type="range"
                min={0}
                max={10000000}
                step={100000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-surface-400 mt-1">
                <span>$0</span>
                <span>$10.000.000</span>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-2.5 text-sm font-medium text-danger rounded-xl border border-danger/30 hover:bg-danger/10 transition-all duration-200"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        </aside>

        <div className="flex-grow">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-surface-500 dark:text-surface-400">
              {loading
                ? 'Cargando...'
                : `${filteredPackages.length} Oferta${filteredPackages.length !== 1 ? 's' : ''} encontrada${filteredPackages.length !== 1 ? 's' : ''}`}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-sm text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="date">Fecha de salida</option>
              <option value="price-asc">Precio: Bajo → Alto</option>
              <option value="price-desc">Precio: Alto → Bajo</option>
              <option value="name">Nombre A-Z</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white dark:bg-surface-800/40 rounded-2xl border border-surface-200/50 dark:border-surface-700/50">
              <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-4 text-warning" />
              <p className="text-surface-500 dark:text-surface-400">{error}</p>
            </div>
          ) : filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPackages.map(pkg => (
                <PackageCard key={pkg.packageId} pkg={pkg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-surface-800/40 rounded-2xl border border-surface-200/50 dark:border-surface-700/50">
              <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 text-surface-400 dark:text-surface-500" />
              <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">No hay ofertas disponibles</h3>
              <p className="text-surface-500 dark:text-surface-400 mb-6">
                Intenta ajustar los filtros o términos de búsqueda
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-all duration-200 text-sm font-medium"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
