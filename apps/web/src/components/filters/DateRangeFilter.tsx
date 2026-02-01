'use client'

import { useState, useCallback } from 'react'
import { ChevronDown, ChevronUp, X, Calendar } from 'lucide-react'
import { useFilterContext } from './FilterProvider'

interface DateRangeFilterProps {
  defaultExpanded?: boolean
}

export function DateRangeFilter({ defaultExpanded = true }: DateRangeFilterProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const { startDate, endDate, setDateRange, clearDateRange } = useFilterContext()

  const handleStartDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStartDate = e.target.value || null
      setDateRange(newStartDate, endDate)
    },
    [endDate, setDateRange]
  )

  const handleEndDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newEndDate = e.target.value || null
      setDateRange(startDate, newEndDate)
    },
    [startDate, setDateRange]
  )

  const hasDateFilter = startDate || endDate

  // Quick date range presets
  const applyPreset = useCallback(
    (preset: 'thisMonth' | 'nextMonth' | 'thisQuarter' | 'thisYear') => {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth()

      let start: Date
      let end: Date

      switch (preset) {
        case 'thisMonth':
          start = new Date(year, month, 1)
          end = new Date(year, month + 1, 0)
          break
        case 'nextMonth':
          start = new Date(year, month + 1, 1)
          end = new Date(year, month + 2, 0)
          break
        case 'thisQuarter':
          const quarterStart = Math.floor(month / 3) * 3
          start = new Date(year, quarterStart, 1)
          end = new Date(year, quarterStart + 3, 0)
          break
        case 'thisYear':
          start = new Date(year, 0, 1)
          end = new Date(year, 11, 31)
          break
      }

      setDateRange(formatDate(start), formatDate(end))
    },
    [setDateRange]
  )

  return (
    <div className="border-b border-gray-200 pb-4">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 text-left"
        aria-expanded={isExpanded}
        aria-controls="date-filter-content"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">기간</h3>
          {hasDateFilter && (
            <span className="text-xs text-primary-600 font-medium">
              필터 적용됨
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div id="date-filter-content" className="mt-2 space-y-3">
          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset('thisMonth')}
              className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              이번 달
            </button>
            <button
              type="button"
              onClick={() => applyPreset('nextMonth')}
              className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              다음 달
            </button>
            <button
              type="button"
              onClick={() => applyPreset('thisQuarter')}
              className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              이번 분기
            </button>
            <button
              type="button"
              onClick={() => applyPreset('thisYear')}
              className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              올해
            </button>
          </div>

          {/* Date inputs */}
          <div className="space-y-2">
            {/* Start date */}
            <div>
              <label
                htmlFor="filter-start-date"
                className="block text-xs text-gray-500 mb-1"
              >
                시작일
              </label>
              <div className="relative">
                <input
                  id="filter-start-date"
                  type="date"
                  value={startDate || ''}
                  onChange={handleStartDateChange}
                  max={endDate || undefined}
                  className="
                    w-full px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    [&::-webkit-calendar-picker-indicator]:opacity-0
                    [&::-webkit-calendar-picker-indicator]:absolute
                    [&::-webkit-calendar-picker-indicator]:right-2
                    [&::-webkit-calendar-picker-indicator]:cursor-pointer
                  "
                />
                <Calendar
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* End date */}
            <div>
              <label
                htmlFor="filter-end-date"
                className="block text-xs text-gray-500 mb-1"
              >
                종료일
              </label>
              <div className="relative">
                <input
                  id="filter-end-date"
                  type="date"
                  value={endDate || ''}
                  onChange={handleEndDateChange}
                  min={startDate || undefined}
                  className="
                    w-full px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    [&::-webkit-calendar-picker-indicator]:opacity-0
                    [&::-webkit-calendar-picker-indicator]:absolute
                    [&::-webkit-calendar-picker-indicator]:right-2
                    [&::-webkit-calendar-picker-indicator]:cursor-pointer
                  "
                />
                <Calendar
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Clear button */}
          {hasDateFilter && (
            <button
              type="button"
              onClick={clearDateRange}
              className="
                flex items-center gap-1 px-3 py-1.5 w-full justify-center
                text-xs font-medium text-red-600 bg-red-50 rounded-lg
                hover:bg-red-100 transition-colors
              "
            >
              <X size={14} />
              기간 필터 해제
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Format a Date object to YYYY-MM-DD string
 */
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
