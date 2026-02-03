export type UnitCategory = 'length' | 'weight' | 'volume' | 'temperature';

export interface Unit {
  id: string;
  label: string;
  factor: number; // Factor to convert TO base unit. e.g. 1 km = 1000 m. Base is m.
  offset?: number; // For temperature
}

export const unitCategories: Record<string, string> = {
  length: 'Length',
  weight: 'Weight',
  volume: 'Volume',
  temperature: 'Temperature',
};

export const units: Record<UnitCategory, Unit[]> = {
  length: [
    { id: 'm', label: 'Meters (m)', factor: 1 },
    { id: 'km', label: 'Kilometers (km)', factor: 1000 },
    { id: 'cm', label: 'Centimeters (cm)', factor: 0.01 },
    { id: 'mm', label: 'Millimeters (mm)', factor: 0.001 },
    { id: 'in', label: 'Inches (in)', factor: 0.0254 },
    { id: 'ft', label: 'Feet (ft)', factor: 0.3048 },
    { id: 'yd', label: 'Yards (yd)', factor: 0.9144 },
    { id: 'mi', label: 'Miles (mi)', factor: 1609.34 },
  ],
  weight: [
    { id: 'g', label: 'Grams (g)', factor: 1 },
    { id: 'kg', label: 'Kilograms (kg)', factor: 1000 },
    { id: 'mg', label: 'Milligrams (mg)', factor: 0.001 },
    { id: 'oz', label: 'Ounces (oz)', factor: 28.3495 },
    { id: 'lb', label: 'Pounds (lb)', factor: 453.592 },
  ],
  volume: [
    { id: 'l', label: 'Liters (l)', factor: 1 },
    { id: 'ml', label: 'Milliliters (ml)', factor: 0.001 },
    { id: 'gal', label: 'Gallons (US)', factor: 3.78541 },
    { id: 'qt', label: 'Quarts (US)', factor: 0.946353 },
    { id: 'pt', label: 'Pints (US)', factor: 0.473176 },
    { id: 'cup', label: 'Cups (US)', factor: 0.236588 },
  ],
  temperature: [
    { id: 'c', label: 'Celsius (°C)', factor: 1 }, // Base
    { id: 'f', label: 'Fahrenheit (°F)', factor: 1 }, // Handled specially
    { id: 'k', label: 'Kelvin (K)', factor: 1 }, // Handled specially
  ]
};

export function convert(value: number, fromId: string, toId: string, category: UnitCategory): number {
  if (category === 'temperature') {
    let celsius = value;
    // To Celsius
    if (fromId === 'f') celsius = (value - 32) * (5/9);
    if (fromId === 'k') celsius = value - 273.15;
    
    // From Celsius
    if (toId === 'c') return celsius;
    if (toId === 'f') return celsius * (9/5) + 32;
    if (toId === 'k') return celsius + 273.15;
    return celsius;
  }

  const categoryUnits = units[category];
  const fromUnit = categoryUnits.find(u => u.id === fromId);
  const toUnit = categoryUnits.find(u => u.id === toId);

  if (!fromUnit || !toUnit) return 0;

  const baseValue = value * fromUnit.factor;
  return baseValue / toUnit.factor;
}
