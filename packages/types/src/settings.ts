// Settings types

import type { ChannelSlug } from './channel'
import type { TeamRole } from './team'

// Notification settings
export interface NotificationSettings {
  emailEnabled: boolean
  slackEnabled: boolean
  kakaoEnabled: boolean
  promotionReminders: boolean
  reminderDaysBefore: number // Days before promotion start
  dailyDigest: boolean
  digestTime: string // HH:mm format
  conflictAlerts: boolean
  teamUpdates: boolean
}

// Channel preference for a team
export interface ChannelPreference {
  channelId: string
  channelSlug: ChannelSlug
  isActive: boolean
  displayOrder: number
  color?: string
  apiConnected: boolean
}

// Team settings
export interface TeamSettings {
  teamId: string
  defaultCurrency: 'KRW' | 'USD'
  fiscalYearStart: number // Month (1-12)
  channelPreferences: ChannelPreference[]
  notificationSettings: NotificationSettings
  createdAt: string
  updatedAt: string
}

// Billing settings
export type BillingPlan = 'free' | 'starter' | 'professional' | 'enterprise'
export type BillingCycle = 'monthly' | 'yearly'
export type PaymentMethod = 'card' | 'bank_transfer'

export interface BillingSettings {
  teamId: string
  plan: BillingPlan
  billingCycle: BillingCycle
  paymentMethod?: PaymentMethod
  nextBillingDate?: string
  cancelAtPeriodEnd: boolean
  seats: number
  usedSeats: number
}

// Integration settings
export interface IntegrationCredential {
  id: string
  provider: 'coupang' | 'naver' | 'kakao' | 'oliveyoung' | 'slack' | 'stripe' | 'toss'
  isConnected: boolean
  lastSyncAt?: string
  expiresAt?: string
  scopes?: string[]
}

export interface IntegrationSettings {
  teamId: string
  credentials: IntegrationCredential[]
}

// API key for external access
export interface ApiKey {
  id: string
  teamId: string
  name: string
  keyPrefix: string // First 8 chars of key for identification
  permissions: ('read' | 'write' | 'admin')[]
  lastUsedAt?: string
  expiresAt?: string
  createdAt: string
  createdBy: string
}

// Audit log entry
export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'export'
  | 'invite'
  | 'role_change'
  | 'login'
  | 'logout'
  | 'settings_change'

export type AuditEntityType =
  | 'promotion'
  | 'team'
  | 'member'
  | 'product'
  | 'channel'
  | 'settings'
  | 'api_key'

export interface AuditLogEntry {
  id: string
  teamId: string
  userId: string
  action: AuditAction
  entityType: AuditEntityType
  entityId: string
  changes?: Record<string, { old: unknown; new: unknown }>
  ipAddress?: string
  userAgent?: string
  timestamp: string
}

// Settings update payloads
export interface UpdateTeamSettingsInput {
  defaultCurrency?: 'KRW' | 'USD'
  fiscalYearStart?: number
}

export interface UpdateNotificationSettingsInput {
  emailEnabled?: boolean
  slackEnabled?: boolean
  kakaoEnabled?: boolean
  promotionReminders?: boolean
  reminderDaysBefore?: number
  dailyDigest?: boolean
  digestTime?: string
  conflictAlerts?: boolean
  teamUpdates?: boolean
}

export interface UpdateChannelPreferenceInput {
  channelId: string
  isActive?: boolean
  displayOrder?: number
  color?: string
}
