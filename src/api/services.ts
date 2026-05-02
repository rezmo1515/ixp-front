// src/api/services.ts

import client from './client'

import type {
  ApiResponse, AuthResult, PingResult, DnsResult,
  WhoisResult, SendMessagePayload, MessageResult, Message,
} from '../types'

// ── Auth ──────────────────────────────────────────────────────────

export const authApi = {
  login: (mobile: string, password: string) =>
    client.post<ApiResponse<AuthResult>>('/auth/login', { mobile, password }),

  register: (data: {
    first_name: string; last_name: string
    mobile: string; email?: string
    password: string; password_confirmation: string
  }) => client.post<ApiResponse<AuthResult>>('/auth/register', data),

  sendOtp: (mobile: string) =>
    client.post<ApiResponse<null>>('/auth/otp/send', { mobile }),

  verifyOtp: (mobile: string, otp: string) =>
    client.post<ApiResponse<AuthResult>>('/auth/otp/verify', { mobile, otp }),

  logout: () =>
    client.post<ApiResponse<null>>('/auth/logout'),

}

  export const userApi = {
    list: () =>
      client.get<ApiResponse<any[]>>('/auth/user'),
  }

// ── Ping ──────────────────────────────────────────────────────────

export const pingApi = {
  run: (target: string, count = 4) =>
    client.post<ApiResponse<PingResult>>('/ping-test', { target, count }),

  history: (target: string) =>
    client.get<ApiResponse<PingResult[]>>('/ping-test/history', { params: { target } }),

  uptime: (target: string, hours = 24) =>
    client.get<ApiResponse<{ target: string; hours: number; uptime: number }>>(
      '/ping-test/uptime', { params: { target, hours } }
    ),
}

// ── DNS ───────────────────────────────────────────────────────────

export const dnsApi = {
  check: (domains: string[], nameservers: string[], timeout = 5) =>
    client.post<ApiResponse<DnsResult>>('dns/check', { domains, nameservers, timeout }),
}

// ── Whois ─────────────────────────────────────────────────────────

export const whoisApi = {
  lookup: (domain: string, useCache = true, timeout = 10) =>
    client.post<ApiResponse<WhoisResult>>('/whois', { domain, use_cache: useCache, timeout }),

  clearCache: (domain: string) =>
    client.delete<ApiResponse<{ cleared: string }>>('/whois/cache', { data: { domain } }),

  servers: () =>
    client.get<ApiResponse<{ supported_tlds: number; servers: Record<string, string> }>>('/whois/servers'),
}

// ── Messaging ─────────────────────────────────────────────────────

export const messageApi = {
  send: (payload: SendMessagePayload) =>
    client.post<ApiResponse<MessageResult>>('/messages', payload),

  list: (page = 1, senderId?: number) =>
    client.get<ApiResponse<{ data: Message[]; pagination: object }>>('/messages', {
      params: { page, sender_id: senderId },
    }),

  show: (id: number) =>
    client.get<ApiResponse<Message>>(`/messages/${id}`),

  logs: (id: number) =>
    client.get<ApiResponse<object[]>>(`/messages/${id}/logs`),

  stats: () =>
    client.get<ApiResponse<{
      total_messages: number
      sent_messages: number
      failed_messages: number
      pending_messages: number
      total_sent_recipients: number
      total_failed_recipients: number
    }>>('/messages/stats'),
}