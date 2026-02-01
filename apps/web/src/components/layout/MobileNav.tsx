'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  X,
  LayoutDashboard,
  Calendar,
  Tag,
  Package,
  Settings,
  LogOut,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'

interface NavItem {
  name: string
  nameEn: string
  href: string
  icon: LucideIcon
  disabled?: boolean
  phase?: number
}

const navigation: NavItem[] = [
  {
    name: '대시보드',
    nameEn: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: '캘린더',
    nameEn: 'Calendar',
    href: '/calendar',
    icon: Calendar,
    phase: 1,
  },
  {
    name: '프로모션',
    nameEn: 'Promotions',
    href: '/promotions',
    icon: Tag,
    phase: 1,
  },
  {
    name: '상품',
    nameEn: 'Products',
    href: '/products',
    icon: Package,
    phase: 1,
  },
  {
    name: '설정',
    nameEn: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

// Mock user data for demo
const mockUser = {
  name: 'Phase 1',
  email: 'demo@promohub.kr',
  avatar: null,
  team: 'Demo Team',
}

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const drawerRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [translateX, setTranslateX] = useState(0)

  // Close on route change
  useEffect(() => {
    if (isOpen) {
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Swipe to close handling
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX
    setTouchEnd(currentTouch)

    // Only allow swiping left (to close)
    if (touchStart !== null) {
      const diff = touchStart - currentTouch
      if (diff > 0) {
        setTranslateX(-diff)
      }
    }
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setTranslateX(0)
      return
    }

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance

    if (isLeftSwipe) {
      onClose()
    }

    setTranslateX(0)
    setTouchStart(null)
    setTouchEnd(null)
  }

  if (!isOpen) return null

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="
          absolute inset-y-0 left-0 w-full max-w-xs
          bg-white shadow-xl flex flex-col
          transform transition-transform duration-300 ease-out
        "
        style={{
          transform: `translateX(${translateX}px)`,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link
            href="/dashboard"
            className="text-xl font-bold text-primary-600"
            onClick={onClose}
          >
            PromoHub
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="메뉴 닫기"
          >
            <X size={24} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
              {mockUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{mockUser.name}</p>
              <p className="text-sm text-gray-500 truncate">{mockUser.email}</p>
            </div>
          </div>
          <div className="mt-3 px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-600">
            {mockUser.team}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-colors
                  ${
                    item.disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : isActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200'
                  }
                `}
                aria-disabled={item.disabled}
              >
                <Icon size={22} />
                <span className="flex-1">{item.name}</span>
                {item.phase && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    P{item.phase}
                  </span>
                )}
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              // TODO: Implement logout
              console.log('Logout clicked')
              onClose()
            }}
            className="
              w-full flex items-center justify-center gap-2
              px-4 py-3 text-gray-600
              hover:bg-gray-100 active:bg-gray-200
              rounded-lg transition-colors
            "
          >
            <LogOut size={20} />
            <span>로그아웃</span>
          </button>
        </div>

        {/* Swipe indicator */}
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          <div className="w-1 h-12 bg-gray-300 rounded-full opacity-50" />
        </div>
      </div>
    </div>
  )
}
