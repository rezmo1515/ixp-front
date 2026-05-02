import { create } from 'zustand';

const saved = JSON.parse(localStorage.getItem('ixp-auth') || '{}');

export const useAuthStore = create((set) => ({
  user: saved.user || null,
  token: saved.token || null,
  acl: saved.acl || { permissions: [] },
  setAuth: ({ user, token, acl }) => {
    localStorage.setItem('ixp-auth', JSON.stringify({ user, token, acl, expiresAt: Date.now() + 30*24*60*60*1000 }));
    set({ user, token, acl });
  },
  clearAuth: () => { localStorage.removeItem('ixp-auth'); set({ user: null, token: null, acl: { permissions: [] } }); }
}));
