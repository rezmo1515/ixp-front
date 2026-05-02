// src/pages/Dashboard.tsx
import { useAuth } from '../hooks/useAuth'
import { Activity, Search, Globe, MessageSquare, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const tools = [
  { to: '/ping',     icon: Activity,       label: 'Ping test',  desc: 'Distributed ping from Iranian probe nodes', permission: null },
  { to: '/dns',      icon: Search,         label: 'DNS check',  desc: 'Check DNS across multiple nameservers',     permission: null },
  { to: '/whois',    icon: Globe,          label: 'WHOIS',      desc: 'Full domain WHOIS lookup',                  permission: null },
  { to: '/messages', icon: MessageSquare,  label: 'Messages',   desc: 'Send messages via Email/SMS/WhatsApp/Bale', permission: 'messages.send' },
]

export default function Dashboard() {
  const { user, acl, hasPermission } = useAuth()

  const accessible = tools.filter(t => !t.permission || hasPermission(t.permission))

  return (
    <div className="p-8 fade-up">
      <div className="mb-8">
        <h1 className="text-2xl font-black mb-1">
          Welcome, {user?.first_name}
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Role: <span className="badge badge-info">{acl?.role ?? 'user'}</span>
        </p>
      </div>

      {acl?.permissions && acl.permissions.length > 0 && (
        <div className="mb-8">
          <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Your permissions</p>
          <div className="flex flex-wrap gap-1.5">
            {acl.permissions.map(p => (
              <span key={p} className="badge badge-muted mono">{p}</span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {accessible.map(t => (
          <Link key={t.to} to={t.to}
            className="card group hover:border-red-900 transition-all fade-up"
            style={{ textDecoration: 'none' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: '#1f0608', border: '1px solid #3d0a0f', color: 'var(--red)' }}>
                <t.icon size={18} />
              </div>
              <ArrowRight size={16} style={{ color: 'var(--muted)' }}
                className="group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold mb-1">{t.label}</h3>
            <p className="text-sm" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}