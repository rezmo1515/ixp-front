import React, {
  createContext, useContext, useState, useEffect,
  type ReactNode,
} from 'react'
import type { User, Acl } from '../types'
import { authApi } from '../api/services'
import toast from 'react-hot-toast'

interface AuthCtx {
  user:      User | null
  token:     string | null
  acl:       Acl | null
  isLoading: boolean
  hasPermission: (p: string) => boolean
  login:     (mobile: string, password: string) => Promise<void>
  register:  (data: { first_name: string; last_name: string; mobile: string; email?: string; password: string; password_confirmation: string }) => Promise<void>
  sendOtp:   (mobile: string) => Promise<void>
  verifyOtp: (mobile: string, otp: string) => Promise<void>
  logout:    () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<User | null>(null)
  const [token,     setToken]     = useState<string | null>(null)
  const [acl,       setAcl]       = useState<Acl | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('ixp_token')
    const u = localStorage.getItem('ixp_user')
    const a = localStorage.getItem('ixp_acl')
    if (t && u) {
      setToken(t)
      setUser(JSON.parse(u))
      if (a) setAcl(JSON.parse(a))
    }
    setIsLoading(false)
  }, [])

  const save = (t: string, u: User, a: Acl | null) => {
    localStorage.setItem('ixp_token', t)
    localStorage.setItem('ixp_user', JSON.stringify(u))
    if (a) localStorage.setItem('ixp_acl', JSON.stringify(a))
    setToken(t); setUser(u); setAcl(a)
  }

  const login = async (mobile: string, password: string) => {
    const res = await authApi.login(mobile, password)
    const d = res.data.data
    save(d.access_token, d.user, d.acl)
    toast.success('Welcome back, ' + d.user.first_name)
  }

  const register = async (data: { first_name: string; last_name: string; mobile: string; email?: string; password: string; password_confirmation: string }) => {
    const res = await authApi.register(data)
    const d = res.data.data
    save(d.access_token, d.user, d.acl)
    toast.success('Welcome, ' + d.user.first_name)
  }

  const sendOtp = async (mobile: string) => {
    await authApi.sendOtp(mobile)
    toast.success('OTP sent')
  }

  const verifyOtp = async (mobile: string, otp: string) => {
    const res = await authApi.verifyOtp(mobile, otp)
    const d = res.data.data
    save(d.access_token, d.user, d.acl)
    toast.success('Verified — welcome ' + d.user.first_name)
  }

  const logout = async () => {
    await authApi.logout().catch(() => {})
    ;['ixp_token','ixp_user','ixp_acl'].forEach(k => localStorage.removeItem(k))
    setToken(null); setUser(null); setAcl(null)
    toast.success('Signed out')
  }

  const hasPermission = (p: string) =>
    !p || (acl?.permissions?.includes(p) ?? false)

  return React.createElement(
    Ctx.Provider,
    {
      value: { user, token, acl, isLoading, hasPermission, login, register, sendOtp, verifyOtp, logout }
    },
    children
  )
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth outside AuthProvider')
  return c
}