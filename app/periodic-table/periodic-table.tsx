"use client"

import { useState } from "react"
import { elements, calculateMolarMass, Element } from "@/lib/elements"
import { Search, Atom } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null)
  const [formula, setFormula] = useState<string>("")
  const [molarMass, setMolarMass] = useState<{ mass: number; breakdown: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")

  const handleCalculate = () => {
    const result = calculateMolarMass(formula)
    setMolarMass(result)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'nonmetal': 'bg-green-500/20 hover:bg-green-500/30 border-green-500/40',
      'noble gas': 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/40',
      'alkali metal': 'bg-red-500/20 hover:bg-red-500/30 border-red-500/40',
      'alkaline earth metal': 'bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/40',
      'transition metal': 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/40',
      'post-transition metal': 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/40',
      'metalloid': 'bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/40',
      'halogen': 'bg-pink-500/20 hover:bg-pink-500/30 border-pink-500/40',
      'lanthanide': 'bg-teal-500/20 hover:bg-teal-500/30 border-teal-500/40',
      'actinide': 'bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/40',
    }
    return colors[category] || 'bg-muted hover:bg-muted/80'
  }

  const filteredElements = searchTerm
    ? elements.filter(e => 
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.nameTh.includes(searchTerm) ||
        e.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.number.toString().includes(searchTerm)
      )
    : elements

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Molar Mass Calculator */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Atom className="h-5 w-5" />
          Molar Mass Calculator
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value.trim())}
            onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
            placeholder="Enter formula (e.g., H2O, Ca(OH)2, H2SO4)"
            className="flex-1 px-4 py-2.5 bg-muted/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleCalculate}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Calculate
          </button>
        </div>
        
        {molarMass && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="text-2xl font-bold text-primary">
              {molarMass.mass} g/mol
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {molarMass.breakdown}
            </div>
          </div>
        )}
        
        {molarMass === null && formula && (
          <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive text-sm">
            Invalid chemical formula. Please check your input.
          </div>
        )}
      </div>

      {/* Element Search */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search element by name, symbol, or number..."
            className="w-full pl-11 pr-4 py-3 bg-muted/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Element Grid */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">
          {searchTerm ? `Search Results (${filteredElements.length})` : 'Periodic Table Elements'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredElements.map((element) => (
            <button
              key={element.number}
              onClick={() => setSelectedElement(element)}
              className={cn(
                "p-3 border rounded-lg transition-all text-left relative",
                getCategoryColor(element.category),
                selectedElement?.number === element.number && "ring-2 ring-primary"
              )}
            >
              <div className="text-xs text-muted-foreground">{element.number}</div>
              <div className="text-2xl font-bold">{element.symbol}</div>
              <div className="text-xs truncate">{element.name}</div>
              <div className="text-xs text-muted-foreground truncate">{element.nameTh}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Element Details */}
      {selectedElement && (
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold">{selectedElement.symbol}</h2>
              <p className="text-xl text-muted-foreground">{selectedElement.name} / {selectedElement.nameTh}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{selectedElement.number}</div>
              <div className="text-sm text-muted-foreground">Atomic Number</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Atomic Mass</div>
              <div className="text-lg font-semibold">{selectedElement.atomicMass} u</div>
            </div>
            
            {selectedElement.group && (
              <div>
                <div className="text-sm text-muted-foreground">Group</div>
                <div className="text-lg font-semibold">{selectedElement.group}</div>
              </div>
            )}
            
            <div>
              <div className="text-sm text-muted-foreground">Period</div>
              <div className="text-lg font-semibold">{selectedElement.period}</div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Category</div>
              <div className="text-lg font-semibold capitalize">{selectedElement.category}</div>
            </div>
            
            {selectedElement.electronegativity && (
              <div>
                <div className="text-sm text-muted-foreground">Electronegativity</div>
                <div className="text-lg font-semibold">{selectedElement.electronegativity}</div>
              </div>
            )}
            
            <div>
              <div className="text-sm text-muted-foreground">Oxidation States</div>
              <div className="text-lg font-semibold">{selectedElement.oxidationStates}</div>
            </div>
            
            {selectedElement.meltingPoint && (
              <div>
                <div className="text-sm text-muted-foreground">Melting Point</div>
                <div className="text-lg font-semibold">{selectedElement.meltingPoint} K</div>
              </div>
            )}
            
            {selectedElement.boilingPoint && (
              <div>
                <div className="text-sm text-muted-foreground">Boiling Point</div>
                <div className="text-lg font-semibold">{selectedElement.boilingPoint} K</div>
              </div>
            )}
            
            {selectedElement.density && (
              <div>
                <div className="text-sm text-muted-foreground">Density</div>
                <div className="text-lg font-semibold">{selectedElement.density} g/cm³</div>
              </div>
            )}
            
            {selectedElement.discoveryYear && (
              <div>
                <div className="text-sm text-muted-foreground">Discovery Year</div>
                <div className="text-lg font-semibold">
                  {selectedElement.discoveryYear < 0 
                    ? `${Math.abs(selectedElement.discoveryYear)} BCE` 
                    : selectedElement.discoveryYear}
                </div>
              </div>
            )}
            
            <div className="md:col-span-2">
              <div className="text-sm text-muted-foreground">Electron Configuration</div>
              <div className="text-lg font-semibold font-mono">{selectedElement.electronConfig}</div>
            </div>
          </div>

          {/* Category Legend */}
          <div className="mt-6 pt-6 border-t">
            <div className="text-sm font-medium mb-3">Element Categories</div>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 border border-green-500/40 rounded">
                <div className="w-3 h-3 bg-green-500/50 rounded-sm"></div>
                Nonmetal
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/20 border border-purple-500/40 rounded">
                <div className="w-3 h-3 bg-purple-500/50 rounded-sm"></div>
                Noble Gas
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/20 border border-red-500/40 rounded">
                <div className="w-3 h-3 bg-red-500/50 rounded-sm"></div>
                Alkali Metal
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/20 border border-blue-500/40 rounded">
                <div className="w-3 h-3 bg-blue-500/50 rounded-sm"></div>
                Transition Metal
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded">
                <div className="w-3 h-3 bg-yellow-500/50 rounded-sm"></div>
                Metalloid
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-pink-500/20 border border-pink-500/40 rounded">
                <div className="w-3 h-3 bg-pink-500/50 rounded-sm"></div>
                Halogen
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
