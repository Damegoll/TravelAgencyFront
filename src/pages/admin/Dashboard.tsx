export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-700">Total Bookings</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">--</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-700">Active Users</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">--</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-700">Revenue</h3>
          <p className="text-3xl font-bold text-amber-600 mt-2">--</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <p className="text-slate-500">Data will appear here from backend API</p>
      </div>
    </div>
  )
}
