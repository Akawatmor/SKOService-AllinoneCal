import PeriodicTable from "./periodic-table"

export const metadata = {
  title: 'Periodic Table - UtilsCal',
  description: 'Interactive periodic table with element details and molar mass calculator',
}

export default function PeriodicTablePage() {
  return (
    <main className="min-h-screen p-4 sm:p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Periodic Table</h1>
        <p className="text-muted-foreground">Explore elements and calculate molar masses</p>
      </div>
      <PeriodicTable />
    </main>
  )
}
