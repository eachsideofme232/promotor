'use client'

import { useMemo } from 'react'
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  parseISO,
  isSameDay,
  addHours,
  startOfDay,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import type { CalendarPromotion } from '@promohub/types'
import { PromotionCard, CHANNEL_COLORS } from './PromotionCard'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

interface WeekViewProps {
  currentDate: Date
  promotions: CalendarPromotion[]
  onDateClick?: (date: Date) => void
  onPromotionClick?: (promotion: CalendarPromotion) => void
}

export function WeekView({
  currentDate,
  promotions,
  onDateClick,
  onPromotionClick,
}: WeekViewProps) {
  // Generate week days
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
    return eachDayOfInterval({ start: weekStart, end: weekEnd })
  }, [currentDate])

  // Get all-day promotions (multi-day or full-day events)
  const allDayPromotions = useMemo(() => {
    const map = new Map<string, CalendarPromotion[]>()

    promotions.forEach((promotion) => {
      const start = parseISO(promotion.startDate)
      const end = parseISO(promotion.endDate)

      weekDays.forEach((day) => {
        if (day >= startOfDay(start) && day <= startOfDay(end)) {
          const dateKey = format(day, 'yyyy-MM-dd')
          const existing = map.get(dateKey) || []
          if (!existing.some((p) => p.id === promotion.id)) {
            map.set(dateKey, [...existing, promotion])
          }
        }
      })
    })

    return map
  }, [promotions, weekDays])

  // Calculate max all-day promotions for any day in the week
  const maxAllDayRows = useMemo(() => {
    let max = 0
    weekDays.forEach((day) => {
      const dateKey = format(day, 'yyyy-MM-dd')
      const count = allDayPromotions.get(dateKey)?.length || 0
      max = Math.max(max, count)
    })
    return Math.min(max, 4) // Cap at 4 rows
  }, [allDayPromotions, weekDays])

  const handleTimeSlotClick = (day: Date, hour: number) => {
    const dateWithTime = addHours(startOfDay(day), hour)
    onDateClick?.(dateWithTime)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full">
      {/* Header with day names and dates */}
      <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
        {/* Time column header */}
        <div className="w-16 sm:w-20 flex-shrink-0 border-r border-gray-200" />

        {/* Day columns */}
        {weekDays.map((day, index) => {
          const isTodayDate = isToday(day)
          const dayOfWeek = day.getDay()

          return (
            <div
              key={index}
              className="flex-1 min-w-0 p-2 sm:p-3 text-center border-r border-gray-200 last:border-r-0"
            >
              <div
                className={`text-xs sm:text-sm font-medium ${
                  dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-600'
                }`}
              >
                {WEEKDAYS[dayOfWeek]}
              </div>
              <div
                className={`mt-1 inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-sm sm:text-base ${
                  isTodayDate
                    ? 'bg-primary-600 text-white rounded-full font-medium'
                    : 'text-gray-900'
                }`}
              >
                {format(day, 'd')}
              </div>
            </div>
          )
        })}
      </div>

      {/* All-day events section */}
      {maxAllDayRows > 0 && (
        <div className="flex border-b border-gray-200 flex-shrink-0">
          {/* Label */}
          <div className="w-16 sm:w-20 flex-shrink-0 border-r border-gray-200 p-2 text-xs text-gray-500 flex items-center justify-center">
            종일
          </div>

          {/* All-day event cells */}
          {weekDays.map((day, index) => {
            const dateKey = format(day, 'yyyy-MM-dd')
            const dayPromotions = allDayPromotions.get(dateKey) || []

            return (
              <div
                key={index}
                className="flex-1 min-w-0 border-r border-gray-200 last:border-r-0 p-1"
                style={{ minHeight: `${Math.max(maxAllDayRows * 28 + 8, 40)}px` }}
              >
                <div className="space-y-1">
                  {dayPromotions.slice(0, 3).map((promotion) => (
                    <PromotionCard
                      key={promotion.id}
                      promotion={promotion}
                      variant="compact"
                      onClick={onPromotionClick}
                    />
                  ))}
                  {dayPromotions.length > 3 && (
                    <div className="text-xs text-gray-500 px-1">
                      +{dayPromotions.length - 3}개
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Time grid */}
      <div className="flex-1 overflow-auto">
        <div className="relative min-h-full">
          {HOURS.map((hour) => (
            <div key={hour} className="flex border-b border-gray-100">
              {/* Time label */}
              <div className="w-16 sm:w-20 flex-shrink-0 border-r border-gray-200 p-1 sm:p-2 text-xs text-gray-500 text-right pr-2">
                {format(new Date().setHours(hour, 0, 0, 0), 'a h시', { locale: ko })}
              </div>

              {/* Hour cells for each day */}
              {weekDays.map((day, dayIndex) => {
                const isTodayDate = isToday(day)

                return (
                  <div
                    key={dayIndex}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleTimeSlotClick(day, hour)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleTimeSlotClick(day, hour)
                      }
                    }}
                    className={`flex-1 min-w-0 h-12 border-r border-gray-100 last:border-r-0 transition-colors cursor-pointer ${
                      isTodayDate ? 'bg-primary-50/30 hover:bg-primary-50/50' : 'hover:bg-gray-50'
                    }`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
