'use client'

import { useState, useCallback } from 'react'
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import type { CalendarView as CalendarViewType, CalendarPromotion } from '@promohub/types'
import { CalendarHeader } from './CalendarHeader'
import { MonthView } from './MonthView'
import { WeekView } from './WeekView'
import { DayView } from './DayView'

interface CalendarViewProps {
  /** Filtered promotions to display (filtering should be handled by parent) */
  promotions: CalendarPromotion[]
  /** Channel options for display purposes */
  channels: { id: string; name: string; color?: string }[]
  /** Initial view type */
  initialView?: CalendarViewType
  /** Initial date to display */
  initialDate?: Date
  /** Callback when add promotion button is clicked */
  onAddPromotion?: () => void
  /** Callback when a promotion is clicked */
  onPromotionClick?: (promotion: CalendarPromotion) => void
  /** Callback when a date/time slot is clicked */
  onDateClick?: (date: Date) => void
  /** Callback when the visible date range changes */
  onDateRangeChange?: (start: Date, end: Date) => void
}

export function CalendarView({
  promotions,
  channels,
  initialView = 'month',
  initialDate,
  onAddPromotion,
  onPromotionClick,
  onDateClick,
  onDateRangeChange,
}: CalendarViewProps) {
  const [view, setView] = useState<CalendarViewType>(initialView)
  const [currentDate, setCurrentDate] = useState<Date>(initialDate || new Date())

  // Calculate date range based on current view
  const getDateRange = useCallback(
    (date: Date, viewType: CalendarViewType) => {
      switch (viewType) {
        case 'month': {
          const monthStart = startOfMonth(date)
          const monthEnd = endOfMonth(date)
          return {
            start: startOfWeek(monthStart, { weekStartsOn: 0 }),
            end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
          }
        }
        case 'week': {
          return {
            start: startOfWeek(date, { weekStartsOn: 0 }),
            end: endOfWeek(date, { weekStartsOn: 0 }),
          }
        }
        case 'day': {
          return {
            start: date,
            end: date,
          }
        }
        default:
          return { start: date, end: date }
      }
    },
    []
  )

  // Navigation handlers
  const handleNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      setCurrentDate((prev) => {
        let newDate: Date
        switch (view) {
          case 'month':
            newDate = direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
            break
          case 'week':
            newDate = direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1)
            break
          case 'day':
            newDate = direction === 'next' ? addDays(prev, 1) : subDays(prev, 1)
            break
          default:
            newDate = prev
        }

        const range = getDateRange(newDate, view)
        onDateRangeChange?.(range.start, range.end)

        return newDate
      })
    },
    [view, getDateRange, onDateRangeChange]
  )

  const handleToday = useCallback(() => {
    const today = new Date()
    setCurrentDate(today)
    const range = getDateRange(today, view)
    onDateRangeChange?.(range.start, range.end)
  }, [view, getDateRange, onDateRangeChange])

  const handleViewChange = useCallback(
    (newView: CalendarViewType) => {
      setView(newView)
      const range = getDateRange(currentDate, newView)
      onDateRangeChange?.(range.start, range.end)
    },
    [currentDate, getDateRange, onDateRangeChange]
  )

  const handleDateClick = useCallback(
    (date: Date) => {
      // When clicking a date in month view, switch to day view
      if (view === 'month') {
        setCurrentDate(date)
        setView('day')
        const range = getDateRange(date, 'day')
        onDateRangeChange?.(range.start, range.end)
      } else {
        onDateClick?.(date)
      }
    },
    [view, getDateRange, onDateClick, onDateRangeChange]
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header section */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">프로모션 캘린더</h1>
          <p className="text-sm text-gray-500">채널별 프로모션 일정을 관리하세요</p>
        </div>

        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={handleViewChange}
          onNavigate={handleNavigate}
          onToday={handleToday}
          onAddPromotion={onAddPromotion}
        />
      </div>

      {/* Calendar body */}
      <div className="flex-1 p-4 sm:p-6 overflow-hidden">
        {view === 'month' && (
          <MonthView
            currentDate={currentDate}
            promotions={promotions}
            onDateClick={handleDateClick}
            onPromotionClick={onPromotionClick}
          />
        )}
        {view === 'week' && (
          <WeekView
            currentDate={currentDate}
            promotions={promotions}
            onDateClick={handleDateClick}
            onPromotionClick={onPromotionClick}
          />
        )}
        {view === 'day' && (
          <DayView
            currentDate={currentDate}
            promotions={promotions}
            onTimeClick={onDateClick}
            onPromotionClick={onPromotionClick}
          />
        )}
      </div>
    </div>
  )
}
