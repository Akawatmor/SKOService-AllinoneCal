import UnitConverter from "./converter"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Unit Converter</h1>
          <p className="text-muted-foreground text-sm">Convert between standard units</p>
        </div>
      </div>
      <UnitConverter />
    </div>
  )
}
