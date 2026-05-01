import { ArrowTopRightOnSquareIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { KEYCLOAK_URL } from '../../utils/keycloak'

export default function AdminAccounts() {
  const keycloakAdminUrl = `${KEYCLOAK_URL}/admin`

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">Gestión de Usuarios</h1>

      <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 p-8">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/15 flex items-center justify-center mx-auto mb-6">
            <ShieldCheckIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-3">
            Administración vía Keycloak
          </h2>

          <p className="text-surface-500 dark:text-surface-400 mb-8 leading-relaxed">
            La gestión de usuarios (crear, editar, deshabilitar, eliminar cuentas y asignar roles)
            se realiza directamente desde la consola de administración de Keycloak.
          </p>

          <a
            href={keycloakAdminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            Abrir Keycloak Admin
            <ArrowTopRightOnSquareIcon className="w-5 h-5" />
          </a>

          <p className="text-xs text-surface-400 dark:text-surface-500 mt-4">
            Se abrirá en una nueva pestaña
          </p>
        </div>
      </div>
    </div>
  )
}
