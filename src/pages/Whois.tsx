// src/pages/Whois.tsx
import { useState } from 'react'
import { whoisApi } from '../api/client'
import type { WhoisResult } from '../types'
import { Globe, RefreshCw, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="rounded-lg px-4 py-3" style={{ background: 'var(--bg)' }}>
      <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>
        {label}
      </p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  )
}

export default function Whois() {
  const [domain, setDomain] = useState('google.com')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<WhoisResult | null>(null)
  const [showRaw, setShowRaw] = useState(false)

  const run = async (useCache = true) => {
    if (!domain.trim()) return toast.error('Enter a domain')

    setLoading(true)
    setResult(null)
    setShowRaw(false)

    try {
      const r = await whoisApi.lookup(domain.trim(), useCache)
      setResult(r.data.data)
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'WHOIS lookup failed')
    } finally {
      setLoading(false)
    }
  }

  const safeNameServers = result?.name_servers ?? []
  const safeStatusCodes = result?.status_codes ?? []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clientTransferProhibited':
        return '#1f1a0a'
      case 'clientDeleteProhibited':
        return '#0c1a2e'
      default:
        return 'var(--bg)'
    }
  }

  return (
    <div className="p-6 max-w-3xl fade-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'var(--red)', opacity: 0.1 }}>
          <Globe size={18} style={{ color: 'var(--red)' }} />
        </div>
        <h1 className="text-2xl font-bold">WHOIS lookup</h1>
      </div>

      {/* INPUT */}
      <div className="card mb-6">
        <div className="flex gap-3 flex-wrap">
          <input
            className="field"
            style={{ flex: 1, minWidth: 200 }}
            placeholder="e.g. google.com or jobinja.ir"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            dir="ltr"
          />

          <button
            className="btn btn-red"
            onClick={() => run(true)}
            disabled={loading}
          >
            {loading ? (
              <span className="loader" style={{ width: 14, height: 14 }} />
            ) : (
              <Globe size={14} />
            )}
            {loading ? 'درحال جستجو…' : 'جستجو'}
          </button>

          {result && (
            <button
              className="btn btn-ghost"
              onClick={() => run(false)}
              title="Ignore cache"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* RESULT */}
      {result && (
        <div className="card space-y-4 fade-up">
          {/* HEADER */}
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-bold mono text-lg" dir="ltr">{result.domain}</h2>

            <span
              className="px-2.5 py-1 rounded text-xs font-semibold"
              style={{
                background: result.is_available ? '#052e16' : '#2d0a0a',
                color: result.is_available ? '#4ade80' : '#f87171',
                border: `1px solid ${result.is_available ? '#166534' : '#7f1d1d'}`,
              }}
            >
              {result.is_available ? 'Available' : result.status}
            </span>

            {result.from_cache && (
              <span className="px-2.5 py-1 rounded text-xs font-semibold" style={{ background: '#1f1a0a', color: '#fbbf24', border: '1px solid #78350f' }}>
                From cache
              </span>
            )}

            {result.whois_server && (
              <span className="mono text-xs" style={{ color: 'var(--muted)' }} dir="ltr">
                {result.whois_server}
              </span>
            )}
          </div>

          {/* PRIVACY */}
          {result.privacy_protected && (
            <div
              className="rounded-lg px-4 py-3 text-sm flex items-center gap-3"
              style={{
                background: '#1f1a0a',
                border: '1px solid #78350f',
                color: '#fbbf24',
              }}
            >
              {result.privacy_message || 'Domain info is private.'}
            </div>
          )}

          {/* ERROR */}
          {result.error_message && (
            <div
              className="rounded-lg px-4 py-3 text-sm"
              style={{
                background: '#2d0a0a',
                border: '1px solid #7f1d1d',
                color: '#f87171',
              }}
            >
              {result.error_message}
            </div>
          )}

          {/* DETAILS */}
          {result.status === 'found' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Registrar" value={result.registrar} />
                <Field label="Registrant name" value={result.registrant?.name} />
                <Field label="Organization" value={result.registrant?.org} />
                <Field label="Country" value={result.registrant?.country} />
                <Field label="Created" value={result.dates?.created_at} />
                <Field label="Expires" value={result.dates?.expires_at} />
                <Field label="Updated" value={result.dates?.updated_at} />
              </div>

              {/* SAFE nameservers */}
              {safeNameServers.length > 0 && (
                <div
                  className="rounded-lg px-4 py-3"
                  style={{ background: 'var(--bg3)' }}
                >
                  <p
                    className="text-xs mb-2"
                    style={{ color: 'var(--muted)' }}
                  >
                    Nameservers
                  </p>
                  {safeNameServers.map(ns => (
                    <p
                      key={ns}
                      className="mono text-sm"
                      style={{ color: '#60a5fa' }}
                    >
                      {ns}
                    </p>
                  ))}
                </div>
              )}

              {/* SAFE status codes */}
              {safeStatusCodes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {safeStatusCodes.map(s => (
                    <span key={s} className="badge badge-muted mono">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}

          {/* RAW */}
          {result.raw_data && (
            <>
              <button
                className="text-xs transition-colors"
                style={{ color: 'var(--muted)' }}
                onClick={() => setShowRaw(!showRaw)}
                onMouseEnter={e =>
                  (e.currentTarget.style.color = 'var(--text)')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.color = 'var(--muted)')
                }
              >
                {showRaw ? '▲ Hide' : '▼ Show'} raw data
              </button>

              {showRaw && (
                <pre
                  className="mono text-xs rounded-xl p-4 overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap"
                  style={{
                    background: '#060609',
                    color: '#4ade80',
                    border: '1px solid var(--border)',
                  }}
                >
                  {result.raw_data}
                </pre>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}