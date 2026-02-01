'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Users,
  Check,
  Plus,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface UserMenuProps {
  collapsed?: boolean
  showName?: boolean
  className?: string
}

export function UserMenu({
  collapsed = false,
  showName = false,
  className = '',
}: UserMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [showTeamSwitcher, setShowTeamSwitcher] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fetch user on mount
  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowTeamSwitcher(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setShowTeamSwitcher(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsOpen(false)
    router.push('/login')
    router.refresh()
  }

  const handleTeamSwitch = (teamId: string) => {
    // TODO: Implement team switch when team management is ready
    console.log('Switching to team:', teamId)
    setShowTeamSwitcher(false)
    setIsOpen(false)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-2 p-2">
          <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
          {!collapsed && (
            <div className="flex-1">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-16 bg-gray-200 rounded mt-1 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    )
  }

  // If no user, show login link
  if (!user) {
    return (
      <div className={`relative ${className}`}>
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          로그인
        </Link>
      </div>
    )
  }

  // Get display name from user metadata or email
  const displayName = user.user_metadata?.full_name ||
                      user.user_metadata?.name ||
                      user.email?.split('@')[0] ||
                      'User'
  const userEmail = user.email || ''
  const avatarUrl = user.user_metadata?.avatar_url || null

  // TODO: Fetch teams from database when team management is implemented
  const currentTeam = { id: 'default', name: 'My Team' }
  const teams = [currentTeam]

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 rounded-lg transition-colors
          ${collapsed ? 'justify-center p-2' : 'p-2 hover:bg-gray-100 w-full'}
          ${isOpen ? 'bg-gray-100' : ''}
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div
          className={`
            ${collapsed ? 'w-8 h-8' : 'w-9 h-9'}
            bg-primary-100 rounded-full flex items-center justify-center
            text-primary-600 font-medium flex-shrink-0 relative overflow-hidden
          `}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              className="rounded-full object-cover"
              sizes={collapsed ? '32px' : '36px'}
            />
          ) : (
            <span className={collapsed ? 'text-sm' : 'text-base'}>
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Name and team (when not collapsed) */}
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-gray-900 truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentTeam.name}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </>
        )}

        {/* Name only for header variant */}
        {collapsed && showName && (
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
          </div>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 w-64 bg-white rounded-lg shadow-lg
            border border-gray-200 py-1 overflow-hidden
            ${collapsed ? 'left-full ml-2 bottom-0' : 'bottom-full mb-2 left-0'}
          `}
        >
          {/* User info section */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{userEmail}</p>
          </div>

          {/* Team switcher */}
          {teams.length > 1 && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => setShowTeamSwitcher(!showTeamSwitcher)}
                className="
                  w-full flex items-center justify-between px-4 py-2.5
                  text-sm text-gray-700 hover:bg-gray-50 transition-colors
                "
              >
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-gray-400" />
                  <span>팀 전환</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${showTeamSwitcher ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Team list */}
              {showTeamSwitcher && (
                <div className="bg-gray-50 py-1">
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => handleTeamSwitch(team.id)}
                      className={`
                        w-full flex items-center gap-3 px-6 py-2
                        text-sm hover:bg-gray-100 transition-colors
                        ${team.id === currentTeam.id ? 'text-primary-600' : 'text-gray-700'}
                      `}
                    >
                      {team.id === currentTeam.id ? (
                        <Check size={16} className="text-primary-600" />
                      ) : (
                        <span className="w-4" />
                      )}
                      <span>{team.name}</span>
                    </button>
                  ))}
                  <button
                    className="
                      w-full flex items-center gap-3 px-6 py-2
                      text-sm text-gray-500 hover:bg-gray-100 transition-colors
                    "
                  >
                    <Plus size={16} />
                    <span>새 팀 만들기</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/settings/profile"
              onClick={() => setIsOpen(false)}
              className="
                flex items-center gap-3 px-4 py-2.5
                text-sm text-gray-700 hover:bg-gray-50 transition-colors
              "
            >
              <User size={18} className="text-gray-400" />
              <span>프로필 설정</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="
                flex items-center gap-3 px-4 py-2.5
                text-sm text-gray-700 hover:bg-gray-50 transition-colors
              "
            >
              <Settings size={18} className="text-gray-400" />
              <span>설정</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 py-1">
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center gap-3 px-4 py-2.5
                text-sm text-red-600 hover:bg-red-50 transition-colors
              "
            >
              <LogOut size={18} />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
