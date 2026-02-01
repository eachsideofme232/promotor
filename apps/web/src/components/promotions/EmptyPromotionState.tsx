'use client'

import Link from 'next/link'
import { Calendar, Plus, Search } from 'lucide-react'

interface EmptyPromotionStateProps {
  type?: 'no-promotions' | 'no-results'
  searchQuery?: string
}

export function EmptyPromotionState({
  type = 'no-promotions',
  searchQuery,
}: EmptyPromotionStateProps) {
  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          검색 결과가 없습니다
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          {searchQuery ? (
            <>
              &quot;{searchQuery}&quot;에 대한 검색 결과가 없습니다.
              <br />
              다른 키워드로 검색하거나 필터를 조정해 보세요.
            </>
          ) : (
            <>
              현재 필터 조건에 맞는 프로모션이 없습니다.
              <br />
              필터를 조정하거나 새 프로모션을 만들어 보세요.
            </>
          )}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
        <Calendar size={40} className="text-primary-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        아직 프로모션이 없습니다
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-md mb-6">
        첫 프로모션을 만들어 채널별 프로모션 일정을 관리하세요.
        <br />
        올리브영, 쿠팡, 네이버 등 다양한 채널의 프로모션을 한 곳에서 확인할 수
        있습니다.
      </p>
      <Link
        href="/promotions/new"
        className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
      >
        <Plus size={20} />
        새 프로모션 만들기
      </Link>
    </div>
  )
}
