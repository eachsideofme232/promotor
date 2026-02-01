'use client'

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { PromotionStatus } from '@promohub/types'

// Channel definitions with Korean e-commerce brand colors
export const CHANNELS = [
  { id: 'oliveyoung', name: '올리브영', nameEn: 'Oliveyoung', color: '#9ACD32' },
  { id: 'coupang', name: '쿠팡', nameEn: 'Coupang', color: '#E31837' },
  { id: 'naver', name: '네이버', nameEn: 'Naver', color: '#03C75A' },
  { id: 'kakao', name: '카카오', nameEn: 'Kakao', color: '#FEE500' },
  { id: 'musinsa', name: '무신사', nameEn: 'Musinsa', color: '#000000' },
] as const

export type ChannelId = (typeof CHANNELS)[number]['id']

export const STATUSES: { id: PromotionStatus; name: string; nameEn: string }[] = [
  { id: 'planned', name: '예정', nameEn: 'Planned' },
  { id: 'active', name: '진행중', nameEn: 'Active' },
  { id: 'ended', name: '종료', nameEn: 'Ended' },
  { id: 'cancelled', name: '취소', nameEn: 'Cancelled' },
]

export interface FilterState {
  channels: ChannelId[]
  statuses: PromotionStatus[]
  startDate: string | null
  endDate: string | null
}

export interface FilterContextValue extends FilterState {
  // Channel filters
  toggleChannel: (channelId: ChannelId) => void
  setChannels: (channelIds: ChannelId[]) => void
  selectAllChannels: () => void
  deselectAllChannels: () => void
  isChannelSelected: (channelId: ChannelId) => boolean

  // Status filters
  toggleStatus: (status: PromotionStatus) => void
  setStatuses: (statuses: PromotionStatus[]) => void
  selectAllStatuses: () => void
  deselectAllStatuses: () => void
  isStatusSelected: (status: PromotionStatus) => boolean

  // Date range filters
  setDateRange: (startDate: string | null, endDate: string | null) => void
  clearDateRange: () => void

  // Reset all filters
  resetFilters: () => void

  // Check if any filters are active
  hasActiveFilters: boolean
}

const FilterContext = createContext<FilterContextValue | null>(null)

// URL param keys
const PARAM_CHANNELS = 'channels'
const PARAM_STATUSES = 'statuses'
const PARAM_START_DATE = 'startDate'
const PARAM_END_DATE = 'endDate'

function parseChannelsFromUrl(params: URLSearchParams): ChannelId[] {
  const channelsParam = params.get(PARAM_CHANNELS)
  if (!channelsParam) {
    // Default: all channels selected
    return CHANNELS.map((c) => c.id)
  }
  const channelIds = channelsParam.split(',').filter(Boolean)
  return channelIds.filter((id): id is ChannelId =>
    CHANNELS.some((c) => c.id === id)
  )
}

function parseStatusesFromUrl(params: URLSearchParams): PromotionStatus[] {
  const statusesParam = params.get(PARAM_STATUSES)
  if (!statusesParam) {
    // Default: all statuses selected
    return STATUSES.map((s) => s.id)
  }
  const statusIds = statusesParam.split(',').filter(Boolean)
  return statusIds.filter((id): id is PromotionStatus =>
    STATUSES.some((s) => s.id === id)
  )
}

interface FilterProviderProps {
  children: ReactNode
}

export function FilterProvider({ children }: FilterProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Parse filter state from URL
  const filterState = useMemo<FilterState>(() => {
    return {
      channels: parseChannelsFromUrl(searchParams),
      statuses: parseStatusesFromUrl(searchParams),
      startDate: searchParams.get(PARAM_START_DATE),
      endDate: searchParams.get(PARAM_END_DATE),
    }
  }, [searchParams])

  // Update URL with new filter values
  const updateUrl = useCallback(
    (updates: Partial<FilterState>) => {
      const params = new URLSearchParams(searchParams.toString())

      if (updates.channels !== undefined) {
        if (
          updates.channels.length === CHANNELS.length ||
          updates.channels.length === 0
        ) {
          // Remove param if all or none selected (use default)
          params.delete(PARAM_CHANNELS)
        } else {
          params.set(PARAM_CHANNELS, updates.channels.join(','))
        }
      }

      if (updates.statuses !== undefined) {
        if (
          updates.statuses.length === STATUSES.length ||
          updates.statuses.length === 0
        ) {
          params.delete(PARAM_STATUSES)
        } else {
          params.set(PARAM_STATUSES, updates.statuses.join(','))
        }
      }

      if (updates.startDate !== undefined) {
        if (updates.startDate) {
          params.set(PARAM_START_DATE, updates.startDate)
        } else {
          params.delete(PARAM_START_DATE)
        }
      }

      if (updates.endDate !== undefined) {
        if (updates.endDate) {
          params.set(PARAM_END_DATE, updates.endDate)
        } else {
          params.delete(PARAM_END_DATE)
        }
      }

      const queryString = params.toString()
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname
      router.push(newUrl, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  // Channel filter actions
  const toggleChannel = useCallback(
    (channelId: ChannelId) => {
      const newChannels = filterState.channels.includes(channelId)
        ? filterState.channels.filter((id) => id !== channelId)
        : [...filterState.channels, channelId]
      updateUrl({ channels: newChannels })
    },
    [filterState.channels, updateUrl]
  )

  const setChannels = useCallback(
    (channelIds: ChannelId[]) => {
      updateUrl({ channels: channelIds })
    },
    [updateUrl]
  )

  const selectAllChannels = useCallback(() => {
    updateUrl({ channels: CHANNELS.map((c) => c.id) })
  }, [updateUrl])

  const deselectAllChannels = useCallback(() => {
    updateUrl({ channels: [] })
  }, [updateUrl])

  const isChannelSelected = useCallback(
    (channelId: ChannelId) => filterState.channels.includes(channelId),
    [filterState.channels]
  )

  // Status filter actions
  const toggleStatus = useCallback(
    (status: PromotionStatus) => {
      const newStatuses = filterState.statuses.includes(status)
        ? filterState.statuses.filter((s) => s !== status)
        : [...filterState.statuses, status]
      updateUrl({ statuses: newStatuses })
    },
    [filterState.statuses, updateUrl]
  )

  const setStatuses = useCallback(
    (statuses: PromotionStatus[]) => {
      updateUrl({ statuses })
    },
    [updateUrl]
  )

  const selectAllStatuses = useCallback(() => {
    updateUrl({ statuses: STATUSES.map((s) => s.id) })
  }, [updateUrl])

  const deselectAllStatuses = useCallback(() => {
    updateUrl({ statuses: [] })
  }, [updateUrl])

  const isStatusSelected = useCallback(
    (status: PromotionStatus) => filterState.statuses.includes(status),
    [filterState.statuses]
  )

  // Date range actions
  const setDateRange = useCallback(
    (startDate: string | null, endDate: string | null) => {
      updateUrl({ startDate, endDate })
    },
    [updateUrl]
  )

  const clearDateRange = useCallback(() => {
    updateUrl({ startDate: null, endDate: null })
  }, [updateUrl])

  // Reset all filters
  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [pathname, router])

  // Check if any filters are active (not default)
  const hasActiveFilters = useMemo(() => {
    const hasChannelFilter =
      filterState.channels.length > 0 &&
      filterState.channels.length < CHANNELS.length
    const hasStatusFilter =
      filterState.statuses.length > 0 &&
      filterState.statuses.length < STATUSES.length
    const hasDateFilter = !!filterState.startDate || !!filterState.endDate

    return hasChannelFilter || hasStatusFilter || hasDateFilter
  }, [filterState])

  const contextValue = useMemo<FilterContextValue>(
    () => ({
      ...filterState,
      toggleChannel,
      setChannels,
      selectAllChannels,
      deselectAllChannels,
      isChannelSelected,
      toggleStatus,
      setStatuses,
      selectAllStatuses,
      deselectAllStatuses,
      isStatusSelected,
      setDateRange,
      clearDateRange,
      resetFilters,
      hasActiveFilters,
    }),
    [
      filterState,
      toggleChannel,
      setChannels,
      selectAllChannels,
      deselectAllChannels,
      isChannelSelected,
      toggleStatus,
      setStatuses,
      selectAllStatuses,
      deselectAllStatuses,
      isStatusSelected,
      setDateRange,
      clearDateRange,
      resetFilters,
      hasActiveFilters,
    ]
  )

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilterContext(): FilterContextValue {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider')
  }
  return context
}
