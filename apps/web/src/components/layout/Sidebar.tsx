'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Tag,
  Package,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  type LucideIcon,
} from 'lucide-react'
import { UserMenu } from './UserMenu'

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

interface SidebarProps {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  className?: string
}

export function Sidebar({
  collapsed: controlledCollapsed,
  onCollapsedChange,
  className = '',
}: SidebarProps) {
  const pathname = usePathname()
  const [internalCollapsed, setInternalCollapsed] = useState(false)

  // Support both controlled and uncontrolled modes
  const isControlled = controlledCollapsed !== undefined
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed

  const handleToggle = () => {
    if (isControlled && onCollapsedChange) {
      onCollapsedChange(!collapsed)
    } else {
      setInternalCollapsed(!internalCollapsed)
    }
  }

  // Store collapse preference in localStorage
  useEffect(() => {
    if (!isControlled) {
      const saved = localStorage.getItem('sidebar-collapsed')
      if (saved !== null) {
        setInternalCollapsed(saved === 'true')
      }
    }
  }, [isControlled])

  useEffect(() => {
    if (!isControlled) {
      localStorage.setItem('sidebar-collapsed', String(internalCollapsed))
    }
  }, [internalCollapsed, isControlled])

  return (
    <aside
      className={`
        ${collapsed ? 'w-16' : 'w-64'}
        bg-white border-r border-gray-200 flex flex-col
        transition-all duration-200 ease-in-out flex-shrink-0
        hidden lg:flex
        ${className}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <Link
            href="/dashboard"
            className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            PromoHub
          </Link>
        )}
        <button
          onClick={handleToggle}
          className={`
            p-2 rounded-lg hover:bg-gray-100 text-gray-500
            transition-colors
            ${collapsed ? 'mx-auto' : ''}
          `}
          aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.disabled ? '#' : item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-colors group relative
                ${
                  item.disabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : isActive
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
              title={collapsed ? item.name : undefined}
              aria-disabled={item.disabled}
            >
              <Icon
                size={20}
                className={`flex-shrink-0 ${isActive ? 'text-primary-600' : ''}`}
              />
              {!collapsed && (
                <>
                  <span className="truncate">{item.name}</span>
                  {item.phase && (
                    <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      P{item.phase}
                    </span>
                  )}
                </>
              )}

              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <div
                  className="
                    absolute left-full ml-2 px-2 py-1
                    bg-gray-900 text-white text-sm rounded
                    opacity-0 group-hover:opacity-100
                    pointer-events-none transition-opacity
                    whitespace-nowrap z-50
                  "
                >
                  {item.name}
                  {item.phase && ` (Phase ${item.phase})`}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200 p-3">
        <UserMenu collapsed={collapsed} />
      </div>
    </aside>
  )
}
