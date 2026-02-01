'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { MoreHorizontal, Eye, Edit, Copy, Trash2 } from 'lucide-react'

interface PromotionActionsProps {
  promotionId: string
  onDuplicate?: (id: string) => void
  onDelete?: (id: string) => void
}

export function PromotionActions({
  promotionId,
  onDuplicate,
  onDelete,
}: PromotionActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDuplicate = () => {
    onDuplicate?.(promotionId)
    setIsOpen(false)
  }

  const handleDelete = () => {
    if (confirm('정말 이 프로모션을 삭제하시겠습니까?')) {
      onDelete?.(promotionId)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="프로모션 작업 메뉴"
      >
        <MoreHorizontal size={18} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <Link
            href={`/promotions/${promotionId}`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <Eye size={16} />
            상세 보기
          </Link>
          <Link
            href={`/promotions/${promotionId}/edit`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <Edit size={16} />
            편집
          </Link>
          <button
            onClick={handleDuplicate}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Copy size={16} />
            복제
          </button>
          <hr className="my-1 border-gray-100" />
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
            삭제
          </button>
        </div>
      )}
    </div>
  )
}

interface PromotionActionButtonsProps {
  promotionId: string
  onDuplicate?: (id: string) => void
  onDelete?: (id: string) => void
}

export function PromotionActionButtons({
  promotionId,
  onDuplicate,
  onDelete,
}: PromotionActionButtonsProps) {
  const handleDelete = () => {
    if (confirm('정말 이 프로모션을 삭제하시겠습니까?')) {
      onDelete?.(promotionId)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/promotions/${promotionId}`}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
        title="상세 보기"
      >
        <Eye size={16} className="text-gray-500" />
      </Link>
      <Link
        href={`/promotions/${promotionId}/edit`}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
        title="편집"
      >
        <Edit size={16} className="text-gray-500" />
      </Link>
      <button
        onClick={() => onDuplicate?.(promotionId)}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
        title="복제"
      >
        <Copy size={16} className="text-gray-500" />
      </button>
      <button
        onClick={handleDelete}
        className="p-1.5 rounded hover:bg-red-50 transition-colors"
        title="삭제"
      >
        <Trash2 size={16} className="text-red-500" />
      </button>
    </div>
  )
}
