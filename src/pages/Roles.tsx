// src/pages/Roles.tsx
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Plus, Trash2, Edit2, Shield, CheckCircle2, Circle, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { PermissionDenied } from '../components/PermissionGate'

interface Role {
  id: number
  name: string
  display_name: string
  permissions: string[]
  users_count: number
}

const availablePermissions = [
  { id: 'ping.run', label: 'Run Ping Tests', icon: '📡' },
  { id: 'dns.check', label: 'Check DNS Records', icon: '🔍' },
  { id: 'whois.lookup', label: 'WHOIS Lookups', icon: '🌐' },
  { id: 'messages.send', label: 'Send Messages', icon: '💬' },
  { id: 'messages.broadcast', label: 'Broadcast Messages', icon: '📢' },
  { id: 'roles.manage', label: 'Manage Roles', icon: '👥' },
  { id: 'users.manage', label: 'Manage Users', icon: '⚙️' },
  { id: 'logs.view', label: 'View Logs', icon: '📋' },
]

const mockRoles: Role[] = [
  {
    id: 1,
    name: 'admin',
    display_name: 'Administrator',
    permissions: availablePermissions.map(p => p.id),
    users_count: 2,
  },
  {
    id: 2,
    name: 'user',
    display_name: 'Standard User',
    permissions: ['ping.run', 'dns.check', 'whois.lookup'],
    users_count: 45,
  },
]

export default function Roles() {
  const { hasPermission } = useAuth()
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', display_name: '', permissions: [] as string[] })

  if (!hasPermission('roles.manage')) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            Roles & Permissions
          </h1>
          <p className="text-slate-400">Manage system roles and user permissions</p>
        </div>
        <PermissionDenied message="You do not have permission to manage roles and permissions" />
      </div>
    )
  }

  const handleAddRole = () => {
    setFormData({ name: '', display_name: '', permissions: [] })
    setShowForm(true)
    setSelectedRole(null)
  }

  const handleEditRole = (role: Role) => {
    setFormData({ name: role.name, display_name: role.display_name, permissions: role.permissions })
    setSelectedRole(role)
    setShowForm(true)
  }

  const handleSaveRole = async () => {
    if (!formData.name || !formData.display_name) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      if (selectedRole) {
        setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, ...formData } : r))
        toast.success('Role updated successfully')
      } else {
        const newRole: Role = {
          id: Math.max(...roles.map(r => r.id), 0) + 1,
          ...formData,
          users_count: 0,
        }
        setRoles([...roles, newRole])
        toast.success('New role created')
      }
      setShowForm(false)
      setSelectedRole(null)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving role')
    }
  }

  const handleDeleteRole = (roleId: number) => {
    if (confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(r => r.id !== roleId))
      toast.success('Role deleted')
    }
  }

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            Roles & Permissions
          </h1>
          <p className="text-slate-400">Manage system roles and assign permissions to users</p>
        </div>
        <button
          onClick={handleAddRole}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-4">
            Available Roles
          </h2>
          <div className="space-y-2">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => {
                  setSelectedRole(role)
                  setShowForm(false)
                }}
                className={`w-full px-4 py-3 rounded-lg text-left transition-all border ${
                  selectedRole?.id === role.id
                    ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/30'
                    : 'bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm text-white">{role.display_name}</div>
                    <div className="text-xs text-slate-400 mt-1">{role.users_count} users</div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-slate-700/50 text-slate-300 capitalize">
                    {role.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Role Form or Details */}
        <div className="lg:col-span-2">
          {showForm ? (
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur-sm p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {selectedRole ? 'Edit Role' : 'Create New Role'}
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Role Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., moderator"
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-2 block">Display Name</label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={e => setFormData({ ...formData, display_name: e.target.value })}
                    placeholder="e.g., Content Moderator"
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-300 mb-3 block">Permissions</label>
                  <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto scrollbar-hide p-3 bg-slate-800/30 rounded-lg border border-slate-700">
                    {availablePermissions.map(perm => (
                      <button
                        key={perm.id}
                        onClick={() => togglePermission(perm.id)}
                        className={`p-3 rounded-lg text-left transition-all border ${
                          formData.permissions.includes(perm.id)
                            ? 'bg-red-500/20 border-red-500/30'
                            : 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {formData.permissions.includes(perm.id) ? (
                            <CheckCircle2 size={16} className="text-red-400" />
                          ) : (
                            <Circle size={16} className="text-slate-500" />
                          )}
                          <span className="text-sm">{perm.icon}</span>
                        </div>
                        <span className="text-xs font-medium text-slate-300">{perm.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveRole}
                    className="flex-1 px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all"
                  >
                    Save Role
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-2.5 rounded-lg border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800/30 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : selectedRole ? (
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur-sm p-6 space-y-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedRole.display_name}</h2>
                  <p className="text-slate-400 text-sm mt-1" dir="ltr">@{selectedRole.name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditRole(selectedRole)}
                    className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition flex items-center gap-2"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRole(selectedRole.id)}
                    className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Assigned Permissions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedRole.permissions.length === 0 ? (
                    <p className="text-slate-400 text-sm col-span-2">No permissions assigned</p>
                  ) : (
                    selectedRole.permissions.map(perm => {
                      const permission = availablePermissions.find(p => p.id === perm)
                      return (
                        <div
                          key={perm}
                          className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                        >
                          <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                          <span className="text-sm text-slate-300">{permission?.icon} {permission?.label}</span>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6 flex items-center gap-2 text-slate-400 text-sm">
                <Shield className="w-4 h-4" />
                <span><strong>{selectedRole.users_count}</strong> users have this role</span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur-sm p-12 text-center">
              <Shield size={48} className="mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">Select a role to view and manage its permissions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
