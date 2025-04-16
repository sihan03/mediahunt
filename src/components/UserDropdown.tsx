'use client'

import { useState, useRef, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import SignOutButton from './SignOutButton'

interface UserDropdownProps {
  user: User
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setIsOpen(!isOpen)

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  if (!user) return null

  // Get user initial from email (first character)
  const userInitial = user.email?.[0]?.toUpperCase() || 'U'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-200 transition-all hover:ring-2 hover:ring-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
      >
        {/* Avatar-like circle with initial */}
        <div className="flex h-full w-full items-center justify-center bg-purple-100 text-sm font-medium text-gray-700">
          {userInitial}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg z-20">
          <div className="border-b p-3">
            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
          </div>
          <div className="p-1">
            {/* Account links could be added here */}
            <div className="cursor-pointer rounded-md hover:bg-gray-100 transition-colors">
              <div className="flex items-center px-3 py-2 text-sm text-gray-700">
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 