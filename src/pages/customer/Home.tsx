export default function Home() {
  return (
    <div>
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to Travel Agency</h1>
        <p className="text-xl text-slate-600 mb-6">
          Discover amazing destinations and book your next adventure.
        </p>
        <div className="relative h-96 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg shadow-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-2xl font-semibold">Featured Destinations</p>
            <p className="text-blue-100 mt-2">Backend API integration coming soon</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Search Trips</h3>
          <p className="text-slate-600">Find and book trips to your favorite destinations.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Best Prices</h3>
          <p className="text-slate-600">Get the best rates on flights and accommodations.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-bold text-slate-900 mb-2">24/7 Support</h3>
          <p className="text-slate-600">Our team is here to help you anytime, anywhere.</p>
        </div>
      </section>
    </div>
  )
}
