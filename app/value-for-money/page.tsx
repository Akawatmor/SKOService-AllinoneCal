import ValueCalculator from "./calculator"
import { CheckCircle2 } from "lucide-react"
import PageHeader from "../components/PageHeader"

export default function Page() {
  return (
    <div className="page-container space-y-6">
      <PageHeader
        title="Value For Money"
        description="Compare options to find the best deal"
        icon={CheckCircle2}
        color="green"
      />
      <ValueCalculator />
    </div>
  )
}
