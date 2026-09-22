// ==========================================
// ADVANCED PERCENTAGE CALCULATOR
// ==========================================

let currentMode = "basic";
let currentBasicSub = "pctof";
let currentGstSub = "add";
let currentCgpaSub = "toPct";

// ===== MODE SELECTOR =====
document.querySelectorAll(".mode-btn").forEach(function(btn) {
  btn.addEventListener("click", function() {
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".mode-panel").forEach(p => p.classList.remove("active"));
    this.classList.add("active");
    currentMode = this.dataset.mode;
    document.querySelector('.mode-panel[data-panel="' + currentMode + '"]').classList.add("active");
    document.getElementById("resultBox").style.display = "none";
  });
});

// ===== SUB TABS: BASIC =====
document.querySelectorAll('[data-sub]').forEach(function(tab) {
  tab.addEventListener("click", function() {
    document.querySelectorAll('[data-sub]').forEach(t => t.classList.remove("active"));
    this.classList.add("active");
    currentBasicSub = this.dataset.sub;

    const l1 = document.getElementById("inp1Label");
    const l2 = document.getElementById("inp2Label");

    if (currentBasicSub === "pctof") {
      l1.textContent = "Percentage (%)";
      l2.textContent = "Number";
    } else if (currentBasicSub === "whatpct") {
      l1.textContent = "Value (X)";
      l2.textContent = "Total (Y)";
    } else if (currentBasicSub === "addpct") {
      l1.textContent = "Percentage (%)";
      l2.textContent = "Number";
    } else {
      l1.textContent = "Percentage (%)";
      l2.textContent = "Number";
    }
  });
});

// ===== SUB TABS: GST =====
document.querySelectorAll('[data-gstsub]').forEach(function(tab) {
  tab.addEventListener("click", function() {
    document.querySelectorAll('[data-gstsub]').forEach(t => t.classList.remove("active"));
    this.classList.add("active");
    currentGstSub = this.dataset.gstsub;
  });
});

// ===== SUB TABS: CGPA =====
document.querySelectorAll('[data-cgpasub]').forEach(function(tab) {
  tab.addEventListener("click", function() {
    document.querySelectorAll('[data-cgpasub]').forEach(t => t.classList.remove("active"));
    this.classList.add("active");
    currentCgpaSub = this.dataset.cgpasub;

    document.getElementById("cgpaLabel").textContent =
      currentCgpaSub === "toPct" ? "CGPA (0-10)" : "Percentage (%)";
  });
});

// ===== RESULT DISPLAY =====
function showResult(value, sub, formula) {
  document.getElementById("pctResult").textContent = value;
  document.getElementById("pctSub").textContent = sub || "—";
  document.getElementById("formulaText").textContent = formula || "—";
  document.getElementById("resultBox").style.display = "block";
  document.getElementById("resultBox").scrollIntoView({ behavior: "smooth", block: "start" });
  saveHistory(value, sub);
  showToast("Calculated! 📊", "success");
}

// ===== HISTORY =====
let lastResult = null;

function saveHistory(value, sub) {
  lastResult = { value: value, sub: sub };
  const history = JSON.parse(localStorage.getItem("pctHistory") || "[]");
  history.unshift({ value: value, sub: sub, time: Date.now() });
  localStorage.setItem("pctHistory", JSON.stringify(history.slice(0, 10)));
}

// ===== MODE 1: BASIC =====
document.getElementById("basicCalcBtn").addEventListener("click", function() {
  const a = parseFloat(document.getElementById("basicA").value);
  const b = parseFloat(document.getElementById("basicB").value);

  if (isNaN(a) || isNaN(b)) {
    showToast("Enter both values!", "error");
    return;
  }

  let result, sub, formula;

  if (currentBasicSub === "pctof") {
    result = ((a / 100) * b).toFixed(2);
    sub = a + "% of " + b + " = " + result;
    formula = "(" + a + " ÷ 100) × " + b + " = " + result;
  } else if (currentBasicSub === "whatpct") {
    result = ((a / b) * 100).toFixed(2) + "%";
    sub = a + " is " + result + " of " + b;
    formula = "(" + a + " ÷ " + b + ") × 100 = " + result;
  } else if (currentBasicSub === "addpct") {
    result = (b + (a / 100) * b).toFixed(2);
    sub = b + " + " + a + "% = " + result;
    formula = b + " + (" + a + "% of " + b + ") = " + result;
  } else {
    result = (b - (a / 100) * b).toFixed(2);
    sub = b + " - " + a + "% = " + result;
    formula = b + " - (" + a + "% of " + b + ") = " + result;
  }

  showResult(result, sub, formula);
});

document.getElementById("basicResetBtn").addEventListener("click", function() {
  document.getElementById("basicA").value = "";
  document.getElementById("basicB").value = "";
  document.getElementById("resultBox").style.display = "none";
});

// ===== MODE 2: DISCOUNT =====
document.getElementById("discCalcBtn").addEventListener("click", function() {
  const mrp = parseFloat(document.getElementById("discMrp").value);
  const pct = parseFloat(document.getElementById("discPct").value);

  if (isNaN(mrp) || isNaN(pct)) {
    showToast("Enter MRP and Discount %!", "error");
    return;
  }

  const saved = (mrp * pct) / 100;
  const final = mrp - saved;

  showResult(
    "₹" + final.toFixed(2),
    "Saved: ₹" + saved.toFixed(2) + " (" + pct + "% off)",
    "Final = MRP - (MRP × " + pct + "%) = " + mrp + " - " + saved.toFixed(2) + " = ₹" + final.toFixed(2)
  );
});

// ===== MODE 3: GST =====
document.getElementById("gstCalcBtn").addEventListener("click", function() {
  const amt = parseFloat(document.getElementById("gstAmt").value);
  const rate = parseFloat(document.getElementById("gstRate").value);

  if (isNaN(amt)) {
    showToast("Enter amount!", "error");
    return;
  }

  let result, sub, formula;

  if (currentGstSub === "add") {
    const gst = (amt * rate) / 100;
    result = "₹" + (amt + gst).toFixed(2);
    sub = "GST: ₹" + gst.toFixed(2) + " | CGST: ₹" + (gst / 2).toFixed(2) + " | SGST: ₹" + (gst / 2).toFixed(2);
    formula = "GST = " + amt + " × " + rate + "% = ₹" + gst.toFixed(2);
  } else {
    const base = (amt * 100) / (100 + rate);
    const gst = amt - base;
    result = "₹" + base.toFixed(2);
    sub = "Original: ₹" + base.toFixed(2) + " | GST: ₹" + gst.toFixed(2);
    formula = "Base = " + amt + " ÷ (1 + " + (rate / 100) + ") = ₹" + base.toFixed(2);
  }

  showResult(result, sub, formula);
});

// ===== MODE 4: TIP =====
document.getElementById("tipCalcBtn").addEventListener("click", function() {
  const bill = parseFloat(document.getElementById("tipBill").value);
  const pct = parseFloat(document.getElementById("tipPct").value);
  const people = parseInt(document.getElementById("tipPeople").value) || 1;

  if (isNaN(bill) || isNaN(pct)) {
    showToast("Enter bill and tip %!", "error");
    return;
  }

  const tip = (bill * pct) / 100;
  const total = bill + tip;
  const perPerson = total / people;

  showResult(
    "₹" + total.toFixed(2),
    "Tip: ₹" + tip.toFixed(2) + " | Per Person: ₹" + perPerson.toFixed(2),
    "Total = " + bill + " + " + pct + "% = ₹" + total.toFixed(2) + " | Split " + people + " = ₹" + perPerson.toFixed(2)
  );
});

// ===== MODE 5: MARKS =====
document.getElementById("marksCalcBtn").addEventListener("click", function() {
  const obt = parseFloat(document.getElementById("marksObt").value);
  const total = parseFloat(document.getElementById("marksTotal").value);

  if (isNaN(obt) || isNaN(total)) {
    showToast("Enter marks!", "error");
    return;
  }

  const pct = ((obt / total) * 100).toFixed(2);

  let grade;
  if (pct >= 90) grade = "A+ 🏆";
  else if (pct >= 80) grade = "A ⭐";
  else if (pct >= 70) grade = "B+";
  else if (pct >= 60) grade = "B";
  else if (pct >= 50) grade = "C";
  else if (pct >= 40) grade = "D";
  else grade = "F (Fail)";

  showResult(
    pct + "%",
    "Grade: " + grade + " | " + obt + "/" + total,
    "(" + obt + " ÷ " + total + ") × 100 = " + pct + "%"
  );
});

// ===== MODE 6: CGPA =====
document.getElementById("cgpaCalcBtn").addEventListener("click", function() {
  const val = parseFloat(document.getElementById("cgpaInput").value);

  if (isNaN(val)) {
    showToast("Enter value!", "error");
    return;
  }

  if (currentCgpaSub === "toPct") {
    if (val < 0 || val > 10) {
      showToast("CGPA 0-10 ke beech hona chahiye!", "error");
      return;
    }
    const pct = (val * 9.5).toFixed(2);
    showResult(
      pct + "%",
      "CGPA " + val + " = " + pct + "%",
      "Percentage = CGPA × 9.5 = " + val + " × 9.5 = " + pct + "%"
    );
  } else {
    const cgpa = (val / 9.5).toFixed(2);
    showResult(
      cgpa,
      val + "% = " + cgpa + " CGPA",
      "CGPA = Percentage ÷ 9.5 = " + val + " ÷ 9.5 = " + cgpa
    );
  }
});

// ===== MODE 7: PROFIT =====
document.getElementById("profitCalcBtn").addEventListener("click", function() {
  const cp = parseFloat(document.getElementById("profitCp").value);
  const sp = parseFloat(document.getElementById("profitSp").value);

  if (isNaN(cp) || isNaN(sp)) {
    showToast("Enter cost and selling price!", "error");
    return;
  }

  const diff = sp - cp;
  const pct = ((Math.abs(diff) / cp) * 100).toFixed(2);

  if (diff >= 0) {
    showResult(
      "+" + pct + "%",
      "Profit: ₹" + diff.toFixed(2),
      "Profit% = ((SP - CP) ÷ CP) × 100 = ((" + sp + " - " + cp + ") ÷ " + cp + ") × 100 = " + pct + "%"
    );
  } else {
    showResult(
      "-" + pct + "%",
      "Loss: ₹" + Math.abs(diff).toFixed(2),
      "Loss% = ((CP - SP) ÷ CP) × 100 = ((" + cp + " - " + sp + ") ÷ " + cp + ") × 100 = " + pct + "%"
    );
  }
});

// ===== MODE 8: INCREASE / DECREASE =====
document.getElementById("incCalcBtn").addEventListener("click", function() {
  const from = parseFloat(document.getElementById("incFrom").value);
  const to = parseFloat(document.getElementById("incTo").value);

  if (isNaN(from) || isNaN(to)) {
    showToast("Enter both values!", "error");
    return;
  }

  const diff = to - from;
  const pct = ((diff / from) * 100).toFixed(2);

  if (pct >= 0) {
    showResult(
      "+" + pct + "%",
      "Increased by " + diff.toFixed(2) + " (from " + from + " to " + to + ")",
      "% Increase = ((New - Old) ÷ Old) × 100 = ((" + to + " - " + from + ") ÷ " + from + ") × 100 = " + pct + "%"
    );
  } else {
    showResult(
      pct + "%",
      "Decreased by " + Math.abs(diff).toFixed(2) + " (from " + from + " to " + to + ")",
      "% Decrease = ((Old - New) ÷ Old) × 100 = ((" + from + " - " + to + ") ÷ " + from + ") × 100 = " + Math.abs(pct) + "%"
    );
  }
});

// ===== MODE 9: REVERSE =====
document.getElementById("revCalcBtn").addEventListener("click", function() {
  const pct = parseFloat(document.getElementById("revPct").value);
  const val = parseFloat(document.getElementById("revVal").value);

  if (isNaN(pct) || isNaN(val)) {
    showToast("Enter both values!", "error");
    return;
  }

  const total = ((val / pct) * 100).toFixed(2);
  showResult(
    total,
    pct + "% = " + val + ", so 100% = " + total,
    "Total = (Value ÷ Percentage) × 100 = (" + val + " ÷ " + pct + ") × 100 = " + total
  );
});

// ===== MODE 10: % ERROR =====
document.getElementById("errCalcBtn").addEventListener("click", function() {
  const actual = parseFloat(document.getElementById("errActual").value);
  const observed = parseFloat(document.getElementById("errObserved").value);

  if (isNaN(actual) || isNaN(observed)) {
    showToast("Enter both values!", "error");
    return;
  }

  const err = (Math.abs(actual - observed) / Math.abs(actual)) * 100;
  showResult(
    err.toFixed(4) + "%",
    "Difference: " + Math.abs(actual - observed).toFixed(2),
    "% Error = |(Actual - Observed) ÷ Actual| × 100 = |(" + actual + " - " + observed + ") ÷ " + actual + "| × 100 = " + err.toFixed(4) + "%"
  );
});

// ===== RESET BUTTONS =====
const resetMap = {
  discResetBtn: ["discMrp", "discPct"],
  gstResetBtn: ["gstAmt"],
  tipResetBtn: ["tipBill", "tipPct", "tipPeople"],
  marksResetBtn: ["marksObt", "marksTotal"],
  cgpaResetBtn: ["cgpaInput"],
  profitResetBtn: ["profitCp", "profitSp"],
  incResetBtn: ["incFrom", "incTo"],
  revResetBtn: ["revPct", "revVal"],
  errResetBtn: ["errActual", "errObserved"]
};

Object.keys(resetMap).forEach(function(btnId) {
  const btn = document.getElementById(btnId);
  if (btn) {
    btn.addEventListener("click", function() {
      resetMap[btnId].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = id === "tipPeople" ? "1" : "";
      });
      document.getElementById("resultBox").style.display = "none";
      showToast("Reset complete", "info");
    });
  }
});

// ===== SHARE =====
document.getElementById("sharePctBtn").addEventListener("click", function() {
  if (!lastResult) return;
  const text = "📊 Percentage Calculator Result\n\n" +
    "Result: " + lastResult.value + "\n" +
    lastResult.sub + "\n\n" +
    "Calculate yours: https://velanmurugan234.github.io/protoolshub/percentage-calculator.html";

  if (navigator.share) {
    navigator.share({ title: "Percentage Result", text: text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied! Share anywhere 📤", "success");
    });
  }
});

// ===== COPY =====
document.getElementById("copyPctBtn").addEventListener("click", function() {
  if (!lastResult) return;
  const text = lastResult.value + " — " + lastResult.sub;
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copied! 📋", "success");
  });
});

// ===== HISTORY =====
document.getElementById("historyBtn").addEventListener("click", function() {
  const history = JSON.parse(localStorage.getItem("pctHistory") || "[]");
  if (history.length === 0) {
    showToast("No history yet!", "info");
    return;
  }

  let msg = "📜 Last Calculations:\n\n";
  history.slice(0, 5).forEach(function(h, i) {
    msg += (i + 1) + ". " + h.value + " — " + h.sub + "\n";
  });
  alert(msg);
});