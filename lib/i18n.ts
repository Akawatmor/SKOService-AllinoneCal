export type Language = 'th' | 'en'

export interface Translations {
  // Common
  common: {
    search: string
    back: string
    home: string
    recentlyUsed: string
    starredTools: string
    allTools: string
  }
  // Home page
  home: {
    title: string
    subtitle: string
    installPrompt: string
    badge: string
  }
  // Tools
  tools: {
    unitConverter: { name: string; desc: string }
    periodicTable: { name: string; desc: string }
    valueForMoney: { name: string; desc: string }
    chainCalculator: { name: string; desc: string }
    casCalculator: { name: string; desc: string }
    baseConverter: { name: string; desc: string }
    dateCalculator: { name: string; desc: string }
    storageConverter: { name: string; desc: string }
  }
}

export const translations: Record<Language, Translations> = {
  th: {
    common: {
      search: 'ค้นหาเครื่องมือ...',
      back: 'กลับ',
      home: 'หน้าหลัก',
      recentlyUsed: 'ใช้งานล่าสุด',
      starredTools: 'เครื่องมือที่ชื่นชอบ',
      allTools: 'เครื่องมือทั้งหมด',
    },
    home: {
      title: 'SKOService',
      subtitle: 'เครื่องมือคำนวณครบวงจร พร้อมใช้งานออฟไลน์',
      installPrompt: 'ติดตั้งเป็นแอพเพื่อใช้งานออฟไลน์',
      badge: 'เครื่องมือคำนวณครบวงจร',
    },
    tools: {
      unitConverter: {
        name: 'แปลงหน่วย',
        desc: 'แปลงหน่วยมากกว่า 15 หมวดหมู่ รวมถึงความยาว น้ำหนัก ปริมาตร อุณหภูมิ และอื่นๆ',
      },
      periodicTable: {
        name: 'ตารางธาตุ',
        desc: 'ตารางธาตุเคมีแบบโต้ตอบพร้อมรายละเอียดธาตุ 118 ธาตุและเครื่องคำนวณมวลโมเลกุล',
      },
      valueForMoney: {
        name: 'คุ้มค่าที่สุด',
        desc: 'เปรียบเทียบผลิตภัณฑ์ตามปริมาณและราคาเพื่อหาข้อเสนอที่ดีที่สุด',
      },
      chainCalculator: {
        name: 'เครื่องคิดเลขแบบลูกโซ่',
        desc: 'ทำการคำนวณแบบต่อเนื่องทีละขั้นตอนพร้อมประวัติ',
      },
      casCalculator: {
        name: 'เครื่องคิดเลข CAS',
        desc: 'ระบบพีชคณิตคอมพิวเตอร์สำหรับคณิตศาสตร์เชิงสัญลักษณ์',
      },
      baseConverter: {
        name: 'แปลงเลขฐาน',
        desc: 'แปลงตัวเลขระหว่างเลขฐาน 2, 8, 10, 16 และอื่นๆ',
      },
      dateCalculator: {
        name: 'คำนวณวันที่',
        desc: 'คำนวณความแตกต่างของวันที่หรือบวก/ลบช่วงเวลา',
      },
      storageConverter: {
        name: 'แปลงหน่วยความจุ',
        desc: 'แปลงหน่วยระหว่าง bits, bytes, KB, MB, GB, TB และอื่นๆ',
      },
    },
  },
  en: {
    common: {
      search: 'Search tools...',
      back: 'Back',
      home: 'Home',
      recentlyUsed: 'Recently Used',
      starredTools: 'Starred Tools',
      allTools: 'All Tools',
    },
    home: {
      title: 'SKOService',
      subtitle: 'All-in-One Calculator Suite with Offline Support',
      installPrompt: 'Install as app for offline use',
      badge: 'All-in-One Calculator Suite',
    },
    tools: {
      unitConverter: {
        name: 'Unit Converter',
        desc: 'Convert between 15+ categories including Length, Weight, Volume, Temperature and more',
      },
      periodicTable: {
        name: 'Periodic Table',
        desc: 'Interactive periodic table with 118 elements and molar mass calculator',
      },
      valueForMoney: {
        name: 'Value for Money',
        desc: 'Compare products by quantity and price to find the best deal',
      },
      chainCalculator: {
        name: 'Chain Calculator',
        desc: 'Perform continuous calculations step-by-step with history',
      },
      casCalculator: {
        name: 'CAS Calculator',
        desc: 'Computer Algebra System for symbolic mathematics',
      },
      baseConverter: {
        name: 'Base Converter',
        desc: 'Convert numbers between Binary, Octal, Decimal, Hex',
      },
      dateCalculator: {
        name: 'Date Calculator',
        desc: 'Calculate date differences or add/subtract time periods',
      },
      storageConverter: {
        name: 'Storage Converter',
        desc: 'Convert between bits, bytes, KB, MB, GB, TB and more',
      },
    },
  },
}

export function useTranslation(lang: Language = 'th') {
  return translations[lang]
}
