"use client"

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] Service Worker registered:', registration)
          })
          .catch((error) => {
            console.log('[PWA] Service Worker registration failed:', error)
          })
      })
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed')
        if (!dismissed) {
          setShowInstallPrompt(true)
        }
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully')
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log(`[PWA] User response: ${outcome}`)
    if (outcome === 'accepted') {
      setShowInstallPrompt(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (isInstalled) return null

  if (showInstallPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-50 animate-slide-up">
        <div className="card-premium p-5 border-2 border-primary/30">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Download className="h-6 w-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base mb-1">ติดตั้ง SKOService</h3>
              <p className="text-sm text-muted-foreground mb-4">
                ติดตั้งแอพเพื่อใช้งานออฟไลน์และเข้าถึงได้เร็วขึ้น
              </p>
              
              <div className="flex gap-3">
                <button onClick={handleInstallClick} className="btn-glow text-sm py-2 px-4">
                  ติดตั้ง
                </button>
                <button onClick={handleDismiss} className="btn-ghost text-sm py-2 px-4">
                  ไว้ทีหลัง
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-secondary/80 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!showInstallPrompt && deferredPrompt) {
    return (
      <button
        onClick={() => setShowInstallPrompt(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 glow-purple"
        title="ติดตั้งแอพ"
      >
        <Download className="h-6 w-6 text-white" />
      </button>
    )
  }

  return null
}
