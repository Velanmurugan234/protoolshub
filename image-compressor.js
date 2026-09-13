// ===== IMAGE COMPRESSOR LOGIC =====

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const qualityBox = document.getElementById("qualityBox");
const qualitySlider = document.getElementById("qualitySlider");
const qualityValue = document.getElementById("qualityValue");
const previewBox = document.getElementById("previewBox");
const beforeImg = document.getElementById("beforeImg");
const afterImg = document.getElementById("afterImg");
const beforeSize = document.getElementById("beforeSize");
const afterSize = document.getElementById("afterSize");
const savingsBadge = document.getElementById("savingsBadge");
const savingsText = document.getElementById("savingsText");
const compressBtn = document.getElementById("compressBtn");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");

let originalFile = null;
let compressedBlob = null;
let originalSize = 0;

// ===== DRAG & DROP =====
dropZone.addEventListener("click", function() {
  fileInput.click();
});

dropZone.addEventListener("dragover", function(e) {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", function() {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", function(e) {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    handleFile(file);
  } else {
    alert("Sirf image file daalo!");
  }
});

fileInput.addEventListener("change", function() {
  const file = fileInput.files[0];
  if (file) handleFile(file);
});

// ===== FORMAT SIZE =====
function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

// ===== HANDLE FILE =====
function handleFile(file) {
  originalFile = file;
  originalSize = file.size;

  const reader = new FileReader();
  reader.onload = function(e) {
    beforeImg.src = e.target.result;
    beforeSize.textContent = formatSize(file.size);

    qualityBox.style.display = "block";
    previewBox.style.display = "block";

    compressImage();
  };
  reader.readAsDataURL(file);
}

// ===== COMPRESS IMAGE =====
function compressImage() {
  if (!originalFile) return;

  const quality = parseInt(qualitySlider.value) / 100;
  const img = new Image();

  img.onload = function() {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(function(blob) {
      compressedBlob = blob;
      const url = URL.createObjectURL(blob);
      afterImg.src = url;
      afterSize.textContent = formatSize(blob.size);

      // Savings calculate karo
      const saved = originalSize - blob.size;
      const savedPercent = Math.round((saved / originalSize) * 100);

      if (savedPercent > 0) {
        savingsText.textContent = savedPercent + "% chhota (" + formatSize(saved) + " bacha)";
        savingsBadge.style.display = "inline-block";
      } else {
        savingsText.textContent = "Quality badha ke try karo";
        savingsBadge.style.display = "inline-block";
      }
    }, "image/jpeg", quality);
  };

  img.src = URL.createObjectURL(originalFile);
}

// ===== QUALITY SLIDER =====
qualitySlider.addEventListener("input", function() {
  qualityValue.textContent = this.value;
});

qualitySlider.addEventListener("change", function() {
  compressImage();
});

// ===== BUTTONS =====
compressBtn.addEventListener("click", function() {
  compressImage();
});

downloadBtn.addEventListener("click", function() {
  if (!compressedBlob) {
    alert("Pehle image compress karo!");
    return;
  }
  const url = URL.createObjectURL(compressedBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "compressed-" + Date.now() + ".jpg";
  link.click();
  URL.revokeObjectURL(url);
});

resetBtn.addEventListener("click", function() {
  originalFile = null;
  compressedBlob = null;
  originalSize = 0;
  fileInput.value = "";
  qualitySlider.value = 80;
  qualityValue.textContent = "80";
  qualityBox.style.display = "none";
  previewBox.style.display = "none";
  savingsBadge.style.display = "none";
});