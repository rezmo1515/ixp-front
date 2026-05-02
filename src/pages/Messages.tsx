// src/pages/Messages.tsx
import { useState, useEffect } from 'react'
import { messageApi } from '../api/services'
import type { Channel, Message } from '../types'
import { useAuth } from '../hooks/useAuth'
import { MessageSquare, Send, History, Zap, Clock, X, Users } from 'lucide-react'
import toast from 'react-hot-toast'

const CHANNELS: { value: Channel; label: string }[] = [
  { value: 'auto',     label: 'Automatic - Best Available' },
  { value: 'email',    label: 'Email' },
  { value: 'sms',      label: 'SMS' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'bale',     label: 'Bale' },
]

// Mock user list - replace with API call
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+98 9123456789' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+98 9123456790' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', phone: '+98 9123456791' },
  { id: 4, name: 'Test User', email: 'test@example.com', phone: '+98 9123456792' },
  { id: 5, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+98 9123456793' },
]

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  sent: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  failed: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  cancelled: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
}

export default function Messages() {
  const { user, hasPermission } = useAuth()
  const [tab, setTab] = useState<'send' | 'history'>('send')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [channel, setChannel] = useState<Channel>('auto')
  const [broadcast, setBroadcast] = useState(true)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchUser, setSearchUser] = useState('')
  const [body, setBody] = useState('')
  const [scheduled, setScheduled] = useState('')

  useEffect(() => {
    if (tab === 'history') load()
  }, [tab])

  const load = async () => {
    setLoading(true)
    try {
      const r = await messageApi.list()
      setMessages(r.data.data.data)
    } catch {
      toast.error('Error loading messages')
    } finally {
      setLoading(false)
    }
  }

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim() || !user) return

    if (!broadcast && selectedUsers.length === 0) {
      return toast.error('Please select recipients or enable broadcast mode')
    }

    setLoading(true)
    try {
      const r = await messageApi.send({
        sender_id: user.id,
        message: body,
        recipients: broadcast ? [] : selectedUsers.map(id => id.toString()),
        channel: channel as any,
        scheduled_at: scheduled || undefined,
      }) as any

      const d = r.data.data
      toast.success(
        d.is_scheduled
          ? `Message scheduled for ${new Date(scheduled).toLocaleString()}`
          : `Message queued for ${d.total_recipients || 0} recipient(s)`
      )
      setBody('')
      setSelectedUsers([])
      setScheduled('')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error sending message')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  )

  const toggleUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-red-500" />
          Messaging System
        </h1>
        <p className="text-slate-400">Send messages to all users or specific recipients</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-800">
        {(['send', 'history'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
              t === tab
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            {t === 'send' ? <Send size={16} /> : <History size={16} />}
            {t === 'send' ? 'Send Message' : 'History'}
          </button>
        ))}
      </div>

      {tab === 'send' && (
        <form onSubmit={send} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Form */}
          <div className="lg:col-span-2 rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur-sm p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Channel</label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-red-500 transition"
                  value={channel}
                  onChange={e => setChannel(e.target.value as Channel)}
                >
                  {CHANNELS.map(c => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={broadcast}
                    onChange={e => setBroadcast(e.target.checked)}
                    className="w-4 h-4 rounded accent-red-500"
                  />
                  <span className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Zap size={14} className="text-yellow-400" />
                    Broadcast
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Message</label>
              <textarea
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition resize-none"
                style={{ height: 180 }}
                placeholder="Enter your message here..."
                value={body}
                onChange={e => setBody(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <Clock size={14} />
                Schedule (Optional)
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition"
                type="datetime-local"
                value={scheduled}
                onChange={e => setScheduled(e.target.value)}
              />
              {scheduled && (
                <p className="text-xs text-slate-400 mt-2">
                  Scheduled for: {new Date(scheduled).toLocaleString()}
                </p>
              )}
            </div>

            <button
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /></>
              ) : (
                <Send size={18} />
              )}
              {loading ? 'Sending...' : scheduled ? 'Schedule Message' : 'Send Message'}
            </button>
          </div>

          {/* Recipients Sidebar */}
          {!broadcast && (
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur-sm p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Users size={14} />
                  Recipients
                </h3>

                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-red-500 transition mb-3"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
                {filteredUsers.map(u => (
                  <label key={u.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/30 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u.id)}
                      onChange={() => toggleUser(u.id)}
                      className="w-4 h-4 rounded accent-red-500"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-300">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </div>
                  </label>
                ))}
              </div>

              {selectedUsers.length > 0 && (
                <div className="pt-3 border-t border-slate-700 space-y-2">
                  <p className="text-xs font-semibold text-slate-400">
                    Selected: {selectedUsers.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map(userId => {
                      const u = mockUsers.find(user => user.id === userId)
                      return (
                        <div
                          key={userId}
                          className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20"
                        >
                          <span className="text-xs text-red-400 font-medium">{u?.name}</span>
                          <button
                            type="button"
                            onClick={() => toggleUser(userId)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUsers([])}
                    className="text-xs text-slate-400 hover:text-slate-300 transition"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      )}

      {tab === 'history' && (
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12 rounded-lg border border-slate-700 bg-slate-900/50">
              <MessageSquare className="mx-auto mb-4 w-8 h-8 text-slate-600" />
              <p className="text-slate-400">No messages yet</p>
            </div>
          ) : (
            messages.map(m => {
              const statusColor = STATUS_COLORS[m.status] || STATUS_COLORS.pending
              return (
                <div key={m.id} className="rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur-sm p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{m.message.substring(0, 60)}...</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(m.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor.border} ${statusColor.bg} ${statusColor.text}`}>
                      {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 text-xs text-slate-400 pt-3 border-t border-slate-700">
                    <div>
                      <span className="block text-slate-500 text-xs mb-1">Total</span>
                      <span className="font-bold text-white">{m.total_recipients}</span>
                    </div>
                    <div>
                      <span className="block text-green-600 text-xs mb-1">Sent</span>
                      <span className="font-bold text-green-400">{m.sent_count}</span>
                    </div>
                    <div>
                      <span className="block text-red-600 text-xs mb-1">Failed</span>
                      <span className="font-bold text-red-400">{m.failed_count || 0}</span>
                    </div>
                    <div>
                      <span className="block text-slate-600 text-xs mb-1">Channel</span>
                      <span className="font-bold text-slate-300">{m.channel}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}