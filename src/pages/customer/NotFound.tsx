import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-950 dark:to-surface-900">
      <p className="text-8xl font-bold text-gradient mb-4">404</p>
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
        Pagina no encontrada
      </h1>
      <p className="text-surface-500 dark:text-surface-400 mb-8 max-w-md">
        Si llegaste acá, algo malo sucedio y no deberias siquiera ver esto.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-primary hover:-translate-y-0.5"
      >
        Página principal
      </Link>
    </div>
  )
}
