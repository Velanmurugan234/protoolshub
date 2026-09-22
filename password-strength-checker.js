// ==========================================
// PASSWORD STRENGTH CHECKER
// ==========================================

const pwdInput = document.getElementById("pwdInput");
const togglePwdBtn = document.getElementById("togglePwdBtn");
const pwdStrengthBar = document.getElementById("pwdStrengthBar");
const pwdStrengthText = document.getElementById("pwdStrengthText");
const pwdScore = document.getElementById("pwdScore");
const pwdCrackTime = document.getElementById("pwdCrackTime");
const pwdLength = document.getElementById("pwdLength");
const pwdCharTypes = document.getElementById("pwdCharTypes");
const pwdSuggestions = document.getElementById("pwdSuggestions");
const generateStrongBtn = document.getElementById("generateStrongBtn");
const copyStrongBtn = document.getElementById("copyStrongBtn");

// ===== COMMON PASSWORDS =====
const COMMON_PASSWORDS = [
  "password", "123456", "12345678", "qwerty", "abc123", "monkey", "1234567",
  "letmein", "trustno1", "dragon", "baseball", "iloveyou", "master", "sunshine",
  "ashley", "bailey", "passw0rd", "shadow", "123123", "654321", "superman",
  "qazwsx", "michael", "football", "welcome", "jesus", "ninja", "mustang",
  "password1", "123456789", "adobe123", "admin", "root", "guest", "user",
  "login", "welcome1", "pass123", "admin123", "password123", "india123",
  "hello", "test", "test123", "temp", "changeme", "default"
];

// ===== TOGGLE VISIBILITY =====
let pwdVisible = false;
togglePwdBtn.addEventListener("click", function() {
  pwdVisible = !pwdVisible;
  pwdInput.type = pwdVisible ? "text" : "password";
  this.textContent = pwdVisible ? "🙈" : "👁️";
});

// ===== ANALYZE PASSWORD =====
function analyzePassword(pwd) {
  let score = 0;
  const checks = {
    length: pwd.length >= 12,
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    symbol: /[^A-Za-z0-9]/.test(pwd),
    common: !COMMON_PASSWORDS.includes(pwd.toLowerCase())
  };

  // Length score (max 30)
  if (pwd.length >= 12) score += 20;
  if (pwd.length >= 16) score += 5;
  if (pwd.length >= 20) score += 5;

  // Character type score (max 40)
  let typeCount = 0;
  if (checks.upper) typeCount++;
  if (checks.lower) typeCount++;
  if (checks.number) typeCount++;
  if (checks.symbol) typeCount++;
  score += typeCount * 10;

  // Variety bonus (max 20)
  const uniqueChars = new Set(pwd).size;
  if (uniqueChars >= pwd.length * 0.7) score += 10;
  if (uniqueChars >= pwd.length * 0.9) score += 10;

  // Common password penalty
  if (!checks.common) score -= 30;

  // Sequential characters penalty
  if (/(.)\1{2,}/.test(pwd)) score -= 10; // aaa, 111
  if (/012|123|234|345|456|567|678|789|abc|bcd|cde|def/i.test(pwd)) score -= 10;

  score = Math.max(0, Math.min(100, score));

  return { score, checks, typeCount, uniqueChars };
}

// ===== CRACK TIME ESTIMATE =====
function estimateCrackTime(pwd) {
  if (pwd.length === 0) return "—";

  // Character pool size
  let pool = 0;
  if (/[a-z]/.test(pwd)) pool += 26;
  if (/[A-Z]/.test(pwd)) pool += 26;
  if (/[0-9]/.test(pwd)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pwd)) pool += 32;

  if (pool === 0) return "—";

  // Total combinations
  const combinations = Math.pow(pool, pwd.length);

  // Assume 10 billion guesses per second (modern GPU)
  const guessesPerSecond = 1e10;
  const seconds = combinations / guessesPerSecond / 2; // average

  return formatTime(seconds);
}

function formatTime(seconds) {
  if (seconds < 1) return "Instant 💀";
  if (seconds < 60) return Math.round(seconds) + " sec";
  if (seconds < 3600) return Math.round(seconds / 60) + " min";
  if (seconds < 86400) return Math.round(seconds / 3600) + " hours";
  if (seconds < 2592000) return Math.round(seconds / 86400) + " days";
  if (seconds < 31536000) return Math.round(seconds / 2592000) + " months";
  if (seconds < 31536000 * 1000) return Math.round(seconds / 31536000) + " years";
  if (seconds < 31536000 * 1e6) return Math.round(seconds / 31536000 / 1000) + "K years";
  if (seconds < 31536000 * 1e9) return Math.round(seconds / 31536000 / 1e6) + "M years";
  if (seconds < 31536000 * 1e12) return Math.round(seconds / 31536000 / 1e9) + "B years";
  return "∞ (trillions of years) 🛡️";
}

// ===== UPDATE UI =====
function updateUI() {
  const pwd = pwdInput.value;
  const { score, checks, typeCount } = analyzePassword(pwd);

  // Update checks
  updateCheck("checkLength", checks.length);
  updateCheck("checkUpper", checks.upper);
  updateCheck("checkLower", checks.lower);
  updateCheck("checkNumber", checks.number);
  updateCheck("checkSymbol", checks.symbol);
  updateCheck("checkCommon", checks.common);

  // Update stats
  pwdLength.textContent = pwd.length;
  pwdCharTypes.textContent = typeCount + " / 4";
  pwdScore.textContent = score + " / 100";
  pwdCrackTime.textContent = estimateCrackTime(pwd);

  // Update strength bar
  let color, text, width;
  if (pwd.length === 0) {
    width = "0%"; color = "#e5e7eb"; text = "—";
  } else if (score < 30) {
    width = "25%"; color = "#ef4444"; text = "🔴 Very Weak";
  } else if (score < 50) {
    width = "45%"; color = "#f59e0b"; text = "🟠 Weak";
  } else if (score < 70) {
    width = "65%"; color = "#fbbf24"; text = "🟡 Medium";
  } else if (score < 85) {
    width = "85%"; color = "#10b981"; text = "🟢 Strong";
  } else {
    width = "100%"; color = "#059669"; text = "💪 Very Strong";
  }

  pwdStrengthBar.style.width = width;
  pwdStrengthBar.style.background = color;
  pwdStrengthText.textContent = text;
  pwdStrengthText.style.color = color;

  // Update suggestions
  updateSuggestions(pwd, checks, score);
}

function updateCheck(id, passed) {
  const el = document.getElementById(id);
  const icon = el.querySelector(".check-icon");
  if (passed) {
    el.classList.add("passed");
    icon.textContent = "✅";
  } else {
    el.classList.remove("passed");
    icon.textContent = "⭕";
  }
}

function updateSuggestions(pwd, checks, score) {
  pwdSuggestions.innerHTML = "";

  if (pwd.length === 0) {
    pwdSuggestions.innerHTML = '<li>Start typing a password to see suggestions.</li>';
    return;
  }

  const suggestions = [];

  if (!checks.length) suggestions.push("Make it at least 12 characters long.");
  if (!checks.upper) suggestions.push("Add at least one UPPERCASE letter.");
  if (!checks.lower) suggestions.push("Add at least one lowercase letter.");
  if (!checks.number) suggestions.push("Include at least one number (0-9).");
  if (!checks.symbol) suggestions.push("Add a special symbol (!@#$%^&*).");
  if (!checks.common) suggestions.push("⚠️ This is a common password — change it immediately!");
  if (/(.)\1{2,}/.test(pwd)) suggestions.push("Avoid repeating the same character 3+ times.");
  if (/012|123|234|345|456|567|678|789|abc|bcd|cde|def/i.test(pwd)) suggestions.push("Avoid sequential characters like 123 or abc.");

  if (score >= 85 && suggestions.length === 0) {
    suggestions.push("🎉 Excellent! Your password is very strong.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Password looks good. Consider making it even longer for extra security.");
  }

  suggestions.forEach(function(s) {
    const li = document.createElement("li");
    li.textContent = s;
    pwdSuggestions.appendChild(li);
  });
}

// ===== GENERATE STRONG PASSWORD =====
function generateStrongPassword() {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const all = upper + lower + numbers + symbols;

  const length = 20;
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  let pwd = "";

  // Ensure at least 1 of each type
  pwd += upper[randomValues[0] % upper.length];
  pwd += lower[randomValues[1] % lower.length];
  pwd += numbers[randomValues[2] % numbers.length];
  pwd += symbols[randomValues[3] % symbols.length];

  // Fill rest randomly
  for (let i = 4; i < length; i++) {
    pwd += all[randomValues[i] % all.length];
  }

  // Shuffle
  const pwdArray = pwd.split("");
  for (let i = pwdArray.length - 1; i > 0; i--) {
    const j = randomValues[i % randomValues.length] % (i + 1);
    [pwdArray[i], pwdArray[j]] = [pwdArray[j], pwdArray[i]];
  }

  pwd = pwdArray.join("");
  pwdInput.value = pwd;
  pwdInput.type = "text";
  pwdVisible = true;
  togglePwdBtn.textContent = "🙈";
  updateUI();
  showToast("Strong password generated! 🔐", "success");
}

// ===== COPY STRONG PASSWORD =====
function copyStrongPassword() {
  const pwd = pwdInput.value;
  if (!pwd) {
    showToast("Pehle password generate karo!", "error");
    return;
  }
  navigator.clipboard.writeText(pwd).then(function() {
    showToast("Password copied! 📋", "success");
  });
}

// ===== EVENTS =====
pwdInput.addEventListener("input", updateUI);
generateStrongBtn.addEventListener("click", generateStrongPassword);
copyStrongBtn.addEventListener("click", copyStrongPassword);