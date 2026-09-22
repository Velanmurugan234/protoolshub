// ==========================================
// ADVANCED EMI CALCULATOR
// ==========================================

let lastResult = null;

// ===== TAB SWITCHING =====
document.querySelectorAll(".age-tab").forEach(function(tab) {
  tab.addEventListener("click", function() {
    document.querySelectorAll(".age-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".age-tab-content").forEach(c => c.classList.remove("active"));
    this.classList.add("active");
    document.getElementById("tab-" + this.dataset.tab).classList.add("active");
  });
});

// ===== HELPERS =====
function formatCurrency(num) {
  if (isNaN(num)) return "₹ 0";
  return "₹ " + Math.round(num).toLocaleString("en-IN");
}

function formatShort(num) {
  if (num >= 10000000) return "₹ " + (num / 10000000).toFixed(2) + " Cr";
  if (num >= 100000) return "₹ " + (num / 100000).toFixed(2) + " L";
  if (num >= 1000) return "₹ " + (num / 1000).toFixed(1) + "K";
  return "₹ " + Math.round(num);
}

// ===== CALCULATE EMI =====
const loanAmount = document.getElementById("loanAmount");
const interestRate = document.getElementById("interestRate");
const tenure = document.getElementById("tenure");
const tenureUnit = document.getElementById("tenureUnit");
const interestType = document.getElementById("interestType");
const processingFee = document.getElementById("processingFee");
const gstRate = document.getElementById("gstRate");
const loanType = document.getElementById("loanType");

const calculateBtn = document.getElementById("calculateBtn");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const shareBtn = document.getElementById("shareBtn");
const copyBtn = document.getElementById("copyBtn");
const csvBtn = document.getElementById("csvBtn");
const resultBox = document.getElementById("resultBox");

let schedule = [];

function calculateEMI() {
  const P = parseFloat(loanAmount.value);
  const R = parseFloat(interestRate.value);
  const T = parseFloat(tenure.value);

  if (!P || !R || !T) {
    showToast("Please fill Loan Amount, Interest Rate and Tenure!", "error");
    return;
  }

  if (P <= 0 || R <= 0 || T <= 0) {
    showToast("All values must be positive!", "error");
    return;
  }

  const months = tenureUnit.value === "years" ? T * 12 : T;
  const r = R / 12 / 100;

  let emi, totalInterest, totalPayment;

  if (interestType.value === "reducing") {
    // Reducing balance formula
    emi = (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    totalPayment = emi * months;
    totalInterest = totalPayment - P;
  } else {
    // Flat rate
    totalInterest = (P * R * (months / 12)) / 100;
    totalPayment = P + totalInterest;
    emi = totalPayment / months;
  }

  // Processing fee
  const feePercent = parseFloat(processingFee.value) || 0;
  const gstPercent = parseFloat(gstRate.value) || 0;
  const baseFee = (P * feePercent) / 100;
  const gstAmount = (baseFee * gstPercent) / 100;
  const totalFees = baseFee + gstAmount;

  // Update UI
  document.getElementById("emiValue").textContent = formatCurrency(emi);
  document.getElementById("emiSub").textContent =
    months + " months • " + R + "% p.a. • " + interestType.value + " balance";
  document.getElementById("principalAmt").textContent = formatShort(P);
  document.getElementById("totalInterest").textContent = formatShort(totalInterest);
  document.getElementById("totalPayment").textContent = formatShort(totalPayment + totalFees);
  document.getElementById("totalFees").textContent = formatShort(totalFees);

  // Generate schedule
  schedule = [];
  let balance = P;
  for (let i = 1; i <= months; i++) {
    let interestPart, principalPart;
    if (interestType.value === "reducing") {
      interestPart = balance * r;
      principalPart = emi - interestPart;
    } else {
      interestPart = totalInterest / months;
      principalPart = P / months;
    }
    balance = balance - principalPart;
    if (balance < 0) balance = 0;

    schedule.push({
      month: i,
      emi: emi,
      principal: principalPart,
      interest: interestPart,
      balance: balance
    });
  }

  lastResult = {
    emi: emi,
    P: P,
    R: R,
    months: months,
    totalInterest: totalInterest,
    totalPayment: totalPayment,
    totalFees: totalFees,
    type: interestType.value
  };

  drawPieChart(P, totalInterest);
  buildScheduleTable();

  resultBox.style.display = "block";
  resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("EMI calculated! 💰", "success");
}

// ===== PIE CHART =====
function drawPieChart(principal, interest) {
  const canvas = document.getElementById("pieChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const total = principal + interest;
  const pAngle = (principal / total) * 2 * Math.PI;
  const iAngle = (interest / total) * 2 * Math.PI;

  const cx = 200, cy = 150, radius = 100;

  ctx.clearRect(0, 0, 400, 300);

  // Principal slice
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, radius, 0, pAngle);
  ctx.closePath();
  ctx.fillStyle = "#2563eb";
  ctx.fill();

  // Interest slice
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, radius, pAngle, pAngle + iAngle);
  ctx.closePath();
  ctx.fillStyle = "#ef4444";
  ctx.fill();

  // Labels
  ctx.fillStyle = "#111827";
  ctx.font = "bold 13px Arial";
  ctx.fillText("Principal: " + formatShort(principal), 20, 280);
  ctx.fillStyle = "#ef4444";
  ctx.fillText("Interest: " + formatShort(interest), 210, 280);
}

// ===== SCHEDULE TABLE =====
function buildScheduleTable() {
  const container = document.getElementById("scheduleTable");
  if (!container) return;

  if (schedule.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#6b7280; padding:30px;">Calculate EMI first.</p>';
    return;
  }

  let html = '<div class="schedule-wrap"><table class="schedule-table">';
  html += '<thead><tr><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>';

  schedule.forEach(function(row) {
    html += `<tr>
      <td>${row.month}</td>
      <td>${formatCurrency(row.emi)}</td>
      <td>${formatCurrency(row.principal)}</td>
      <td>${formatCurrency(row.interest)}</td>
      <td>${formatCurrency(row.balance)}</td>
    </tr>`;
  });

  html += '</tbody></table></div>';
  container.innerHTML = html;
}

// ===== EVENTS =====
if (calculateBtn) calculateBtn.addEventListener("click", calculateEMI);

if (resetBtn) {
  resetBtn.addEventListener("click", function() {
    document.querySelectorAll(".tool-box input").forEach(el => el.value = "");
    gstRate.value = "18";
    resultBox.style.display = "none";
    schedule = [];
    showToast("Reset complete", "info");
  });
}

// ===== SHARE =====
if (shareBtn) {
  shareBtn.addEventListener("click", function() {
    if (!lastResult) return;
    const text = `💰 EMI Calculator Result\n\n` +
      `📊 Loan Amount: ${formatCurrency(lastResult.P)}\n` +
      `📈 Interest Rate: ${lastResult.R}%\n` +
      `📅 Tenure: ${lastResult.months} months\n` +
      `💵 Monthly EMI: ${formatCurrency(lastResult.emi)}\n` +
      `💰 Total Interest: ${formatCurrency(lastResult.totalInterest)}\n` +
      `💸 Total Payment: ${formatCurrency(lastResult.totalPayment + lastResult.totalFees)}\n\n` +
      `Calculate yours: https://velanmurugan234.github.io/protoolshub/emi-calculator.html`;

    if (navigator.share) {
      navigator.share({ title: "EMI Result", text: text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        showToast("Copied! Share anywhere 📤", "success");
      });
    }
  });
}

// ===== COPY =====
if (copyBtn) {
  copyBtn.addEventListener("click", function() {
    if (!lastResult) return;
    const text = `EMI: ${formatCurrency(lastResult.emi)}\nLoan: ${formatCurrency(lastResult.P)}\nInterest: ${formatCurrency(lastResult.totalInterest)}\nTotal: ${formatCurrency(lastResult.totalPayment + lastResult.totalFees)}`;
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied! 📋", "success");
    });
  });
}

// ===== CSV DOWNLOAD =====
if (csvBtn) {
  csvBtn.addEventListener("click", function() {
    if (schedule.length === 0) {
      showToast("Calculate EMI first!", "error");
      return;
    }

    let csv = "Month,EMI,Principal,Interest,Balance\n";
    schedule.forEach(function(row) {
      csv += `${row.month},${Math.round(row.emi)},${Math.round(row.principal)},${Math.round(row.interest)},${Math.round(row.balance)}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "emi-schedule.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV downloaded! 📥", "success");
  });
}

// ===== SAVE PROFILE =====
if (saveBtn) {
  saveBtn.addEventListener("click", function() {
    if (!lastResult) {
      showToast("Calculate EMI first!", "error");
      return;
    }
    const name = prompt("Profile name:", "Loan 1");
    if (!name) return;

    const profiles = JSON.parse(localStorage.getItem("emiProfiles") || "[]");
    profiles.push({
      name: name,
      amount: lastResult.P,
      rate: lastResult.R,
      months: lastResult.months,
      emi: lastResult.emi,
      date: new Date().toLocaleDateString()
    });
    localStorage.setItem("emiProfiles", JSON.stringify(profiles));
    showToast("Profile saved! 💾", "success");
  });
}

// ===== PREPAYMENT =====
const prepayAmount = document.getElementById("prepayAmount");
const prepayMonth = document.getElementById("prepayMonth");
const calcPrepayBtn = document.getElementById("calcPrepayBtn");
const prepayResult = document.getElementById("prepayResult");

if (calcPrepayBtn) {
  calcPrepayBtn.addEventListener("click", function() {
    if (!lastResult) {
      showToast("Calculate EMI first!", "error");
      return;
    }

    const extra = parseFloat(prepayAmount.value);
    const afterMonth = parseInt(prepayMonth.value);

    if (!extra || !afterMonth) {
      showToast("Enter prepayment amount and month!", "error");
      return;
    }

    if (afterMonth > lastResult.months) {
      showToast("Month exceeds loan tenure!", "error");
      return;
    }

    const r = lastResult.R / 12 / 100;
    let balance = lastResult.P;
    let totalPaid = 0;
    let monthsCount = 0;

    // Pay EMIs until prepayment month
    for (let i = 1; i <= lastResult.months; i++) {
      const interestPart = balance * r;
      const principalPart = lastResult.emi - interestPart;
      balance -= principalPart;
      totalPaid += lastResult.emi;
      monthsCount++;

      // Apply prepayment after specified month
      if (i === afterMonth) {
        balance -= extra;
        totalPaid += extra;
      }

      if (balance <= 0) break;
    }

    const newTotal = totalPaid;
    const savedInterest = (lastResult.totalPayment) - (newTotal);
    const reducedMonths = lastResult.months - monthsCount;

    document.getElementById("savedInterest").textContent = formatShort(savedInterest > 0 ? savedInterest : 0);
    document.getElementById("tenureReduced").textContent = reducedMonths + " months";
    document.getElementById("newTotalPay").textContent = formatShort(newTotal);
    document.getElementById("loanEndsIn").textContent = monthsCount + " months";

    prepayResult.style.display = "block";
    prepayResult.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Prepayment calculated! ⚡", "success");
  });
}

// ===== COMPARE LOANS =====
const compareBtn = document.getElementById("compareBtn");
const compareResult = document.getElementById("compareResult");

if (compareBtn) {
  compareBtn.addEventListener("click", function() {
    const aAmt = parseFloat(document.getElementById("loanA_amt").value);
    const aRate = parseFloat(document.getElementById("loanA_rate").value);
    const aTen = parseFloat(document.getElementById("loanA_ten").value);
    const aName = document.getElementById("loanA_name").value || "Loan A";

    const bAmt = parseFloat(document.getElementById("loanB_amt").value);
    const bRate = parseFloat(document.getElementById("loanB_rate").value);
    const bTen = parseFloat(document.getElementById("loanB_ten").value);
    const bName = document.getElementById("loanB_name").value || "Loan B";

    if (!aAmt || !aRate || !aTen || !bAmt || !bRate || !bTen) {
      showToast("Fill all fields for both loans!", "error");
      return;
    }

    function calcEmi(P, R, years) {
      const months = years * 12;
      const r = R / 12 / 100;
      const emi = (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      const total = emi * months;
      return { emi: emi, total: total, interest: total - P };
    }

    const A = calcEmi(aAmt, aRate, aTen);
    const B = calcEmi(bAmt, bRate, bTen);

    document.getElementById("loanAName").textContent = aName;
    document.getElementById("loanAEmi").textContent = formatCurrency(A.emi);
    document.getElementById("loanAInt").textContent = formatShort(A.interest);
    document.getElementById("loanATotal").textContent = formatShort(A.total);

    document.getElementById("loanBName").textContent = bName;
    document.getElementById("loanBEmi").textContent = formatCurrency(B.emi);
    document.getElementById("loanBInt").textContent = formatShort(B.interest);
    document.getElementById("loanBTotal").textContent = formatShort(B.total);

    const diff = A.total - B.total;
    if (diff > 0) {
      document.getElementById("compareTipText").textContent =
        bName + " is cheaper by " + formatShort(diff) + " 💰";
    } else if (diff < 0) {
      document.getElementById("compareTipText").textContent =
        aName + " is cheaper by " + formatShort(Math.abs(diff)) + " 💰";
    } else {
      document.getElementById("compareTipText").textContent = "Both loans are equal!";
    }

    compareResult.style.display = "block";
    compareResult.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Comparison done! 📊", "success");
  });
}

// ===== ELIGIBILITY =====
const eligBtn = document.getElementById("eligBtn");
const eligResult = document.getElementById("eligResult");

if (eligBtn) {
  eligBtn.addEventListener("click", function() {
    const income = parseFloat(document.getElementById("monthlyIncome").value);
    const existing = parseFloat(document.getElementById("existingEmi").value) || 0;
    const rate = parseFloat(document.getElementById("eligRate").value);
    const years = parseFloat(document.getElementById("eligTenure").value);
    const foir = parseFloat(document.getElementById("foir").value) || 50;

    if (!income || !rate || !years) {
      showToast("Fill income, rate and tenure!", "error");
      return;
    }

    const maxEmi = (income * foir / 100) - existing;
    if (maxEmi <= 0) {
      showToast("No eligibility with current FOIR!", "error");
      return;
    }

    const months = years * 12;
    const r = rate / 12 / 100;
    const maxLoan = (maxEmi * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months));

    document.getElementById("maxLoan").textContent = formatCurrency(maxLoan);
    document.getElementById("maxEmi").textContent = formatCurrency(maxEmi);
    document.getElementById("availFoir").textContent = foir + "%";

    eligResult.style.display = "block";
    eligResult.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Eligibility calculated! ✅", "success");
  });
}