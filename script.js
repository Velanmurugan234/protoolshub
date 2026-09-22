// ==========================================
// ProToolsHub - Main JavaScript
// ==========================================

// ===== FOOTER YEAR AUTO UPDATE =====
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ===== NAVBAR SHADOW ON SCROLL =====
const header = document.querySelector("header");
if (header) {
  window.addEventListener("scroll", function() {
    if (window.scrollY > 50) {
      header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
    } else {
      header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08)";
    }
  });
}

// ===== SCROLL TO TOP BUTTON =====
const topBtn = document.createElement("button");
topBtn.id = "scrollTopBtn";
topBtn.innerHTML = "↑";
topBtn.title = "Go to top";
document.body.appendChild(topBtn);

topBtn.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white;
  border: none;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(37, 99, 235, 0.4);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  z-index: 999;
`;

topBtn.addEventListener("click", function() {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", function() {
  if (window.scrollY > 300) {
    topBtn.style.opacity = "1";
    topBtn.style.visibility = "visible";
  } else {
    topBtn.style.opacity = "0";
    topBtn.style.visibility = "hidden";
  }
});

// ===== CARD FADE-IN ANIMATION =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".card, .section h2, .section > p").forEach(function(el) {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", function() {
  let current = "";
  sections.forEach(function(section) {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(function(link) {
    link.style.color = "";
    link.style.fontWeight = "";
    if (link.getAttribute("href") === "#" + current) {
      link.style.color = "#2563eb";
      link.style.fontWeight = "bold";
    }
  });
});

// ==========================================
// ===== DARK MODE TOGGLE ==================
// ==========================================
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (themeIcon) themeIcon.textContent = "☀️";
  } else {
    if (themeIcon) themeIcon.textContent = "🌙";
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    if (themeIcon) themeIcon.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    if (themeIcon) themeIcon.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}
loadTheme();

// ==========================================
// ===== TOAST NOTIFICATIONS ===============
// ==========================================
const toastContainer = document.createElement("div");
toastContainer.className = "toast-container";
document.body.appendChild(toastContainer);

function showToast(message, type, duration) {
  type = type || "info";
  duration = duration || 3000;

  const icons = { success: "✅", error: "❌", info: "ℹ️" };

  const toast = document.createElement("div");
  toast.className = "toast " + type;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(function() {
    toast.classList.add("hiding");
    setTimeout(function() { toast.remove(); }, 300);
  }, duration);
}

// ==========================================
// ===== SEARCH BAR (Filter Tools) ==========
// ==========================================
const searchInput = document.getElementById("searchInput");
const toolsSection = document.getElementById("tools");
const toolCards = document.querySelectorAll("#tools .card");

let noResultsMsg = null;

if (toolsSection && toolCards.length > 0) {
  noResultsMsg = document.createElement("div");
  noResultsMsg.className = "no-results";
  noResultsMsg.innerHTML = `
    <span class="no-results-icon">🔍</span>
    <p>No tools found matching your search.</p>
  `;
  noResultsMsg.style.display = "none";
  toolsSection.querySelector(".cards").appendChild(noResultsMsg);
}

if (searchInput && toolCards.length > 0) {
  searchInput.addEventListener("input", function() {
    const query = this.value.toLowerCase().trim();
    let visibleCount = 0;

    toolCards.forEach(function(card) {
      const title = card.querySelector("h3").textContent.toLowerCase();
      const desc = card.querySelector("p").textContent.toLowerCase();

      if (title.includes(query) || desc.includes(query)) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (visibleCount === 0 && query !== "") {
      noResultsMsg.style.display = "block";
    } else {
      noResultsMsg.style.display = "none";
    }
  });

  searchInput.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      this.value = "";
      this.dispatchEvent(new Event("input"));
    }
  });
}

// ==========================================
// ===== FAVORITES SYSTEM ==================
// ==========================================
const favButtons = document.querySelectorAll(".fav-btn");
const favoritesLink = document.getElementById("favoritesLink");

let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

function updateFavButton(btn, toolId) {
  if (favorites.includes(toolId)) {
    btn.textContent = "★";
    btn.classList.add("active");
    btn.title = "Remove from favorites";
  } else {
    btn.textContent = "☆";
    btn.classList.remove("active");
    btn.title = "Add to favorites";
  }
}

favButtons.forEach(function(btn) {
  const toolId = btn.dataset.tool;
  updateFavButton(btn, toolId);

  btn.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    const id = this.dataset.tool;

    if (favorites.includes(id)) {
      favorites = favorites.filter(function(f) { return f !== id; });
      showToast("Removed from favorites", "info");
    } else {
      favorites.push(id);
      showToast("Added to favorites! ⭐", "success");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavButton(this, id);
  });
});

let showOnlyFavorites = false;

if (favoritesLink) {
  favoritesLink.addEventListener("click", function(e) {
    e.preventDefault();
    showOnlyFavorites = !showOnlyFavorites;

    if (showOnlyFavorites) {
      this.classList.add("active");
      this.textContent = "⭐ Showing Favorites";

      const toolsSec = document.getElementById("tools");
      if (toolsSec) {
        toolsSec.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      showToast("Showing favorites only", "info");
    } else {
      this.classList.remove("active");
      this.textContent = "⭐ Favorites";
      showToast("Showing all tools", "info");
    }

    filterByFavorites();
  });
}

function filterByFavorites() {
  const cards = document.querySelectorAll("#tools .card");
  let visibleCount = 0;

  cards.forEach(function(card) {
    const toolId = card.dataset.tool;

    if (showOnlyFavorites) {
      if (favorites.includes(toolId)) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    } else {
      card.style.display = "";
      visibleCount++;
    }
  });

  const noResults = document.querySelector(".no-results");
  if (noResults) {
    if (visibleCount === 0 && showOnlyFavorites) {
      noResults.innerHTML = `
        <span class="no-results-icon">⭐</span>
        <p>No favorites yet. Click the star icon on any tool to add it.</p>
      `;
      noResults.style.display = "block";
    } else {
      noResults.style.display = "none";
    }
  }
}

// ==========================================
// ===== RECENTLY USED TOOLS ===============
// ==========================================
function trackToolView(toolId, toolName, toolImage) {
  let recent = JSON.parse(localStorage.getItem("recentTools") || "[]");

  recent = recent.filter(function(t) { return t.id !== toolId; });

  recent.unshift({
    id: toolId,
    name: toolName,
    image: toolImage,
    time: Date.now()
  });

  recent = recent.slice(0, 4);

  localStorage.setItem("recentTools", JSON.stringify(recent));
}

function displayRecentTools() {
  const recentSection = document.getElementById("recent");
  const recentCards = document.getElementById("recentCards");

  if (!recentSection || !recentCards) return;

  const recent = JSON.parse(localStorage.getItem("recentTools") || "[]");

  if (recent.length === 0) {
    recentSection.style.display = "none";
    return;
  }

  recentSection.style.display = "block";
  recentCards.innerHTML = "";

  recent.forEach(function(tool) {
    const card = document.createElement("a");
    card.href = tool.id + ".html";
    card.className = "card";
    card.style.textDecoration = "none";
    card.style.color = "inherit";
    card.innerHTML = `
      <img src="${tool.image}" alt="${tool.name}">
      <h3>${tool.name}</h3>
      <p>Recently used</p>
    `;
    recentCards.appendChild(card);
  });
}

if (document.getElementById("recent")) {
  displayRecentTools();
}

// ==========================================
// ===== MULTI-LANGUAGE (Hindi + English) ===
// ==========================================

let currentLang = localStorage.getItem("lang") || "en";

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);

  document.querySelectorAll("[data-en][data-hi]").forEach(function(el) {
    const text = el.getAttribute("data-" + lang);
    if (text) {
      if (el.hasAttribute("data-html") && el.getAttribute("data-html") === "true") {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    }
  });

  document.querySelectorAll("[data-en-placeholder][data-hi-placeholder]").forEach(function(el) {
    const ph = el.getAttribute("data-" + lang + "-placeholder");
    if (ph) el.placeholder = ph;
  });

  document.querySelectorAll(".lang-btn").forEach(function(btn) {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  document.documentElement.lang = lang;

  const msg = lang === "hi" ? "भाषा बदल गई: हिंदी" : "Language changed: English";
  if (typeof showToast === "function") {
    showToast(msg, "success");
  }
}

function loadLanguage() {
  const saved = localStorage.getItem("lang") || "en";
  if (saved === "hi") {
    setLanguage("hi");
  } else {
    document.querySelectorAll(".lang-btn").forEach(function(btn) {
      btn.classList.toggle("active", btn.dataset.lang === "en");
    });
  }
}

document.querySelectorAll(".lang-btn").forEach(function(btn) {
  btn.addEventListener("click", function() {
    setLanguage(this.dataset.lang);
  });
});

loadLanguage();

// ==========================================
// ===== PRODUCT ORDER VIA INSTAGRAM DM =====
// ==========================================
document.querySelectorAll(".product-card").forEach(function(card) {
  card.addEventListener("click", function() {
    const productName = this.dataset.product || "a product";
    const price = this.dataset.price || "";

    const message =
      "Hi ProToolsHub! 👋\n\n" +
      "I'm interested in buying: " + productName + "\n" +
      "Price listed: " + price + "\n\n" +
      "Please share:\n" +
      "1. Payment details (UPI/PayPal)\n" +
      "2. Delivery time\n" +
      "3. Sample preview (if possible)\n\n" +
      "Thank you! 🙏";

    navigator.clipboard.writeText(message).then(function() {
      showToast("📋 Message copied! Paste in Instagram DM", "success", 5000);
    }).catch(function() {
      console.log("Clipboard error");
    });
  });
});

// ==========================================
// ===== PWA SERVICE WORKER ================
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js')
      .then(function(reg) {
        console.log('✅ Service Worker registered');
      })
      .catch(function(err) {
        console.log('❌ SW registration failed:', err);
      });
  });
}

// ===== PAGE LOAD MESSAGE =====
window.addEventListener("load", function() {
  console.log("%cProToolsHub loaded! 🚀", "color: #2563eb; font-size: 16px; font-weight: bold;");
});