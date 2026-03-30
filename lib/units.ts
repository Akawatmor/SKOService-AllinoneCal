export type UnitCategory = 
  | 'length' 
  | 'weight' 
  | 'volume' 
  | 'temperature'
  | 'area'
  | 'speed'
  | 'time'
  | 'force'
  | 'pressure'
  | 'energy'
  | 'power'
  | 'light'
  | 'angle'
  | 'frequency'
  | 'substance';

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
  temperature: 'Temp',
  area: 'Area',
  speed: 'Speed',
  time: 'Time',
  force: 'Force',
  pressure: 'Pressure',
  energy: 'Energy',
  power: 'Power',
  light: 'Light',
  angle: 'Angle',
  frequency: 'Freq',
  substance: 'Mole',
};

export const units: Record<UnitCategory, Unit[]> = {
  length: [
    // Metric
    { id: 'nm', label: 'Nanometers (nm)', factor: 0.000000001 },
    { id: 'μm', label: 'Micrometers (μm)', factor: 0.000001 },
    { id: 'mm', label: 'Millimeters (mm)', factor: 0.001 },
    { id: 'cm', label: 'Centimeters (cm)', factor: 0.01 },
    { id: 'm', label: 'Meters (m)', factor: 1 },
    { id: 'km', label: 'Kilometers (km)', factor: 1000 },
    // Imperial
    { id: 'thou', label: 'Thou (mil)', factor: 0.0000254 },
    { id: 'in', label: 'Inches (in)', factor: 0.0254 },
    { id: 'ft', label: 'Feet (ft)', factor: 0.3048 },
    { id: 'yd', label: 'Yards (yd)', factor: 0.9144 },
    { id: 'chain', label: 'Chains', factor: 20.1168 },
    { id: 'furlong', label: 'Furlongs', factor: 201.168 },
    { id: 'mi', label: 'Miles (mi)', factor: 1609.34 },
    // Thai
    { id: 'niw', label: 'นิ้ว (Thai inch)', factor: 0.02083 },
    { id: 'keub', label: 'คืบ (Thai span)', factor: 0.25 },
    { id: 'sok', label: 'ศอก (Thai cubit)', factor: 0.5 },
    { id: 'wa', label: 'วา (Thai fathom)', factor: 2 },
    { id: 'sen', label: 'เส้น (Thai furlong)', factor: 40 },
    { id: 'yot', label: 'โยชน์ (Thai league)', factor: 16000 },
    // Nautical
    { id: 'nmi', label: 'Nautical miles', factor: 1852 },
    { id: 'fathom', label: 'Fathoms', factor: 1.8288 },
    { id: 'cable', label: 'Cables', factor: 185.2 },
    // Astronomical
    { id: 'au', label: 'Astronomical units (AU)', factor: 149597870700 },
    { id: 'ly', label: 'Light-years', factor: 9460730472580800 },
    { id: 'pc', label: 'Parsecs', factor: 30856775814913673 },
    // Other
    { id: 'angstrom', label: 'Angstroms (Å)', factor: 0.0000000001 },
  ],
  
  weight: [
    // Metric
    { id: 'μg', label: 'Micrograms (μg)', factor: 0.000001 },
    { id: 'mg', label: 'Milligrams (mg)', factor: 0.001 },
    { id: 'g', label: 'Grams (g)', factor: 1 },
    { id: 'kg', label: 'Kilograms (kg)', factor: 1000 },
    { id: 'tonne', label: 'Tonnes (metric ton)', factor: 1000000 },
    // Imperial/US
    { id: 'gr', label: 'Grains (gr)', factor: 0.06479891 },
    { id: 'oz', label: 'Ounces (oz)', factor: 28.349523125 },
    { id: 'lb', label: 'Pounds (lb)', factor: 453.59237 },
    { id: 'stone', label: 'Stones', factor: 6350.29318 },
    { id: 'us_ton', label: 'US tons (short ton)', factor: 907184.74 },
    { id: 'uk_ton', label: 'UK tons (long ton)', factor: 1016046.9088 },
    // Thai
    { id: 'salueng', label: 'สลึง (Thai salueng)', factor: 3.75 },
    { id: 'baht', label: 'บาท (Thai baht)', factor: 15 },
    { id: 'tamlueng', label: 'ตำลึง (Thai tamlueng)', factor: 60 },
    { id: 'chang', label: 'ชั่ง (Thai chang)', factor: 1200 },
    { id: 'hap', label: 'หาบ (Thai hap)', factor: 60000 },
    { id: 'kwian', label: 'เกวียน (Thai cart)', factor: 1200000 },
    // Troy
    { id: 'oz_t', label: 'Troy ounces (oz t)', factor: 31.1034768 },
    { id: 'lb_t', label: 'Troy pounds (lb t)', factor: 373.2417216 },
    // Other
    { id: 'carat', label: 'Carats', factor: 0.2 },
    { id: 'u', label: 'Atomic mass units (u)', factor: 1.66053906660e-24 },
  ],
  
  volume: [
    // Metric
    { id: 'μl', label: 'Microliters (μL)', factor: 0.000001 },
    { id: 'ml', label: 'Milliliters (mL)', factor: 0.001 },
    { id: 'cl', label: 'Centiliters (cL)', factor: 0.01 },
    { id: 'dl', label: 'Deciliters (dL)', factor: 0.1 },
    { id: 'l', label: 'Liters (L)', factor: 1 },
    { id: 'm3', label: 'Cubic meters (m³)', factor: 1000 },
    { id: 'cm3', label: 'Cubic centimeters (cm³)', factor: 0.001 },
    { id: 'mm3', label: 'Cubic millimeters (mm³)', factor: 0.000001 },
    // Imperial US
    { id: 'tsp', label: 'Teaspoons (US)', factor: 0.00492892 },
    { id: 'tbsp', label: 'Tablespoons (US)', factor: 0.0147868 },
    { id: 'fl_oz', label: 'Fluid ounces (US)', factor: 0.0295735 },
    { id: 'cup', label: 'Cups (US)', factor: 0.236588 },
    { id: 'pt', label: 'Pints (US)', factor: 0.473176 },
    { id: 'qt', label: 'Quarts (US)', factor: 0.946353 },
    { id: 'gal', label: 'Gallons (US)', factor: 3.78541 },
    // Imperial UK
    { id: 'fl_oz_uk', label: 'Fluid ounces (UK)', factor: 0.0284131 },
    { id: 'pt_uk', label: 'Pints (UK)', factor: 0.568261 },
    { id: 'qt_uk', label: 'Quarts (UK)', factor: 1.13652 },
    { id: 'gal_uk', label: 'Gallons (UK)', factor: 4.54609 },
    // Thai
    { id: 'thanan', label: 'ทะนาน (Thai thanan)', factor: 1 },
    { id: 'tang', label: 'ถัง (Thai bucket)', factor: 20 },
    { id: 'bat', label: 'บาตร (Thai bowl)', factor: 0.5 },
    // Other
    { id: 'barrel_oil', label: 'Barrels (oil)', factor: 158.987 },
    { id: 'barrel_beer', label: 'Barrels (beer)', factor: 117.348 },
    { id: 'ft3', label: 'Cubic feet (ft³)', factor: 28.3168 },
    { id: 'in3', label: 'Cubic inches (in³)', factor: 0.0163871 },
    { id: 'yd3', label: 'Cubic yards (yd³)', factor: 764.555 },
  ],
  
  temperature: [
    { id: 'c', label: 'Celsius (°C)', factor: 1 },
    { id: 'f', label: 'Fahrenheit (°F)', factor: 1 },
    { id: 'k', label: 'Kelvin (K)', factor: 1 },
    { id: 'r', label: 'Rankine (°R)', factor: 1 },
    { id: 're', label: 'Réaumur (°Ré)', factor: 1 },
  ],
  
  area: [
    // Metric
    { id: 'mm2', label: 'Square millimeters (mm²)', factor: 0.000001 },
    { id: 'cm2', label: 'Square centimeters (cm²)', factor: 0.0001 },
    { id: 'm2', label: 'Square meters (m²)', factor: 1 },
    { id: 'km2', label: 'Square kilometers (km²)', factor: 1000000 },
    { id: 'ha', label: 'Hectares (ha)', factor: 10000 },
    { id: 'are', label: 'Ares', factor: 100 },
    // Imperial
    { id: 'in2', label: 'Square inches (in²)', factor: 0.00064516 },
    { id: 'ft2', label: 'Square feet (ft²)', factor: 0.092903 },
    { id: 'yd2', label: 'Square yards (yd²)', factor: 0.836127 },
    { id: 'ac', label: 'Acres', factor: 4046.86 },
    { id: 'mi2', label: 'Square miles (mi²)', factor: 2589988.11 },
    // Thai
    { id: 'sq_wa', label: 'ตารางวา (Thai sq wa)', factor: 4 },
    { id: 'ngan', label: 'งาน (Thai ngan)', factor: 400 },
    { id: 'rai', label: 'ไร่ (Thai rai)', factor: 1600 },
    // Other
    { id: 'rood', label: 'Roods', factor: 1011.71 },
  ],
  
  speed: [
    { id: 'm/s', label: 'Meters/second (m/s)', factor: 1 },
    { id: 'km/h', label: 'Kilometers/hour (km/h)', factor: 0.277778 },
    { id: 'mph', label: 'Miles/hour (mph)', factor: 0.44704 },
    { id: 'ft/s', label: 'Feet/second (ft/s)', factor: 0.3048 },
    { id: 'knot', label: 'Knots', factor: 0.514444 },
    { id: 'mach', label: 'Mach (at sea level)', factor: 343 },
    { id: 'c', label: 'Speed of light', factor: 299792458 },
  ],
  
  time: [
    { id: 'ns', label: 'Nanoseconds (ns)', factor: 0.000000001 },
    { id: 'μs', label: 'Microseconds (μs)', factor: 0.000001 },
    { id: 'ms', label: 'Milliseconds (ms)', factor: 0.001 },
    { id: 's', label: 'Seconds (s)', factor: 1 },
    { id: 'min', label: 'Minutes (min)', factor: 60 },
    { id: 'h', label: 'Hours (h)', factor: 3600 },
    { id: 'd', label: 'Days (d)', factor: 86400 },
    { id: 'wk', label: 'Weeks (wk)', factor: 604800 },
    { id: 'mo', label: 'Months (30 days)', factor: 2592000 },
    { id: 'yr', label: 'Years (365.25 days)', factor: 31557600 },
    { id: 'decade', label: 'Decades', factor: 315576000 },
    { id: 'century', label: 'Centuries', factor: 3155760000 },
    { id: 'millennium', label: 'Millennia', factor: 31557600000 },
  ],
  
  force: [
    { id: 'N', label: 'Newtons (N)', factor: 1 },
    { id: 'kN', label: 'Kilonewtons (kN)', factor: 1000 },
    { id: 'dyn', label: 'Dynes (dyn)', factor: 0.00001 },
    { id: 'kgf', label: 'Kilogram-force (kgf)', factor: 9.80665 },
    { id: 'lbf', label: 'Pound-force (lbf)', factor: 4.44822 },
    { id: 'pdl', label: 'Poundals (pdl)', factor: 0.138255 },
    { id: 'kip', label: 'Kips (klbf)', factor: 4448.22 },
  ],
  
  pressure: [
    { id: 'Pa', label: 'Pascals (Pa)', factor: 1 },
    { id: 'kPa', label: 'Kilopascals (kPa)', factor: 1000 },
    { id: 'MPa', label: 'Megapascals (MPa)', factor: 1000000 },
    { id: 'bar', label: 'Bars', factor: 100000 },
    { id: 'mbar', label: 'Millibars (mbar)', factor: 100 },
    { id: 'atm', label: 'Atmospheres (atm)', factor: 101325 },
    { id: 'psi', label: 'Pounds/sq inch (psi)', factor: 6894.76 },
    { id: 'mmHg', label: 'Millimeters of mercury (mmHg)', factor: 133.322 },
    { id: 'torr', label: 'Torr', factor: 133.322 },
    { id: 'inHg', label: 'Inches of mercury (inHg)', factor: 3386.39 },
  ],
  
  energy: [
    { id: 'J', label: 'Joules (J)', factor: 1 },
    { id: 'kJ', label: 'Kilojoules (kJ)', factor: 1000 },
    { id: 'MJ', label: 'Megajoules (MJ)', factor: 1000000 },
    { id: 'cal', label: 'Calories (cal)', factor: 4.184 },
    { id: 'kcal', label: 'Kilocalories (kcal)', factor: 4184 },
    { id: 'Wh', label: 'Watt-hours (Wh)', factor: 3600 },
    { id: 'kWh', label: 'Kilowatt-hours (kWh)', factor: 3600000 },
    { id: 'BTU', label: 'British thermal units (BTU)', factor: 1055.06 },
    { id: 'erg', label: 'Ergs', factor: 0.0000001 },
    { id: 'eV', label: 'Electronvolts (eV)', factor: 1.60218e-19 },
    { id: 'therm', label: 'Therms', factor: 105505600 },
    { id: 'ft_lbf', label: 'Foot-pounds (ft·lbf)', factor: 1.35582 },
  ],
  
  power: [
    { id: 'W', label: 'Watts (W)', factor: 1 },
    { id: 'kW', label: 'Kilowatts (kW)', factor: 1000 },
    { id: 'MW', label: 'Megawatts (MW)', factor: 1000000 },
    { id: 'GW', label: 'Gigawatts (GW)', factor: 1000000000 },
    { id: 'hp', label: 'Horsepower (hp)', factor: 745.7 },
    { id: 'hp_m', label: 'Metric horsepower', factor: 735.499 },
    { id: 'BTU/h', label: 'BTU/hour', factor: 0.293071 },
    { id: 'ft_lbf/s', label: 'Foot-pounds/second', factor: 1.35582 },
  ],
  
  light: [
    { id: 'lm', label: 'Lumens (lm)', factor: 1 },
    { id: 'cd', label: 'Candelas (cd)', factor: 1 },
    { id: 'lx', label: 'Lux (lx)', factor: 1 },
    { id: 'fc', label: 'Foot-candles (fc)', factor: 10.7639 },
  ],
  
  angle: [
    { id: 'deg', label: 'Degrees (°)', factor: 1 },
    { id: 'rad', label: 'Radians (rad)', factor: 57.2958 },
    { id: 'grad', label: 'Gradians (gon)', factor: 0.9 },
    { id: 'turn', label: 'Turns (revolutions)', factor: 360 },
    { id: 'arcmin', label: 'Arcminutes (′)', factor: 0.0166667 },
    { id: 'arcsec', label: 'Arcseconds (″)', factor: 0.000277778 },
    { id: 'mrad', label: 'Milliradians (mrad)', factor: 0.0572958 },
  ],
  
  frequency: [
    { id: 'Hz', label: 'Hertz (Hz)', factor: 1 },
    { id: 'kHz', label: 'Kilohertz (kHz)', factor: 1000 },
    { id: 'MHz', label: 'Megahertz (MHz)', factor: 1000000 },
    { id: 'GHz', label: 'Gigahertz (GHz)', factor: 1000000000 },
    { id: 'THz', label: 'Terahertz (THz)', factor: 1000000000000 },
    { id: 'rpm', label: 'Revolutions/minute (rpm)', factor: 0.0166667 },
    { id: 'rad/s', label: 'Radians/second', factor: 0.159155 },
  ],
  
  substance: [
    { id: 'mol', label: 'Moles (mol)', factor: 1 },
    { id: 'mmol', label: 'Millimoles (mmol)', factor: 0.001 },
    { id: 'kmol', label: 'Kilomoles (kmol)', factor: 1000 },
    { id: 'particles', label: 'Particles (×10²³)', factor: 1.66054 },
  ],
};

export function convert(value: number, fromId: string, toId: string, category: UnitCategory): number {
  // Temperature conversion (special handling)
  if (category === 'temperature') {
    let celsius = value;
    
    // Convert to Celsius first
    if (fromId === 'c') celsius = value;
    else if (fromId === 'f') celsius = (value - 32) * (5/9);
    else if (fromId === 'k') celsius = value - 273.15;
    else if (fromId === 'r') celsius = (value - 491.67) * (5/9);
    else if (fromId === 're') celsius = value * (5/4);
    
    // Convert from Celsius to target
    if (toId === 'c') return celsius;
    if (toId === 'f') return celsius * (9/5) + 32;
    if (toId === 'k') return celsius + 273.15;
    if (toId === 'r') return (celsius + 273.15) * (9/5);
    if (toId === 're') return celsius * (4/5);
    return celsius;
  }
  
  // Light units need special handling (luminous intensity vs luminous flux)
  if (category === 'light') {
    // For now, treat lm and cd separately from lx and fc
    // lx and fc can convert to each other
    if ((fromId === 'lx' || fromId === 'fc') && (toId === 'lx' || toId === 'fc')) {
      const categoryUnits = units[category];
      const fromUnit = categoryUnits.find(u => u.id === fromId);
      const toUnit = categoryUnits.find(u => u.id === toId);
      if (!fromUnit || !toUnit) return 0;
      const baseValue = value * fromUnit.factor;
      return baseValue / toUnit.factor;
    }
    // Cannot convert between different types (lm, cd vs lx)
    if (fromId === toId) return value;
    return 0; // Invalid conversion
  }

  // Standard linear conversion for all other categories
  const categoryUnits = units[category];
  const fromUnit = categoryUnits.find(u => u.id === fromId);
  const toUnit = categoryUnits.find(u => u.id === toId);

  if (!fromUnit || !toUnit) return 0;

  const baseValue = value * fromUnit.factor;
  return baseValue / toUnit.factor;
}
