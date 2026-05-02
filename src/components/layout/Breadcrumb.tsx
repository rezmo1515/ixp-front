// src/components/layout/Breadcrumb.tsx
import { useLocation, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const breadcrumbMap: Record<string, string> = {
  '/ping': 'Ping',
  '/dns': 'DNS',
  '/whois': 'WHOIS',
  '/messages': 'messages',
  '/roles': 'role and permissions',
}

export default function Breadcrumb() {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)

  if (pathSegments.length === 0) return null

  return (
    <div className="flex items-center gap-2 text-sm px-6 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
      <Link to="/ping" className="flex items-center gap-1 hover:text-red-500 transition">
        <Home size={16} />
        <span>خانه</span>
      </Link>

      {pathSegments.map((segment, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight size={16} style={{ color: 'var(--text2)' }} />
          <span>{breadcrumbMap[`/${pathSegments.slice(0, index + 1).join('/')}`] || segment}</span>
        </div>
      ))}
    </div>
  )
}
