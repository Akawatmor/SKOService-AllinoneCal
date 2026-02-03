import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Calculator } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'UtilsCal - Utility Calculator',
  description: 'A suite of useful calculators for everyday tasks.',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <Link href="/" className="flex items-center gap-2 font-bold px-4">
                <Calculator className="h-6 w-6" />
                <span>UtilsCal</span>
              </Link>
            </div>
          </header>
          <main className="flex-1 container py-6 px-4 md:px-6">
            {children}
          </main>
          <footer className="border-t py-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} UtilsCal. Powered by Next.js & Bun.</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
