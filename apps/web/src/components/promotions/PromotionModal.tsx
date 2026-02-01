'use client'

import { useEffect, useCallback, useRef } from 'react'
import { X } from 'lucide-react'
import type { Promotion } from '@promohub/types'
import { PromotionForm } from './PromotionForm'

interface PromotionFormData {
  title: string
  description: string
  channelId: string
  discountType: string
  discountValue: string
  startDate: string
  endDate: string
  memo: string
}

interface PromotionModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  promotion?: Promotion
  teamId: string
  onSubmit?: (data: PromotionFormData) => Promise<void>
  isLoading?: boolean
}

export function PromotionModal({
  isOpen,
  onClose,
  mode,
  promotion,
  teamId,
  onSubmit,
  isLoading = false,
}: PromotionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    },
    [onClose, isLoading]
  )

  // Handle click outside
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        !isLoading
      ) {
        onClose()
      }
    },
    [onClose, isLoading]
  )

  // Set up event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape, handleClickOutside])

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      firstElement?.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const title =
    mode === 'create'
      ? '새 프로모션 생성 (Create Promotion)'
      : '프로모션 수정 (Edit Promotion)'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <PromotionForm
            mode={mode}
            promotion={promotion}
            teamId={teamId}
            onSubmit={async (data) => {
              if (onSubmit) {
                await onSubmit(data)
              }
              onClose()
            }}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
