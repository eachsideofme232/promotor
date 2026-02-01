'use client'

import { useState } from 'react'
import { Filter, X, RotateCcw } from 'lucide-react'
import { ChannelFilter } from './ChannelFilter'
import { StatusFilter } from './StatusFilter'
import { DateRangeFilter } from './DateRangeFilter'
import { useFilterContext } from './FilterProvider'
import { useFilterSummary } from './useFilters'

interface FilterSidebarProps {
  className?: string
}

/**
 * Desktop sidebar for filters - always visible on larger screens
 */
export function FilterSidebar({ className = '' }: FilterSidebarProps) {
  const { resetFilters, hasActiveFilters } = useFilterContext()
  const { summary, channelCount, statusCount, totalChannels, totalStatuses } =
    useFilterSummary()

  return (
    <aside
      className={`
        w-64 bg-white border-r border-gray-200 flex-shrink-0
        hidden lg:flex lg:flex-col
        ${className}
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <h2 className="font-semibold text-gray-900">필터</h2>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="
                flex items-center gap-1 px-2 py-1 text-xs font-medium
                text-gray-600 hover:text-gray-900 hover:bg-gray-100
                rounded transition-colors
              "
              title="모든 필터 초기화"
            >
              <RotateCcw size={12} />
              초기화
            </button>
          )}
        </div>

        {/* Active filter summary */}
        {hasActiveFilters && (
          <p className="mt-2 text-xs text-gray-500 truncate" title={summary}>
            {summary}
          </p>
        )}
      </div>

      {/* Filter sections */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <ChannelFilter defaultExpanded />
        <StatusFilter defaultExpanded />
        <DateRangeFilter defaultExpanded />
      </div>

      {/* Footer with stats */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            채널: {channelCount}/{totalChannels}
          </span>
          <span>
            상태: {statusCount}/{totalStatuses}
          </span>
        </div>
      </div>
    </aside>
  )
}

/**
 * Mobile filter button that opens a modal/drawer
 */
export function MobileFilterButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { hasActiveFilters, resetFilters } = useFilterContext()
  const { channelCount, statusCount, totalChannels, totalStatuses } =
    useFilterSummary()

  return (
    <>
      {/* Filter button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`
          lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg
          border transition-colors
          ${
            hasActiveFilters
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        <Filter size={18} />
        <span className="text-sm font-medium">필터</span>
        {hasActiveFilters && (
          <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-primary-600 text-white rounded-full">
            {channelCount < totalChannels || statusCount < totalStatuses
              ? '!'
              : ''}
          </span>
        )}
      </button>

      {/* Mobile filter drawer/modal */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <h2 className="font-semibold text-gray-900">필터</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="닫기"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Filter sections */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <ChannelFilter defaultExpanded />
              <StatusFilter defaultExpanded />
              <DateRangeFilter defaultExpanded />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200 space-y-2">
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="
                      flex-1 px-4 py-2 text-sm font-medium
                      text-gray-700 bg-gray-100 rounded-lg
                      hover:bg-gray-200 transition-colors
                    "
                  >
                    필터 초기화
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="
                    flex-1 px-4 py-2 text-sm font-medium
                    text-white bg-primary-600 rounded-lg
                    hover:bg-primary-700 transition-colors
                  "
                >
                  적용하기
                </button>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  채널: {channelCount}/{totalChannels}
                </span>
                <span>
                  상태: {statusCount}/{totalStatuses}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
