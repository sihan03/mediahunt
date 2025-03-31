'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSignInModal } from '@/components/SignInModalProvider'

export default function SignIn() {
  const router = useRouter()
  const { openModal } = useSignInModal()

  useEffect(() => {
    // Open the modal automatically
    openModal()
    
    // Redirect to home page after a short delay
    const timeout = setTimeout(() => {
      router.push('/')
    }, 100)
    
    return () => clearTimeout(timeout)
  }, [openModal, router])

  // Return empty div as we're redirecting
  return <div className="min-h-screen bg-gray-50"></div>
}
