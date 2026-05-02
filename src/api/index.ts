// src/api/index.ts
import axios from 'axios'
import type { ApiResponse, AuthResult, PingResult, DnsResult, WhoisResult, Message, RoleItem, UserItem } from '../types'

const api = axios.create({ baseURL: '/api', headers: { Accept: 'application/json' }, timeout: 30000 })

api.interceptors.request.use(c => {
  const t = localStorage.getItem('ixp_token')
  if (t) c.headers.Authorization = `Bearer ${t}`
  return c
})

api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    ;['ixp_token','ixp_user','ixp_acl'].forEach(k => localStorage.removeItem(k))
    window.location.href = '/auth'
  }
  return Promise.reject(err)
})

export default api

export const authApi = {
  login:     (mobile: string, password: string) => api.post<ApiResponse<AuthResult>>('/auth/login', { mobile, password }),
  register:  (d: object) => api.post<ApiResponse<AuthResult>>('/auth/register', d),
  sendOtp:   (mobile: string) => api.post<ApiResponse<null>>('/auth/otp/send', { mobile }),
  verifyOtp: (mobile: string, otp: string) => api.post<ApiResponse<AuthResult>>('/auth/otp/verify', { mobile, otp }),
  logout:    () => api.post<ApiResponse<null>>('/auth/logout'),
}

export const pingApi = {
  run: (target: string, count = 4) => api.post<ApiResponse<PingResult>>('/ping-test', { target, count }),
}

export const dnsApi = {
  check: (domains: string[], nameservers: string[], timeout = 5) =>
    api.post<ApiResponse<DnsResult>>('/dns-check', { domains, nameservers, timeout }),
}

export const whoisApi = {
  domain: (domain: string, use_cache = true) => api.post<ApiResponse<WhoisResult>>('/whois', { domain, use_cache }),
  ip:     (ip: string) => api.post<ApiResponse<WhoisResult>>('/whois/ip', { ip }),
}

export const msgApi = {
  send:  (payload: object) => api.post<ApiResponse<object>>('/messages', payload),
  list:  (page = 1)        => api.get<ApiResponse<{ data: Message[] }>>('/messages', { params: { page } }),
  stats: ()                => api.get<ApiResponse<object>>('/messages/stats'),
}

export const aclApi = {
  roles:       () => api.get<ApiResponse<RoleItem[]>>('/acl/roles'),
  permissions: () => api.get<ApiResponse<Record<string, { id: number; name: string; label: string }[]>>>('/acl/permissions'),
  createRole:  (d: object) => api.post<ApiResponse<RoleItem>>('/acl/roles', d),
  updateRole:  (id: number, d: object) => api.put<ApiResponse<RoleItem>>(`/acl/roles/${id}`, d),
  deleteRole:  (id: number) => api.delete<ApiResponse<null>>(`/acl/roles/${id}`),
  assignRole:  (userId: number, role_id: number) => api.post<ApiResponse<object>>(`/acl/users/${userId}/role`, { role_id }),
  users:       () => api.get<ApiResponse<{ data: UserItem[] }>>('/users'),
}