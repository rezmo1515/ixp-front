// src/types/message.types.ts

export interface SendMessagePayload {
  sender_id: number
  recipients: string[]        // or number[] if you use IDs
  message: string
  channel?: 'sms' | 'email' | 'whatsapp'
  scheduled_at?: string | null
}

export interface Message {
  id: number
  sender_id: number
  message: string
  channel: string
  status: 'pending' | 'sent' | 'failed'
  created_at: string
}

export interface MessageResult {
  id: number
  status: string
  sent_at: string | null
  sent_count: number
  failed_count: number

  is_scheduled?: boolean
  total_recipients?: number
}
