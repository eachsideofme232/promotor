'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type { Promotion } from '@promohub/types'
import { PromotionForm } from '@/components/promotions'

// TODO: Get actual team ID from auth context/session
const DEMO_TEAM_ID = '00000000-0000-0000-0000-000000000001'

// Demo promotion data for development
const DEMO_PROMOTIONS: Record<string, Promotion> = {
  '1': {
    id: '1',
    teamId: DEMO_TEAM_ID,
    channelId: 'oliveyoung',
    title: '올리브영 2월 뷰티 페스타',
    description: '2월 한 달간 진행되는 올리브영 뷰티 페스타 프로모션입니다.',
    status: 'active',
    discountType: 'percentage',
    discountValue: '30%',
    startDate: '2026-02-01',
    endDate: '2026-02-14',
    memo: '담당자: 김마케팅',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-20T14:30:00Z',
  },
  '2': {
    id: '2',
    teamId: DEMO_TEAM_ID,
    channelId: 'coupang',
    title: '쿠팡 발렌타인 기획전',
    description: '발렌타인 데이 기획전 참여',
    status: 'planned',
    discountType: 'coupon',
    discountValue: '5,000원',
    startDate: '2026-02-10',
    endDate: '2026-02-14',
    memo: '',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-20T10:00:00Z',
  },
  '3': {
    id: '3',
    teamId: DEMO_TEAM_ID,
    channelId: 'naver',
    title: '네이버 브랜드 위크',
    description: '네이버 쇼핑 브랜드 위크 참여',
    status: 'planned',
    discountType: 'bogo',
    discountValue: '1+1',
    startDate: '2026-02-15',
    endDate: '2026-02-22',
    memo: '선착순 500명',
    createdAt: '2026-01-22T11:00:00Z',
    updatedAt: '2026-01-22T11:00:00Z',
  },
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditPromotionPage({ params }: PageProps) {
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [promotionId, setPromotionId] = useState<string | null>(null)

  // Unwrap params promise
  useEffect(() => {
    params.then((p) => setPromotionId(p.id))
  }, [params])

  // Fetch promotion data
  useEffect(() => {
    if (!promotionId) return

    const fetchPromotion = async () => {
      setLoading(true)
      setError(null)

      try {
        // Try to fetch from API first
        const response = await fetch(`/api/promotions/${promotionId}`)

        if (response.ok) {
          const data = await response.json()
          setPromotion(data)
        } else if (response.status === 404) {
          // Fall back to demo data for development
          const demoPromotion = DEMO_PROMOTIONS[promotionId]
          if (demoPromotion) {
            setPromotion(demoPromotion)
          } else {
            setError('프로모션을 찾을 수 없습니다 (Promotion not found)')
          }
        } else {
          throw new Error('Failed to fetch promotion')
        }
      } catch {
        // Fall back to demo data for development
        const demoPromotion = DEMO_PROMOTIONS[promotionId]
        if (demoPromotion) {
          setPromotion(demoPromotion)
        } else {
          setError('프로모션을 불러오는데 실패했습니다 (Failed to load promotion)')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPromotion()
  }, [promotionId])

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/promotions"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back to promotions"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                프로모션 수정
              </h1>
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-primary-600" />
        </div>
      </div>
    )
  }

  if (error || !promotion) {
    return (
      <div className="h-full flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/promotions"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back to promotions"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">오류</h1>
              <p className="text-sm text-gray-500">Error</p>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error || '프로모션을 찾을 수 없습니다'}</p>
            </div>
            <Link
              href="/promotions"
              className="inline-block mt-4 text-primary-600 hover:text-primary-700"
            >
              프로모션 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/promotions"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Back to promotions"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              프로모션 수정
            </h1>
            <p className="text-sm text-gray-500">
              Edit promotion: {promotion.title}
            </p>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <PromotionForm
              mode="edit"
              promotion={promotion}
              teamId={promotion.teamId}
            />
          </div>

          {/* Metadata */}
          <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              프로모션 정보 (Info)
            </h3>
            <div className="text-xs text-gray-500 space-y-1">
              <p>ID: {promotion.id}</p>
              <p>
                생성일: {new Date(promotion.createdAt).toLocaleDateString('ko-KR')}
              </p>
              <p>
                수정일: {new Date(promotion.updatedAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
