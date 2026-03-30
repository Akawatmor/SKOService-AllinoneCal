import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Calculator, Home } from 'lucide-react'
import PWAInstall from './components/PWAInstall'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'SKOService - All-in-One Calculator',
  description: 'Comprehensive calculator suite with unit converter (15+ categories), periodic table, and advanced features. Works offline as PWA.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SKOService',
  },
  applicationName: 'SKOService Calculator',
  keywords: ['calculator', 'unit converter', 'periodic table', 'scientific calculator', 'PWA'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className="dark">
      <head>
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="icon-container group-hover:scale-105 transition-transform">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg hidden sm:block">
                  <span className="text-gradient">SKOService</span>
                </span>
              </Link>
              
              <nav className="flex items-center gap-1">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">หน้าหลัก</span>
                </Link>
              </nav>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="border-t border-border/40 py-8 mt-auto">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} <span className="text-gradient font-semibold">SKOService</span>
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Built with Next.js • Works Offline
              </p>
            </div>
          </footer>
        </div>
        
        <PWAInstall />
      </body>
    </html>
  )
}
