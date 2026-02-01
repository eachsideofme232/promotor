'use client'

import { Breadcrumb } from './Breadcrumb'

interface BreadcrumbItem {
  name: string
  href: string
  isCurrent: boolean
}

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  breadcrumbItems?: BreadcrumbItem[]
  showBreadcrumb?: boolean
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbItems,
  showBreadcrumb = true,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="px-4 lg:px-6 py-4">
        {/* Breadcrumb */}
        {showBreadcrumb && (
          <Breadcrumb items={breadcrumbItems} className="mb-3" />
        )}

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>

          {/* Action buttons */}
          {actions && (
            <div className="flex items-center gap-3 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Page header action button component for consistent styling
 */
interface PageHeaderButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  icon?: React.ReactNode
  disabled?: boolean
  type?: 'button' | 'submit'
}

export function PageHeaderButton({
  children,
  onClick,
  variant = 'secondary',
  icon,
  disabled = false,
  type = 'button',
}: PageHeaderButtonProps) {
  const baseStyles = `
    inline-flex items-center gap-2 px-4 py-2
    text-sm font-medium rounded-lg
    transition-colors disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variantStyles = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700 active:bg-primary-800
    `,
    secondary: `
      bg-gray-100 text-gray-700
      hover:bg-gray-200 active:bg-gray-300
    `,
    outline: `
      border border-gray-300 bg-white text-gray-700
      hover:bg-gray-50 active:bg-gray-100
    `,
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {icon}
      {children}
    </button>
  )
}
