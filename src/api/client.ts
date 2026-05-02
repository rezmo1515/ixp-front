// src/api/client.ts
import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 30_000,
})

client.interceptors.request.use(cfg => {
  const t = localStorage.getItem('ixp_token')
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

client.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      ;['ixp_token','ixp_user','ixp_acl'].forEach(k => localStorage.removeItem(k))
      window.location.href = '/auth'
    }
    return Promise.reject(err)
  }
)

export default client

// ── services ────────────────────────────────────────────────────
import type { ApiResponse, AuthResult, PingResult, DnsResult, WhoisResult, Message } from '../types'

export const authApi = {
  login:     (mobile: string, password: string) =>
    client.post<ApiResponse<AuthResult>>('/auth/login', { mobile, password }),
  sendOtp:   (mobile: string) =>
    client.post<ApiResponse<null>>('/auth/otp/send', { mobile }),
  verifyOtp: (mobile: string, otp: string) =>
    client.post<ApiResponse<AuthResult>>('/auth/otp/verify', { mobile, otp }),
  logout:    () =>
    client.post<ApiResponse<null>>('/auth/logout'),
}

export const pingApi = {
  run: (target: string, count = 4) =>
    client.post<ApiResponse<PingResult>>('/ping-test', { target, count }),
}

export const dnsApi = {
  check: (domains: string[], nameservers: string[], timeout = 5) =>
    client.post<ApiResponse<DnsResult>>('/dns/check', { domains, nameservers, timeout }),
}

export const whoisApi = {
  lookup: (domain: string, useCache = true) =>
    client.post<ApiResponse<WhoisResult>>('/whois', { domain, use_cache: useCache }),
}

export const messageApi = {
  send: (payload: object) =>
    client.post<ApiResponse<object>>('/messages', payload),
  list: (page = 1) =>
    client.get<ApiResponse<{ data: Message[] }>>('/messages', { params: { page } }),
  stats: () =>
    client.get<ApiResponse<object>>('/messages/stats'),
}