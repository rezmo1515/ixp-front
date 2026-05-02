import { create } from 'zustand'
import type { User, Acl } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  acl: Acl | null

  init: () => void
  set: (token: string, user: User, acl: Acl | null) => void
  clear: () => void
  can: (permission: string) => boolean
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  acl: null,

  init: () => {
    const token = localStorage.getItem('ixp_token')
    const user = localStorage.getItem('ixp_user')
    const acl = localStorage.getItem('ixp_acl')

    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        acl: acl ? JSON.parse(acl) : null,
      })
    }
  },

  set: (token, user, acl) => {
    localStorage.setItem('ixp_token', token)
    localStorage.setItem('ixp_user', JSON.stringify(user))
    if (acl) localStorage.setItem('ixp_acl', JSON.stringify(acl))

    set({ token, user, acl })
  },

  clear: () => {
    ;['ixp_token', 'ixp_user', 'ixp_acl'].forEach(k =>
      localStorage.removeItem(k)
    )
    set({ user: null, token: null, acl: null })
  },

  can: permission => {
    const { acl } = get()
    if (acl?.role === 'admin') return true
    return acl?.permissions?.includes(permission) ?? false
  },

  isAdmin: () => get().acl?.role === 'admin',
}))
