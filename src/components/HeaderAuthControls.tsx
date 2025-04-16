'use client'

import { useAuth } from '@/hooks/useAuth'
import SignInButton from './SignInButton'
import UserDropdown from './UserDropdown'

export default function HeaderAuthControls() {
  const { user, loading } = useAuth()

  if (loading) {
    // Render a placeholder or loading indicator while auth state is being determined
    return <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
  }

  return user ? <UserDropdown user={user} /> : <SignInButton />
} 