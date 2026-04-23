export interface Element {
  number: number;
  symbol: string;
  name: string;
  nameTh: string;
  atomicMass: number;
  group?: number;
  period: number;
  category: string;
  electronConfig: string;
  electronegativity?: number;
  oxidationStates: string;
  meltingPoint?: number; // Kelvin
  boilingPoint?: number; // Kelvin
  density?: number; // g/cm³
  discoveryYear?: number;
}

export const elements: Element[] = [
  // Period 1
  { number: 1, symbol: 'H', name: 'Hydrogen', nameTh: 'ไฮโดรเจน', atomicMass: 1.008, group: 1, period: 1, category: 'nonmetal', electronConfig: '1s¹', electronegativity: 2.20, oxidationStates: '+1, -1', meltingPoint: 13.99, boilingPoint: 20.271, density: 0.00008988, discoveryYear: 1766 },
  { number: 2, symbol: 'He', name: 'Helium', nameTh: 'ฮีเลียม', atomicMass: 4.003, group: 18, period: 1, category: 'noble gas', electronConfig: '1s²', oxidationStates: '0', meltingPoint: 0.95, boilingPoint: 4.222, density: 0.0001785, discoveryYear: 1895 },

  // Period 2
  { number: 3, symbol: 'Li', name: 'Lithium', nameTh: 'ลิเทียม', atomicMass: 6.941, group: 1, period: 2, category: 'alkali metal', electronConfig: '[He] 2s¹', electronegativity: 0.98, oxidationStates: '+1', meltingPoint: 453.65, boilingPoint: 1603, density: 0.534, discoveryYear: 1817 },
  { number: 4, symbol: 'Be', name: 'Beryllium', nameTh: 'เบริลเลียม', atomicMass: 9.012, group: 2, period: 2, category: 'alkaline earth metal', electronConfig: '[He] 2s²', electronegativity: 1.57, oxidationStates: '+2', meltingPoint: 1560, boilingPoint: 2742, density: 1.85, discoveryYear: 1798 },
  { number: 5, symbol: 'B', name: 'Boron', nameTh: 'โบรอน', atomicMass: 10.81, group: 13, period: 2, category: 'metalloid', electronConfig: '[He] 2s² 2p¹', electronegativity: 2.04, oxidationStates: '+3', meltingPoint: 2349, boilingPoint: 4200, density: 2.34, discoveryYear: 1808 },
  { number: 6, symbol: 'C', name: 'Carbon', nameTh: 'คาร์บอน', atomicMass: 12.011, group: 14, period: 2, category: 'nonmetal', electronConfig: '[He] 2s² 2p²', electronegativity: 2.55, oxidationStates: '+4, +2, -4', meltingPoint: 3823, boilingPoint: 4098, density: 2.267, discoveryYear: -3750 },
  { number: 7, symbol: 'N', name: 'Nitrogen', nameTh: 'ไนโตรเจน', atomicMass: 14.007, group: 15, period: 2, category: 'nonmetal', electronConfig: '[He] 2s² 2p³', electronegativity: 3.04, oxidationStates: '+5, +4, +3, +2, +1, -3', meltingPoint: 63.15, boilingPoint: 77.355, density: 0.0012506, discoveryYear: 1772 },
  { number: 8, symbol: 'O', name: 'Oxygen', nameTh: 'ออกซิเจน', atomicMass: 15.999, group: 16, period: 2, category: 'nonmetal', electronConfig: '[He] 2s² 2p⁴', electronegativity: 3.44, oxidationStates: '-2', meltingPoint: 54.36, boilingPoint: 90.188, density: 0.001429, discoveryYear: 1774 },
  { number: 9, symbol: 'F', name: 'Fluorine', nameTh: 'ฟลูออรีน', atomicMass: 18.998, group: 17, period: 2, category: 'halogen', electronConfig: '[He] 2s² 2p⁵', electronegativity: 3.98, oxidationStates: '-1', meltingPoint: 53.48, boilingPoint: 85.03, density: 0.001696, discoveryYear: 1886 },
  { number: 10, symbol: 'Ne', name: 'Neon', nameTh: 'นีออน', atomicMass: 20.180, group: 18, period: 2, category: 'noble gas', electronConfig: '[He] 2s² 2p⁶', oxidationStates: '0', meltingPoint: 24.56, boilingPoint: 27.104, density: 0.0008999, discoveryYear: 1898 },

  // Period 3
  { number: 11, symbol: 'Na', name: 'Sodium', nameTh: 'โซเดียม', atomicMass: 22.990, group: 1, period: 3, category: 'alkali metal', electronConfig: '[Ne] 3s¹', electronegativity: 0.93, oxidationStates: '+1', meltingPoint: 370.944, boilingPoint: 1156.09, density: 0.968, discoveryYear: 1807 },
  { number: 12, symbol: 'Mg', name: 'Magnesium', nameTh: 'แมกนีเซียม', atomicMass: 24.305, group: 2, period: 3, category: 'alkaline earth metal', electronConfig: '[Ne] 3s²', electronegativity: 1.31, oxidationStates: '+2', meltingPoint: 923, boilingPoint: 1363, density: 1.738, discoveryYear: 1808 },
  { number: 13, symbol: 'Al', name: 'Aluminum', nameTh: 'อะลูมิเนียม', atomicMass: 26.982, group: 13, period: 3, category: 'post-transition metal', electronConfig: '[Ne] 3s² 3p¹', electronegativity: 1.61, oxidationStates: '+3', meltingPoint: 933.47, boilingPoint: 2743, density: 2.70, discoveryYear: 1825 },
  { number: 14, symbol: 'Si', name: 'Silicon', nameTh: 'ซิลิคอน', atomicMass: 28.085, group: 14, period: 3, category: 'metalloid', electronConfig: '[Ne] 3s² 3p²', electronegativity: 1.90, oxidationStates: '+4, -4', meltingPoint: 1687, boilingPoint: 3538, density: 2.3290, discoveryYear: 1824 },
  { number: 15, symbol: 'P', name: 'Phosphorus', nameTh: 'ฟอสฟอรัส', atomicMass: 30.974, group: 15, period: 3, category: 'nonmetal', electronConfig: '[Ne] 3s² 3p³', electronegativity: 2.19, oxidationStates: '+5, +3, -3', meltingPoint: 317.3, boilingPoint: 553.7, density: 1.823, discoveryYear: 1669 },
  { number: 16, symbol: 'S', name: 'Sulfur', nameTh: 'กำมะถัน', atomicMass: 32.06, group: 16, period: 3, category: 'nonmetal', electronConfig: '[Ne] 3s² 3p⁴', electronegativity: 2.58, oxidationStates: '+6, +4, -2', meltingPoint: 388.36, boilingPoint: 717.8, density: 2.07, discoveryYear: -2000 },
  { number: 17, symbol: 'Cl', name: 'Chlorine', nameTh: 'คลอรีน', atomicMass: 35.45, group: 17, period: 3, category: 'halogen', electronConfig: '[Ne] 3s² 3p⁵', electronegativity: 3.16, oxidationStates: '+7, +5, +1, -1', meltingPoint: 171.6, boilingPoint: 239.11, density: 0.003214, discoveryYear: 1774 },
  { number: 18, symbol: 'Ar', name: 'Argon', nameTh: 'อาร์กอน', atomicMass: 39.948, group: 18, period: 3, category: 'noble gas', electronConfig: '[Ne] 3s² 3p⁶', oxidationStates: '0', meltingPoint: 83.81, boilingPoint: 87.302, density: 0.001784, discoveryYear: 1894 },

  // Period 4
  { number: 19, symbol: 'K', name: 'Potassium', nameTh: 'โพแทสเซียม', atomicMass: 39.098, group: 1, period: 4, category: 'alkali metal', electronConfig: '[Ar] 4s¹', electronegativity: 0.82, oxidationStates: '+1', meltingPoint: 336.7, boilingPoint: 1032, density: 0.89, discoveryYear: 1807 },
  { number: 20, symbol: 'Ca', name: 'Calcium', nameTh: 'แคลเซียม', atomicMass: 40.078, group: 2, period: 4, category: 'alkaline earth metal', electronConfig: '[Ar] 4s²', electronegativity: 1.00, oxidationStates: '+2', meltingPoint: 1115, boilingPoint: 1757, density: 1.55, discoveryYear: 1808 },
  { number: 21, symbol: 'Sc', name: 'Scandium', nameTh: 'สแกนเดียม', atomicMass: 44.956, group: 3, period: 4, category: 'transition metal', electronConfig: '[Ar] 3d¹ 4s²', electronegativity: 1.36, oxidationStates: '+3', meltingPoint: 1814, boilingPoint: 3109, density: 2.985, discoveryYear: 1879 },
  { number: 22, symbol: 'Ti', name: 'Titanium', nameTh: 'ไทเทเนียม', atomicMass: 47.867, group: 4, period: 4, category: 'transition metal', electronConfig: '[Ar] 3d² 4s²', electronegativity: 1.54, oxidationStates: '+4, +3, +2', meltingPoint: 1941, boilingPoint: 3560, density: 4.506, discoveryYear: 1791 },
  { number: 23, symbol: 'V', name: 'Vanadium', nameTh: 'วาเนเดียม', atomicMass: 50.942, group: 5, period: 4, category: 'transition metal', electronConfig: '[Ar] 3d³ 4s²', electronegativity: 1.63, oxidationStates: '+5, +4, +3, +2', meltingPoint: 2183, boilingPoint: 3680, density: 6.0, discoveryYear: 1801 },
  { number: 24, symbol: 'Cr', name: 'Chromium', nameTh: 'โครเมียม', atomicMass: 51.996, group: 6, period: 4, category: 'transition metal', electronConfig: '[Ar] 3d⁵ 4s¹', electronegativity: 1.66, oxidationStates: '+6, +3, +2', meltingPoint: 2180, boilingPoint: 2944, density: 7.15, discoveryYear: 1797 },
  { number: 25, symbol: 'Mn', name: 'Manganese', nameTh: 'แมงกานีส', atomicMass: 54.938, group: 7, period: 4, category: 'transition metal', electronConfig: '[Ar] 3d⁵ 4s²', electronegativity: 1.55, oxidationStates: '+7, +4, +3, +2', meltingPoint: 1519, boilingPoint: 2334, density: 7.21, discoveryYear: 1774 },
  { number: 26, symbol: 'Fe', name: 'Iron', nameTh: 'เหล็ก', atomicMass: 55.845, group: 8, period: 4, category: 'transition metal', electronConfig: '[Ar] 3d⁶ 4s²', electronegativity: 1.83, oxidationStates: '+3, +2', meltingPoint: 1811, boilingPoint: 3134, density: 7.874, discoveryYear: -3000 },
  { number: 27, symbol: 'Co', name: 'Cobalt', nameTh: 'โคบอลต์', atomicMass: 58.933, group: 9, period: 4, category: 'transition metal', electronConfig: '[Ar] 3d⁷ 4s²', electronegativity: 1.88, oxidationStates: '+3, +2', meltingPoint: 1768, boilingPoint: 3200, density: 8.90, discoveryYear: 1735 },
  { number: 28, symbol: 'Ni', name: 'Nickel', nameTh: 'นิกเกิล', atomicMass: 58.693, group: 10, period: 4, category: 'transition metal', electronConfig: '[Ar] 3d⁸ 4s²', electronegativity: 1.91, oxidationStates: '+2, +3', meltingPoint: 1728, boilingPoint: 3003, density: 8.908, discoveryYear: 1751 },
  { number: 29, symbol: 'Cu', name: 'Copper', nameTh: 'ทองแดง', atomicMass: 63.546, group: 11, period: 4, category: 'transition metal', electronConfig: '[Ar] 3d¹⁰ 4s¹', electronegativity: 1.90, oxidationStates: '+2, +1', meltingPoint: 1357.77, boilingPoint: 2835, density: 8.96, discoveryYear: -9000 },
  { number: 30, symbol: 'Zn', name: 'Zinc', nameTh: 'สังกะสี', atomicMass: 65.38, group: 12, period: 4, category: 'transition metal', electronConfig: '[Ar] 3d¹⁰ 4s²', electronegativity: 1.65, oxidationStates: '+2', meltingPoint: 692.68, boilingPoint: 1180, density: 7.14, discoveryYear: 1746 },
  { number: 31, symbol: 'Ga', name: 'Gallium', nameTh: 'แกลเลียม', atomicMass: 69.723, group: 13, period: 4, category: 'post-transition metal', electronConfig: '[Ar] 3d¹⁰ 4s² 4p¹', electronegativity: 1.81, oxidationStates: '+3', meltingPoint: 302.91, boilingPoint: 2477, density: 5.91, discoveryYear: 1875 },
  { number: 32, symbol: 'Ge', name: 'Germanium', nameTh: 'เจอร์เมเนียม', atomicMass: 72.630, group: 14, period: 4, category: 'metalloid', electronConfig: '[Ar] 3d¹⁰ 4s² 4p²', electronegativity: 2.01, oxidationStates: '+4, +2', meltingPoint: 1211.4, boilingPoint: 3106, density: 5.323, discoveryYear: 1886 },
  { number: 33, symbol: 'As', name: 'Arsenic', nameTh: 'สารหนู', atomicMass: 74.922, group: 15, period: 4, category: 'metalloid', electronConfig: '[Ar] 3d¹⁰ 4s² 4p³', electronegativity: 2.18, oxidationStates: '+5, +3, -3', meltingPoint: 1090, boilingPoint: 887, density: 5.727, discoveryYear: 1250 },
  { number: 34, symbol: 'Se', name: 'Selenium', nameTh: 'ซีลีเนียม', atomicMass: 78.971, group: 16, period: 4, category: 'nonmetal', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁴', electronegativity: 2.55, oxidationStates: '+6, +4, -2', meltingPoint: 494, boilingPoint: 958, density: 4.819, discoveryYear: 1817 },
  { number: 35, symbol: 'Br', name: 'Bromine', nameTh: 'โบรมีน', atomicMass: 79.904, group: 17, period: 4, category: 'halogen', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵', electronegativity: 2.96, oxidationStates: '+5, +1, -1', meltingPoint: 265.8, boilingPoint: 332.0, density: 3.1028, discoveryYear: 1826 },
  { number: 36, symbol: 'Kr', name: 'Krypton', nameTh: 'คริปทอน', atomicMass: 83.798, group: 18, period: 4, category: 'noble gas', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁶', oxidationStates: '0', meltingPoint: 115.78, boilingPoint: 119.93, density: 0.003749, discoveryYear: 1898 },

  // Period 5
  { number: 37, symbol: 'Rb', name: 'Rubidium', nameTh: 'รูบิเดียม', atomicMass: 85.468, group: 1, period: 5, category: 'alkali metal', electronConfig: '[Kr] 5s¹', electronegativity: 0.82, oxidationStates: '+1', meltingPoint: 312.45, boilingPoint: 961, density: 1.532, discoveryYear: 1861 },
  { number: 38, symbol: 'Sr', name: 'Strontium', nameTh: 'สตรอนเชียม', atomicMass: 87.62, group: 2, period: 5, category: 'alkaline earth metal', electronConfig: '[Kr] 5s²', electronegativity: 0.95, oxidationStates: '+2', meltingPoint: 1050, boilingPoint: 1655, density: 2.64, discoveryYear: 1790 },
  { number: 39, symbol: 'Y', name: 'Yttrium', nameTh: 'อิตเทรียม', atomicMass: 88.906, group: 3, period: 5, category: 'transition metal', electronConfig: '[Kr] 4d¹ 5s²', electronegativity: 1.22, oxidationStates: '+3', meltingPoint: 1799, boilingPoint: 3203, density: 4.472, discoveryYear: 1794 },
  { number: 40, symbol: 'Zr', name: 'Zirconium', nameTh: 'เซอร์โคเนียม', atomicMass: 91.224, group: 4, period: 5, category: 'transition metal', electronConfig: '[Kr] 4d² 5s²', electronegativity: 1.33, oxidationStates: '+4', meltingPoint: 2128, boilingPoint: 4682, density: 6.52, discoveryYear: 1789 },
  { number: 41, symbol: 'Nb', name: 'Niobium', nameTh: 'ไนโอเบียม', atomicMass: 92.906, group: 5, period: 5, category: 'transition metal', electronConfig: '[Kr] 4d⁴ 5s¹', electronegativity: 1.6, oxidationStates: '+5, +3', meltingPoint: 2750, boilingPoint: 5017, density: 8.57, discoveryYear: 1801 },
  { number: 42, symbol: 'Mo', name: 'Molybdenum', nameTh: 'โมลิบดีนัม', atomicMass: 95.95, group: 6, period: 5, category: 'transition metal', electronConfig: '[Kr] 4d⁵ 5s¹', electronegativity: 2.16, oxidationStates: '+6, +5, +4, +3', meltingPoint: 2896, boilingPoint: 4912, density: 10.28, discoveryYear: 1778 },
  { number: 43, symbol: 'Tc', name: 'Technetium', nameTh: 'เทคนีเชียม', atomicMass: 98, group: 7, period: 5, category: 'transition metal', electronConfig: '[Kr] 4d⁵ 5s²', electronegativity: 1.9, oxidationStates: '+7, +6, +4', meltingPoint: 2430, boilingPoint: 4538, density: 11, discoveryYear: 1937 },
  { number: 44, symbol: 'Ru', name: 'Ruthenium', nameTh: 'รูทีเนียม', atomicMass: 101.07, group: 8, period: 5, category: 'transition metal', electronConfig: '[Kr] 4d⁷ 5s¹', electronegativity: 2.2, oxidationStates: '+4, +3, +2', meltingPoint: 2607, boilingPoint: 4423, density: 12.45, discoveryYear: 1844 },
  { number: 45, symbol: 'Rh', name: 'Rhodium', nameTh: 'โรเดียม', atomicMass: 102.91, group: 9, period: 5, category: 'transition metal', electronConfig: '[Kr] 4d⁸ 5s¹', electronegativity: 2.28, oxidationStates: '+3, +2, +1', meltingPoint: 2237, boilingPoint: 3968, density: 12.41, discoveryYear: 1803 },
  { number: 46, symbol: 'Pd', name: 'Palladium', nameTh: 'แพลเลเดียม', atomicMass: 106.42, group: 10, period: 5, category: 'transition metal', electronConfig: '[Kr] 4d¹⁰', electronegativity: 2.20, oxidationStates: '+4, +2', meltingPoint: 1828.05, boilingPoint: 3236, density: 12.023, discoveryYear: 1803 },
  { number: 47, symbol: 'Ag', name: 'Silver', nameTh: 'เงิน', atomicMass: 107.87, group: 11, period: 5, category: 'transition metal', electronConfig: '[Kr] 4d¹⁰ 5s¹', electronegativity: 1.93, oxidationStates: '+1', meltingPoint: 1234.93, boilingPoint: 2435, density: 10.49, discoveryYear: -5000 },
  { number: 48, symbol: 'Cd', name: 'Cadmium', nameTh: 'แคดเมียม', atomicMass: 112.41, group: 12, period: 5, category: 'transition metal', electronConfig: '[Kr] 4d¹⁰ 5s²', electronegativity: 1.69, oxidationStates: '+2', meltingPoint: 594.22, boilingPoint: 1040, density: 8.65, discoveryYear: 1817 },
  { number: 49, symbol: 'In', name: 'Indium', nameTh: 'อินเดียม', atomicMass: 114.82, group: 13, period: 5, category: 'post-transition metal', electronConfig: '[Kr] 4d¹⁰ 5s² 5p¹', electronegativity: 1.78, oxidationStates: '+3', meltingPoint: 429.75, boilingPoint: 2345, density: 7.31, discoveryYear: 1863 },
  { number: 50, symbol: 'Sn', name: 'Tin', nameTh: 'ดีบุก', atomicMass: 118.71, group: 14, period: 5, category: 'post-transition metal', electronConfig: '[Kr] 4d¹⁰ 5s² 5p²', electronegativity: 1.96, oxidationStates: '+4, +2', meltingPoint: 505.08, boilingPoint: 2875, density: 7.265, discoveryYear: -3500 },
  { number: 51, symbol: 'Sb', name: 'Antimony', nameTh: 'พลวง', atomicMass: 121.76, group: 15, period: 5, category: 'metalloid', electronConfig: '[Kr] 4d¹⁰ 5s² 5p³', electronegativity: 2.05, oxidationStates: '+5, +3, -3', meltingPoint: 903.78, boilingPoint: 1908, density: 6.697, discoveryYear: 1450 },
  { number: 52, symbol: 'Te', name: 'Tellurium', nameTh: 'เทลลูเรียม', atomicMass: 127.60, group: 16, period: 5, category: 'metalloid', electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁴', electronegativity: 2.1, oxidationStates: '+6, +4, -2', meltingPoint: 722.66, boilingPoint: 1261, density: 6.24, discoveryYear: 1783 },
  { number: 53, symbol: 'I', name: 'Iodine', nameTh: 'ไอโอดีน', atomicMass: 126.90, group: 17, period: 5, category: 'halogen', electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁵', electronegativity: 2.66, oxidationStates: '+7, +5, +1, -1', meltingPoint: 386.85, boilingPoint: 457.4, density: 4.933, discoveryYear: 1811 },
  { number: 54, symbol: 'Xe', name: 'Xenon', nameTh: 'ซีนอน', atomicMass: 131.29, group: 18, period: 5, category: 'noble gas', electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁶', oxidationStates: '0', meltingPoint: 161.4, boilingPoint: 165.051, density: 0.005894, discoveryYear: 1898 },

  // Period 6
  { number: 55, symbol: 'Cs', name: 'Cesium', nameTh: 'ซีเซียม', atomicMass: 132.91, group: 1, period: 6, category: 'alkali metal', electronConfig: '[Xe] 6s¹', electronegativity: 0.79, oxidationStates: '+1', meltingPoint: 301.7, boilingPoint: 944, density: 1.93, discoveryYear: 1860 },
  { number: 56, symbol: 'Ba', name: 'Barium', nameTh: 'แบเรียม', atomicMass: 137.33, group: 2, period: 6, category: 'alkaline earth metal', electronConfig: '[Xe] 6s²', electronegativity: 0.89, oxidationStates: '+2', meltingPoint: 1000, boilingPoint: 2118, density: 3.51, discoveryYear: 1808 },

  // Lanthanides (Period 6)
  { number: 57, symbol: 'La', name: 'Lanthanum', nameTh: 'แลนทานัม', atomicMass: 138.91, period: 6, category: 'lanthanide', electronConfig: '[Xe] 5d¹ 6s²', electronegativity: 1.10, oxidationStates: '+3', meltingPoint: 1193, boilingPoint: 3737, density: 6.162, discoveryYear: 1839 },
  { number: 58, symbol: 'Ce', name: 'Cerium', nameTh: 'ซีเรียม', atomicMass: 140.12, period: 6, category: 'lanthanide', electronConfig: '[Xe] 4f¹ 5d¹ 6s²', electronegativity: 1.12, oxidationStates: '+4, +3', meltingPoint: 1068, boilingPoint: 3716, density: 6.770, discoveryYear: 1803 },
  { number: 59, symbol: 'Pr', name: 'Praseodymium', nameTh: 'เพรซีโอดิเมียม', atomicMass: 140.91, period: 6, category: 'lanthanide', electronConfig: '[Xe] 4f³ 6s²', electronegativity: 1.13, oxidationStates: '+4, +3', meltingPoint: 1208, boilingPoint: 3793, density: 6.77, discoveryYear: 1885 },
  { number: 60, symbol: 'Nd', name: 'Neodymium', nameTh: 'นีโอดิเมียม', atomicMass: 144.24, period: 6, category: 'lanthanide', electronConfig: '[Xe] 4f⁴ 6s²', electronegativity: 1.14, oxidationStates: '+3', meltingPoint: 1297, boilingPoint: 3347, density: 7.01, discoveryYear: 1885 },
  { number: 61, symbol: 'Pm', name: 'Promethium', nameTh: 'โพรมีเทียม', atomicMass: 145, period: 6, category: 'lanthanide', electronConfig: '[Xe] 4f⁵ 6s²', electronegativity: 1.13, oxidationStates: '+3', meltingPoint: 1315, boilingPoint: 3273, density: 7.26, discoveryYear: 1945 },
  { number: 62, symbol: 'Sm', name: 'Samarium', nameTh: 'ซาแมเรียม', atomicMass: 150.36, period: 6, category: 'lanthanide', electronConfig: '[Xe] 4f⁶ 6s²', electronegativity: 1.17, oxidationStates: '+3, +2', meltingPoint: 1345, boilingPoint: 2067, density: 7.52, discoveryYear: 1879 },
  { number: 63, symbol: 'Eu', name: 'Europium', nameTh: 'ยูโรเพียม', atomicMass: 151.96, period: 6, category: 'lanthanide', electronConfig: '[Xe] 4f⁷ 6s²', electronegativity: 1.20, oxidationStates: '+3, +2', meltingPoint: 1099, boilingPoint: 1802, density: 5.244, discoveryYear: 1901 },
  { number: 64, symbol: 'Gd', name: 'Gadolinium', nameTh: 'แกโดลิเนียม', atomicMass: 157.25, period: 6, category: 'lanthanide', electronConfig: '[Xe] 4f⁷ 5d¹ 6s²', electronegativity: 1.20, oxidationStates: '+3', meltingPoint: 1585, boilingPoint: 3546, density: 7.90, discoveryYear: 1880 },
  { number: 65, symbol: 'Tb', name: 'Terbium', nameTh: 'เทอร์เบียม', atomicMass: 158.93, period: 6, category: 'lanthanide', electronConfig: '[Xe] 4f⁹ 6s²', electronegativity: 1.10, oxidationStates: '+4, +3', meltingPoint: 1629, boilingPoint: 3503, density: 8.23, discoveryYear: 1843 },
  { number: 66, symbol: 'Dy', name: 'Dysprosium', nameTh: 'ดิสโพรเซียม', atomicMass: 162.50, period: 6, category: 'lanthanide', electronConfig: '[Xe] 4f¹⁰ 6s²', electronegativity: 1.22, oxidationStates: '+3', meltingPoint: 1680, boilingPoint: 2840, density: 8.551, discoveryYear: 1886 },
  { number: 67, symbol: 'Ho', name: 'Holmium', nameTh: 'โฮล์เมียม', atomicMass: 164.93, period: 6, category: 'lanthanide', electronConfig: '[Xe] 4f¹¹ 6s²', electronegativity: 1.23, oxidationStates: '+3', meltingPoint: 1734, boilingPoint: 2993, density: 8.795, discoveryYear: 1878 },
  { number: 68, symbol: 'Er', name: 'Erbium', nameTh: 'เออร์เบียม', atomicMass: 167.26, period: 6, category: 'lanthanide', electronConfig: '[Xe] 4f¹² 6s²', electronegativity: 1.24, oxidationStates: '+3', meltingPoint: 1802, boilingPoint: 3141, density: 9.066, discoveryYear: 1843 },
  { number: 69, symbol: 'Tm', name: 'Thulium', nameTh: 'ทูเลียม', atomicMass: 168.93, period: 6, category: 'lanthanide', electronConfig: '[Xe] 4f¹³ 6s²', electronegativity: 1.25, oxidationStates: '+3, +2', meltingPoint: 1818, boilingPoint: 2223, density: 9.321, discoveryYear: 1879 },
  { number: 70, symbol: 'Yb', name: 'Ytterbium', nameTh: 'อิตเทอร์เบียม', atomicMass: 173.05, period: 6, category: 'lanthanide', electronConfig: '[Xe] 4f¹⁴ 6s²', electronegativity: 1.10, oxidationStates: '+3, +2', meltingPoint: 1097, boilingPoint: 1469, density: 6.965, discoveryYear: 1878 },
  { number: 71, symbol: 'Lu', name: 'Lutetium', nameTh: 'ลูทีเทียม', atomicMass: 174.97, group: 3, period: 6, category: 'lanthanide', electronConfig: '[Xe] 4f¹⁴ 5d¹ 6s²', electronegativity: 1.27, oxidationStates: '+3', meltingPoint: 1925, boilingPoint: 3675, density: 9.841, discoveryYear: 1907 },

  // Period 6 transition metals (72-80)
  { number: 72, symbol: 'Hf', name: 'Hafnium', nameTh: 'แฮฟเนียม', atomicMass: 178.49, group: 4, period: 6, category: 'transition metal', electronConfig: '[Xe] 4f¹⁴ 5d² 6s²', electronegativity: 1.3, oxidationStates: '+4', meltingPoint: 2506, boilingPoint: 4876, density: 13.31, discoveryYear: 1923 },
  { number: 73, symbol: 'Ta', name: 'Tantalum', nameTh: 'แทนทาลัม', atomicMass: 180.95, group: 5, period: 6, category: 'transition metal', electronConfig: '[Xe] 4f¹⁴ 5d³ 6s²', electronegativity: 1.5, oxidationStates: '+5', meltingPoint: 3290, boilingPoint: 5731, density: 16.65, discoveryYear: 1802 },
  { number: 74, symbol: 'W', name: 'Tungsten', nameTh: 'ทังสเตน', atomicMass: 183.84, group: 6, period: 6, category: 'transition metal', electronConfig: '[Xe] 4f¹⁴ 5d⁴ 6s²', electronegativity: 2.36, oxidationStates: '+6, +4, +2', meltingPoint: 3695, boilingPoint: 6203, density: 19.25, discoveryYear: 1783 },
  { number: 75, symbol: 'Re', name: 'Rhenium', nameTh: 'รีเนียม', atomicMass: 186.21, group: 7, period: 6, category: 'transition metal', electronConfig: '[Xe] 4f¹⁴ 5d⁵ 6s²', electronegativity: 1.9, oxidationStates: '+7, +6, +4', meltingPoint: 3459, boilingPoint: 5869, density: 21.02, discoveryYear: 1925 },
  { number: 76, symbol: 'Os', name: 'Osmium', nameTh: 'ออสเมียม', atomicMass: 190.23, group: 8, period: 6, category: 'transition metal', electronConfig: '[Xe] 4f¹⁴ 5d⁶ 6s²', electronegativity: 2.2, oxidationStates: '+4, +3, +2', meltingPoint: 3306, boilingPoint: 5285, density: 22.59, discoveryYear: 1803 },
  { number: 77, symbol: 'Ir', name: 'Iridium', nameTh: 'อิริเดียม', atomicMass: 192.22, group: 9, period: 6, category: 'transition metal', electronConfig: '[Xe] 4f¹⁴ 5d⁷ 6s²', electronegativity: 2.20, oxidationStates: '+4, +3', meltingPoint: 2719, boilingPoint: 4403, density: 22.56, discoveryYear: 1803 },
  { number: 78, symbol: 'Pt', name: 'Platinum', nameTh: 'แพลตินัม', atomicMass: 195.08, group: 10, period: 6, category: 'transition metal', electronConfig: '[Xe] 4f¹⁴ 5d⁹ 6s¹', electronegativity: 2.28, oxidationStates: '+4, +2', meltingPoint: 2041.4, boilingPoint: 4098, density: 21.45, discoveryYear: 1735 },
  { number: 79, symbol: 'Au', name: 'Gold', nameTh: 'ทองคำ', atomicMass: 196.97, group: 11, period: 6, category: 'transition metal', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', electronegativity: 2.54, oxidationStates: '+3, +1', meltingPoint: 1337.33, boilingPoint: 3129, density: 19.3, discoveryYear: -6000 },
  { number: 80, symbol: 'Hg', name: 'Mercury', nameTh: 'ปรอท', atomicMass: 200.59, group: 12, period: 6, category: 'transition metal', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', electronegativity: 2.00, oxidationStates: '+2, +1', meltingPoint: 234.321, boilingPoint: 629.88, density: 13.534, discoveryYear: -1500 },

  // Period 6 post-transition metals and others (81-86)
  { number: 81, symbol: 'Tl', name: 'Thallium', nameTh: 'แทลเลียม', atomicMass: 204.38, group: 13, period: 6, category: 'post-transition metal', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', electronegativity: 1.62, oxidationStates: '+3, +1', meltingPoint: 577, boilingPoint: 1746, density: 11.85, discoveryYear: 1861 },
  { number: 82, symbol: 'Pb', name: 'Lead', nameTh: 'ตะกั่ว', atomicMass: 207.2, group: 14, period: 6, category: 'post-transition metal', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', electronegativity: 2.33, oxidationStates: '+4, +2', meltingPoint: 600.61, boilingPoint: 2022, density: 11.34, discoveryYear: -7000 },
  { number: 83, symbol: 'Bi', name: 'Bismuth', nameTh: 'บิสมัท', atomicMass: 208.98, group: 15, period: 6, category: 'post-transition metal', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', electronegativity: 2.02, oxidationStates: '+5, +3', meltingPoint: 544.55, boilingPoint: 1837, density: 9.807, discoveryYear: 1753 },
  { number: 84, symbol: 'Po', name: 'Polonium', nameTh: 'โพโลเนียม', atomicMass: 209, group: 16, period: 6, category: 'metalloid', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', electronegativity: 2.0, oxidationStates: '+4, +2, -2', meltingPoint: 527, boilingPoint: 1235, density: 9.32, discoveryYear: 1898 },
  { number: 85, symbol: 'At', name: 'Astatine', nameTh: 'แอสทาทีน', atomicMass: 210, group: 17, period: 6, category: 'halogen', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', electronegativity: 2.2, oxidationStates: '+7, +5, +3, +1, -1', meltingPoint: 575, boilingPoint: 610, density: 7, discoveryYear: 1940 },
  { number: 86, symbol: 'Rn', name: 'Radon', nameTh: 'เรดอน', atomicMass: 222, group: 18, period: 6, category: 'noble gas', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', oxidationStates: '0', meltingPoint: 202, boilingPoint: 211.5, density: 0.00973, discoveryYear: 1900 },

  // Period 7
  { number: 87, symbol: 'Fr', name: 'Francium', nameTh: 'แฟรนเซียม', atomicMass: 223, group: 1, period: 7, category: 'alkali metal', electronConfig: '[Rn] 7s¹', electronegativity: 0.7, oxidationStates: '+1', meltingPoint: 300, boilingPoint: 950, density: 1.87, discoveryYear: 1939 },
  { number: 88, symbol: 'Ra', name: 'Radium', nameTh: 'เรเดียม', atomicMass: 226, group: 2, period: 7, category: 'alkaline earth metal', electronConfig: '[Rn] 7s²', electronegativity: 0.9, oxidationStates: '+2', meltingPoint: 973, boilingPoint: 2010, density: 5.5, discoveryYear: 1898 },

  // Actinides (Period 7)
  { number: 89, symbol: 'Ac', name: 'Actinium', nameTh: 'แอกทิเนียม', atomicMass: 227, period: 7, category: 'actinide', electronConfig: '[Rn] 6d¹ 7s²', electronegativity: 1.1, oxidationStates: '+3', meltingPoint: 1500, boilingPoint: 3500, density: 10.07, discoveryYear: 1899 },
  { number: 90, symbol: 'Th', name: 'Thorium', nameTh: 'ทอเรียม', atomicMass: 232.04, period: 7, category: 'actinide', electronConfig: '[Rn] 6d² 7s²', electronegativity: 1.3, oxidationStates: '+4', meltingPoint: 2023, boilingPoint: 5061, density: 11.72, discoveryYear: 1829 },
  { number: 91, symbol: 'Pa', name: 'Protactinium', nameTh: 'โพรแทกทิเนียม', atomicMass: 231.04, period: 7, category: 'actinide', electronConfig: '[Rn] 5f² 6d¹ 7s²', electronegativity: 1.5, oxidationStates: '+5, +4', meltingPoint: 1841, boilingPoint: 4300, density: 15.37, discoveryYear: 1913 },
  { number: 92, symbol: 'U', name: 'Uranium', nameTh: 'ยูเรเนียม', atomicMass: 238.03, period: 7, category: 'actinide', electronConfig: '[Rn] 5f³ 6d¹ 7s²', electronegativity: 1.38, oxidationStates: '+6, +5, +4, +3', meltingPoint: 1405.3, boilingPoint: 4404, density: 19.1, discoveryYear: 1789 },
  { number: 93, symbol: 'Np', name: 'Neptunium', nameTh: 'เนปทูเนียม', atomicMass: 237, period: 7, category: 'actinide', electronConfig: '[Rn] 5f⁴ 6d¹ 7s²', electronegativity: 1.36, oxidationStates: '+6, +5, +4, +3', meltingPoint: 912, boilingPoint: 4447, density: 20.45, discoveryYear: 1940 },
  { number: 94, symbol: 'Pu', name: 'Plutonium', nameTh: 'พลูโทเนียม', atomicMass: 244, period: 7, category: 'actinide', electronConfig: '[Rn] 5f⁶ 7s²', electronegativity: 1.28, oxidationStates: '+6, +5, +4, +3', meltingPoint: 912.5, boilingPoint: 3505, density: 19.816, discoveryYear: 1940 },
  { number: 95, symbol: 'Am', name: 'Americium', nameTh: 'อเมริเซียม', atomicMass: 243, period: 7, category: 'actinide', electronConfig: '[Rn] 5f⁷ 7s²', electronegativity: 1.3, oxidationStates: '+6, +5, +4, +3', meltingPoint: 1449, boilingPoint: 2880, density: 13.67, discoveryYear: 1944 },
  { number: 96, symbol: 'Cm', name: 'Curium', nameTh: 'คูเรียม', atomicMass: 247, period: 7, category: 'actinide', electronConfig: '[Rn] 5f⁷ 6d¹ 7s²', electronegativity: 1.3, oxidationStates: '+4, +3', meltingPoint: 1613, boilingPoint: 3383, density: 13.51, discoveryYear: 1944 },
  { number: 97, symbol: 'Bk', name: 'Berkelium', nameTh: 'เบอร์คีเลียม', atomicMass: 247, period: 7, category: 'actinide', electronConfig: '[Rn] 5f⁹ 7s²', electronegativity: 1.3, oxidationStates: '+4, +3', meltingPoint: 1259, boilingPoint: 2900, density: 14.78, discoveryYear: 1949 },
  { number: 98, symbol: 'Cf', name: 'Californium', nameTh: 'แคลิฟอร์เนียม', atomicMass: 251, period: 7, category: 'actinide', electronConfig: '[Rn] 5f¹⁰ 7s²', electronegativity: 1.3, oxidationStates: '+4, +3', meltingPoint: 1173, boilingPoint: 1743, density: 15.1, discoveryYear: 1950 },
  { number: 99, symbol: 'Es', name: 'Einsteinium', nameTh: 'ไอน์สไตเนียม', atomicMass: 252, period: 7, category: 'actinide', electronConfig: '[Rn] 5f¹¹ 7s²', electronegativity: 1.3, oxidationStates: '+3', meltingPoint: 1133, boilingPoint: 1269, density: 8.84, discoveryYear: 1952 },
  { number: 100, symbol: 'Fm', name: 'Fermium', nameTh: 'เฟอร์เมียม', atomicMass: 257, period: 7, category: 'actinide', electronConfig: '[Rn] 5f¹² 7s²', electronegativity: 1.3, oxidationStates: '+3', discoveryYear: 1952 },
  { number: 101, symbol: 'Md', name: 'Mendelevium', nameTh: 'เมนเดลีเวียม', atomicMass: 258, period: 7, category: 'actinide', electronConfig: '[Rn] 5f¹³ 7s²', electronegativity: 1.3, oxidationStates: '+3, +2', discoveryYear: 1955 },
  { number: 102, symbol: 'No', name: 'Nobelium', nameTh: 'โนเบเลียม', atomicMass: 259, period: 7, category: 'actinide', electronConfig: '[Rn] 5f¹⁴ 7s²', electronegativity: 1.3, oxidationStates: '+3, +2', discoveryYear: 1958 },
  { number: 103, symbol: 'Lr', name: 'Lawrencium', nameTh: 'ลอว์เรนเซียม', atomicMass: 266, group: 3, period: 7, category: 'actinide', electronConfig: '[Rn] 5f¹⁴ 7s² 7p¹', electronegativity: 1.3, oxidationStates: '+3', discoveryYear: 1961 },

  // Period 7 transition metals (104-112)
  { number: 104, symbol: 'Rf', name: 'Rutherfordium', nameTh: 'รัทเทอร์ฟอร์เดียม', atomicMass: 267, group: 4, period: 7, category: 'transition metal', electronConfig: '[Rn] 5f¹⁴ 6d² 7s²', oxidationStates: '+4', discoveryYear: 1964 },
  { number: 105, symbol: 'Db', name: 'Dubnium', nameTh: 'ดับเนียม', atomicMass: 268, group: 5, period: 7, category: 'transition metal', electronConfig: '[Rn] 5f¹⁴ 6d³ 7s²', oxidationStates: '+5', discoveryYear: 1970 },
  { number: 106, symbol: 'Sg', name: 'Seaborgium', nameTh: 'ซีบอร์เกียม', atomicMass: 271, group: 6, period: 7, category: 'transition metal', electronConfig: '[Rn] 5f¹⁴ 6d⁴ 7s²', oxidationStates: '+6', discoveryYear: 1974 },
  { number: 107, symbol: 'Bh', name: 'Bohrium', nameTh: 'โบห์เรียม', atomicMass: 270, group: 7, period: 7, category: 'transition metal', electronConfig: '[Rn] 5f¹⁴ 6d⁵ 7s²', oxidationStates: '+7', discoveryYear: 1981 },
  { number: 108, symbol: 'Hs', name: 'Hassium', nameTh: 'แฮสเซียม', atomicMass: 277, group: 8, period: 7, category: 'transition metal', electronConfig: '[Rn] 5f¹⁴ 6d⁶ 7s²', oxidationStates: '+8', discoveryYear: 1984 },
  { number: 109, symbol: 'Mt', name: 'Meitnerium', nameTh: 'ไมต์เนเรียม', atomicMass: 278, group: 9, period: 7, category: 'transition metal', electronConfig: '[Rn] 5f¹⁴ 6d⁷ 7s²', oxidationStates: '+6, +3', discoveryYear: 1982 },
  { number: 110, symbol: 'Ds', name: 'Darmstadtium', nameTh: 'ดาร์มสตัดเทียม', atomicMass: 281, group: 10, period: 7, category: 'transition metal', electronConfig: '[Rn] 5f¹⁴ 6d⁸ 7s²', oxidationStates: '+6, +4', discoveryYear: 1994 },
  { number: 111, symbol: 'Rg', name: 'Roentgenium', nameTh: 'เรินต์เกเนียม', atomicMass: 282, group: 11, period: 7, category: 'transition metal', electronConfig: '[Rn] 5f¹⁴ 6d⁹ 7s²', oxidationStates: '+3, +1', discoveryYear: 1994 },
  { number: 112, symbol: 'Cn', name: 'Copernicium', nameTh: 'โคเปอร์นิเซียม', atomicMass: 285, group: 12, period: 7, category: 'transition metal', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s²', oxidationStates: '+4, +2', discoveryYear: 1996 },

  // Period 7 post-transition metals and others (113-118)
  { number: 113, symbol: 'Nh', name: 'Nihonium', nameTh: 'นิโฮเนียม', atomicMass: 286, group: 13, period: 7, category: 'post-transition metal', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', oxidationStates: '+3, +1', discoveryYear: 2004 },
  { number: 114, symbol: 'Fl', name: 'Flerovium', nameTh: 'เฟลโรเวียม', atomicMass: 289, group: 14, period: 7, category: 'post-transition metal', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', oxidationStates: '+6, +4, +2', discoveryYear: 1998 },
  { number: 115, symbol: 'Mc', name: 'Moscovium', nameTh: 'มอสโคเวียม', atomicMass: 290, group: 15, period: 7, category: 'post-transition metal', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', oxidationStates: '+3, +1', discoveryYear: 2003 },
  { number: 116, symbol: 'Lv', name: 'Livermorium', nameTh: 'ลิเวอร์มอเรียม', atomicMass: 293, group: 16, period: 7, category: 'post-transition metal', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', oxidationStates: '+4, +2', discoveryYear: 2000 },
  { number: 117, symbol: 'Ts', name: 'Tennessine', nameTh: 'เทนเนสซีน', atomicMass: 294, group: 17, period: 7, category: 'halogen', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', oxidationStates: '+5, +3, +1, -1', discoveryYear: 2010 },
  { number: 118, symbol: 'Og', name: 'Oganesson', nameTh: 'โอกาเนสซอน', atomicMass: 294, group: 18, period: 7, category: 'noble gas', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', oxidationStates: '0', discoveryYear: 2002 },
];

export function getElementBySymbol(symbol: string): Element | undefined {
  return elements.find(e => e.symbol.toLowerCase() === symbol.toLowerCase());
}

export function getElementByNumber(number: number): Element | undefined {
  return elements.find(e => e.number === number);
}

export function calculateMolarMass(formula: string): { mass: number; breakdown: string } | null {
  // Simple parser for chemical formulas like H2O, Ca(OH)2, H2SO4
  try {
    const regex = /([A-Z][a-z]?)(\d*)|(\()|(\))(\d*)/g;
    let mass = 0;
    let breakdown = '';
    let match;
    const stack: number[] = [1];

    while ((match = regex.exec(formula)) !== null) {
      if (match[3]) { // Opening parenthesis
        stack.push(1);
      } else if (match[4]) { // Closing parenthesis
        const multiplier = parseInt(match[5] || '1');
        const top = stack.pop() || 1;
        stack[stack.length - 1] *= top * multiplier;
      } else if (match[1]) { // Element
        const element = getElementBySymbol(match[1]);
        if (!element) return null;

        const count = parseInt(match[2] || '1');
        const multiplier = stack[stack.length - 1];
        const contribution = element.atomicMass * count * multiplier;
        mass += contribution;

        if (breakdown) breakdown += ' + ';
        breakdown += `${count * multiplier}${element.symbol}`;
      }
    }

    return { mass: parseFloat(mass.toFixed(3)), breakdown };
  } catch (e) {
    return null;
  }
}
