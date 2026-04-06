import { useState, useEffect } from 'react'
import { accountService } from '../../api/accountService'
import type { Account } from '../../types'

export default function AdminAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    accountService
      .getAllAccounts()
      .then(setAccounts)
      .catch(() => setError('Error cargando cuentas'))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusToggle = async (account: Account) => {
    const next = account.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'
    try {
      const updated = await accountService.updateAccountStatus(account.id, next)
      setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a))
    } catch {
      alert('Error al cambiar estado')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta cuenta? Esta acción no se puede deshacer.')) return
    try {
      await accountService.deleteAccount(id)
      setAccounts(prev => prev.filter(a => a.id !== id))
    } catch {
      alert('Error al eliminar la cuenta')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">Cuentas</h1>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-surface-800/60 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200/50 dark:border-surface-700/50">
                <th className="text-left px-6 py-4 font-semibold text-surface-600 dark:text-surface-400">Nombre</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Email</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Roles</th>
                <th className="text-left px-4 py-4 font-semibold text-surface-600 dark:text-surface-400">Estado</th>
                <th className="text-right px-6 py-4 font-semibold text-surface-600 dark:text-surface-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => (
                <tr key={account.id} className="border-b border-surface-100 dark:border-surface-700/30 hover:bg-surface-50 dark:hover:bg-surface-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-surface-900 dark:text-white">
                      {account.firstName} {account.lastName}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-surface-600 dark:text-surface-300">{account.email}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1">
                      {account.roles?.map(role => (
                        <span
                          key={role}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            role === 'ADMIN'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleStatusToggle(account)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-opacity hover:opacity-80 ${
                        account.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {account.status === 'ACTIVE' ? 'Activa' : 'Deshabilitada'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="text-xs px-3 py-1.5 rounded-lg text-danger border border-danger/30 hover:bg-danger/10 transition-all"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {accounts.length === 0 && (
          <div className="text-center py-12 text-surface-400 dark:text-surface-500">
            No hay cuentas registradas
          </div>
        )}
      </div>
    </div>
  )
}
