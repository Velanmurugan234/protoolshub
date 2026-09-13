// ===== COLOR PICKER LOGIC =====

const colorPickerInput = document.getElementById("colorPickerInput");
const colorPreview = document.getElementById("colorPreview");
const colorPreviewText = document.getElementById("colorPreviewText");
const hexCode = document.getElementById("hexCode");
const rgbCode = document.getElementById("rgbCode");
const hslCode = document.getElementById("hslCode");
const presetColors = document.getElementById("presetColors");

// Preset colors
const PRESETS = [
  "#2563eb", "#7c3aed", "#ef4444", "#f59e0b",
  "#10b981", "#06b6d4", "#ec4899", "#111827",
  "#6b7280", "#fbbf24", "#84cc16", "#14b8a6"
];

// ===== HELPERS =====
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// ===== UPDATE UI =====
function updateColor(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Preview
  colorPreview.style.background = hex;
  colorPreviewText.textContent = hex.toUpperCase();

  // Text color auto contrast
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  colorPreviewText.style.color = brightness > 128 ? "#111827" : "#ffffff";

  // Codes
  hexCode.value = hex.toUpperCase();
  rgbCode.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  hslCode.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  // Picker sync
  colorPickerInput.value = hex;
}

// ===== EVENTS =====
colorPickerInput.addEventListener("input", function() {
  updateColor(this.value);
});

// Copy buttons
document.querySelectorAll(".copy-small").forEach(function(btn) {
  btn.addEventListener("click", function() {
    const target = document.getElementById(this.dataset.target);
    navigator.clipboard.writeText(target.value).then(() => {
      this.textContent = "✅";
      setTimeout(() => {
        this.textContent = "📋";
      }, 1500);
    });
  });
});

// Preset colors generate
PRESETS.forEach(function(color) {
  const swatch = document.createElement("div");
  swatch.className = "preset-swatch";
  swatch.style.background = color;
  swatch.title = color.toUpperCase();
  swatch.addEventListener("click", function() {
    updateColor(color);
  });
  presetColors.appendChild(swatch);
});

// Initial
updateColor("#2563eb");