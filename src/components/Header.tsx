import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          TravelAgency
        </Link>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          <Link to="/search" className="hover:text-blue-400 transition">
            Search
          </Link>
          <Link to="/admin/dashboard" className="hover:text-blue-400 transition ml-4">
            Admin
          </Link>
        </div>
      </nav>
    </header>
  )
}
