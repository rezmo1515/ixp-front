import { create } from 'zustand'

const cached = JSON.parse(localStorage.getItem('ixp_auth') || '{}')

export const useAuthStore = create((set) => ({
  token: cached.token || null,
  user: cached.user || null,
  acl: cached.acl || { permissions: [] },
  setAuth: (payload) => {
    const data = { token: payload.token, user: payload.user, acl: payload.acl || { permissions: [] } }
    localStorage.setItem('ixp_auth', JSON.stringify(data))
    set(data)
  },
  logout: () => { localStorage.removeItem('ixp_auth'); set({ token: null, user: null, acl: { permissions: [] } }) }
}))
