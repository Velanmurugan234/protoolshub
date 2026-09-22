// ==========================================
// ADVANCED AGE CALCULATOR
// ==========================================

const dobInput = document.getElementById("dobInput");
const currentInput = document.getElementById("currentInput");
const calculateBtn = document.getElementById("calculateBtn");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const resetBtn = document.getElementById("resetBtn");
const resultBox = document.getElementById("resultBox");
const shareBtn = document.getElementById("shareBtn");
const copyResultBtn = document.getElementById("copyResultBtn");

// Today's date
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const todayStr = yyyy + "-" + mm + "-" + dd;

if (currentInput) {
  currentInput.value = todayStr;
  currentInput.max = todayStr;
}
if (dobInput) {
  dobInput.max = todayStr;
}

// ===== TAB SWITCHING =====
document.querySelectorAll(".age-tab").forEach(function(tab) {
  tab.addEventListener("click", function() {
    document.querySelectorAll(".age-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".age-tab-content").forEach(c => c.classList.remove("active"));
    this.classList.add("active");
    document.getElementById("tab-" + this.dataset.tab).classList.add("active");
  });
});

// ===== CALCULATE AGE =====
let lastResult = null;

function calculateAge() {
  const dobValue = dobInput.value;
  const currentValue = currentInput.value || todayStr;

  if (!dobValue) {
    showToast("Please enter your date of birth!", "error");
    dobInput.focus();
    return;
  }

  const dob = new Date(dobValue);
  const current = new Date(currentValue);

  if (dob > current) {
    showToast("Date of birth cannot be in the future!", "error");
    return;
  }

  // Main Age
  let years = current.getFullYear() - dob.getFullYear();
  let months = current.getMonth() - dob.getMonth();
  let days = current.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(current.getFullYear(), current.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const ageText = years + " Years, " + months + " Months, " + days + " Days";
  document.getElementById("ageBigDisplay").textContent = ageText;
  document.getElementById("ageSubDisplay").textContent =
    "= " + (years * 12 + months) + " months, " + days + " days";

  // Totals
  const diffMs = current - dob;
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  document.getElementById("totalDays").textContent = totalDays.toLocaleString();
  document.getElementById("totalWeeks").textContent = totalWeeks.toLocaleString();
  document.getElementById("totalMonths").textContent = totalMonths.toLocaleString();
  document.getElementById("totalHours").textContent = formatBigNumber(totalHours);
  document.getElementById("totalMinutes").textContent = formatBigNumber(totalMinutes);
  document.getElementById("totalSeconds").textContent = formatBigNumber(totalSeconds);

  // Born Day
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  document.getElementById("bornDay").textContent = weekdays[dob.getDay()];

  // Next Birthday
  const nextBday = new Date(current.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBday < current) nextBday.setFullYear(current.getFullYear() + 1);
  const daysToBday = Math.ceil((nextBday - current) / (1000 * 60 * 60 * 24));
  document.getElementById("nextBirthday").textContent =
    daysToBday === 0 ? "🎉 Today!" :
    daysToBday === 1 ? "Tomorrow" :
    daysToBday + " days";

  // Zodiac
  document.getElementById("zodiacSign").textContent = getZodiac(dob.getDate(), dob.getMonth() + 1);

  // Chinese Zodiac
  document.getElementById("chineseZodiac").textContent = getChineseZodiac(dob.getFullYear());

  // Heartbeats (72 bpm)
  document.getElementById("heartbeats").textContent = formatBigNumber(totalMinutes * 72);

  // Sleep hours (1/3 of life)
  document.getElementById("sleepHours").textContent = formatBigNumber(totalHours / 3);

  // Legal Age 18
  document.getElementById("legalAge").textContent = years >= 18 ? "✅ Yes" : "❌ " + (18 - years) + " yrs left";

  // Legal Age 21
  document.getElementById("legalAge21").textContent = years >= 21 ? "✅ Yes" : "❌ " + (21 - years) + " yrs left";

  // Retirement (60)
  if (years >= 60) {
    document.getElementById("retirement").textContent = "🎉 Retired!";
  } else {
    document.getElementById("retirement").textContent = (60 - years) + " yrs left";
  }

  // Baby Age
  if (years === 0) {
    document.getElementById("babyAge").textContent = months + "mo " + days + "d";
  } else {
    document.getElementById("babyAge").textContent = "Not a baby";
  }

  // Save result for sharing
  lastResult = {
    age: ageText,
    totalDays: totalDays.toLocaleString(),
    nextBirthday: document.getElementById("nextBirthday").textContent,
    zodiac: document.getElementById("zodiacSign").textContent,
    bornDay: weekdays[dob.getDay()]
  };

  // Show result
  resultBox.style.display = "block";
  resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("Age calculated! 🎂", "success");
}

// ===== ZODIAC SIGN =====
function getZodiac(day, month) {
  const signs = ["Capricorn ♑","Aquarius ♒","Pisces ♓","Aries ♈","Taurus ♉","Gemini ♊","Cancer ♋","Leo ♌","Virgo ♍","Libra ♎","Scorpio ♏","Sagittarius ♐","Capricorn ♑"];
  const ends = [19, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 21, 31];
  return day <= ends[month - 1] ? signs[month - 1] : signs[month];
}

// ===== CHINESE ZODIAC =====
function getChineseZodiac(year) {
  const animals = ["Monkey 🐒","Rooster 🐓","Dog 🐕","Pig 🐖","Rat 🐀","Ox 🐂","Tiger 🐅","Rabbit 🐇","Dragon 🐉","Snake 🐍","Horse 🐎","Goat 🐐"];
  return animals[year % 12];
}

// ===== FORMAT BIG NUMBERS =====
function formatBigNumber(num) {
  num = Math.floor(num);
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toLocaleString();
}

// ===== EVENTS =====
if (calculateBtn) calculateBtn.addEventListener("click", calculateAge);

if (resetBtn) {
  resetBtn.addEventListener("click", function() {
    dobInput.value = "";
    currentInput.value = todayStr;
    resultBox.style.display = "none";
    showToast("Reset complete", "info");
  });
}

if (dobInput) {
  dobInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") calculateAge();
  });
}

if (currentInput) {
  currentInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") calculateAge();
  });
}

// ===== SHARE RESULT =====
if (shareBtn) {
  shareBtn.addEventListener("click", function() {
    if (!lastResult) {
      showToast("Please calculate age first!", "error");
      return;
    }

    const text = `🎂 My Age Calculator Result\n\n` +
      `📅 Age: ${lastResult.age}\n` +
      `📆 Total Days: ${lastResult.totalDays}\n` +
      `🎉 Next Birthday: ${lastResult.nextBirthday}\n` +
      `⭐ Zodiac: ${lastResult.zodiac}\n` +
      `📅 Born On: ${lastResult.bornDay}\n\n` +
      `Calculate yours: https://velanmurugan234.github.io/protoolshub/age-calculator.html`;

    if (navigator.share) {
      navigator.share({ title: "My Age", text: text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(function() {
        showToast("Copied! Share anywhere 📤", "success");
      });
    }
  });
}

// ===== COPY RESULT =====
if (copyResultBtn) {
  copyResultBtn.addEventListener("click", function() {
    if (!lastResult) {
      showToast("Please calculate age first!", "error");
      return;
    }

    const text = `Age: ${lastResult.age}\nTotal Days: ${lastResult.totalDays}\nNext Birthday: ${lastResult.nextBirthday}\nZodiac: ${lastResult.zodiac}\nBorn On: ${lastResult.bornDay}`;

    navigator.clipboard.writeText(text).then(function() {
      showToast("Result copied! 📋", "success");
    });
  });
}

// ===== PROFILES =====
function loadProfiles() {
  const profiles = JSON.parse(localStorage.getItem("ageProfiles") || "[]");
  const list = document.getElementById("profilesList");
  if (!list) return;

  if (profiles.length === 0) {
    list.innerHTML = '<p style="text-align:center; color:#6b7280; padding:30px;">No profiles saved yet.</p>';
    return;
  }

  list.innerHTML = "";
  profiles.forEach(function(p, index) {
    const card = document.createElement("div");
    card.className = "profile-card";
    card.innerHTML = `
      <div class="profile-info">
        <div class="profile-name">${p.name || "Profile " + (index + 1)}</div>
        <div class="profile-dob">DOB: ${p.dob}</div>
        <div class="profile-age">${p.age}</div>
      </div>
      <button class="profile-delete" data-index="${index}" title="Delete">🗑️</button>
    `;
    list.appendChild(card);
  });

  list.querySelectorAll(".profile-delete").forEach(function(btn) {
    btn.addEventListener("click", function() {
      const idx = parseInt(this.dataset.index);
      let profiles = JSON.parse(localStorage.getItem("ageProfiles") || "[]");
      profiles.splice(idx, 1);
      localStorage.setItem("ageProfiles", JSON.stringify(profiles));
      loadProfiles();
      showToast("Profile deleted", "info");
    });
  });
}

if (saveProfileBtn) {
  saveProfileBtn.addEventListener("click", function() {
    if (!lastResult || !dobInput.value) {
      showToast("Calculate age first!", "error");
      return;
    }

    const name = prompt("Profile name (e.g., Mom, Dad, Me):", "Me");
    if (!name) return;

    const profiles = JSON.parse(localStorage.getItem("ageProfiles") || "[]");
    profiles.push({
      name: name,
      dob: dobInput.value,
      age: lastResult.age,
      savedAt: Date.now()
    });
    localStorage.setItem("ageProfiles", JSON.stringify(profiles));
    loadProfiles();
    showToast("Profile saved! 💾", "success");
  });
}

// ===== DATE DIFFERENCE =====
const date1 = document.getElementById("date1");
const date2 = document.getElementById("date2");
const calcDiffBtn = document.getElementById("calcDiffBtn");
const resetDiffBtn = document.getElementById("resetDiffBtn");
const diffResultBox = document.getElementById("diffResultBox");

if (calcDiffBtn) {
  calcDiffBtn.addEventListener("click", function() {
    if (!date1.value || !date2.value) {
      showToast("Please select both dates!", "error");
      return;
    }

    let d1 = new Date(date1.value);
    let d2 = new Date(date2.value);

    if (d1 > d2) {
      const temp = d1;
      d1 = d2;
      d2 = temp;
    }

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffText = years + " Years, " + months + " Months, " + days + " Days";
    document.getElementById("diffBigDisplay").textContent = diffText;

    const diffMs = d2 - d1;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = years * 12 + months;

    document.getElementById("diffDays").textContent = diffDay.toLocaleString();
    document.getElementById("diffWeeks").textContent = diffWeek.toLocaleString();
    document.getElementById("diffMonths").textContent = diffMonth.toLocaleString();
    document.getElementById("diffHours").textContent = formatBigNumber(diffHr);
    document.getElementById("diffMinutes").textContent = formatBigNumber(diffMin);
    document.getElementById("diffSeconds").textContent = formatBigNumber(diffSec);
    document.getElementById("diffSubDisplay").textContent = "= " + diffDay + " days total";

    diffResultBox.style.display = "block";
    diffResultBox.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Difference calculated! 📅", "success");
  });
}

if (resetDiffBtn) {
  resetDiffBtn.addEventListener("click", function() {
    date1.value = "";
    date2.value = "";
    diffResultBox.style.display = "none";
    showToast("Reset complete", "info");
  });
}

// ===== INIT =====
loadProfiles();