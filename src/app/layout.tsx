import './globals.css'
import type { Metadata } from 'next'
import { SWRConfig } from 'swr'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/SignOutButton'
import { SignInModalProvider } from '@/components/SignInModalProvider'
import SignInButton from '@/components/SignInButton'
import Image from 'next/image'

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
        <SWRConfig 
          value={{
            revalidateOnFocus: false,
          }}
        >
          <SignInModalProvider>
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image src="/logoicon.webp" alt="MediaHunt Logo" width={42} height={42} />
                  <div>
                    <h1 className="text-3xl font-bold font-serif text-gray-900">MediaHunt</h1>
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
            
            <div className="">
              {children}
            </div>
          </SignInModalProvider>
        </SWRConfig>
      </body>
    </html>
  )
}