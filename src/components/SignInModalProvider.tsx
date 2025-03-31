'use client'

import { createContext, useState, useContext, ReactNode } from 'react'
import SignInModal from './SignInModal'

interface SignInModalContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const SignInModalContext = createContext<SignInModalContextType | undefined>(undefined)

export function useSignInModal() {
  const context = useContext(SignInModalContext)
  if (context === undefined) {
    throw new Error('useSignInModal must be used within a SignInModalProvider')
  }
  return context
}

export function SignInModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <SignInModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <SignInModal isOpen={isOpen} onClose={closeModal} />
    </SignInModalContext.Provider>
  )
} 