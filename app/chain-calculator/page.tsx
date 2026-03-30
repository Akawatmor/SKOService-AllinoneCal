import ChainCalculator from "./chain"
import { Calculator } from "lucide-react"
import PageHeader from "../components/PageHeader"

export default function Page() {
  return (
    <div className="page-container space-y-6">
      <PageHeader
        title="Chain Calculator"
        description="Create a calculation thread step-by-step"
        icon={Calculator}
        color="amber"
      />
      <ChainCalculator />
    </div>
  )
}
