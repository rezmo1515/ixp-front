// src/pages/Dns.tsx
import { useState } from 'react'
import { dnsApi } from '../api/client'
import type { DnsResult } from '../types'
import { Search, CheckCircle2, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Dns() {
  const [domains, setDomains] = useState('mobinhost.com')
  const [servers, setServers] = useState(
    '8.8.8.8\n1.1.1.1\n185.51.200.2\n185.161.112.34'
  )
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DnsResult | null>(null)

  const run = async () => {
    const d = domains.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
    const n = servers.split(/[\n,]/).map(s => s.trim()).filter(Boolean)

    if (!d.length || !n.length) {
      return toast.error('Enter domains and nameservers')
    }

    setLoading(true)
    setResult(null)

    try {
      const r = await dnsApi.check(d, n)
      setResult(r.data.data)
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'DNS check failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 fade-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ background: 'var(--red)', opacity: 0.1 }}>
          <Search size={18} style={{ color: 'var(--red)' }} />
        </div>
        <h1>DNS check</h1>
      </div>

      {/* INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[
          {
            label: 'Domains (one per line)',
            val: domains,
            set: setDomains,
            ph: 'mobinhost.com\nexample.com',
          },
          {
            label: 'Nameservers (one per line)',
            val: servers,
            set: setServers,
            ph: '8.8.8.8\n1.1.1.1',
          },
        ].map(({ label, val, set, ph }) => (
          <div key={label} className="card">
            <label
              className="block text-sm font-semibold mb-2"
            >
              {label}
            </label>
            <textarea
              className="field mono"
              style={{ height: 120, resize: 'vertical' }}
              value={val}
              onChange={e => set(e.target.value)}
              placeholder={ph}
              dir="ltr"
            />
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <button
        className="btn btn-red mb-8 flex items-center gap-2"
        onClick={run}
        disabled={loading}
      >
        {loading ? (
          <span className="loader" style={{ width: 14, height: 14 }} />
        ) : (
          <Search size={14} />
        )}
        {loading ? 'Checking…' : 'Check DNS'}
      </button>

      {/* RESULTS */}
      {result?.results.map(domain => (
        <div key={domain.domain} className="card mb-4 fade-up">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-bold mono text-lg" dir="ltr">{domain.domain}</h2>

            {domain.summary.avg_response_ms != null && (
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                {domain.summary.avg_response_ms.toFixed(0)} ms avg
              </div>
            )}
          </div>

          {/* DNS RESULTS */}
          <div className="space-y-2">
            {domain.results.map(r => (
              <div
                key={r.nameserver}
                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm flex-wrap gap-2 border"
                style={{
                  background:
                    r.status === 'SUCCESS' ? '#052e16' : '#2d0a0a',
                  borderColor:
                    r.status === 'SUCCESS' ? '#166534' : '#7f1d1d',
                }}
              >
                <div className="flex items-center gap-3 flex-wrap flex-1">
                  {r.status === 'SUCCESS' ? (
                    <CheckCircle2 size={14} style={{ color: '#4ade80' }} />
                  ) : (
                    <XCircle size={14} style={{ color: '#f87171' }} />
                  )}

                  <span
                    className="mono text-xs"
                    style={{ color: 'var(--muted)' }}
                    dir="ltr"
                  >
                    {r.nameserver}
                  </span>

                  {r.status === 'SUCCESS' ? (
                    <span
                      className="mono text-xs"
                      style={{ color: '#60a5fa' }}
                      dir="ltr"
                    >
                      {r.records.join(', ')}
                    </span>
                  ) : (
                    <span
                      className="text-xs"
                      style={{ color: '#f87171' }}
                    >
                      {r.error_message}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {r.response_time != null && (
                    <span
                      className="text-xs"
                      style={{ color: 'var(--muted)' }}
                    >
                      {r.response_time} ms
                    </span>
                  )}

                  <span
                    className={`badge ${
                      r.status === 'SUCCESS' ? 'badge-up' : 'badge-down'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}