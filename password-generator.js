// ===== PASSWORD GENERATOR LOGIC =====

const passwordOutput = document.getElementById("passwordOutput");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");
const useUpper = document.getElementById("useUpper");
const useLower = document.getElementById("useLower");
const useNumbers = document.getElementById("useNumbers");
const useSymbols = document.getElementById("useSymbols");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

const CHAR_SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

// Slider update
lengthSlider.addEventListener("input", function() {
  lengthValue.textContent = this.value;
});

// Generate password
function generatePassword() {
  let chars = "";

  if (useUpper.checked) chars += CHAR_SETS.upper;
  if (useLower.checked) chars += CHAR_SETS.lower;
  if (useNumbers.checked) chars += CHAR_SETS.numbers;
  if (useSymbols.checked) chars += CHAR_SETS.symbols;

  if (chars === "") {
    showToast("Select at least one option!", "error");
    return;
  }

  const length = parseInt(lengthSlider.value);
  let password = "";

  // Crypto-secure random
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    password += chars[randomValues[i] % chars.length];
  }

  passwordOutput.value = password;
  updateStrength(password);
}

// Strength calculation
function updateStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let width, color, text;
  if (score <= 3) {
    width = "30%"; color = "#ef4444"; text = "Weak 🔴";
  } else if (score <= 5) {
    width = "60%"; color = "#f59e0b"; text = "Medium 🟡";
  } else if (score <= 6) {
    width = "85%"; color = "#10b981"; text = "Strong 🟢";
  } else {
    width = "100%"; color = "#059669"; text = "Very Strong 💪";
  }

  strengthBar.style.width = width;
  strengthBar.style.background = color;
  strengthText.textContent = text;
  strengthText.style.color = color;
}

// Generate button
generateBtn.addEventListener("click", function() {
  generatePassword();
  showToast("New password generated!", "success");
});

// Copy button
copyBtn.addEventListener("click", function() {
  const pwd = passwordOutput.value;
  if (pwd === "Click Generate" || pwd === "") {
    showToast("Please generate a password first!", "error");
    return;
  }
  navigator.clipboard.writeText(pwd).then(function() {
    showToast("Password copied!", "success");
    copyBtn.textContent = "✅";
    setTimeout(function() {
      copyBtn.textContent = "📋";
    }, 1500);
  });
});

// Checkboxes change hone par auto-generate
[useUpper, useLower, useNumbers, useSymbols, lengthSlider].forEach(function(el) {
  el.addEventListener("change", function() {
    if (passwordOutput.value !== "Click Generate") {
      generatePassword();
    }
  });
});

// Initial generate
generatePassword();