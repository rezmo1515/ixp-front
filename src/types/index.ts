// src/types/index.ts

// ─────────────────────────────────────────────
// Generic API Response
// ─────────────────────────────────────────────
export interface ApiResponse<T> {
  statusCode: number
  success: boolean
  message: string
  data: T
}

// ─────────────────────────────────────────────
// Auth / User / ACL
// ─────────────────────────────────────────────
export interface User {
  id: number
  first_name: string
  last_name: string
  mobile: string
  email?: string | null
}

export interface Acl {
  role: string
  permissions: string[] | null
}

export interface AuthResult {
  access_token: string
  token_type: string
  user: User
  acl: Acl | null
  expires_at: string
  ip?: string
}

// ─────────────────────────────────────────────
// Ping
// ─────────────────────────────────────────────
export interface PingNodeResult {
  probe_node_id: number
  status: 'up' | 'down' | 'timeout' | 'error'
  latency_avg: number | null
  latency_min: number | null
  latency_max: number | null
  packet_loss: number | null
  error_message: string | null
  checked_at: string
  node_name: string
  node_location: string
  node_provider: string
}

export interface PingResult {
  target: string
  global_status: 'up' | 'down' | 'partial_outage' | 'unknown'
  global_status_label: string
  summary: {
    total_nodes: number
    up_nodes: number
    down_nodes: number
    average_latency_ms: number
    average_packet_loss: number
  }
  results: PingNodeResult[]
}

// ─────────────────────────────────────────────
// DNS
// ─────────────────────────────────────────────
export interface DnsServerResult {
  domain: string
  nameserver: string
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'ERROR'
  records: string[]
  response_time: number | null
  error_message: string | null
}

export interface DnsDomainResult {
  domain: string
  results: DnsServerResult[]
  summary: {
    total: number
    success: number
    failed: number
    avg_response_ms: number | null
  }
}

export interface DnsResult {
  checked_domains: number
  checked_nameservers: number
  total_checks: number
  results: DnsDomainResult[]
}

export interface WhoisResult {
  domain: string
  status: 'found' | 'not_found' | 'error' | 'timeout'
  is_available: boolean | null
  whois_server: string | null
  from_cache: boolean
  privacy_protected: boolean
  privacy_message: string | null
  registrar: string | null
  registrant: {
    name: string | null
    org: string | null
    email: string | null
    country: string | null
  }
  dates: {
    created_at: string | null
    updated_at: string | null
    expires_at: string | null
  }
  name_servers: string[]
  status_codes: string[]
  error_message: string | null
  raw_data: string | null
}

export type Channel = 'auto' | 'email' | 'sms' | 'whatsapp' | 'bale'

export interface Message {
  id: number
  message: string
  subject: string | null
  channel: Channel
  channel_label: string
  type: string
  type_label: string
  status: string
  status_label: string
  total_recipients: number
  sent_count: number
  failed_count: number
  scheduled_at: string | null
  sent_at: string | null
  created_at: string
}

export interface SendMessagePayload {
  sender_id: number
  subject?: string | null
  message: string
  channel: Channel
  recipients: string[]
  scheduled_at?: string | null
}

export interface SenderChannel {
  subject?: string | null
  message: string
  channel: Channel
  recipients: string[]
}


export interface MessageResult {
  id: number
  status: string
  sent_at: string | null
  sent_count: number
  failed_count: number
}

export interface RoleItem {
  id: number
  name: string
  label: string
  description: string | null
  permissions: string[]
  users_count: number
}

export interface UserItem {
  id: number
  first_name: string
  last_name: string
  mobile: string
  email: string | null
  role_id: number | null
}
