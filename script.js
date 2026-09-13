// ===== FOOTER YEAR AUTO UPDATE =====
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ===== SMOOTH SCROLL (Menu links par click karne par) =====
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

// ===== CARD PAR CLICK (Hover effect console me) =====
document.querySelectorAll(".card").forEach(function(card) {
  card.addEventListener("click", function() {
    const title = this.querySelector("h3").textContent;
    console.log("Clicked: " + title);
  });
});

// ===== PAGE LOAD HONE PAR MESSAGE =====
window.addEventListener("load", function() {
  console.log("ProToolsHub website load ho gayi!");
});