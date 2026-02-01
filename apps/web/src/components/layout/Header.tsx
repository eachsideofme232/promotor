'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, Search, Bell, X } from 'lucide-react'
import { UserMenu } from './UserMenu'

interface HeaderProps {
  title?: string
  onMobileMenuToggle?: () => void
  className?: string
}

export function Header({
  title,
  onMobileMenuToggle,
  className = '',
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  // Close notifications dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implement global search
      console.log('Searching for:', searchQuery)
    }
  }

  // Mock notifications for demo
  const notifications = [
    {
      id: '1',
      title: '프로모션 알림',
      message: '올리브영 1월 프로모션이 내일 시작됩니다.',
      time: '5분 전',
      unread: true,
    },
    {
      id: '2',
      title: '일정 충돌',
      message: '쿠팡과 네이버 프로모션 일정이 겹칩니다.',
      time: '1시간 전',
      unread: true,
    },
    {
      id: '3',
      title: '팀 초대',
      message: '새 팀원이 팀에 참여했습니다.',
      time: '어제',
      unread: false,
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header
      className={`
        h-16 bg-white border-b border-gray-200
        flex items-center justify-between px-4 lg:px-6
        sticky top-0 z-40
        ${className}
      `}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-500"
          aria-label="메뉴 열기"
        >
          <Menu size={24} />
        </button>

        {/* Page title */}
        {title && (
          <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Search bar */}
        <div className="relative">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색... (ESC로 닫기)"
                  className="
                    w-64 pl-10 pr-10 py-2 text-sm
                    border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  "
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="
                flex items-center gap-2 px-3 py-2
                text-sm text-gray-500 hover:text-gray-700
                border border-gray-200 rounded-lg
                hover:bg-gray-50 transition-colors
              "
              title="검색 (Cmd+K)"
            >
              <Search size={18} />
              <span className="hidden md:inline">검색</span>
              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-gray-100 rounded border border-gray-200">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`
              p-2 rounded-lg transition-colors relative
              ${
                notificationsOpen
                  ? 'bg-gray-100 text-gray-900'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }
            `}
            aria-label="알림"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {notificationsOpen && (
            <div
              className="
                absolute right-0 mt-2 w-80
                bg-white rounded-lg shadow-lg border border-gray-200
                py-2 z-50
              "
            >
              <div className="px-4 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">알림</h3>
                  {unreadCount > 0 && (
                    <button className="text-xs text-primary-600 hover:text-primary-700">
                      모두 읽음 처리
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      className={`
                        w-full px-4 py-3 text-left hover:bg-gray-50
                        transition-colors border-b border-gray-100 last:border-b-0
                        ${notification.unread ? 'bg-primary-50/50' : ''}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {notification.unread && (
                          <span className="w-2 h-2 mt-2 bg-primary-500 rounded-full flex-shrink-0" />
                        )}
                        <div className={notification.unread ? '' : 'ml-5'}>
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    새 알림이 없습니다
                  </div>
                )}
              </div>
              <div className="px-4 py-2 border-t border-gray-200">
                <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                  모든 알림 보기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu (visible on larger screens) */}
        <div className="hidden lg:block border-l border-gray-200 pl-4 ml-2">
          <UserMenu showName />
        </div>
      </div>
    </header>
  )
}
