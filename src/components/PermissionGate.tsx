import { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Shield } from 'lucide-react'

interface PermissionGateProps {
  permission: string | string[]
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGate({ permission, fallback, children }: PermissionGateProps) {
  const { hasPermission } = useAuth()

  const permissions = Array.isArray(permission) ? permission : [permission]
  const allowed = permissions.some(p => hasPermission(p))

  if (!allowed) {
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}

export function PermissionDenied({ message }: { message?: string }) {
  return (
    <div className="p-12 text-center rounded-lg border border-slate-700 bg-slate-800/20">
      <Shield className="mx-auto mb-3 w-8 h-8 text-slate-500" />
      <h3 className="text-lg font-bold text-white mb-1">Access Denied</h3>
      <p className="text-slate-400 text-sm">
        {message || 'You do not have permission to access this feature'}
      </p>
    </div>
  )
}
