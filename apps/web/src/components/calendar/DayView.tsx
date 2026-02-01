'use client'

import { useMemo } from 'react'
import {
  format,
  isToday,
  parseISO,
  startOfDay,
  endOfDay,
  addHours,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import type { CalendarPromotion } from '@promohub/types'
import { PromotionCard, CHANNEL_COLORS } from './PromotionCard'

const DEFAULT_COLOR = '#6B7280'

// Helper to determine if text should be light or dark based on background color
function getContrastTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#1f2937' : '#ffffff'
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

interface DayViewProps {
  currentDate: Date
  promotions: CalendarPromotion[]
  onTimeClick?: (date: Date) => void
  onPromotionClick?: (promotion: CalendarPromotion) => void
}

export function DayView({
  currentDate,
  promotions,
  onTimeClick,
  onPromotionClick,
}: DayViewProps) {
  const isTodayDate = isToday(currentDate)
  const dayOfWeek = currentDate.getDay()

  // Filter promotions for this day
  const dayPromotions = useMemo(() => {
    const dayStart = startOfDay(currentDate)
    const dayEnd = endOfDay(currentDate)

    return promotions.filter((promotion) => {
      const start = parseISO(promotion.startDate)
      const end = parseISO(promotion.endDate)
      return start <= dayEnd && end >= dayStart
    })
  }, [promotions, currentDate])

  const handleTimeSlotClick = (hour: number) => {
    const dateWithTime = addHours(startOfDay(currentDate), hour)
    onTimeClick?.(dateWithTime)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col lg:flex-row h-full">
      {/* Main timeline section */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Day header */}
        <div className="border-b border-gray-200 bg-gray-50 p-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div
              className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 text-xl sm:text-2xl font-medium ${
                isTodayDate
                  ? 'bg-primary-600 text-white rounded-full'
                  : 'text-gray-900'
              }`}
            >
              {format(currentDate, 'd')}
            </div>
            <div>
              <div
                className={`text-lg font-medium ${
                  dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-900'
                }`}
              >
                {format(currentDate, 'EEEE', { locale: ko })}
              </div>
              <div className="text-sm text-gray-500">
                {format(currentDate, 'yyyy년 M월 d일', { locale: ko })}
              </div>
            </div>
          </div>
        </div>

        {/* All-day events */}
        {dayPromotions.length > 0 && (
          <div className="border-b border-gray-200 p-4 flex-shrink-0">
            <div className="text-xs text-gray-500 font-medium mb-2">종일 일정</div>
            <div className="flex flex-wrap gap-2">
              {dayPromotions.map((promotion) => {
                const bgColor = promotion.channelColor || CHANNEL_COLORS[promotion.channelId]?.hex || DEFAULT_COLOR
                const textColor = getContrastTextColor(bgColor)
                return (
                  <button
                    key={promotion.id}
                    onClick={() => onPromotionClick?.(promotion)}
                    className="px-3 py-1.5 rounded text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: bgColor, color: textColor }}
                  >
                    {promotion.title}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Time grid */}
        <div className="flex-1 overflow-auto">
          <div className="relative">
            {HOURS.map((hour) => (
              <div key={hour} className="flex border-b border-gray-100">
                {/* Time label */}
                <div className="w-16 sm:w-20 flex-shrink-0 border-r border-gray-200 p-2 text-xs text-gray-500 text-right pr-3">
                  {format(new Date().setHours(hour, 0, 0, 0), 'a h시', { locale: ko })}
                </div>

                {/* Time slot */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleTimeSlotClick(hour)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleTimeSlotClick(hour)
                    }
                  }}
                  className={`flex-1 h-14 transition-colors cursor-pointer ${
                    isTodayDate ? 'bg-primary-50/20 hover:bg-primary-50/40' : 'hover:bg-gray-50'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side panel with promotion details */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            오늘의 프로모션 ({dayPromotions.length})
          </h3>

          {dayPromotions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500">예정된 프로모션이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayPromotions.map((promotion) => (
                <PromotionCard
                  key={promotion.id}
                  promotion={promotion}
                  variant="expanded"
                  onClick={onPromotionClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
