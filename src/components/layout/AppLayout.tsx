// src/components/layout/AppLayout.tsx
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'
import {
  LayoutDashboard, Activity, Search, Globe,
  MessageSquare, ShieldCheck, LogOut, ChevronRight, ExternalLink,
} from 'lucide-react'
import Logo from '../ui/Logo'
import clsx from 'clsx'

const allNav = [
  { to: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard, perm: null },
  { to: '/ping',      label: 'Ping test',  icon: Activity,        perm: null },
  { to: '/dns',       label: 'DNS check',  icon: Search,          perm: null },
  { to: '/whois',     label: 'WHOIS',      icon: Globe,           perm: null },
  { to: '/messages',  label: 'Messages',   icon: MessageSquare,   perm: 'messages.view' },
  { to: '/roles',     label: 'Roles & ACL',icon: ShieldCheck,     perm: 'acl.manage' },
]

export default function AppLayout() {
  const { user, acl, can, clear } = useAuthStore()
  const navigate = useNavigate()

  const nav = allNav.filter(n => !n.perm || can(n.perm))

  const handleLogout = async () => {
    try { await import('../../api').then(m => m.authApi.logout()) } catch {}
    clear()
    navigate('/auth')
  }

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 flex flex-col"
        style={{ background: 'var(--bg2)', borderRight: '1px solid var(--border)' }}>

        {/* Logo */}
        <div style={{ borderBottom: '1px solid var(--border)' }} className="px-5 py-4">
          <Link to="/"><Logo /></Link>
        </div>

        {/* Role */}
        {acl && (
          <div className="px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="badge b-info text-[10px]">{acl.role}</span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/dashboard'}
              className={({ isActive }) => clsx('nav-item', isActive && 'active')}>
              <Icon size={15} />
              <span className="flex-1">{label}</span>
              <ChevronRight size={12} className="opacity-0 group-hover:opacity-100" />
            </NavLink>
          ))}

          {/* Divider + Public tools */}
          <div className="divider my-3" />
          <p className="text-[10px] uppercase tracking-widest px-3 mb-1" style={{ color: 'var(--muted)' }}>Public tools</p>
          {[
            { to: '/ping',  label: 'Ping test', icon: Activity },
            { to: '/dns',   label: 'DNS check',  icon: Search  },
            { to: '/whois', label: 'WHOIS',       icon: Globe   },
          ].map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all"
              style={{ color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
              <Icon size={13} />
              {label}
              <ExternalLink size={10} className="ml-auto opacity-50" />
            </Link>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5 p-2 rounded-xl mb-1"
            style={{ background: 'var(--bg3)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
              style={{ background: 'var(--r)' }}>
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate leading-tight">{user?.first_name} {user?.last_name}</p>
              <p className="text-[10px] truncate leading-tight" style={{ color: 'var(--muted)' }}>{user?.mobile}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-xs w-full px-2 py-1.5 rounded-lg transition-all"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}