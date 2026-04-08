import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PackageCard from '../../components/PackageCard'
import { seasonLabels, seasonGradients, seasonDescriptions } from '../../data/mockData'
import { packageService } from '../../api/packageService'

const seasons = ['SUMMER', 'WINTER', 'AUTUMN', 'SPRING']

export default function Home() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    packageService
      .getAllPackages()
      .then(setPackages)
      .catch(() => setError('No se pudieron cargar los paquetes'))
      .finally(() => setLoading(false))
  }, [])

  const featuredPackages = packages.slice(0, 6)

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-800 to-surface-900 py-24 px-6">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-primary-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            Conoce el{' '}
            <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
              MUNDO
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-200 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Paquetes premium, economicos y familiares para cada temporada.
            Tu proxima aventura comienza aqui.
          </p>
          <div className="flex gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/search"
              className="px-10 py-5 bg-white text-primary-700 font-semibold rounded-2xl hover:bg-primary-50 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Ver Ofertas
            </Link>
            <Link
              to="/register"
              className="px-10 py-5 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200"
            >
              Registrate
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-3">
            Viaja por Temporada
          </h2>
          <p className="text-surface-500 dark:text-surface-400">
            Cada temporada trae su propia magia
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {seasons.map(season => {
            const info = seasonLabels[season]
            const gradient = seasonGradients[season]
            const description = seasonDescriptions[season]
            return (
              <Link
                key={season}
                to={`/search?season=${season}`}
                className="group relative h-44 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-4">
                  <h3 className="text-xl font-bold">{info.label}</h3>
                  <p className="text-sm text-white/80 text-center mt-1">{description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
              Ofertas Destacadas
            </h2>
            <p className="text-surface-500 dark:text-surface-400">
              Destinos seleccionados para experiencias inolvidables
            </p>
          </div>
          <Link
            to="/search"
            className="hidden sm:inline-flex px-5 py-2.5 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200 text-sm font-medium"
          >
            Ver todas las ofertas →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">⚠️</p>
            <p className="text-surface-500 dark:text-surface-400">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPackages.map(pkg => (
              <PackageCard key={pkg.packageId} pkg={pkg} />
            ))}
          </div>
        )}

        <div className="sm:hidden text-center mt-8">
          <Link
            to="/search"
            className="inline-flex px-5 py-2.5 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200 text-sm font-medium"
          >
            Ver todas las ofertas →
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-3">
            Porque deberias elegirnos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              ),
              title: 'Oferta Variada',
              desc: 'Descubre destinos de todo el mundo:desde playas paradisiacas hasta aventuras en la montaña.',
            },
            {
              icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="12 1 22 5 22 19 12 23 2 19 2 5 12 1" />
                  <polyline points="12 12.46 20.24 8.6 20.24 15.5 12 19.35 3.76 15.5 3.76 8.6 12 12.46" />
                </svg>
              ),
              title: 'Mejores Precios',
              desc: 'Competimos con los mejores del mercado. Descuentos progresivos por reservas múltiples.',
            },
            {
              icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
              title: 'Seguridad Garantizada',
              desc: 'Todos nuestros destinos son seguros. Tus datos están protegidos con encriptación.',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 p-8 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4 group-hover:bg-primary-500/25 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-surface-500 dark:text-surface-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
