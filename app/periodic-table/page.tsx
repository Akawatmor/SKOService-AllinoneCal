import PeriodicTable from "./periodic-table"
import { Atom } from "lucide-react"
import PageHeader from "../components/PageHeader"

export const metadata = {
  title: 'Periodic Table - SKOService',
  description: 'Interactive periodic table with element details and molar mass calculator',
}

export default function PeriodicTablePage() {
  return (
    <div className="page-container space-y-6">
      <PageHeader
        title="Periodic Table"
        description="Explore elements and calculate molar masses"
        icon={Atom}
        color="emerald"
      />
      <PeriodicTable />
    </div>
  )
}
