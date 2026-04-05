export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Bookings', value: '--', color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-500/10' },
          { label: 'Active Users', value: '--', color: 'text-success', bg: 'bg-success/10' },
          { label: 'Revenue', value: '--', color: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-500/10' },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white dark:bg-surface-800/60 p-6 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-3`}>
              <span className={`text-sm font-semibold ${card.color}`}>{card.label}</span>
            </div>
            <p className={`text-3xl font-bold ${card.color} mt-1`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-surface-800/60 p-6 rounded-2xl border border-surface-200/50 dark:border-surface-700/50">
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Recent Activity</h2>
        <p className="text-surface-500 dark:text-surface-400">Data will appear here from backend API</p>
      </div>
    </div>
  )
}
