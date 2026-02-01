'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { CalendarPromotion } from '@promohub/types'

// Channel color mapping (fallback for when channelColor is not provided)
export const CHANNEL_COLORS: Record<string, { bg: string; hex: string }> = {
  oliveyoung: { bg: 'bg-[#9ACD32]', hex: '#9ACD32' },
  coupang: { bg: 'bg-[#E31837]', hex: '#E31837' },
  naver: { bg: 'bg-[#03C75A]', hex: '#03C75A' },
  kakao: { bg: 'bg-[#FEE500]', hex: '#FEE500' },
  musinsa: { bg: 'bg-black', hex: '#000000' },
  ssg: { bg: 'bg-pink-500', hex: '#ec4899' },
  lotteon: { bg: 'bg-red-600', hex: '#dc2626' },
  '11st': { bg: 'bg-red-400', hex: '#f87171' },
}

const DEFAULT_COLOR = '#6B7280'

// Helper to determine if text should be light or dark based on background color
function getContrastTextColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '')

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return white for dark backgrounds, dark gray for light backgrounds
  return luminance > 0.5 ? '#1f2937' : '#ffffff'
}

interface PromotionCardProps {
  promotion: CalendarPromotion
  variant?: 'compact' | 'default' | 'expanded'
  onClick?: (promotion: CalendarPromotion) => void
}

export function PromotionCard({
  promotion,
  variant = 'default',
  onClick,
}: PromotionCardProps) {
  // Use channelColor from promotion, or fall back to CHANNEL_COLORS, or default
  const bgColor = promotion.channelColor || CHANNEL_COLORS[promotion.channelId]?.hex || DEFAULT_COLOR
  const textColor = getContrastTextColor(bgColor)

  const handleClick = () => {
    onClick?.(promotion)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.(promotion)
    }
  }

  // Compact variant - used in month view cells
  if (variant === 'compact') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-90 transition-opacity"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {promotion.title}
      </div>
    )
  }

  // Expanded variant - used in day view or detail panels
  if (variant === 'expanded') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="border-l-4 bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
        style={{ borderColor: bgColor }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{promotion.title}</h4>
            <div className="mt-1 flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                {promotion.channelName}
              </span>
              <StatusBadge status={promotion.status} />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {format(new Date(promotion.startDate), 'M월 d일', { locale: ko })} -{' '}
              {format(new Date(promotion.endDate), 'M월 d일', { locale: ko })}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Default variant - used in week view
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="text-sm px-2 py-1.5 rounded cursor-pointer hover:opacity-90 transition-opacity"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="font-medium truncate">{promotion.title}</div>
      {promotion.isMultiDay && (
        <div className="text-xs opacity-80 truncate">
          {promotion.channelName}
        </div>
      )}
    </div>
  )
}

// Status badge component
function StatusBadge({ status }: { status: CalendarPromotion['status'] }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    planned: { label: '예정', className: 'bg-blue-100 text-blue-700' },
    active: { label: '진행중', className: 'bg-green-100 text-green-700' },
    ended: { label: '종료', className: 'bg-gray-100 text-gray-600' },
    cancelled: { label: '취소', className: 'bg-red-100 text-red-700' },
  }

  const config = statusConfig[status] || statusConfig.planned

  return (
    <span className={`text-xs px-2 py-0.5 rounded ${config.className}`}>
      {config.label}
    </span>
  )
}

// Multi-day promotion bar for month view
interface PromotionBarProps {
  promotion: CalendarPromotion
  position: 'start' | 'middle' | 'end' | 'single'
  onClick?: (promotion: CalendarPromotion) => void
}

export function PromotionBar({ promotion, position, onClick }: PromotionBarProps) {
  const bgColor = promotion.channelColor || CHANNEL_COLORS[promotion.channelId]?.hex || DEFAULT_COLOR
  const textColor = getContrastTextColor(bgColor)

  const handleClick = () => {
    onClick?.(promotion)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.(promotion)
    }
  }

  const borderRadius = {
    start: 'rounded-l',
    middle: '',
    end: 'rounded-r',
    single: 'rounded',
  }[position]

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`text-xs px-2 py-1 ${borderRadius} cursor-pointer hover:opacity-90 transition-opacity truncate`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {(position === 'start' || position === 'single') && promotion.title}
    </div>
  )
}
