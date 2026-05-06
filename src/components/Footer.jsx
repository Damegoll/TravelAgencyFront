import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 glass dark:glass-dark border-t border-surface-200/50 dark:border-surface-700/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gradient mb-3">TravelAgency</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
              Descubre los destinos más increíbles del mundo. Ofrecemos paquetes de viaje premium, económicos y familiares en todas las estaciones.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wider mb-3">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Inicio' },
                { to: '/search', label: 'Buscar Ofertas' },
                { to: '/cart', label: 'Mi Carrito' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wider mb-3">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm text-surface-500 dark:text-surface-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                contact@travelagency.com
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                +56 2 2649 1628
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-surface-200/50 dark:border-surface-700/50 text-center">
          <p className="text-sm text-surface-400 dark:text-surface-500">
            © {new Date().getFullYear()} Travel Agency. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
