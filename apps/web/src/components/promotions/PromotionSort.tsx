'use client'

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

export type SortField = 'startDate' | 'endDate' | 'title' | 'channel' | 'createdAt'
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: SortField
  direction: SortDirection
}

interface PromotionSortProps {
  sortConfig: SortConfig
  onSortChange: (config: SortConfig) => void
}

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'startDate', label: '시작일' },
  { value: 'endDate', label: '종료일' },
  { value: 'title', label: '제목' },
  { value: 'channel', label: '채널' },
  { value: 'createdAt', label: '생성일' },
]

export function PromotionSort({ sortConfig, onSortChange }: PromotionSortProps) {
  const handleFieldChange = (field: SortField) => {
    onSortChange({
      field,
      direction: sortConfig.direction,
    })
  }

  const handleDirectionToggle = () => {
    onSortChange({
      field: sortConfig.field,
      direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
    })
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">정렬:</span>
      <select
        value={sortConfig.field}
        onChange={(e) => handleFieldChange(e.target.value as SortField)}
        className="px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleDirectionToggle}
        className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        title={sortConfig.direction === 'asc' ? '오름차순' : '내림차순'}
      >
        {sortConfig.direction === 'asc' ? (
          <ArrowUp size={16} className="text-gray-600" />
        ) : (
          <ArrowDown size={16} className="text-gray-600" />
        )}
      </button>
    </div>
  )
}

interface SortableHeaderProps {
  field: SortField
  label: string
  sortConfig: SortConfig
  onSort: (field: SortField) => void
  className?: string
}

export function SortableHeader({
  field,
  label,
  sortConfig,
  onSort,
  className = '',
}: SortableHeaderProps) {
  const isActive = sortConfig.field === field

  const handleClick = () => {
    onSort(field)
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors ${className}`}
    >
      {label}
      <span className="ml-1">
        {isActive ? (
          sortConfig.direction === 'asc' ? (
            <ArrowUp size={14} />
          ) : (
            <ArrowDown size={14} />
          )
        ) : (
          <ArrowUpDown size={14} className="text-gray-300" />
        )}
      </span>
    </button>
  )
}
