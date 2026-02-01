'use client'

import { forwardRef } from 'react'
import { Calendar } from 'lucide-react'

interface DateRangeInputProps {
  startDate?: string
  endDate?: string
  onStartDateChange?: (value: string) => void
  onEndDateChange?: (value: string) => void
  startError?: string
  endError?: string
  disabled?: boolean
  label?: string
  required?: boolean
  minDate?: string
  maxDate?: string
}

export const DateRangeInput = forwardRef<HTMLDivElement, DateRangeInputProps>(
  function DateRangeInput(
    {
      startDate,
      endDate,
      onStartDateChange,
      onEndDateChange,
      startError,
      endError,
      disabled = false,
      label = '프로모션 기간 (Promotion Period)',
      required = false,
      minDate,
      maxDate,
    },
    ref
  ) {
    // Calculate duration in days
    const getDuration = (): string | null => {
      if (!startDate || !endDate) return null
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return null
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      if (diffDays < 0) return null
      return `${diffDays}일 (${diffDays} days)`
    }

    const duration = getDuration()

    return (
      <div ref={ref} className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Start Date */}
          <div className="flex-1 space-y-1">
            <label className="block text-xs text-gray-500">
              시작일 (Start)
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="date"
                value={startDate || ''}
                onChange={(e) => onStartDateChange?.(e.target.value)}
                disabled={disabled}
                min={minDate}
                max={maxDate}
                className={`
                  w-full pl-10 pr-4 py-2.5 border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${startError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
                `}
              />
            </div>
            {startError && <p className="text-sm text-red-500">{startError}</p>}
          </div>

          {/* Separator */}
          <div className="hidden sm:flex items-center justify-center pt-6">
            <span className="text-gray-400">~</span>
          </div>

          {/* End Date */}
          <div className="flex-1 space-y-1">
            <label className="block text-xs text-gray-500">
              종료일 (End)
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="date"
                value={endDate || ''}
                onChange={(e) => onEndDateChange?.(e.target.value)}
                disabled={disabled}
                min={startDate || minDate}
                max={maxDate}
                className={`
                  w-full pl-10 pr-4 py-2.5 border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${endError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
                `}
              />
            </div>
            {endError && <p className="text-sm text-red-500">{endError}</p>}
          </div>
        </div>

        {/* Duration display */}
        {duration && (
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-primary-500 rounded-full"></span>
            프로모션 기간: {duration}
          </p>
        )}
      </div>
    )
  }
)
