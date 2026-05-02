// src/components/layout/PublicLayout.tsx
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'
import { Activity, Search, Globe, LayoutDashboard, User, LogIn } from 'lucide-react'
import Logo from '../ui/Logo'

const publicNav = [
  { to: '/ping',  label: 'Ping test', icon: Activity },
  { to: '/dns',   label: 'DNS check', icon: Search   },
  { to: '/whois', label: 'WHOIS',     icon: Globe    },
]

export default function PublicLayout() {
  const { token, user } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'rgba(12,12,16,.95)', backdropFilter: 'blur(12px)' }}
        className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">

          <div className="flex items-center gap-8">
            <Link to="/"><Logo /></Link>

            {/* Main nav */}
            <nav className="hidden md:flex items-center gap-1">
              {publicNav.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                    ${isActive ? 'text-white bg-white/5' : 'text-[var(--muted)] hover:text-white'}`
                  }>
                  <Icon size={14} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {token && user ? (
              <button onClick={() => navigate('/dashboard')}
                className="btn btn-r gap-2 text-sm">
                <LayoutDashboard size={14} />
                Dashboard
              </button>
            ) : (
              <>
                <NavLink to="/auth" state={{ tab: 'auth' }}
                  className="btn btn-ghost text-sm">
                  <LogIn size={14} /> Sign in
                </NavLink>
                <NavLink to="/auth" state={{ tab: 'register' }}
                  className="btn btn-r text-sm">
                  <User size={14} /> Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}