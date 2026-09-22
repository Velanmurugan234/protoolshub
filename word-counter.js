// ===== WORD COUNTER LOGIC =====

const textInput = document.getElementById("textInput");
const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const charNoSpace = document.getElementById("charNoSpace");
const sentenceCount = document.getElementById("sentenceCount");
const paragraphCount = document.getElementById("paragraphCount");
const readingTime = document.getElementById("readingTime");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");

function updateStats() {
  const text = textInput.value;

  // Words
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  wordCount.textContent = words;

  // Characters (with spaces)
  charCount.textContent = text.length;

  // Characters (no spaces)
  charNoSpace.textContent = text.replace(/\s/g, "").length;

  // Sentences
  const sentences = text.trim() === "" ? 0 : (text.match(/[.!?]+/g) || []).length;
  sentenceCount.textContent = sentences;

  // Paragraphs
  const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter(p => p.trim() !== "").length;
  paragraphCount.textContent = paragraphs;

  // Reading time (200 words per minute)
  const minutes = Math.ceil(words / 200);
  readingTime.textContent = minutes;
}

// Live update on typing
textInput.addEventListener("input", updateStats);

// Clear button
clearBtn.addEventListener("click", function() {
  textInput.value = "";
  updateStats();
  textInput.focus();
  showToast("Text cleared", "info");
});

// Copy button
copyBtn.addEventListener("click", function() {
  if (textInput.value === "") {
    showToast("Please type some text first!", "error");
    return;
  }
  navigator.clipboard.writeText(textInput.value).then(function() {
    showToast("Text copied to clipboard!", "success");
    copyBtn.textContent = "✅ Copied!";
    setTimeout(function() {
      copyBtn.textContent = "📋 Copy";
    }, 2000);
  });
});

// Initial update
updateStats();