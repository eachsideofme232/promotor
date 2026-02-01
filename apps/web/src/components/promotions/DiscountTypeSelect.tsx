'use client'

import { forwardRef } from 'react'
import type { DiscountType } from '@promohub/types'

export interface DiscountTypeOption {
  value: DiscountType
  label: string
  labelKo: string
  description: string
}

export const DISCOUNT_TYPES: DiscountTypeOption[] = [
  {
    value: 'percentage',
    label: 'Percentage',
    labelKo: '할인율',
    description: '정가 대비 할인 (예: 30% OFF)',
  },
  {
    value: 'bogo',
    label: 'BOGO',
    labelKo: '증정',
    description: 'Buy One Get One (예: 1+1, 2+1)',
  },
  {
    value: 'coupon',
    label: 'Coupon',
    labelKo: '쿠폰',
    description: '정액 할인 쿠폰 (예: 5,000원 할인)',
  },
  {
    value: 'gift',
    label: 'Gift',
    labelKo: '사은품',
    description: '구매 시 사은품 제공',
  },
  {
    value: 'bundle',
    label: 'Bundle',
    labelKo: '묶음',
    description: '세트 구성 특별가 (예: 3개 15,000원)',
  },
]

interface DiscountTypeSelectProps {
  value?: DiscountType
  onChange?: (value: DiscountType) => void
  error?: string
  disabled?: boolean
  placeholder?: string
  label?: string
  required?: boolean
}

export const DiscountTypeSelect = forwardRef<HTMLSelectElement, DiscountTypeSelectProps>(
  function DiscountTypeSelect(
    {
      value,
      onChange,
      error,
      disabled = false,
      placeholder = '할인 유형 선택 (Select discount type)',
      label = '할인 유형 (Discount Type)',
      required = false,
    },
    ref
  ) {
    const selectedType = DISCOUNT_TYPES.find((t) => t.value === value)

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value as DiscountType)}
            disabled={disabled}
            className={`
              w-full px-4 py-2.5 border rounded-lg appearance-none
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            `}
          >
            <option value="">{placeholder}</option>
            {DISCOUNT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.labelKo} ({type.label})
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {selectedType && (
          <p className="text-xs text-gray-500">{selectedType.description}</p>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)
