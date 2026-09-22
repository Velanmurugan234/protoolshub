// ==========================================
// UNIT CONVERTER
// ==========================================

// ===== UNITS DATA =====
const UNITS = {
  length: {
    "Meter (m)": 1,
    "Kilometer (km)": 1000,
    "Centimeter (cm)": 0.01,
    "Millimeter (mm)": 0.001,
    "Mile (mi)": 1609.344,
    "Yard (yd)": 0.9144,
    "Foot (ft)": 0.3048,
    "Inch (in)": 0.0254,
    "Nautical Mile (nmi)": 1852
  },
  weight: {
    "Kilogram (kg)": 1,
    "Gram (g)": 0.001,
    "Milligram (mg)": 0.000001,
    "Metric Ton (t)": 1000,
    "Pound (lb)": 0.453592,
    "Ounce (oz)": 0.0283495,
    "Stone (st)": 6.35029
  },
  temperature: {
    "Celsius (°C)": "C",
    "Fahrenheit (°F)": "F",
    "Kelvin (K)": "K"
  },
  area: {
    "Square Meter (m²)": 1,
    "Square Kilometer (km²)": 1000000,
    "Square Centimeter (cm²)": 0.0001,
    "Square Foot (ft²)": 0.092903,
    "Square Yard (yd²)": 0.836127,
    "Acre": 4046.86,
    "Hectare": 10000,
    "Square Mile (mi²)": 2589988
  },
  volume: {
    "Liter (L)": 1,
    "Milliliter (mL)": 0.001,
    "Cubic Meter (m³)": 1000,
    "Cubic Centimeter (cm³)": 0.001,
    "Gallon (US)": 3.78541,
    "Gallon (UK)": 4.54609,
    "Quart (US)": 0.946353,
    "Pint (US)": 0.473176,
    "Cup (US)": 0.236588,
    "Fluid Ounce (US)": 0.0295735
  },
  speed: {
    "Meter/second (m/s)": 1,
    "Kilometer/hour (km/h)": 0.277778,
    "Mile/hour (mph)": 0.44704,
    "Knot (kn)": 0.514444,
    "Foot/second (ft/s)": 0.3048
  },
  time: {
    "Second (s)": 1,
    "Minute (min)": 60,
    "Hour (h)": 3600,
    "Day (d)": 86400,
    "Week (wk)": 604800,
    "Month (mo)": 2629800,
    "Year (yr)": 31557600
  },
  data: {
    "Byte (B)": 1,
    "Kilobyte (KB)": 1024,
    "Megabyte (MB)": 1048576,
    "Gigabyte (GB)": 1073741824,
    "Terabyte (TB)": 1099511627776,
    "Bit (b)": 0.125
  }
};

// Quick Reference Examples
const QUICK_REF = {
  length: ["1 km = 1000 m", "1 mile = 1.609 km", "1 foot = 30.48 cm", "1 inch = 2.54 cm"],
  weight: ["1 kg = 1000 g", "1 lb = 0.454 kg", "1 oz = 28.35 g", "1 ton = 1000 kg"],
  temperature: ["0°C = 32°F", "100°C = 212°F", "0°C = 273.15 K", "37°C = 98.6°F"],
  area: ["1 acre = 4046.86 m²", "1 hectare = 10000 m²", "1 km² = 100 hectares", "1 ft² = 0.0929 m²"],
  volume: ["1 L = 1000 mL", "1 gallon (US) = 3.785 L", "1 m³ = 1000 L", "1 cup = 236.6 mL"],
  speed: ["1 km/h = 0.278 m/s", "1 mph = 1.609 km/h", "1 knot = 1.852 km/h", "60 mph = 96.56 km/h"],
  time: ["1 hour = 60 min", "1 day = 24 hours", "1 week = 7 days", "1 year = 365 days"],
  data: ["1 KB = 1024 bytes", "1 MB = 1024 KB", "1 GB = 1024 MB", "1 TB = 1024 GB"]
};

// ===== ELEMENTS =====
const fromValue = document.getElementById("fromValue");
const toValue = document.getElementById("toValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const resultText = document.getElementById("resultText");
const swapBtn = document.getElementById("swapBtn");
const copyConvBtn = document.getElementById("copyConvBtn");
const resetConvBtn = document.getElementById("resetConvBtn");
const quickRef = document.getElementById("quickRef");

let currentCategory = "length";

// ===== LOAD UNITS =====
function loadUnits(category) {
  currentCategory = category;
  const units = Object.keys(UNITS[category]);

  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  units.forEach(function(unit, i) {
    const opt1 = document.createElement("option");
    opt1.value = unit;
    opt1.textContent = unit;
    fromUnit.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = unit;
    opt2.textContent = unit;
    toUnit.appendChild(opt2);
  });

  // Default: first unit → second unit
  fromUnit.selectedIndex = 0;
  toUnit.selectedIndex = units.length > 1 ? 1 : 0;

  // Load quick ref
  loadQuickRef(category);

  // Reset
  fromValue.value = "1";
  convert();
}

// ===== LOAD QUICK REF =====
function loadQuickRef(category) {
  if (!quickRef) return;
  quickRef.innerHTML = "";
  (QUICK_REF[category] || []).forEach(function(item) {
    const div = document.createElement("div");
    div.className = "quick-ref-item";
    div.textContent = item;
    quickRef.appendChild(div);
  });
}

// ===== CONVERT =====
function convert() {
  const val = parseFloat(fromValue.value);
  if (isNaN(val)) {
    toValue.value = "";
    resultText.textContent = "—";
    return;
  }

  const from = fromUnit.value;
  const to = toUnit.value;
  let result;

  if (currentCategory === "temperature") {
    result = convertTemperature(val, from, to);
  } else {
    const units = UNITS[currentCategory];
    // Convert to base unit, then to target
    const baseValue = val * units[from];
    result = baseValue / units[to];
  }

  // Format result
  let formatted;
  if (Math.abs(result) < 0.0001 && result !== 0) {
    formatted = result.toExponential(4);
  } else if (Math.abs(result) >= 1e9) {
    formatted = result.toExponential(4);
  } else {
    formatted = parseFloat(result.toFixed(6)).toString();
  }

  toValue.value = formatted;
  resultText.textContent = val + " " + from + " = " + formatted + " " + to;
}

// ===== TEMPERATURE CONVERSION =====
function convertTemperature(val, from, to) {
  // Convert to Celsius first
  let celsius;
  if (from === "Celsius (°C)") celsius = val;
  else if (from === "Fahrenheit (°F)") celsius = (val - 32) * 5 / 9;
  else if (from === "Kelvin (K)") celsius = val - 273.15;

  // Convert from Celsius to target
  if (to === "Celsius (°C)") return celsius;
  if (to === "Fahrenheit (°F)") return celsius * 9 / 5 + 32;
  if (to === "Kelvin (K)") return celsius + 273.15;
}

// ===== EVENTS =====
document.querySelectorAll(".unit-cat-btn").forEach(function(btn) {
  btn.addEventListener("click", function() {
    document.querySelectorAll(".unit-cat-btn").forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    loadUnits(this.dataset.cat);
  });
});

fromValue.addEventListener("input", convert);
fromUnit.addEventListener("change", convert);
toUnit.addEventListener("change", convert);

swapBtn.addEventListener("click", function() {
  const fromIdx = fromUnit.selectedIndex;
  fromUnit.selectedIndex = toUnit.selectedIndex;
  toUnit.selectedIndex = fromIdx;

  const tempVal = fromValue.value;
  fromValue.value = toValue.value || tempVal;
  convert();
});

copyConvBtn.addEventListener("click", function() {
  if (!resultText.textContent || resultText.textContent === "—") {
    showToast("Kuch calculate karo pehle!", "error");
    return;
  }
  navigator.clipboard.writeText(resultText.textContent).then(function() {
    showToast("Result copied! 📋", "success");
  });
});

resetConvBtn.addEventListener("click", function() {
  fromValue.value = "1";
  fromUnit.selectedIndex = 0;
  toUnit.selectedIndex = 1;
  convert();
  showToast("Reset complete", "info");
});

// ===== INIT =====
loadUnits("length");