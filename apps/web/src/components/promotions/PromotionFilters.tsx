'use client'

import { useState } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import type { PromotionStatus, PromotionFilters as Filters } from '@promohub/types'

interface Channel {
  id: string
  name: string
  color: string
}

interface PromotionFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  channels: Channel[]
}

const STATUS_OPTIONS: { value: PromotionStatus | ''; label: string }[] = [
  { value: '', label: '모든 상태' },
  { value: 'planned', label: '예정' },
  { value: 'active', label: '진행중' },
  { value: 'ended', label: '종료' },
  { value: 'cancelled', label: '취소' },
]

export function PromotionFilters({
  filters,
  onFiltersChange,
  channels,
}: PromotionFiltersProps) {
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false)

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search: search || undefined })
  }

  const handleStatusChange = (status: PromotionStatus | '') => {
    onFiltersChange({
      ...filters,
      status: status || undefined,
    })
  }

  const handleChannelToggle = (channelId: string) => {
    const currentChannels = filters.channelIds || []
    const newChannels = currentChannels.includes(channelId)
      ? currentChannels.filter((id) => id !== channelId)
      : [...currentChannels, channelId]

    onFiltersChange({
      ...filters,
      channelIds: newChannels.length > 0 ? newChannels : undefined,
    })
  }

  const handleDateRangeChange = (
    field: 'startDate' | 'endDate',
    value: string
  ) => {
    onFiltersChange({
      ...filters,
      [field]: value || undefined,
    })
  }

  const handleClearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    (filters.channelIds && filters.channelIds.length > 0) ||
    filters.startDate ||
    filters.endDate

  const selectedChannelCount = filters.channelIds?.length || 0

  return (
    <div className="space-y-4">
      {/* Search and main filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="프로모션 검색..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
          {filters.search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          value={filters.status || ''}
          onChange={(e) =>
            handleStatusChange(e.target.value as PromotionStatus | '')
          }
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm min-w-[120px]"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Channel filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm min-w-[140px]"
          >
            <span className="flex-1 text-left">
              {selectedChannelCount > 0
                ? `${selectedChannelCount}개 채널`
                : '모든 채널'}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${isChannelDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isChannelDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {channels.map((channel) => (
                <label
                  key={channel.id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.channelIds?.includes(channel.id) || false}
                    onChange={() => handleChannelToggle(channel.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span
                    className={`w-2 h-2 rounded-full ${channel.color}`}
                  />
                  <span className="text-sm text-gray-700">{channel.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Date range filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <span className="text-sm text-gray-500 min-w-fit">기간:</span>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
          <span className="text-gray-400">~</span>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          >
            <X size={14} />
            필터 초기화
          </button>
        )}
      </div>
    </div>
  )
}
