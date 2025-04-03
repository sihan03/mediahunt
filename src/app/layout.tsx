import './globals.css'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/SignOutButton'
import { SignInModalProvider } from '@/components/SignInModalProvider'
import SignInButton from '@/components/SignInButton'

export const metadata: Metadata = {
  title: 'MediaHunt - AI Media Discovery',
  description: 'Discover and vote for the best AI media sources',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body>
        <SignInModalProvider>
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl" role="img" aria-label="Robot">🕵️</span>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">MediaHunt</h1>
                  <p className="text-sm text-gray-500">Discover and vote for the best AI media sources</p>
                </div>
              </div>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{user.email}</span>
                  <SignOutButton />
                </div>
              ) : (
                <SignInButton />
              )}
            </div>
          </header>
          
          {/* Page content with padding for the fixed header */}
          <div className="pt-20">
            {children}
          </div>
        </SignInModalProvider>
      </body>
    </html>
  )
}