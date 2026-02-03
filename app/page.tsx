import Link from 'next/link'
import { ArrowLeftRight, CheckCircle2, Calculator, ArrowRight } from 'lucide-react'

export default function Home() {
  const tools = [
    {
      title: "Unit Converter",
      description: "Convert between different units of measurement (Length, Weight, Volume, etc.)",
      href: "/unit-converter",
      icon: ArrowLeftRight,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Value for Money",
      description: "Compare products including quantity and price to find the best deal.",
      href: "/value-for-money",
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-50"
    },
    {
      title: "Chain Calculator",
      description: "Perform continuous calculations step-by-step.",
      href: "/chain-calculator",
      icon: Calculator,
      color: "text-orange-500",
      bg: "bg-orange-50"
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Tools & Utilities</h1>
        <p className="text-muted-foreground">Select a tool to get started.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link 
            key={tool.href} 
            href={tool.href}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
          >
            <div className="space-y-4">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${tool.bg} ${tool.color}`}>
                <tool.icon className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-xl">{tool.title}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 mobile-visible">
              Open Tool <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
