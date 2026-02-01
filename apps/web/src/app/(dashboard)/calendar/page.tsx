'use client'

import { useState, useCallback, useMemo } from 'react'
import { CalendarView } from '@/components/calendar'
import { useFilters, CHANNELS } from '@/components/filters'
import type { CalendarPromotion } from '@promohub/types'

// Demo promotions data
const DEMO_PROMOTIONS: CalendarPromotion[] = [
  {
    id: '1',
    title: '올리브영 2월 세일',
    status: 'active',
    channelId: 'oliveyoung',
    channelName: '올리브영',
    channelColor: '#9ACD32',
    startDate: '2026-02-05',
    endDate: '2026-02-12',
    isStart: true,
    isEnd: true,
    isMultiDay: true,
  },
  {
    id: '2',
    title: '쿠팡 발렌타인 기획전',
    status: 'planned',
    channelId: 'coupang',
    channelName: '쿠팡',
    channelColor: '#E31837',
    startDate: '2026-02-10',
    endDate: '2026-02-14',
    isStart: true,
    isEnd: true,
    isMultiDay: true,
  },
  {
    id: '3',
    title: '네이버 브랜드 위크',
    status: 'planned',
    channelId: 'naver',
    channelName: '네이버',
    channelColor: '#03C75A',
    startDate: '2026-02-15',
    endDate: '2026-02-22',
    isStart: true,
    isEnd: true,
    isMultiDay: true,
  },
  {
    id: '4',
    title: '카카오 선물하기 프로모션',
    status: 'ended',
    channelId: 'kakao',
    channelName: '카카오',
    channelColor: '#FEE500',
    startDate: '2026-02-01',
    endDate: '2026-02-07',
    isStart: true,
    isEnd: true,
    isMultiDay: true,
  },
  {
    id: '5',
    title: '무신사 브랜드데이',
    status: 'active',
    channelId: 'musinsa',
    channelName: '무신사',
    channelColor: '#000000',
    startDate: '2026-02-08',
    endDate: '2026-02-20',
    isStart: true,
    isEnd: true,
    isMultiDay: true,
  },
  {
    id: '6',
    title: '올리브영 월말 정산 세일',
    status: 'planned',
    channelId: 'oliveyoung',
    channelName: '올리브영',
    channelColor: '#9ACD32',
    startDate: '2026-02-25',
    endDate: '2026-02-28',
    isStart: true,
    isEnd: true,
    isMultiDay: true,
  },
]

// Convert CHANNELS from filter system to ChannelOption format
const channelOptions = CHANNELS.map((channel) => ({
  id: channel.id,
  name: channel.name,
  color: channel.color,
}))

export default function CalendarPage() {
  const [promotions] = useState<CalendarPromotion[]>(DEMO_PROMOTIONS)

  // Use existing filter context for channel and status filtering
  const { channels: selectedChannels, statuses: selectedStatuses, isChannelSelected, isStatusSelected } = useFilters()

  // Filter promotions based on selected channels and statuses
  const filteredPromotions = useMemo(() => {
    return promotions.filter((promo) => {
      const channelMatch = isChannelSelected(promo.channelId as typeof selectedChannels[number])
      const statusMatch = isStatusSelected(promo.status)
      return channelMatch && statusMatch
    })
  }, [promotions, isChannelSelected, isStatusSelected])

  const handleAddPromotion = useCallback(() => {
    // TODO: Open promotion creation modal
    console.log('Add promotion clicked')
  }, [])

  const handlePromotionClick = useCallback((promotion: CalendarPromotion) => {
    // TODO: Open promotion detail modal
    console.log('Promotion clicked:', promotion)
  }, [])

  const handleDateClick = useCallback((date: Date) => {
    // TODO: Open promotion creation modal with pre-filled date
    console.log('Date clicked:', date)
  }, [])

  const handleDateRangeChange = useCallback((start: Date, end: Date) => {
    // TODO: Fetch promotions for the new date range
    console.log('Date range changed:', start, end)
  }, [])

  return (
    <CalendarView
      promotions={filteredPromotions}
      channels={channelOptions}
      initialView="month"
      onAddPromotion={handleAddPromotion}
      onPromotionClick={handlePromotionClick}
      onDateClick={handleDateClick}
      onDateRangeChange={handleDateRangeChange}
    />
  )
}
