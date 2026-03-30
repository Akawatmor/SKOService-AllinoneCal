import Link from 'next/link'
import { ArrowLeftRight, CheckCircle2, Calculator, ArrowRight, Sigma, Binary, Calendar, HardDrive, Atom, Sparkles } from 'lucide-react'

export default function Home() {
  const tools = [
    {
      title: "Unit Converter",
      description: "Convert between 15+ categories including Length, Weight, Volume, Temperature and more",
      href: "/unit-converter",
      icon: ArrowLeftRight,
      color: "from-violet-500 to-purple-600",
      iconBg: "bg-violet-500"
    },
    {
      title: "Periodic Table",
      description: "Interactive periodic table with 118 elements and molar mass calculator",
      href: "/periodic-table",
      icon: Atom,
      color: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-500"
    },
    {
      title: "Value for Money",
      description: "Compare products by quantity and price to find the best deal",
      href: "/value-for-money",
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-600",
      iconBg: "bg-green-500"
    },
    {
      title: "Chain Calculator",
      description: "Perform continuous calculations step-by-step with history",
      href: "/chain-calculator",
      icon: Calculator,
      color: "from-orange-500 to-amber-600",
      iconBg: "bg-orange-500"
    },
    {
      title: "CAS Calculator",
      description: "Computer Algebra System for symbolic mathematics",
      href: "/cas",
      icon: Sigma,
      color: "from-pink-500 to-rose-600",
      iconBg: "bg-pink-500"
    },
    {
      title: "Base Converter",
      description: "Convert numbers between Binary, Octal, Decimal, Hex",
      href: "/base-converter",
      icon: Binary,
      color: "from-cyan-500 to-blue-600",
      iconBg: "bg-cyan-500"
    },
    {
      title: "Date Calculator",
      description: "Calculate date differences or add/subtract time periods",
      href: "/date-calculator",
      icon: Calendar,
      color: "from-fuchsia-500 to-pink-600",
      iconBg: "bg-fuchsia-500"
    },
    {
      title: "Storage Converter",
      description: "Convert between bits, bytes, KB, MB, GB, TB and more",
      href: "/storage-converter",
      icon: HardDrive,
      color: "from-indigo-500 to-violet-600",
      iconBg: "bg-indigo-500"
    }
  ]

  return (
    <div className="relative min-h-screen">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="bg-blur-circle w-[500px] h-[500px] bg-purple-600/20 -top-48 -left-48" />
        <div className="bg-blur-circle w-[400px] h-[400px] bg-cyan-600/20 top-1/2 -right-32" />
        <div className="bg-blur-circle w-[300px] h-[300px] bg-pink-600/15 bottom-0 left-1/3" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16 animate-slide-up">
          <div className="badge mb-6">
            <Sparkles className="h-4 w-4" />
            <span>All-in-One Calculator Suite</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-gradient">SKOService</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            เครื่องมือคำนวณครบวงจร พร้อมใช้งานออฟไลน์
            <span className="hidden sm:inline"> รองรับการติดตั้งเป็นแอพบนทุกอุปกรณ์</span>
          </p>
        </div>
        
        {/* Tools Grid */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool, index) => (
            <Link 
              key={tool.href} 
              href={tool.href}
              className="group card-premium p-5 md:p-6 flex flex-col transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Icon */}
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <tool.icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {tool.description}
              </p>
              
              {/* Arrow */}
              <div className="flex items-center gap-2 mt-4 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                <span>เปิดใช้งาน</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-12 md:mt-16 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-secondary/50 border border-border/50">
            <span className="text-2xl">📱</span>
            <span className="text-sm text-muted-foreground">
              ติดตั้งเป็นแอพเพื่อใช้งานออฟไลน์
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
