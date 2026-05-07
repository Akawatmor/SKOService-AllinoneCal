import type { Metadata, Viewport } from 'next'
import { Anuphan } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Calculator, Home, Sparkles } from 'lucide-react'
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
        <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden app-shell">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.16),transparent_35%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_bottom,rgba(14,165,233,0.1),transparent_35%)]" />
            <div className="absolute inset-x-0 top-0 h-[28rem] bg-[linear-gradient(180deg,rgba(15,23,42,0.15),transparent)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.7),transparent_85%)] opacity-30" />
          </div>
          
          <nav className="sticky top-0 z-20 px-3 sm:px-5 pt-3">
            <div className="max-w-6xl mx-auto rounded-2xl border border-slate-800/70 bg-slate-950/75 shadow-[0_18px_50px_rgba(2,6,23,0.45)] backdrop-blur-xl">
              <div className="px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-3 group min-w-0">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
                    <Calculator className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-base sm:text-lg font-bold bg-gradient-to-r from-violet-200 via-sky-100 to-cyan-200 bg-clip-text text-transparent">
                      SKOService
                    </span>
                    <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                      <Sparkles className="h-3 w-3 text-violet-300" />
                      Utility suite for fast everyday calculations
                    </span>
                  </div>
                </Link>
                
                <Link 
                  href="/" 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 border border-slate-800/70 bg-slate-900/60 hover:text-white hover:border-slate-700 hover:bg-slate-800/70 transition-all shrink-0"
                >
                  <Home className="h-4 w-4 text-slate-400" />
                  <span className="hidden sm:inline">หน้าหลัก</span>
                </Link>
              </div>
            </div>
          </nav>
          
          <main className="relative z-10 pb-8">
            {children}
          </main>
          
          <footer className="relative z-10 mt-8 px-4 sm:px-6 md:px-8 pb-8">
            <div className="max-w-6xl mx-auto rounded-2xl border border-slate-800/70 bg-slate-950/70 px-5 py-4 text-sm text-slate-400 backdrop-blur-xl">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  © {new Date().getFullYear()} <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent font-semibold">SKOService</span>
                </p>
                <p className="text-slate-500">Offline-ready calculator workspace built with Next.js</p>
              </div>
            </div>
          </footer>
        </div>
        
        <PWAInstall />
      </body>
    </html>
  )
}
