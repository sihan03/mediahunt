import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MediaHunt - AI Media Discovery',
  description: 'Discover and vote for the best AI media sources',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
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
            <Link
              href="/signin"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Sign in
            </Link>
          </div>
        </header>
        
        {/* Page content with padding for the fixed header */}
        <div className="pt-20">
          {children}
        </div>
      </body>
    </html>
  )
}