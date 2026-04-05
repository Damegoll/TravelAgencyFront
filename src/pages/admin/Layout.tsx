import { Outlet } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
        <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <p className="text-primary-700 dark:text-primary-300 text-sm font-medium">Admin Panel — Reports & Monitoring</p>
        </div>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
