'use client'

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { CalendarView } from '@promohub/types'

interface CalendarHeaderProps {
  currentDate: Date
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onNavigate: (direction: 'prev' | 'next') => void
  onToday: () => void
  onAddPromotion?: () => void
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onNavigate,
  onToday,
  onAddPromotion,
}: CalendarHeaderProps) {
  const getDateDisplay = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'yyyy년 M월', { locale: ko })
      case 'week':
        return format(currentDate, 'yyyy년 M월 W주차', { locale: ko })
      case 'day':
        return format(currentDate, 'yyyy년 M월 d일 (EEEE)', { locale: ko })
      default:
        return format(currentDate, 'yyyy년 M월', { locale: ko })
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Navigation */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigate('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="이전"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="다음"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 min-w-[160px]">
          {getDateDisplay()}
        </h2>

        <button
          onClick={onToday}
          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
        >
          오늘
        </button>
      </div>

      {/* View toggle and actions */}
      <div className="flex items-center gap-3">
        {/* View toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewChange('month')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              view === 'month'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            월간
          </button>
          <button
            onClick={() => onViewChange('week')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              view === 'week'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            주간
          </button>
          <button
            onClick={() => onViewChange('day')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              view === 'day'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            일간
          </button>
        </div>

        {/* Add promotion button */}
        {onAddPromotion && (
          <button
            onClick={onAddPromotion}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">프로모션 추가</span>
          </button>
        )}
      </div>
    </div>
  )
}
