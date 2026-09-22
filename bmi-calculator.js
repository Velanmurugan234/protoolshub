// ==========================================
// ADVANCED BMI CALCULATOR
// ==========================================

let unit = "metric";
let lastResult = null;

// Elements
const unitMetric = document.getElementById("unitMetric");
const unitImperial = document.getElementById("unitImperial");
const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");
const heightCm = document.getElementById("heightCm");
const heightFt = document.getElementById("heightFt");
const heightIn = document.getElementById("heightIn");
const weightKg = document.getElementById("weightKg");
const weightLb = document.getElementById("weightLb");
const waistInput = document.getElementById("waist");
const hipInput = document.getElementById("hip");

const calculateBtn = document.getElementById("calculateBtn");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const shareBtn = document.getElementById("shareBtn");
const copyBtn = document.getElementById("copyBtn");
const resultBox = document.getElementById("resultBox");

// ===== TAB SWITCHING =====
document.querySelectorAll(".age-tab").forEach(function(tab) {
  tab.addEventListener("click", function() {
    document.querySelectorAll(".age-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".age-tab-content").forEach(c => c.classList.remove("active"));
    this.classList.add("active");
    document.getElementById("tab-" + this.dataset.tab).classList.add("active");
  });
});

// ===== UNIT TOGGLE =====
unitMetric.addEventListener("click", function() {
  unit = "metric";
  this.classList.add("active");
  unitImperial.classList.remove("active");
  document.getElementById("heightMetricGroup").style.display = "flex";
  document.getElementById("heightImperialGroup").style.display = "none";
  document.getElementById("weightMetricGroup").style.display = "flex";
  document.getElementById("weightImperialGroup").style.display = "none";
});

unitImperial.addEventListener("click", function() {
  unit = "imperial";
  this.classList.add("active");
  unitMetric.classList.remove("active");
  document.getElementById("heightMetricGroup").style.display = "none";
  document.getElementById("heightImperialGroup").style.display = "flex";
  document.getElementById("weightMetricGroup").style.display = "none";
  document.getElementById("weightImperialGroup").style.display = "flex";
});

// ===== CALCULATE =====
function calculateBMI() {
  const age = parseFloat(ageInput.value);
  const gender = genderInput.value;

  let heightM, weightKgVal;

  if (unit === "metric") {
    const h = parseFloat(heightCm.value);
    const w = parseFloat(weightKg.value);
    if (!h || !w) {
      showToast("Please enter height and weight!", "error");
      return;
    }
    heightM = h / 100;
    weightKgVal = w;
  } else {
    const ft = parseFloat(heightFt.value) || 0;
    const inches = parseFloat(heightIn.value) || 0;
    const lb = parseFloat(weightLb.value);
    if ((!ft && !inches) || !lb) {
      showToast("Please enter height and weight!", "error");
      return;
    }
    heightM = (ft * 12 + inches) * 0.0254;
    weightKgVal = lb * 0.453592;
  }

  if (heightM <= 0 || weightKgVal <= 0) {
    showToast("Invalid values!", "error");
    return;
  }

  // ===== BMI =====
  const bmi = weightKgVal / (heightM * heightM);
  const bmiRounded = bmi.toFixed(1);

  let category, color, tip;
  if (bmi < 18.5) {
    category = "Underweight";
    color = "#3b82f6";
    tip = "You should consider gaining some weight. Eat nutrient-rich foods and consult a dietitian.";
  } else if (bmi < 25) {
    category = "Normal Weight";
    color = "#10b981";
    tip = "Great! You're in the healthy range. Keep up your balanced diet and regular exercise.";
  } else if (bmi < 30) {
    category = "Overweight";
    color = "#f59e0b";
    tip = "Consider losing some weight. Focus on portion control and regular physical activity.";
  } else {
    category = "Obese";
    color = "#ef4444";
    tip = "Your health may be at risk. Please consult a doctor for a proper weight-loss plan.";
  }

  document.getElementById("bmiValue").textContent = bmiRounded;
  document.getElementById("bmiCategory").textContent = category;
  document.getElementById("bmiCategory").style.background = color;
  document.getElementById("bmiSub").textContent = "Height: " + heightM.toFixed(2) + " m • Weight: " + weightKgVal.toFixed(1) + " kg";

  // Gauge pointer
  let pointerPos = 0;
  if (bmi < 18.5) pointerPos = (bmi / 18.5) * 25;
  else if (bmi < 25) pointerPos = 25 + ((bmi - 18.5) / 6.5) * 25;
  else if (bmi < 30) pointerPos = 50 + ((bmi - 25) / 5) * 25;
  else pointerPos = Math.min(75 + ((bmi - 30) / 10) * 25, 100);
  document.getElementById("gaugePointer").style.left = pointerPos + "%";

  // Healthy Range (BMI 18.5 - 24.9)
  const healthyMin = (18.5 * heightM * heightM).toFixed(1);
  const healthyMax = (24.9 * heightM * heightM).toFixed(1);
  document.getElementById("healthyRange").textContent = healthyMin + " - " + healthyMax + " kg";

  // Target Weight
  if (bmi < 18.5) {
    document.getElementById("targetWeight").textContent = "+" + (healthyMin - weightKgVal).toFixed(1) + " kg";
  } else if (bmi > 24.9) {
    document.getElementById("targetWeight").textContent = "-" + (weightKgVal - healthyMax).toFixed(1) + " kg";
  } else {
    document.getElementById("targetWeight").textContent = "✅ Maintain";
  }

  // ===== BMR (Mifflin-St Jeor) =====
  let bmr;
  if (age && gender) {
    if (gender === "male") {
      bmr = 10 * weightKgVal + 6.25 * (heightM * 100) - 5 * age + 5;
    } else {
      bmr = 10 * weightKgVal + 6.25 * (heightM * 100) - 5 * age - 161;
    }
  } else {
    bmr = 0;
  }
  const bmrVal = Math.round(bmr);
  document.getElementById("bmr").textContent = bmrVal ? bmrVal + " kcal" : "Enter age";

  // TDEE (moderate activity 1.55)
  const tdee = Math.round(bmr * 1.55);
  document.getElementById("tdee").textContent = tdee ? tdee + " kcal" : "—";

  // Calories
  document.getElementById("calLose").textContent = tdee ? (tdee - 500) + " kcal" : "—";
  document.getElementById("calMaintain").textContent = tdee ? tdee + " kcal" : "—";
  document.getElementById("calGain").textContent = tdee ? (tdee + 500) + " kcal" : "—";

  // ===== Body Fat % (Navy Method) =====
  let bodyFat = "—";
  const waist = parseFloat(waistInput.value);
  if (waist && age && gender) {
    let bf;
    if (gender === "male") {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - 0) + 0.15456 * Math.log10(heightM * 100)) - 450;
    } else {
      const hip = parseFloat(hipInput.value);
      if (hip) {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip) + 0.22100 * Math.log10(heightM * 100)) - 450;
      } else {
        bf = null;
      }
    }
    if (bf && bf > 0) {
      bodyFat = bf.toFixed(1) + " %";
      const leanMass = weightKgVal * (1 - bf / 100);
      document.getElementById("leanMass").textContent = leanMass.toFixed(1) + " kg";
    }
  }
  document.getElementById("bodyFat").textContent = bodyFat;
  if (bodyFat === "—") {
    document.getElementById("leanMass").textContent = "Need waist";
  }

  // ===== Waist Ratios =====
  if (waist) {
    const whr = (waist / (heightM * 100)).toFixed(2);
    document.getElementById("waistHeight").textContent = whr + (whr < 0.5 ? " ✅" : " ⚠️");
  } else {
    document.getElementById("waistHeight").textContent = "—";
  }

  const hip = parseFloat(hipInput.value);
  if (waist && hip) {
    const whp = (waist / hip).toFixed(2);
    document.getElementById("waistHip").textContent = whp;
  } else {
    document.getElementById("waistHip").textContent = "—";
  }

  // ===== Ideal Weight Formulas =====
  const heightInches = (heightM * 100) / 2.54;
  const inchesOver5Ft = Math.max(0, heightInches - 60);
  let idealDevine, idealRobinson, idealMiller, idealHamwi;

  if (gender === "male") {
    idealDevine = 50 + 2.3 * inchesOver5Ft;
    idealRobinson = 52 + 1.9 * inchesOver5Ft;
    idealMiller = 56.2 + 1.41 * inchesOver5Ft;
    idealHamwi = 48 + 2.7 * inchesOver5Ft;
  } else {
    idealDevine = 45.5 + 2.3 * inchesOver5Ft;
    idealRobinson = 49 + 1.7 * inchesOver5Ft;
    idealMiller = 53.1 + 1.36 * inchesOver5Ft;
    idealHamwi = 45.5 + 2.2 * inchesOver5Ft;
  }

  document.getElementById("idealDevine").textContent = idealDevine.toFixed(1) + " kg";
  document.getElementById("idealRobinson").textContent = idealRobinson.toFixed(1) + " kg";
  document.getElementById("idealMiller").textContent = idealMiller.toFixed(1) + " kg";
  document.getElementById("idealHamwi").textContent = idealHamwi.toFixed(1) + " kg";

  // ===== Water Intake (35 ml per kg) =====
  const waterMl = weightKgVal * 35;
  const waterL = (waterMl / 1000).toFixed(1);
  document.getElementById("waterIntake").textContent = waterL + " L";

  // ===== Macro Split (based on TDEE) =====
  const proteinG = Math.round((tdee * 0.30) / 4);
  const carbsG = Math.round((tdee * 0.40) / 4);
  const fatsG = Math.round((tdee * 0.30) / 9);
  document.getElementById("macroProtein").textContent = proteinG + " g";
  document.getElementById("macroCarbs").textContent = carbsG + " g";
  document.getElementById("macroFats").textContent = fatsG + " g";

  // Tip
  document.getElementById("tipText").textContent = tip;

  // Main result color
  document.getElementById("bmiMainResult").style.background =
    "linear-gradient(135deg, " + color + ", " + color + "cc)";

  // Save last result
  lastResult = {
    bmi: bmiRounded,
    category: category,
    bmr: bmrVal,
    tdee: tdee,
    height: heightM,
    weight: weightKgVal,
    healthyMin: healthyMin,
    healthyMax: healthyMax
  };

  resultBox.style.display = "block";
  resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("BMI calculated! ⚖️", "success");
}

calculateBtn.addEventListener("click", calculateBMI);

resetBtn.addEventListener("click", function() {
  document.querySelectorAll(".tool-box input, .tool-box select").forEach(el => el.value = "");
  resultBox.style.display = "none";
  showToast("Reset complete", "info");
});

// ===== SHARE =====
shareBtn.addEventListener("click", function() {
  if (!lastResult) return;
  const text = `⚖️ My BMI Result\n\n` +
    `📊 BMI: ${lastResult.bmi} (${lastResult.category})\n` +
    `🔥 BMR: ${lastResult.bmr} kcal\n` +
    `⚡ TDEE: ${lastResult.tdee} kcal\n\n` +
    `Calculate yours: https://velanmurugan234.github.io/protoolshub/bmi-calculator.html`;

  if (navigator.share) {
    navigator.share({ title: "My BMI", text: text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied! Share anywhere 📤", "success");
    });
  }
});

// ===== COPY =====
copyBtn.addEventListener("click", function() {
  if (!lastResult) return;
  const text = `BMI: ${lastResult.bmi} (${lastResult.category})\nBMR: ${lastResult.bmr} kcal\nTDEE: ${lastResult.tdee} kcal`;
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copied! 📋", "success");
  });
});

// ===== PROFILES =====
function loadProfiles() {
  const profiles = JSON.parse(localStorage.getItem("bmiProfiles") || "[]");
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
        <div class="profile-dob">BMI: ${p.bmi} • ${p.category}</div>
        <div class="profile-age">${p.date}</div>
      </div>
      <button class="profile-delete" data-index="${index}">🗑️</button>
    `;
    list.appendChild(card);
  });

  list.querySelectorAll(".profile-delete").forEach(function(btn) {
    btn.addEventListener("click", function() {
      const idx = parseInt(this.dataset.index);
      let profiles = JSON.parse(localStorage.getItem("bmiProfiles") || "[]");
      profiles.splice(idx, 1);
      localStorage.setItem("bmiProfiles", JSON.stringify(profiles));
      loadProfiles();
      showToast("Deleted", "info");
    });
  });
}

saveBtn.addEventListener("click", function() {
  if (!lastResult) {
    showToast("Calculate BMI first!", "error");
    return;
  }
  const name = prompt("Profile name (e.g., Me, Mom):", "Me");
  if (!name) return;

  const profiles = JSON.parse(localStorage.getItem("bmiProfiles") || "[]");
  profiles.push({
    name: name,
    bmi: lastResult.bmi,
    category: lastResult.category,
    date: new Date().toLocaleDateString()
  });
  localStorage.setItem("bmiProfiles", JSON.stringify(profiles));
  loadProfiles();
  showToast("Profile saved! 💾", "success");
});

// ===== INIT =====
loadProfiles();