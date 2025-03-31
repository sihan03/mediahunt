'use client'

import { useSignInModal } from './SignInModalProvider'

export default function SignInButton() {
  const { openModal } = useSignInModal()

  return (
    <button
      onClick={openModal}
      className="text-indigo-600 hover:text-indigo-500 font-medium"
    >
      Sign in
    </button>
  )
} 