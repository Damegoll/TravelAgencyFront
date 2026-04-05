import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import PackageCard from '../../components/PackageCard'
import { mockPackages, seasonLabels, packageTypeLabels } from '../../data/mockData'
import { formatCLP } from '../../utils/format'
import type { Season, PackageType } from '../../types'

const allSeasons: Season[] = ['SUMMER', 'WINTER', 'AUTUMN', 'SPRING']
const allTypes: PackageType[] = ['EXPENSIVE', 'BUDGET', 'FAMILY']

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchText, setSearchText] = useState('')
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>(() => {
    const param = searchParams.get('season')
    return param ? [param as Season] : []
  })
  const [selectedTypes, setSelectedTypes] = useState<PackageType[]>(() => {
    const param = searchParams.get('type')
    return param ? [param as PackageType] : []
  })
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000000])
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'name'>('rating')

  const toggleSeason = (season: Season) => {
    setSelectedSeasons(prev =>
      prev.includes(season)
        ? prev.filter(s => s !== season)
        : [...prev, season]
    )
  }

  const toggleType = (type: PackageType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const clearFilters = () => {
    setSearchText('')
    setSelectedSeasons([])
    setSelectedTypes([])
    setPriceRange([0, 6000000])
    setSortBy('rating')
    setSearchParams({})
  }

  const filteredPackages = useMemo(() => {
    let results = [...mockPackages]

    if (searchText) {
      const query = searchText.toLowerCase()
      results = results.filter(
        pkg =>
          pkg.name.toLowerCase().includes(query) ||
          pkg.location.toLowerCase().includes(query) ||
          pkg.description.toLowerCase().includes(query)
      )
    }

    if (selectedSeasons.length > 0) {
      results = results.filter(pkg =>
        pkg.seasons.some(s => selectedSeasons.includes(s))
      )
    }

    if (selectedTypes.length > 0) {
      results = results.filter(pkg => selectedTypes.includes(pkg.type))
    }

    results = results.filter(
      pkg => pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
    )

    switch (sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        results.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return results
  }, [searchText, selectedSeasons, selectedTypes, priceRange, sortBy])

  const hasActiveFilters = searchText || selectedSeasons.length > 0 || selectedTypes.length > 0 || priceRange[0] > 0 || priceRange[1] < 6000000

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
                placeholder="Destination, name..."
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
                Tipo de Oferta
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
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                Precio Máximo: {formatCLP(priceRange[1])}
              </label>
              <input
                type="range"
                min={0}
                max={6000000}
                step={100000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-surface-400 mt-1">
                <span>$0</span>
                <span>$6.000.000</span>
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
              {filteredPackages.length} Oferta{filteredPackages.length !== 1 ? 's' : ''} encontrada{filteredPackages.length !== 1 ? 's' : ''}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-sm text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="rating">Mejor Valoradas</option>
              <option value="price-asc">Precio: Bajo → Alto</option>
              <option value="price-desc">Precio: Alto → Bajo</option>
              <option value="name">Nombre A-Z</option>
            </select>
          </div>

          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPackages.map(pkg => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-surface-800/40 rounded-2xl border border-surface-200/50 dark:border-surface-700/50">
              <p className="text-5xl mb-4">🔍</p>
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
