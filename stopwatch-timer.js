// ==========================================
// STOPWATCH & TIMER
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

// ===== STOPWATCH =====
let swInterval = null;
let swStartTime = 0;
let swElapsed = 0;
let swRunning = false;
let lapCount = 0;
let lastLapTime = 0;

const swDisplay = document.getElementById("swDisplay");
const swStartBtn = document.getElementById("swStartBtn");
const swPauseBtn = document.getElementById("swPauseBtn");
const swLapBtn = document.getElementById("swLapBtn");
const swResetBtn = document.getElementById("swResetBtn");
const swLaps = document.getElementById("swLaps");

function formatStopwatch(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  return (
    String(hours).padStart(2, "0") + ":" +
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0") + "." +
    String(centiseconds).padStart(2, "0")
  );
}

function updateStopwatch() {
  const now = Date.now();
  const elapsed = swElapsed + (now - swStartTime);
  swDisplay.textContent = formatStopwatch(elapsed);
}

function startStopwatch() {
  if (swRunning) return;
  swStartTime = Date.now();
  swInterval = setInterval(updateStopwatch, 10);
  swRunning = true;
  swStartBtn.style.display = "none";
  swPauseBtn.style.display = "inline-block";
}

function pauseStopwatch() {
  if (!swRunning) return;
  clearInterval(swInterval);
  swElapsed += Date.now() - swStartTime;
  swRunning = false;
  swStartBtn.style.display = "inline-block";
  swPauseBtn.style.display = "none";
}

function resetStopwatch() {
  clearInterval(swInterval);
  swRunning = false;
  swElapsed = 0;
  swStartTime = 0;
  lapCount = 0;
  lastLapTime = 0;
  swDisplay.textContent = "00:00:00.00";
  swLaps.innerHTML = "";
  swStartBtn.style.display = "inline-block";
  swPauseBtn.style.display = "none";
  showToast("Stopwatch reset", "info");
}

function addLap() {
  if (!swRunning && swElapsed === 0) return;
  const now = Date.now();
  const currentElapsed = swElapsed + (swRunning ? (now - swStartTime) : 0);
  const lapTime = currentElapsed - lastLapTime;
  lastLapTime = currentElapsed;
  lapCount++;

  const lapItem = document.createElement("div");
  lapItem.className = "sw-lap-item";
  lapItem.innerHTML = `<span>Lap ${lapCount}</span><span>${formatStopwatch(lapTime)}</span>`;
  swLaps.prepend(lapItem);
}

swStartBtn.addEventListener("click", startStopwatch);
swPauseBtn.addEventListener("click", pauseStopwatch);
swResetBtn.addEventListener("click", resetStopwatch);
swLapBtn.addEventListener("click", addLap);

// ===== TIMER =====
let timerInterval = null;
let timerRemaining = 0; // in seconds
let timerRunning = false;
let timerEndTime = 0;

const timerHours = document.getElementById("timerHours");
const timerMinutes = document.getElementById("timerMinutes");
const timerSeconds = document.getElementById("timerSeconds");
const timerDisplay = document.getElementById("timerDisplay");
const timerStartBtn = document.getElementById("timerStartBtn");
const timerPauseBtn = document.getElementById("timerPauseBtn");
const timerResetBtn = document.getElementById("timerResetBtn");

function formatTimer(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTimer(timerRemaining);
}

function startTimer() {
  if (timerRunning) return;

  if (timerRemaining === 0) {
    // read inputs
    const h = parseInt(timerHours.value) || 0;
    const m = parseInt(timerMinutes.value) || 0;
    const s = parseInt(timerSeconds.value) || 0;
    timerRemaining = h * 3600 + m * 60 + s;
  }

  if (timerRemaining <= 0) {
    showToast("Please set a time greater than 0", "error");
    return;
  }

  timerEndTime = Date.now() + timerRemaining * 1000;
  timerInterval = setInterval(function() {
    const now = Date.now();
    timerRemaining = Math.max(0, Math.round((timerEndTime - now) / 1000));
    updateTimerDisplay();
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timerStartBtn.style.display = "inline-block";
      timerPauseBtn.style.display = "none";
      playBeep();
      showToast("⏰ Timer finished!", "success");
    }
  }, 200);

  timerRunning = true;
  timerStartBtn.style.display = "none";
  timerPauseBtn.style.display = "inline-block";
  showToast("Timer started", "success");
}

function pauseTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
  timerStartBtn.style.display = "inline-block";
  timerPauseBtn.style.display = "none";
  showToast("Timer paused", "info");
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerRemaining = 0;
  updateTimerDisplay();
  timerStartBtn.style.display = "inline-block";
  timerPauseBtn.style.display = "none";
  showToast("Timer reset", "info");
}

// Beep sound using Web Audio API
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 800;
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, 500);
  } catch (e) {
    console.log("Beep error:", e);
  }
}

timerStartBtn.addEventListener("click", startTimer);
timerPauseBtn.addEventListener("click", pauseTimer);
timerResetBtn.addEventListener("click", resetTimer);

// Initialize timer display
updateTimerDisplay();