import { useAuthStore } from '../store/authStore'
export default function usePermission(permission) {
  const perms = useAuthStore(s => s.acl?.permissions || [])
  return perms.includes(permission)
}
