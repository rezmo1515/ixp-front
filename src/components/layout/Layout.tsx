// src/components/layout/Layout.tsx
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Breadcrumb from './Breadcrumb'
import {
  Activity, Search, Globe, MessageSquare, LogOut, ChevronRight, Shield, 
  BarChart3, Settings, Bell, User, AlertCircle
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const allNav = [
  { to: '/ping',      label: 'Ping',                  icon: Activity,        permission: null },
  { to: '/dns',       label: 'DNS',                   icon: Search,          permission: null },
  { to: '/whois',     label: 'WHOIS',                 icon: Globe,           permission: null },
  { to: '/messages',  label: 'Messages',              icon: MessageSquare,   permission: 'messages.send' },
  { to: '/roles',     label: 'Roles & Permissions',   icon: Shield,          permission: 'roles.manage' },
]

export default function Layout() {
  const { user, acl, hasPermission, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Filter nav by ACL
  const nav = allNav.filter(n =>
    n.permission === null || hasPermission(n.permission)
  )

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
      toast.success('Logged out successfully')
    } catch {
      toast.error('Error logging out')
    }
  }

  const initials = `${user?.first_name?.charAt(0) || 'U'}${user?.last_name?.charAt(0) || 'S'}`

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col bg-slate-900/50 border-r border-slate-800 backdrop-blur-sm">

        {/* Logo Section */}
        <Link to="/ping" className="flex items-center gap-3 px-6 py-5 border-b border-slate-800 hover:bg-slate-800/30 transition group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-red-500/30 transition">
            <span className="text-white font-bold text-sm">⚡</span>
          </div>
          <div>
            <span className="text-white text-sm font-black tracking-tight block">IXP</span>
            <span className="text-slate-400 text-xs font-semibold">TRACKER</span>
          </div>
        </Link>

        {/* Role Badge */}
        {acl && (
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/20">
            <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Your Role</div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${acl.role === 'admin' ? 'bg-green-400' : 'bg-blue-400'}`} />
              <span className="text-xs font-bold text-slate-300 capitalize">{acl.role}</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-hide">
          {nav.map(({ to, label, icon: Icon, permission }) => {
            const allowed = !permission || hasPermission(permission)
            return allowed ? (
              <NavLink key={to} to={to}
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-2.5 rounded-lg text-sm
                  font-medium transition-all group relative
                  ${isActive
                    ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border border-red-500/30'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-800/30'
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} />
                  {label}
                </span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ) : null
          })}
        </nav>

        {/* User Section */}
        <div className="px-4 py-4 border-t border-slate-800 space-y-3 bg-slate-800/20">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-700/30 transition group"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-gradient-to-br from-red-500 to-red-600 group-hover:shadow-lg group-hover:shadow-red-500/30 transition">
                {initials}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-semibold text-white truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.mobile}</p>
              </div>
            </button>

            {/* User Menu */}
            {showUserMenu && (
              <div className="absolute bottom-full mb-2 w-full bg-slate-800 rounded-lg border border-slate-700 shadow-xl overflow-hidden z-50">
                <button className="w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 transition flex items-center gap-2">
                  <User size={14} />
                  Profile
                </button>
                <button className="w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700/50 transition flex items-center gap-2">
                  <Settings size={14} />
                  Settings
                </button>
                <div className="h-px bg-slate-700" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <Breadcrumb />
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/30 transition">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Help */}
            <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/30 transition">
              <AlertCircle size={18} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}