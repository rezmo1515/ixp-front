// src/pages/Landing.tsx
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Activity, Search, Globe, MessageSquare, ArrowRight, Shield, Zap, Server } from 'lucide-react'

const tools = [
  { icon: Activity,      label: 'Ping test',  desc: 'Distributed ping from multiple Iranian probe nodes — Tehran, Isfahan, Mashhad, Shiraz.', href: '/ping',    public: true },
  { icon: Search,        label: 'DNS check',  desc: 'Verify DNS resolution across multiple nameservers simultaneously.',                        href: '/dns',     public: true },
  { icon: Globe,         label: 'WHOIS',      desc: 'Full WHOIS lookup via direct TCP socket — works during national internet.',               href: '/whois',   public: true },
  { icon: MessageSquare, label: 'Messaging',  desc: 'Send messages to users via Email, SMS, WhatsApp or Bale with smart fallback.',            href: '/messages',public: false },
]

const features = [
  { icon: Zap,    title: 'Real-time',         desc: 'Live results from all probe nodes simultaneously.' },
  { icon: Shield, title: 'Works offline',     desc: 'Direct TCP socket — no third-party services needed.' },
  { icon: Server, title: 'Iranian nodes',     desc: 'Probes in Tehran (HiWeb, Afranet, Emam, Arvand), Isfahan, Mashhad, Shiraz.' },
]

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--border)' }}
        className="flex items-center justify-between px-8 py-4 max-w-6xl mx-auto">
        <div className="flex items-end gap-1.5">
          <span className="w-1.5 h-5 rounded-sm block" style={{ background: 'var(--red)' }} />
          <span className="w-1.5 h-3 rounded-sm block"  style={{ background: 'var(--red)' }} />
          <span className="w-1.5 h-5 rounded-sm block" style={{ background: 'var(--red)' }} />
          <span className="text-white text-lg font-bold tracking-widest ml-2">IXP</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="btn btn-red">
              Dashboard <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link to="/auth" className="btn btn-ghost">Sign in</Link>
              <Link to="/auth" className="btn btn-red">Get started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-24 pb-20 text-center fade-up">
        <div className="inline-flex items-center gap-2 text-xs font-mono mb-6 px-3 py-1.5 rounded-full"
          style={{ background: '#1f0608', border: '1px solid #3d0a0f', color: 'var(--red)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          Network monitoring — Iranian datacenters
        </div>
        <h1 className="text-5xl font-black mb-6 leading-tight" style={{ letterSpacing: '-1px' }}>
          Monitor your infrastructure
          <br />
          <span style={{ color: 'var(--red)' }}>from every angle.</span>
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
          Ping, DNS, WHOIS and messaging tools — all in one platform.
          Works even during national internet filtering.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/ping"  className="btn btn-red text-base px-6 py-3">
            Try Ping test <ArrowRight size={16} />
          </Link>
          <Link to="/whois" className="btn btn-ghost text-base px-6 py-3">
            WHOIS lookup
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title} className="card fade-up">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                style={{ background: '#1f0608', border: '1px solid #3d0a0f', color: 'var(--red)' }}>
                <f.icon size={16} />
              </div>
              <h3 className="font-bold mb-1">{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-6xl mx-auto px-8 pb-24">
        <h2 className="text-2xl font-bold mb-2">Tools</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>
          Some tools are public — no account needed.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tools.map(t => (
            <Link key={t.label}
              to={t.public ? t.href : (user ? t.href : '/login')}
              className="card group hover:border-red-900 transition-colors fade-up"
              style={{ textDecoration: 'none' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: '#1f0608', border: '1px solid #3d0a0f', color: 'var(--red)' }}>
                  <t.icon size={16} />
                </div>
                <div className="flex gap-2">
                  <span className={t.public ? 'badge badge-up' : 'badge badge-info'}>
                    {t.public ? 'Public' : 'Auth required'}
                  </span>
                </div>
              </div>
              <h3 className="font-bold mb-1 group-hover:text-red-400 transition-colors">{t.label}</h3>
              <p className="text-sm" style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)' }}
        className="text-center py-8 text-xs"
        >
        <p style={{ color: 'var(--muted)' }}>© {new Date().getFullYear()} IXP Network Monitoring Platform</p>
      </footer>
    </div>
  )
}