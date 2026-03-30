'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftRight, CheckCircle2, Calculator, ArrowRight, Sigma, Binary, Calendar, HardDrive, Atom, Sparkles, Search, Star, Clock, Globe } from 'lucide-react'
import { getRecentTools, getStarredTools, toggleToolStar, isToolStarred, markToolUsed, type ToolInfo } from '@/lib/toolsStore'
import { useTranslation, type Language } from '@/lib/i18n'

const tools = [
  {
    id: 'unit-converter',
    title: "Unit Converter",
    titleTh: "แปลงหน่วย",
    description: "Convert between 15+ categories including Length, Weight, Volume, Temperature and more",
    descriptionTh: "แปลงหน่วยมากกว่า 15 หมวดหมู่ รวมถึงความยาว น้ำหนัก ปริมาตร อุณหภูมิ และอื่นๆ",
    href: "/unit-converter",
    icon: ArrowLeftRight,
    color: "violet",
  },
  {
    id: 'periodic-table',
    title: "Periodic Table",
    titleTh: "ตารางธาตุ",
    description: "Interactive periodic table with 118 elements and molar mass calculator",
    descriptionTh: "ตารางธาตุเคมีแบบโต้ตอบพร้อมรายละเอียดธาตุ 118 ธาตุและเครื่องคำนวณมวลโมเลกุล",
    href: "/periodic-table",
    icon: Atom,
    color: "emerald",
  },
  {
    id: 'value-for-money',
    title: "Value for Money",
    titleTh: "คุ้มค่าที่สุด",
    description: "Compare products by quantity and price to find the best deal",
    descriptionTh: "เปรียบเทียบผลิตภัณฑ์ตามปริมาณและราคาเพื่อหาข้อเสนอที่ดีที่สุด",
    href: "/value-for-money",
    icon: CheckCircle2,
    color: "green",
  },
  {
    id: 'chain-calculator',
    title: "Chain Calculator",
    titleTh: "เครื่องคิดเลขแบบลูกโซ่",
    description: "Perform continuous calculations step-by-step with history",
    descriptionTh: "ทำการคำนวณแบบต่อเนื่องทีละขั้นตอนพร้อมประวัติ",
    href: "/chain-calculator",
    icon: Calculator,
    color: "amber",
  },
  {
    id: 'cas-calculator',
    title: "CAS Calculator",
    titleTh: "เครื่องคิดเลข CAS",
    description: "Computer Algebra System for symbolic mathematics",
    descriptionTh: "ระบบพีชคณิตคอมพิวเตอร์สำหรับคณิตศาสตร์เชิงสัญลักษณ์",
    href: "/cas",
    icon: Sigma,
    color: "pink",
  },
  {
    id: 'base-converter',
    title: "Base Converter",
    titleTh: "แปลงเลขฐาน",
    description: "Convert numbers between Binary, Octal, Decimal, Hex",
    descriptionTh: "แปลงตัวเลขระหว่างเลขฐาน 2, 8, 10, 16 และอื่นๆ",
    href: "/base-converter",
    icon: Binary,
    color: "cyan",
  },
  {
    id: 'date-calculator',
    title: "Date Calculator",
    titleTh: "คำนวณวันที่",
    description: "Calculate date differences or add/subtract time periods",
    descriptionTh: "คำนวณความแตกต่างของวันที่หรือบวก/ลบช่วงเวลา",
    href: "/date-calculator",
    icon: Calendar,
    color: "fuchsia",
  },
  {
    id: 'storage-converter',
    title: "Storage Converter",
    titleTh: "แปลงหน่วยความจุ",
    description: "Convert between bits, bytes, KB, MB, GB, TB and more",
    descriptionTh: "แปลงหน่วยระหว่าง bits, bytes, KB, MB, GB, TB และอื่นๆ",
    href: "/storage-converter",
    icon: HardDrive,
    color: "indigo",
  }
]

const colorClasses: Record<string, { border: string; bg: string; icon: string }> = {
  violet: { border: "border-violet-500/20 hover:border-violet-500/40", bg: "bg-violet-500/10", icon: "text-violet-400 group-hover:text-violet-300" },
  emerald: { border: "border-emerald-500/20 hover:border-emerald-500/40", bg: "bg-emerald-500/10", icon: "text-emerald-400 group-hover:text-emerald-300" },
  green: { border: "border-green-500/20 hover:border-green-500/40", bg: "bg-green-500/10", icon: "text-green-400 group-hover:text-green-300" },
  amber: { border: "border-amber-500/20 hover:border-amber-500/40", bg: "bg-amber-500/10", icon: "text-amber-400 group-hover:text-amber-300" },
  pink: { border: "border-pink-500/20 hover:border-pink-500/40", bg: "bg-pink-500/10", icon: "text-pink-400 group-hover:text-pink-300" },
  cyan: { border: "border-cyan-500/20 hover:border-cyan-500/40", bg: "bg-cyan-500/10", icon: "text-cyan-400 group-hover:text-cyan-300" },
  fuchsia: { border: "border-fuchsia-500/20 hover:border-fuchsia-500/40", bg: "bg-fuchsia-500/10", icon: "text-fuchsia-400 group-hover:text-fuchsia-300" },
  indigo: { border: "border-indigo-500/20 hover:border-indigo-500/40", bg: "bg-indigo-500/10", icon: "text-indigo-400 group-hover:text-indigo-300" },
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [recentTools, setRecentTools] = useState<ToolInfo[]>([])
  const [starredTools, setStarredTools] = useState<ToolInfo[]>([])
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set())
  const [language, setLanguage] = useState<Language>('th')
  const t = useTranslation(language)

  useEffect(() => {
    setRecentTools(getRecentTools())
    setStarredTools(getStarredTools())
    const starred = new Set(tools.filter(tool => isToolStarred(tool.id)).map(t => t.id))
    setStarredIds(starred)
    
    // Load language preference
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang) setLanguage(savedLang)
  }, [])

  const toggleLanguage = () => {
    const newLang = language === 'th' ? 'en' : 'th'
    setLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  const handleToggleStar = (e: React.MouseEvent, toolId: string, href: string) => {
    e.preventDefault()
    e.stopPropagation()
    const isStarred = toggleToolStar(toolId, href)
    setStarredIds(prev => {
      const next = new Set(prev)
      if (isStarred) {
        next.add(toolId)
      } else {
        next.delete(toolId)
      }
      return next
    })
    setStarredTools(getStarredTools())
  }

  const handleToolClick = (toolId: string, href: string) => {
    markToolUsed(toolId, href)
    setRecentTools(getRecentTools())
  }

  const filteredTools = tools.filter(tool => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const title = language === 'th' ? tool.titleTh : tool.title
    const desc = language === 'th' ? tool.descriptionTh : tool.description
    return title.toLowerCase().includes(query) || desc.toLowerCase().includes(query)
  })

  const recentToolsData = recentTools.map(rt => tools.find(t => t.id === rt.id)).filter(Boolean) as typeof tools
  const starredToolsData = starredTools.map(st => tools.find(t => t.id === st.id)).filter(Boolean) as typeof tools

  const ToolCard = ({ tool, index }: { tool: typeof tools[0]; index: number }) => {
    const colors = colorClasses[tool.color]
    const isStarred = starredIds.has(tool.id)
    const title = language === 'th' ? tool.titleTh : tool.title
    const description = language === 'th' ? tool.descriptionTh : tool.description

    return (
      <Link
        key={tool.href}
        href={tool.href}
        onClick={() => handleToolClick(tool.id, tool.href)}
        className={`tool-card group ${colors.border} ${colors.bg} relative`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <button
          onClick={(e) => handleToggleStar(e, tool.id, tool.href)}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          aria-label={isStarred ? 'Unstar' : 'Star'}
        >
          <Star
            className={`w-5 h-5 ${isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`}
          />
        </button>

        <div className="relative z-10 flex flex-col h-full gap-4">
          <div className="flex items-start justify-between pr-8">
            <div className={`p-3 rounded-xl bg-slate-950/50 w-fit border border-slate-800 backdrop-blur-sm ${colors.icon}`}>
              <tool.icon className="w-7 h-7" aria-hidden="true" />
            </div>
            <span className="badge">{language === 'th' ? 'พร้อมใช้งาน' : 'Available'}</span>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-white transition-colors">
              {title}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300">
              {description}
            </p>
          </div>
          
          <div className="mt-auto pt-4 flex items-center text-sm font-medium text-slate-500 group-hover:text-white transition-colors">
            {language === 'th' ? 'เปิดใช้งาน' : 'Open Tool'}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="page-container flex flex-col gap-8 md:gap-12">
      {/* Hero Section */}
      <header className="text-center space-y-4 animate-slide-up">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="badge badge-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.home.badge}</span>
          </div>
          <button
            onClick={toggleLanguage}
            className="badge hover:bg-slate-700/50 transition-colors cursor-pointer"
            title="Switch Language"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{language === 'th' ? 'EN' : 'TH'}</span>
          </button>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight pb-2 drop-shadow-[0_0_16px_rgba(139,92,246,0.25)]">
          <span className="text-gradient animate-shimmer">{t.home.title}</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          {t.home.subtitle}
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto pt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.common.search}
              className="input-modern w-full pl-12 text-base"
            />
          </div>
        </div>
      </header>

      {/* Starred Tools */}
      {starredToolsData.length > 0 && !searchQuery && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            {t.common.starredTools}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {starredToolsData.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Used Tools */}
      {recentToolsData.length > 0 && !searchQuery && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-cyan-400" />
            {t.common.recentlyUsed}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {recentToolsData.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </div>
      )}
      
      {/* All Tools Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">
          {searchQuery ? `${language === 'th' ? 'ผลการค้นหา' : 'Search Results'} (${filteredTools.length})` : t.common.allTools}
        </h2>
        {filteredTools.length === 0 ? (
          <div className="section-card text-center py-12">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              {language === 'th' ? 'ไม่พบเครื่องมือที่ตรงกับการค้นหา' : 'No tools found matching your search'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/50 border border-slate-800/60">
          <span className="text-2xl">📱</span>
          <span className="text-sm text-slate-400">
            {t.home.installPrompt}
          </span>
        </div>
      </div>
    </div>
  )
}
