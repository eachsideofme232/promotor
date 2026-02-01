'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Download, Trash2, LayoutGrid, List } from 'lucide-react'
import type { Promotion, PromotionFilters as Filters } from '@promohub/types'
import { PromotionTable } from './PromotionTable'
import { PromotionListItem } from './PromotionListItem'
import { PromotionFilters } from './PromotionFilters'
import { PromotionSort, type SortConfig, type SortField } from './PromotionSort'
import { EmptyPromotionState } from './EmptyPromotionState'

interface Channel {
  id: string
  name: string
  color: string
}

interface PromotionListProps {
  promotions: Promotion[]
  channels: Channel[]
  onDuplicate?: (id: string) => void
  onDelete?: (id: string) => void
  onBulkDelete?: (ids: string[]) => void
  onBulkExport?: (ids: string[]) => void
}

type ViewMode = 'table' | 'cards'
type PageSize = 10 | 25 | 50

const PAGE_SIZE_OPTIONS: PageSize[] = [10, 25, 50]

export function PromotionList({
  promotions,
  channels,
  onDuplicate,
  onDelete,
  onBulkDelete,
  onBulkExport,
}: PromotionListProps) {
  // State
  const [filters, setFilters] = useState<Filters>({})
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'startDate',
    direction: 'desc',
  })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(10)

  // Filter promotions
  const filteredPromotions = useMemo(() => {
    return promotions.filter((promo) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          promo.title.toLowerCase().includes(searchLower) ||
          promo.description?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Status filter
      if (filters.status && promo.status !== filters.status) {
        return false
      }

      // Channel filter
      if (
        filters.channelIds &&
        filters.channelIds.length > 0 &&
        !filters.channelIds.includes(promo.channelId)
      ) {
        return false
      }

      // Date range filter
      if (filters.startDate) {
        const filterStart = new Date(filters.startDate)
        const promoEnd = new Date(promo.endDate)
        if (promoEnd < filterStart) return false
      }

      if (filters.endDate) {
        const filterEnd = new Date(filters.endDate)
        const promoStart = new Date(promo.startDate)
        if (promoStart > filterEnd) return false
      }

      return true
    })
  }, [promotions, filters])

  // Sort promotions
  const sortedPromotions = useMemo(() => {
    const sorted = [...filteredPromotions]

    sorted.sort((a, b) => {
      let comparison = 0

      switch (sortConfig.field) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'ko')
          break
        case 'channel':
          const channelA = channels.find((c) => c.id === a.channelId)?.name || ''
          const channelB = channels.find((c) => c.id === b.channelId)?.name || ''
          comparison = channelA.localeCompare(channelB, 'ko')
          break
        case 'startDate':
          comparison =
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          break
        case 'endDate':
          comparison =
            new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
          break
        case 'createdAt':
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        default:
          comparison = 0
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [filteredPromotions, sortConfig, channels])

  // Pagination
  const totalPages = Math.ceil(sortedPromotions.length / pageSize)
  const paginatedPromotions = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedPromotions.slice(start, start + pageSize)
  }, [sortedPromotions, currentPage, pageSize])

  // Reset to first page when filters change
  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  // Selection handlers
  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (selected) {
        setSelectedIds(new Set(paginatedPromotions.map((p) => p.id)))
      } else {
        setSelectedIds(new Set())
      }
    },
    [paginatedPromotions]
  )

  const handleSelectOne = useCallback((id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (selected) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }, [])

  // Sort handlers
  const handleSort = useCallback((field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }, [])

  // Bulk action handlers
  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return
    if (
      confirm(
        `선택한 ${selectedIds.size}개의 프로모션을 삭제하시겠습니까?`
      )
    ) {
      onBulkDelete?.(Array.from(selectedIds))
      setSelectedIds(new Set())
    }
  }

  const handleBulkExport = () => {
    if (selectedIds.size === 0) return
    onBulkExport?.(Array.from(selectedIds))
  }

  // Page size change
  const handlePageSizeChange = (newSize: PageSize) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  // Get channel helper
  const getChannel = (channelId: string) =>
    channels.find((c) => c.id === channelId)

  // Empty states
  if (promotions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <EmptyPromotionState type="no-promotions" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <PromotionFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          channels={channels}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Result count */}
          <span className="text-sm text-gray-500">
            총 {sortedPromotions.length}개
            {selectedIds.size > 0 && (
              <span className="ml-2 text-primary-600">
                ({selectedIds.size}개 선택됨)
              </span>
            )}
          </span>

          {/* Bulk actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkExport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <Download size={14} />
                내보내기
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={14} />
                삭제
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <PromotionSort sortConfig={sortConfig} onSortChange={setSortConfig} />

          {/* View mode toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${
                viewMode === 'table'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
              title="테이블 보기"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 ${
                viewMode === 'cards'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
              title="카드 보기"
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          {/* Create button */}
          <Link
            href="/promotions/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <Plus size={18} />
            새 프로모션
          </Link>
        </div>
      </div>

      {/* Content */}
      {sortedPromotions.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200">
          <EmptyPromotionState type="no-results" searchQuery={filters.search} />
        </div>
      ) : (
        <>
          {/* Table view (desktop) */}
          {viewMode === 'table' && (
            <div className="hidden md:block">
              <PromotionTable
                promotions={paginatedPromotions}
                channels={channels}
                selectedIds={selectedIds}
                onSelectAll={handleSelectAll}
                onSelectOne={handleSelectOne}
                sortConfig={sortConfig}
                onSort={handleSort}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            </div>
          )}

          {/* Cards view (or mobile) */}
          {(viewMode === 'cards' || viewMode === 'table') && (
            <div
              className={`grid gap-4 ${
                viewMode === 'cards' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'md:hidden grid-cols-1'
              }`}
            >
              {paginatedPromotions.map((promotion) => (
                <PromotionListItem
                  key={promotion.id}
                  promotion={promotion}
                  channel={getChannel(promotion.channelId)}
                  isSelected={selectedIds.has(promotion.id)}
                  onSelect={handleSelectOne}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg border border-gray-200 p-4">
              {/* Page size selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">페이지당:</span>
                <select
                  value={pageSize}
                  onChange={(e) =>
                    handlePageSizeChange(Number(e.target.value) as PageSize)
                  }
                  className="px-2 py-1 border border-gray-200 rounded text-sm"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}개
                    </option>
                  ))}
                </select>
              </div>

              {/* Page navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 text-sm rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-primary-600 text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>

              {/* Page info */}
              <span className="text-sm text-gray-500">
                {(currentPage - 1) * pageSize + 1} -{' '}
                {Math.min(currentPage * pageSize, sortedPromotions.length)} /{' '}
                {sortedPromotions.length}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
