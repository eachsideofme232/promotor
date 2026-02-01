'use client'

import { Filter } from 'lucide-react'
import { CHANNEL_COLORS } from './PromotionCard'

export interface ChannelOption {
  id: string
  name: string
  color?: string
}

interface ChannelFilterProps {
  channels: ChannelOption[]
  selectedChannels: string[]
  onToggle: (channelId: string) => void
  onSelectAll?: () => void
  onDeselectAll?: () => void
}

export function ChannelFilter({
  channels,
  selectedChannels,
  onToggle,
  onSelectAll,
  onDeselectAll,
}: ChannelFilterProps) {
  const allSelected = selectedChannels.length === channels.length
  const noneSelected = selectedChannels.length === 0

  const getChannelColor = (channelId: string): string => {
    return CHANNEL_COLORS[channelId]?.bg || 'bg-gray-500'
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 text-gray-400 mr-1">
        <Filter size={16} />
        <span className="text-sm hidden sm:inline">필터</span>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1 mr-2">
        <button
          onClick={onSelectAll}
          disabled={allSelected}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            allSelected
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          전체
        </button>
        <button
          onClick={onDeselectAll}
          disabled={noneSelected}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            noneSelected
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          해제
        </button>
      </div>

      {/* Channel buttons */}
      {channels.map((channel) => {
        const isSelected = selectedChannels.includes(channel.id)
        const bgColor = getChannelColor(channel.id)

        return (
          <button
            key={channel.id}
            onClick={() => onToggle(channel.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-all ${
              isSelected
                ? 'border-gray-300 bg-white shadow-sm'
                : 'border-transparent bg-gray-100 text-gray-400'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${bgColor} ${
                isSelected ? 'opacity-100' : 'opacity-40'
              }`}
            />
            <span className={isSelected ? 'text-gray-700' : 'text-gray-400'}>
              {channel.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
