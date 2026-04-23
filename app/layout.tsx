import type { Metadata, Viewport } from 'next'
import { Anuphan } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Calculator, Home } from 'lucide-react'
import PWAInstall from './components/PWAInstall'

const anuphan = Anuphan({ subsets: ['latin', 'thai'], variable: '--font-anuphan', weight: ['300', '400', '500', '600', '700'] })

export const viewport: Viewport = {
  themeColor: '#020617',
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
        <link rel="icon" href="/icon-192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className={`${anuphan.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
          {/* Background Glow Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-violet-500/10 blur-3xl rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full" />
          </div>
          
          {/* Navbar */}
          <nav className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg group-hover:scale-105 transition-transform">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  SKOService
                </span>
              </Link>
              
              <Link 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">หน้าหลัก</span>
              </Link>
            </div>
          </nav>
          
          {/* Main Content */}
          <main className="relative z-10">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="relative z-10 text-center text-slate-500 text-sm mt-10 border-t border-slate-800 pt-6 pb-8">
            <p>© {new Date().getFullYear()} <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent font-semibold">SKOService</span> · Built with Next.js</p>
          </footer>
        </div>
        
        <PWAInstall />
      </body>
    </html>
  )
}
