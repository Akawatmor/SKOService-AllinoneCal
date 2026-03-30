import UnitConverter from "./converter"
import { ArrowLeftRight } from "lucide-react"
import PageHeader from "../components/PageHeader"

export default function Page() {
  return (
    <div className="page-container space-y-6">
      <PageHeader
        title="Unit Converter"
        description="Convert between 15+ categories of units"
        icon={ArrowLeftRight}
        color="violet"
      />
      <UnitConverter />
    </div>
  )
}
