export const incompleteFormula = 'กรอกสูตรในช่องว่างให้ครบ'

export type FunctionKey = {
  label: string
  name: string
  template: string
  wrap?: boolean
}

const unary = (label: string, name: string, command: string) => ({
  label, name, template: String.raw`\operatorname{${command}}\left(#0\right)`, wrap: true,
})

export const categories: { id: string; label: string; keys: FunctionKey[] }[] = [
  {
    id: 'science', label: 'วิทย์',
    keys: [
      { label: '□/□', name: 'เศษส่วน', template: String.raw`\frac{#0}{#?}` },
      { label: '√', name: 'รากที่สอง', template: String.raw`\sqrt{#0}` },
      { label: 'xⁿ', name: 'เลขยกกำลัง', template: '^{#?}' },
      { label: 'sin', name: 'ไซน์', template: String.raw`\sin\left(#0\right)` },
      { label: 'cos', name: 'โคไซน์', template: String.raw`\cos\left(#0\right)` },
      { label: 'tan', name: 'แทนเจนต์', template: String.raw`\tan\left(#0\right)` },
      { label: 'log', name: 'ลอการิทึมฐานสิบ', template: String.raw`\log_{10}\left(#0\right)` },
      { label: 'ln', name: 'ลอการิทึมธรรมชาติ', template: String.raw`\ln\left(#0\right)` },
      { label: 'π', name: 'ค่าพาย', template: String.raw`\pi` },
      { label: '!', name: 'แฟกทอเรียล', template: '!' },
    ],
  },
  {
    id: 'algebra', label: 'พีชคณิต',
    keys: [
      { label: 'Solve', name: 'แก้สมการ', template: String.raw`\operatorname{Solve}\left(#0,x\right)`, wrap: true },
      unary('Factor', 'แยกตัวประกอบ', 'Factor'),
      unary('Expand', 'กระจายพจน์', 'Expand'),
      unary('Simplify', 'จัดรูปนิพจน์', 'Simplify'),
      unary('≈', 'หาค่าประมาณ', 'Approx'),
      { label: 'GCD', name: 'หาตัวหารร่วมมาก', template: String.raw`\operatorname{GCD}\left(#0,#?\right)` },
      { label: 'LCM', name: 'หาตัวคูณร่วมน้อย', template: String.raw`\operatorname{LCM}\left(#0,#?\right)` },
      { label: '|x|', name: 'ค่าสัมบูรณ์', template: String.raw`\left|#0\right|` },
      { label: 'y', name: 'ตัวแปร y', template: 'y' },
      { label: ',', name: 'จุลภาค', template: ',' },
    ],
  },
  {
    id: 'calculus', label: 'แคลคูลัส',
    keys: [
      { label: 'd/dx', name: 'อนุพันธ์', template: String.raw`\operatorname{Diff}\left(#0,x\right)`, wrap: true },
      { label: '∫', name: 'อินทิกรัลไม่จำกัดเขต', template: String.raw`\int #0\,\mathrm{d}x` },
      { label: '∫ₐᵇ', name: 'อินทิกรัลจำกัดเขต', template: String.raw`\int_{#?}^{#?} #0\,\mathrm{d}x` },
      { label: 'lim', name: 'ลิมิต', template: String.raw`\operatorname{Limit}\left(#0,x,#?\right)` },
      { label: 'Σ', name: 'ผลรวม', template: String.raw`\operatorname{Sum}\left(#0,x,#?,#?\right)` },
      { label: 'Π', name: 'ผลคูณ', template: String.raw`\operatorname{Product}\left(#0,x,#?,#?\right)` },
      { label: '∞', name: 'อนันต์', template: String.raw`\infty` },
      { label: 'e', name: 'ค่าคงที่ออยเลอร์', template: 'e' },
      { label: 'x²', name: 'ยกกำลังสอง', template: '^{2}' },
      { label: ',', name: 'จุลภาค', template: ',' },
    ],
  },
  {
    id: 'matrix', label: 'เมทริกซ์',
    keys: [
      { label: '2×2', name: 'เพิ่มเมทริกซ์ 2 คูณ 2', template: String.raw`\begin{bmatrix}#? & #? \\ #? & #?\end{bmatrix}` },
      { label: '3×3', name: 'เพิ่มเมทริกซ์ 3 คูณ 3', template: String.raw`\begin{bmatrix}#? & #? & #? \\ #? & #? & #? \\ #? & #? & #?\end{bmatrix}` },
      unary('det', 'ดีเทอร์มิแนนต์', 'Det'),
      unary('inv', 'เมทริกซ์ผกผัน', 'Inv'),
      unary('T', 'สลับแถวและคอลัมน์', 'Transpose'),
      unary('rank', 'แรงก์ของเมทริกซ์', 'Rank'),
      unary('eig', 'ค่าลักษณะเฉพาะ', 'Eig'),
      unary('norm', 'นอร์ม', 'Norm'),
    ],
  },
]

export const examples = [
  { id: 'fraction', label: 'บวกเศษส่วน', tex: String.raw`\frac{1}{2}+\frac{1}{3}`, command: '1/2+1/3' },
  { id: 'solve', label: 'แก้สมการ', tex: String.raw`\operatorname{Solve}\left(x^2-5x+6=0,x\right)`, command: 'solve(x^2-5*x+6=0,x)' },
  { id: 'factor', label: 'แยกตัวประกอบ', tex: String.raw`\operatorname{Factor}\left(x^2-4\right)`, command: 'factor(x^2-4)' },
  { id: 'integral', label: 'อินทิกรัลจำกัดเขต', tex: String.raw`\int_{0}^{1}x^2\,\mathrm{d}x`, command: 'integrate(x^2,x,0,1)' },
]
