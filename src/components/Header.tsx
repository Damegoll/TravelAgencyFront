import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Header() {
  const location = useLocation()
  const { itemCount } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const { isDark, toggle } = useTheme()

  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/search', label: 'Buscar Ofertas' },
  ]

  return (
    <header className="sticky top-0 z-50 glass dark:glass-dark shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gradient">
          TravelAgency
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive(path)
                  ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400'
                  : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-200/50 dark:hover:bg-white/10'
                }`}
            >
              {label}
            </Link>
          ))}

          <div className="w-px h-6 bg-surface-300 dark:bg-surface-600 mx-2" />

          <button
            onClick={toggle}
            className="p-2 rounded-lg text-surface-500 dark:text-surface-400 hover:bg-surface-200/50 dark:hover:bg-white/10 transition-all duration-200"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <Link
            to="/cart"
            className={`relative p-2 rounded-lg transition-all duration-200
              ${isActive('/cart')
                ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400'
                : 'text-surface-500 dark:text-surface-400 hover:bg-surface-200/50 dark:hover:bg-white/10'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-fade-in">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm text-surface-600 dark:text-surface-300 hidden sm:inline">
                {user?.firstName}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm rounded-lg text-surface-500 dark:text-surface-400 hover:bg-surface-200/50 dark:hover:bg-white/10 transition-all duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-primary"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
