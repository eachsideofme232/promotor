'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'
import { STATUSES, useFilterContext } from './FilterProvider'
import type { PromotionStatus } from '@promohub/types'

interface StatusFilterProps {
  defaultExpanded?: boolean
}

// Status colors for visual indication
const STATUS_COLORS: Record<PromotionStatus, { bg: string; text: string; dot: string }> = {
  planned: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
  },
  active: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
  },
  ended: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    dot: 'bg-gray-500',
  },
  cancelled: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
}

export function StatusFilter({ defaultExpanded = true }: StatusFilterProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const {
    statuses,
    toggleStatus,
    selectAllStatuses,
    deselectAllStatuses,
    isStatusSelected,
  } = useFilterContext()

  const selectedCount = statuses.length
  const totalCount = STATUSES.length
  const allSelected = selectedCount === totalCount
  const noneSelected = selectedCount === 0

  return (
    <div className="border-b border-gray-200 pb-4">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 text-left"
        aria-expanded={isExpanded}
        aria-controls="status-filter-content"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">상태</h3>
          <span className="text-xs text-gray-500">
            ({selectedCount}/{totalCount})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div id="status-filter-content" className="mt-2 space-y-1">
          {/* Select All / Deselect All buttons */}
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={selectAllStatuses}
              disabled={allSelected}
              className={`
                flex-1 px-3 py-1.5 text-xs font-medium rounded-md
                transition-colors duration-150
                ${
                  allSelected
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              전체 선택
            </button>
            <button
              type="button"
              onClick={deselectAllStatuses}
              disabled={noneSelected}
              className={`
                flex-1 px-3 py-1.5 text-xs font-medium rounded-md
                transition-colors duration-150
                ${
                  noneSelected
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              전체 해제
            </button>
          </div>

          {/* Status checkboxes */}
          <div className="space-y-1">
            {STATUSES.map((status) => {
              const colors = STATUS_COLORS[status.id]
              const checked = isStatusSelected(status.id)

              return (
                <div
                  key={status.id}
                  role="checkbox"
                  aria-checked={checked}
                  aria-label={`${status.name} (${status.nameEn})`}
                  tabIndex={0}
                  onClick={() => toggleStatus(status.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggleStatus(status.id)
                    }
                  }}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                    transition-all duration-150 select-none
                    hover:bg-gray-50
                    ${checked ? 'bg-gray-50' : ''}
                  `}
                >
                  {/* Checkbox */}
                  <div
                    className={`
                      relative w-5 h-5 rounded border-2 flex items-center justify-center
                      transition-all duration-150
                      ${
                        checked
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-gray-300'
                      }
                    `}
                  >
                    {checked && (
                      <Check size={14} className="text-white" strokeWidth={3} />
                    )}
                  </div>

                  {/* Status indicator dot */}
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`}
                    aria-hidden="true"
                  />

                  {/* Status name */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900">
                      {status.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({status.nameEn})
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
