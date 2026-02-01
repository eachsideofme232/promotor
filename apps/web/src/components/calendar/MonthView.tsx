'use client'

import { useMemo } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import type { CalendarPromotion } from '@promohub/types'
import { PromotionCard } from './PromotionCard'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

interface MonthViewProps {
  currentDate: Date
  promotions: CalendarPromotion[]
  onDateClick?: (date: Date) => void
  onPromotionClick?: (promotion: CalendarPromotion) => void
  maxPromotionsPerDay?: number
}

export function MonthView({
  currentDate,
  promotions,
  onDateClick,
  onPromotionClick,
  maxPromotionsPerDay = 3,
}: MonthViewProps) {
  // Generate calendar days for the month view
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentDate])

  // Group promotions by date
  const promotionsByDate = useMemo(() => {
    const map = new Map<string, CalendarPromotion[]>()

    promotions.forEach((promotion) => {
      const start = parseISO(promotion.startDate)
      const end = parseISO(promotion.endDate)

      calendarDays.forEach((day) => {
        if (day >= start && day <= end) {
          const dateKey = format(day, 'yyyy-MM-dd')
          const existing = map.get(dateKey) || []
          // Avoid duplicates
          if (!existing.some((p) => p.id === promotion.id)) {
            map.set(dateKey, [...existing, promotion])
          }
        }
      })
    })

    return map
  }, [promotions, calendarDays])

  const handleDateClick = (date: Date) => {
    onDateClick?.(date)
  }

  const handleDateKeyDown = (e: React.KeyboardEvent, date: Date) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onDateClick?.(date)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`p-2 sm:p-3 text-center text-xs sm:text-sm font-medium ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dateKey = format(day, 'yyyy-MM-dd')
          const dayPromotions = promotionsByDate.get(dateKey) || []
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isTodayDate = isToday(day)
          const dayOfWeek = day.getDay()
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

          return (
            <div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => handleDateClick(day)}
              onKeyDown={(e) => handleDateKeyDown(e, day)}
              className={`min-h-[80px] sm:min-h-[120px] border-b border-r border-gray-100 p-1 sm:p-2 transition-colors cursor-pointer ${
                isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {/* Day number */}
              <div className="flex justify-start mb-1">
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 text-xs sm:text-sm ${
                    isTodayDate
                      ? 'bg-primary-600 text-white rounded-full font-medium'
                      : isCurrentMonth
                      ? dayOfWeek === 0
                        ? 'text-red-500'
                        : dayOfWeek === 6
                        ? 'text-blue-500'
                        : 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                >
                  {format(day, 'd')}
                </span>
              </div>

              {/* Promotions */}
              <div className="space-y-1">
                {dayPromotions.slice(0, maxPromotionsPerDay).map((promotion) => (
                  <PromotionCard
                    key={promotion.id}
                    promotion={promotion}
                    variant="compact"
                    onClick={onPromotionClick}
                  />
                ))}
                {dayPromotions.length > maxPromotionsPerDay && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDateClick(day)
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 px-1"
                  >
                    +{dayPromotions.length - maxPromotionsPerDay}개 더보기
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
