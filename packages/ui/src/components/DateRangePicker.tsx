'use client'

import { forwardRef, useState, type ComponentPropsWithoutRef } from 'react'
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
  isWithinInterval,
  isBefore,
  isAfter,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../utils/cn'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  className?: string
  dateFormat?: string
  locale?: 'ko' | 'en'
}

const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토']
const WEEKDAYS_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value = { start: null, end: null },
      onChange,
      placeholder = '기간 선택',
      disabled = false,
      error = false,
      className,
      dateFormat = 'yyyy.MM.dd',
      locale = 'ko',
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [viewDate, setViewDate] = useState<Date>(value.start || new Date())
    const [selecting, setSelecting] = useState<'start' | 'end'>('start')
    const [hoverDate, setHoverDate] = useState<Date | null>(null)

    const weekdays = locale === 'ko' ? WEEKDAYS_KO : WEEKDAYS_EN
    const dateLocale = locale === 'ko' ? ko : undefined

    const monthStart = startOfMonth(viewDate)
    const monthEnd = endOfMonth(viewDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const startDay = getDay(monthStart)
    const paddingDays = Array(startDay).fill(null)

    // Second month view
    const nextMonthView = addMonths(viewDate, 1)
    const nextMonthStart = startOfMonth(nextMonthView)
    const nextMonthEnd = endOfMonth(nextMonthView)
    const nextDays = eachDayOfInterval({ start: nextMonthStart, end: nextMonthEnd })
    const nextStartDay = getDay(nextMonthStart)
    const nextPaddingDays = Array(nextStartDay).fill(null)

    const handleSelect = (date: Date) => {
      if (selecting === 'start') {
        onChange?.({ start: date, end: null })
        setSelecting('end')
      } else {
        if (value.start && isBefore(date, value.start)) {
          // If selected end is before start, swap them
          onChange?.({ start: date, end: value.start })
        } else {
          onChange?.({ start: value.start, end: date })
        }
        setSelecting('start')
        setOpen(false)
      }
    }

    const handleClear = () => {
      onChange?.({ start: null, end: null })
      setSelecting('start')
    }

    const isInRange = (day: Date): boolean => {
      if (!value.start) return false

      if (value.end) {
        return isWithinInterval(day, { start: value.start, end: value.end })
      }

      if (hoverDate && selecting === 'end') {
        const rangeStart = isBefore(hoverDate, value.start) ? hoverDate : value.start
        const rangeEnd = isAfter(hoverDate, value.start) ? hoverDate : value.start
        return isWithinInterval(day, { start: rangeStart, end: rangeEnd })
      }

      return false
    }

    const isRangeStart = (day: Date): boolean => {
      return value.start ? isSameDay(day, value.start) : false
    }

    const isRangeEnd = (day: Date): boolean => {
      return value.end ? isSameDay(day, value.end) : false
    }

    const formatValue = (): string => {
      if (!value.start && !value.end) return placeholder
      if (value.start && !value.end) {
        return `${format(value.start, dateFormat, { locale: dateLocale })} ~`
      }
      if (value.start && value.end) {
        return `${format(value.start, dateFormat, { locale: dateLocale })} ~ ${format(value.end, dateFormat, { locale: dateLocale })}`
      }
      return placeholder
    }

    const renderMonth = (
      monthDays: Date[],
      padding: null[],
      monthDate: Date,
      key: string
    ) => (
      <div key={key}>
        {/* Month header */}
        <div className="mb-2 text-center text-sm font-medium">
          {format(monthDate, 'yyyy년 MM월', { locale: dateLocale })}
        </div>

        {/* Weekday headers */}
        <div className="mb-1 grid grid-cols-7 gap-0.5">
          {weekdays.map((day, i) => (
            <div
              key={`${key}-${day}`}
              className={cn(
                'flex h-7 w-7 items-center justify-center text-xs font-medium',
                i === 0 && 'text-red-500',
                i === 6 && 'text-blue-500'
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {padding.map((_, i) => (
            <div key={`${key}-padding-${i}`} className="h-7 w-7" />
          ))}

          {monthDays.map((day) => {
            const isStart = isRangeStart(day)
            const isEnd = isRangeEnd(day)
            const inRange = isInRange(day)
            const dayOfWeek = getDay(day)

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => handleSelect(day)}
                onMouseEnter={() => setHoverDate(day)}
                onMouseLeave={() => setHoverDate(null)}
                className={cn(
                  'flex h-7 w-7 items-center justify-center text-sm transition-colors',
                  // Range styling
                  inRange && !isStart && !isEnd && 'bg-primary-100',
                  isStart && 'rounded-l bg-primary-600 text-white',
                  isEnd && 'rounded-r bg-primary-600 text-white',
                  isStart && isEnd && 'rounded',
                  // Default styling
                  !isStart && !isEnd && !inRange && 'rounded hover:bg-gray-100',
                  !isStart && !isEnd && isToday(day) && 'font-medium ring-1 ring-inset ring-gray-300',
                  !isStart && !isEnd && !inRange && dayOfWeek === 0 && 'text-red-500',
                  !isStart && !isEnd && !inRange && dayOfWeek === 6 && 'text-blue-500',
                  !isSameMonth(day, monthDate) && 'text-gray-300'
                )}
              >
                {format(day, 'd')}
              </button>
            )
          })}
        </div>
      </div>
    )

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
              !value.start && !value.end && 'text-gray-400',
              className
            )}
          >
            <span className="truncate">{formatValue()}</span>
            <Calendar className="h-4 w-4 text-gray-400" />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className="z-50 rounded-lg border border-gray-200 bg-white p-3 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            align="start"
            sideOffset={4}
          >
            {/* Navigation */}
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewDate(subMonths(viewDate, 1))}
                className="rounded p-1 hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-gray-500">
                {selecting === 'start' ? '시작일 선택' : '종료일 선택'}
              </span>
              <button
                type="button"
                onClick={() => setViewDate(addMonths(viewDate, 1))}
                className="rounded p-1 hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Two month view */}
            <div className="flex gap-4">
              {renderMonth(days, paddingDays, viewDate, 'current')}
              {renderMonth(nextDays, nextPaddingDays, nextMonthView, 'next')}
            </div>

            {/* Footer */}
            {(value.start || value.end) && (
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

DateRangePicker.displayName = 'DateRangePicker'
