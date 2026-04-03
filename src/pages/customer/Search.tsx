export default function Search() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search Trips</h1>
      
      <div className="bg-white p-8 rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Departure</label>
            <input
              type="text"
              placeholder="From"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Destination</label>
            <input
              type="text"
              placeholder="To"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Check-in</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">&nbsp;</label>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Results</h2>
        <p className="text-slate-500">Search results will appear here when connected to backend API</p>
      </div>
    </div>
  )
}
