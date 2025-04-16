'use client'

import { useSignInModal } from './SignInModalProvider'

export default function SignInButton() {
  const { openModal } = useSignInModal()

  return (
    <button
      onClick={openModal}
      className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 cursor-pointer"
    >
      Sign in
    </button>
  )
} 