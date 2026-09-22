// ===== TEXT CASE CONVERTER LOGIC =====

const textInput = document.getElementById("textInput");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");

// Convert functions
const converters = {
  upper: function(text) {
    return text.toUpperCase();
  },

  lower: function(text) {
    return text.toLowerCase();
  },

  title: function(text) {
    return text.toLowerCase().replace(/\b\w/g, function(char) {
      return char.toUpperCase();
    });
  },

  sentence: function(text) {
    return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, function(char) {
      return char.toUpperCase();
    });
  },

  camel: function(text) {
    return text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, function(match, char) {
        return char.toUpperCase();
      });
  },

  snake: function(text) {
    return text
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .toLowerCase();
  }
};

// Button click
document.querySelectorAll(".case-btn").forEach(function(btn) {
  btn.addEventListener("click", function() {
    if (textInput.value === "") {
      showToast("Please type some text first!", "error");
      textInput.focus();
      return;
    }

    const caseType = this.dataset.case;
    textInput.value = converters[caseType](textInput.value);

    // Button feedback
    const originalText = this.textContent;
    this.textContent = "✅ Done!";
    setTimeout(() => {
      this.textContent = originalText;
    }, 1000);

    showToast("Converted to " + caseType + " case!", "success");
  });
});

// Copy button
copyBtn.addEventListener("click", function() {
  if (textInput.value === "") {
    showToast("Please type some text first!", "error");
    return;
  }
  navigator.clipboard.writeText(textInput.value).then(function() {
    showToast("Text copied!", "success");
    copyBtn.textContent = "✅ Copied!";
    setTimeout(function() {
      copyBtn.textContent = "📋 Copy";
    }, 1500);
  });
});

// Clear button
clearBtn.addEventListener("click", function() {
  textInput.value = "";
  textInput.focus();
  showToast("Text cleared", "info");
});