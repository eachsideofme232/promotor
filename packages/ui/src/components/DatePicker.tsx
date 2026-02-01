'use client'

import { forwardRef, useState, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../utils/cn'

export interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  className?: string
  dateFormat?: string
  locale?: 'ko' | 'en'
}

const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토']
const WEEKDAYS_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = '날짜 선택',
      disabled = false,
      error = false,
      className,
      dateFormat = 'yyyy년 MM월 dd일',
      locale = 'ko',
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [viewDate, setViewDate] = useState<Date>(value || new Date())

    const weekdays = locale === 'ko' ? WEEKDAYS_KO : WEEKDAYS_EN

    const monthStart = startOfMonth(viewDate)
    const monthEnd = endOfMonth(viewDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Get the day of week the month starts on (0 = Sunday)
    const startDay = getDay(monthStart)

    // Create padding for days before the start of the month
    const paddingDays = Array(startDay).fill(null)

    const handleSelect = (date: Date) => {
      onChange?.(date)
      setOpen(false)
    }

    const handleClear = () => {
      onChange?.(null)
    }

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary-500',
              !value && 'text-gray-400',
              className
            )}
          >
            <span className="truncate">
              {value
                ? format(value, dateFormat, { locale: locale === 'ko' ? ko : undefined })
                : placeholder}
            </span>
            <Calendar className="h-4 w-4 text-gray-400" />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className="z-50 w-auto rounded-lg border border-gray-200 bg-white p-3 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            align="start"
            sideOffset={4}
          >
            {/* Header with navigation */}
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewDate(subMonths(viewDate, 1))}
                className="rounded p-1 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">
                {format(viewDate, 'yyyy년 MM월', { locale: locale === 'ko' ? ko : undefined })}
              </span>
              <button
                type="button"
                onClick={() => setViewDate(addMonths(viewDate, 1))}
                className="rounded p-1 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="mb-1 grid grid-cols-7 gap-1">
              {weekdays.map((day, i) => (
                <div
                  key={day}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center text-xs font-medium',
                    i === 0 && 'text-red-500', // Sunday
                    i === 6 && 'text-blue-500' // Saturday
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Padding days */}
              {paddingDays.map((_, i) => (
                <div key={`padding-${i}`} className="h-8 w-8" />
              ))}

              {/* Actual days */}
              {days.map((day) => {
                const isSelected = value && isSameDay(day, value)
                const dayOfWeek = getDay(day)

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => handleSelect(day)}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded text-sm transition-colors',
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : isToday(day)
                          ? 'bg-gray-100 font-medium'
                          : 'hover:bg-gray-100',
                      !isSelected && dayOfWeek === 0 && 'text-red-500',
                      !isSelected && dayOfWeek === 6 && 'text-blue-500',
                      !isSameMonth(day, viewDate) && 'text-gray-300'
                    )}
                  >
                    {format(day, 'd')}
                  </button>
                )
              })}
            </div>

            {/* Footer with clear button */}
            {value && (
              <div className="mt-2 flex justify-end border-t border-gray-100 pt-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  초기화
                </button>
              </div>
            )}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    )
  }
)

DatePicker.displayName = 'DatePicker'
