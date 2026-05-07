import ValueCalculator from "./calculator"
import { CheckCircle2, ShoppingBasket, PackageCheck, Scale } from "lucide-react"
import PageHeader from "../components/PageHeader"

export default function Page() {
  return (
    <div className="page-container space-y-6">
      <PageHeader
        title="Value For Money"
        description="Compare options to find the best deal"
        icon={CheckCircle2}
        color="green"
        badge="Best deals"
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
        <div className="section-card border-green-500/20 bg-gradient-to-br from-green-500/10 via-slate-900/70 to-emerald-500/5">
          <div className="flex items-center gap-2 text-sm font-semibold text-green-300">
            <CheckCircle2 className="h-4 w-4" />
            Compare packs, bottles, boxes, or bulk offers fairly
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            ใส่ราคา จำนวนแพ็ก และจำนวนชิ้นต่อแพ็ก ระบบจะคำนวณราคาเฉลี่ยต่อหน่วยให้ทันที เพื่อช่วยตัดสินใจว่าตัวเลือกไหนคุ้มกว่าจริง ไม่ใช่แค่ราคาหน้าป้ายถูกกว่า
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/55 px-4 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <ShoppingBasket className="h-4 w-4 text-green-300" />
                Grocery runs
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">เทียบขวด เครื่องดื่ม ขนม หรือแพ็กโปรโมชั่นที่ปริมาณไม่เท่ากัน</p>
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/55 px-4 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <PackageCheck className="h-4 w-4 text-green-300" />
                Bulk purchases
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">เช็กว่าการซื้อยกลัง ยกโหล หรือแบบแพ็กประหยัดลดต้นทุนต่อหน่วยจริงหรือไม่</p>
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/55 px-4 py-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <Scale className="h-4 w-4 text-green-300" />
                Fair comparison
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">ใช้จำนวนหน่วยเป็นฐานเดียวกันแล้วดูผลลัพธ์ว่าใครได้ราคาต่อชิ้นดีที่สุด</p>
            </div>
          </div>
        </div>

        <div className="section-card space-y-4">
          <div>
            <div className="badge mb-3">How to use</div>
            <h2 className="text-lg font-bold text-white">เริ่มใช้งานใน 3 ขั้น</h2>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/55 px-4 py-3">
              <div className="font-semibold text-white">1. ใส่ราคาจริง</div>
              <p className="mt-1 text-slate-400">กรอกราคาที่ต้องจ่ายทั้งหมดของแต่ละตัวเลือก</p>
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/55 px-4 py-3">
              <div className="font-semibold text-white">2. ระบุจำนวนแพ็กและจำนวนต่อแพ็ก</div>
              <p className="mt-1 text-slate-400">ระบบจะคูณเป็นจำนวนหน่วยรวมให้อัตโนมัติ</p>
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/55 px-4 py-3">
              <div className="font-semibold text-white">3. ดูผู้ชนะจากราคา/หน่วย</div>
              <p className="mt-1 text-slate-400">ผลลัพธ์จะไฮไลต์ตัวเลือกที่คุ้มค่าที่สุดและเทียบความต่างให้ทันที</p>
            </div>
          </div>
        </div>
      </div>

      <ValueCalculator />
    </div>
  )
}
