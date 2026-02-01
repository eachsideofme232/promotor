'use client'

import type { PromotionStatus } from '@promohub/types'

interface PromotionStatusBadgeProps {
  status: PromotionStatus
  size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<
  PromotionStatus,
  { label: string; className: string }
> = {
  planned: {
    label: '예정',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  active: {
    label: '진행중',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  ended: {
    label: '종료',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  cancelled: {
    label: '취소',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
}

export function PromotionStatusBadge({
  status,
  size = 'sm',
}: PromotionStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.className} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  )
}
