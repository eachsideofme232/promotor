// User types

export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  phone?: string
  locale: 'ko' | 'en'
  timezone: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface UserProfile extends Pick<User, 'name' | 'avatarUrl' | 'phone' | 'locale' | 'timezone'> {}

export interface UserPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  weekStartsOn: 0 | 1 // 0 = Sunday, 1 = Monday
  defaultCalendarView: 'month' | 'week' | 'day'
  theme: 'light' | 'dark' | 'system'
}

export interface AuthSession {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  name: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordUpdate {
  currentPassword: string
  newPassword: string
}
