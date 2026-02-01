'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { useMemo } from 'react'

// Route name mappings
const routeNames: Record<string, { name: string; nameEn: string }> = {
  dashboard: { name: '대시보드', nameEn: 'Dashboard' },
  calendar: { name: '캘린더', nameEn: 'Calendar' },
  promotions: { name: '프로모션', nameEn: 'Promotions' },
  products: { name: '상품', nameEn: 'Products' },
  settings: { name: '설정', nameEn: 'Settings' },
  profile: { name: '프로필', nameEn: 'Profile' },
  team: { name: '팀', nameEn: 'Team' },
  billing: { name: '결제', nameEn: 'Billing' },
  new: { name: '새로 만들기', nameEn: 'New' },
  edit: { name: '편집', nameEn: 'Edit' },
}

interface BreadcrumbItem {
  name: string
  href: string
  isCurrent: boolean
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

export function Breadcrumb({
  items: customItems,
  className = '',
  showHome = true,
}: BreadcrumbProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs from pathname if not provided
  const items = useMemo<BreadcrumbItem[]>(() => {
    if (customItems) return customItems

    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`

      // Skip dynamic segments that look like IDs
      const isId = /^[a-f0-9-]{8,}$/i.test(segment) || /^\d+$/.test(segment)

      const routeInfo = routeNames[segment.toLowerCase()]
      const name = routeInfo?.name || (isId ? '상세' : segment)

      breadcrumbs.push({
        name,
        href: currentPath,
        isCurrent: index === segments.length - 1,
      })
    })

    return breadcrumbs
  }, [customItems, pathname])

  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1 text-sm">
        {/* Home link */}
        {showHome && (
          <>
            <li>
              <Link
                href="/dashboard"
                className="
                  flex items-center gap-1 text-gray-500
                  hover:text-gray-700 transition-colors
                "
                title="홈"
              >
                <Home size={16} />
                <span className="sr-only">홈</span>
              </Link>
            </li>
            <li className="text-gray-400">
              <ChevronRight size={14} />
            </li>
          </>
        )}

        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight size={14} className="text-gray-400 mr-1" />
            )}
            {item.isCurrent ? (
              <span
                className="text-gray-900 font-medium"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
