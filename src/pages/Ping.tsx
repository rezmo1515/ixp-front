// src/pages/Ping.tsx
import { useState } from 'react'
import { pingApi } from '../api/client'
import type { PingResult, PingNodeResult } from '../types'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { Activity } from 'lucide-react'

function dot(status: PingNodeResult['status']) {
  return (
    <span
      className={clsx('w-2 h-2 rounded-full inline-block flex-shrink-0', {
        'bg-green-500': status === 'up',
        'bg-red-500': status === 'down',
        'bg-yellow-400': status === 'timeout' || status === 'error',
      })}
    />
  )
}

export default function Ping() {
  const [target, setTarget] = useState('google.com')
  const [count, setCount] = useState(4)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PingResult | null>(null)

  const run = async () => {
    if (!target.trim()) return toast.error('Please enter a domain or IP address')

    setLoading(true)
    setResult(null)

    try {
      const r = await pingApi.run(target.trim(), count)
      setResult(r.data.data)
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Ping execution failed')
    } finally {
      setLoading(false)
    }
  }

  const gColor = {
    up: '#052e16',
    down: '#2d0a0a',
    partial_outage: '#1f1a0a',
    unknown: 'var(--bg)',
  }

  const gColorText = {
    up: '#4ade80',
    down: '#f87171',
    partial_outage: '#fbbf24',
    unknown: 'var(--muted)',
  }

  return (
    <div className="p-6 space-y-6 fade-up">

      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg"
          style={{ background: 'var(--red)', opacity: 0.1 }}
        >
          <Activity size={18} style={{ color: 'var(--red)' }} />
        </div>
        <h1 className="text-2xl font-bold">Ping Test</h1>
      </div>

      <div className="card">
        <div className="flex gap-3 flex-wrap">
          <input
            className="field"
            style={{ flex: 1, minWidth: 180 }}
            placeholder="Domain or IP – e.g. google.com"
            value={target}
            onChange={e => setTarget(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            dir="ltr"
          />

          <select
            className="field"
            style={{ width: 140 }}
            value={count}
            onChange={e => setCount(Number(e.target.value))}
          >
            <option value={4}>4 packets</option>
            <option value={8}>8 packets</option>
            <option value={16}>16 packets</option>
          </select>

          <button className="btn btn-red" onClick={run} disabled={loading}>
            {loading ? (
              <span className="loader" style={{ width: 14, height: 14 }} />
            ) : (
              <Activity size={14} />
            )}
            {loading ? 'Running…' : 'Run'}
          </button>
        </div>
      </div>

      {/* RESULT */}
      {result && (
        <div className="space-y-6">

          {/* SUMMARY */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                l: 'Overall Status',
                v: result.global_status_label,
                bg: gColor[result.global_status as keyof typeof gColor] || 'var(--bg)',
                color: gColorText[result.global_status as keyof typeof gColorText] || 'var(--muted)',
              },
              {
                l: 'Active Nodes',
                v: `${result.summary.up_nodes} / ${result.summary.total_nodes}`,
              },
              {
                l: 'Average Latency',
                v: `${result.summary.average_latency_ms.toFixed(1)} ms`,
              },
              {
                l: 'Packet Loss',
                v: `${result.summary.average_packet_loss.toFixed(1)}%`,
              },
            ].map(({ l, v, bg, color }) => (
              <div
                key={l}
                className="card"
                style={bg ? { background: bg, borderColor: color, borderWidth: 1 } : {}}
              >
                <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>
                  {l}
                </p>
                <div className="text-base font-bold" style={color ? { color } : {}}>
                  {v}
                </div>
              </div>
            ))}
          </div>

          {/* NODES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {result.results.map(node => (
              <div key={node.probe_node_id} className="card">

                <div className="flex items-center gap-2 mb-3">
                  {dot(node.status)}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {node.node_name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {node.node_provider}
                    </p>
                  </div>

                  <span
                    className={`badge ${
                      node.status === 'up' ? 'badge-up' : 'badge-down'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>

                {node.status === 'up' ? (
                  <div className="grid grid-cols-3 gap-1.5">
                    {([
                      ['avg', node.latency_avg],
                      ['min', node.latency_min],
                      ['max', node.latency_max],
                    ] as const).map(([l, v]) => (
                      <div
                        key={l}
                        className="rounded-lg py-2 text-center"
                        style={{ background: 'var(--bg3)' }}
                      >
                        <p className="text-xs mb-0.5" style={{ color: 'var(--muted)' }}>
                          {l}
                        </p>
                        <p className="text-sm font-bold mono">
                          {v?.toFixed(0)}
                          <span
                            className="text-xs font-normal"
                            style={{ color: 'var(--muted)' }}
                          >
                            ms
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-xs px-3 py-2 rounded-lg"
                    style={{ background: '#2d0a0a', color: '#f87171' }}
                  >
                    {node.error_message || 'Host unreachable'}
                  </p>
                )}

                {(node.packet_loss ?? 0) > 0 && node.status === 'up' && (
                  <p className="text-xs mt-2" style={{ color: '#fbbf24' }}>
                    Loss: {node.packet_loss}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}