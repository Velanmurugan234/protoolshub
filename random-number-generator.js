// ==========================================
// RANDOM NUMBER GENERATOR
// ==========================================

// ===== TABS =====
document.querySelectorAll(".sw-tab").forEach(function(tab) {
  tab.addEventListener("click", function() {
    document.querySelectorAll(".sw-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".sw-panel").forEach(p => p.classList.remove("active"));
    this.classList.add("active");
    document.getElementById("tab-" + this.dataset.tab).classList.add("active");
  });
});

// ===== CRYPTO-SECURE RANDOM =====
function secureRandom(min, max) {
  const range = max - min + 1;
  const maxUint32 = 4294967295;
  const limit = Math.floor(maxUint32 / range) * range;
  const arr = new Uint32Array(1);
  let num;
  do {
    crypto.getRandomValues(arr);
    num = arr[0];
  } while (num >= limit);
  return min + (num % range);
}

// ==========================================
// NUMBER MODE
// ==========================================
const rngMin = document.getElementById("rngMin");
const rngMax = document.getElementById("rngMax");
const rngCount = document.getElementById("rngCount");
const rngUnique = document.getElementById("rngUnique");
const rngGenerateBtn = document.getElementById("rngGenerateBtn");
const rngResetBtn = document.getElementById("rngResetBtn");
const rngResultBox = document.getElementById("rngResultBox");
const rngResult = document.getElementById("rngResult");
const rngCopyBtn = document.getElementById("rngCopyBtn");

let lastRngResult = "";

function generateNumbers() {
  const min = parseInt(rngMin.value);
  const max = parseInt(rngMax.value);
  const count = parseInt(rngCount.value);
  const unique = rngUnique.value === "no";

  if (isNaN(min) || isNaN(max)) {
    showToast("Please enter valid min and max!", "error");
    return;
  }

  if (min > max) {
    showToast("Min must be less than Max!", "error");
    return;
  }

  if (count < 1 || count > 100) {
    showToast("Count must be 1-100!", "error");
    return;
  }

  const rangeSize = max - min + 1;
  if (unique && count > rangeSize) {
    showToast("Count can't exceed range size for unique!", "error");
    return;
  }

  const numbers = [];

  if (unique) {
    const used = new Set();
    while (numbers.length < count) {
      const n = secureRandom(min, max);
      if (!used.has(n)) {
        used.add(n);
        numbers.push(n);
      }
    }
  } else {
    for (let i = 0; i < count; i++) {
      numbers.push(secureRandom(min, max));
    }
  }

  const resultText = numbers.join(", ");
  lastRngResult = resultText;
  rngResult.textContent = resultText;
  rngResultBox.style.display = "block";
  showToast("Numbers generated! 🎲", "success");
}

rngGenerateBtn.addEventListener("click", generateNumbers);

rngResetBtn.addEventListener("click", function() {
  rngMin.value = "1";
  rngMax.value = "100";
  rngCount.value = "1";
  rngUnique.value = "yes";
  rngResultBox.style.display = "none";
  showToast("Reset complete", "info");
});

rngCopyBtn.addEventListener("click", function() {
  if (!lastRngResult) return;
  navigator.clipboard.writeText(lastRngResult).then(function() {
    showToast("Copied! 📋", "success");
  });
});

// ==========================================
// DICE MODE
// ==========================================
const diceCount = document.getElementById("diceCount");
const diceSides = document.getElementById("diceSides");
const diceRollBtn = document.getElementById("diceRollBtn");
const diceResultBox = document.getElementById("diceResultBox");
const diceDisplay = document.getElementById("diceDisplay");
const diceTotal = document.getElementById("diceTotal");

diceRollBtn.addEventListener("click", function() {
  const count = parseInt(diceCount.value);
  const sides = parseInt(diceSides.value);

  if (isNaN(count) || count < 1 || count > 10) {
    showToast("Dice count must be 1-10!", "error");
    return;
  }

  let rolls = [];
  let total = 0;

  for (let i = 0; i < count; i++) {
    const roll = secureRandom(1, sides);
    rolls.push(roll);
    total += roll;
  }

  diceDisplay.innerHTML = "";
  rolls.forEach(function(r) {
    const die = document.createElement("div");
    die.className = "dice-face";
    die.textContent = r;
    diceDisplay.appendChild(die);
  });

  diceTotal.textContent = "Total: " + total;
  diceResultBox.style.display = "block";
  showToast("Dice rolled! 🎲", "success");
});

// ==========================================
// COIN FLIP
// ==========================================
const coinFlipBtn = document.getElementById("coinFlipBtn");
const coinDisplay = document.getElementById("coinDisplay");
const coinResult = document.getElementById("coinResult");

coinFlipBtn.addEventListener("click", function() {
  coinDisplay.textContent = "🌀";
  coinResult.textContent = "Flipping...";

  setTimeout(function() {
    const result = secureRandom(0, 1) === 0 ? "Heads" : "Tails";
    coinDisplay.textContent = result === "Heads" ? "👑" : "🪙";
    coinResult.textContent = result === "Heads" ? "👑 Heads" : "🪙 Tails";
    showToast("Flipped: " + result, "success");
  }, 500);
});

// ==========================================
// PICK FROM LIST
// ==========================================
const pickList = document.getElementById("pickList");
const pickBtn = document.getElementById("pickBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const pickResultBox = document.getElementById("pickResultBox");
const pickResult = document.getElementById("pickResult");

function getListItems() {
  return pickList.value
    .split("\n")
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

pickBtn.addEventListener("click", function() {
  const items = getListItems();
  if (items.length === 0) {
    showToast("Please enter at least one item!", "error");
    return;
  }
  const picked = items[secureRandom(0, items.length - 1)];
  pickResult.textContent = "🎯 " + picked;
  pickResultBox.style.display = "block";
  showToast("Picked: " + picked, "success");
});

shuffleBtn.addEventListener("click", function() {
  const items = getListItems();
  if (items.length < 2) {
    showToast("Please enter at least 2 items!", "error");
    return;
  }
  // Fisher-Yates shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = secureRandom(0, i);
    [items[i], items[j]] = [items[j], items[i]];
  }
  pickResult.textContent = items.join(" → ");
  pickResultBox.style.display = "block";
  showToast("Shuffled! 🔀", "success");
});