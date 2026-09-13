// ===== QR CODE GENERATOR LOGIC =====

const qrInput = document.getElementById("qrInput");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const qrResult = document.getElementById("qrResult");
const qrcodeDiv = document.getElementById("qrcode");

let qrcode = null;

function generateQR() {
  const text = qrInput.value.trim();

  if (text === "") {
    alert("Pehle kuch text ya link daalo!");
    qrInput.focus();
    return;
  }

  // Purana QR clear karo
  qrcodeDiv.innerHTML = "";

  // Naya QR banao
  qrcode = new QRCode(qrcodeDiv, {
    text: text,
    width: 250,
    height: 250,
    colorDark: "#111827",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  // Result show karo
  qrResult.style.display = "block";
  qrResult.scrollIntoView({ behavior: "smooth", block: "center" });

  // Download button enable karo
  downloadBtn.disabled = false;
  downloadBtn.style.opacity = "1";
}

// Generate button
generateBtn.addEventListener("click", generateQR);

// Enter key dabane par bhi generate ho
qrInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    generateQR();
  }
});

// Download button
downloadBtn.addEventListener("click", function() {
  const canvas = qrcodeDiv.querySelector("canvas");
  const img = qrcodeDiv.querySelector("img");

  if (canvas) {
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  } else if (img) {
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = img.src;
    link.click();
  } else {
    alert("Pehle QR code generate karo!");
  }
});