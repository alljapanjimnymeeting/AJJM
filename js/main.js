/* ==========================================================================
   ALL JAPAN JIMNY MEETING — main.js
   ========================================================================== */
(() => {
  "use strict";

  /* ------------------------------ language toggle ------------------------------ */
  const langToggle = document.getElementById("lang-toggle");
  if (langToggle){
    const STORAGE_KEY = "ajjm-lang";
    const translatable = document.querySelectorAll("[data-en]");

    function applyLang(lang){
      translatable.forEach(el => {
        if (lang === "en"){
          if (el.dataset.ja === undefined) el.dataset.ja = el.innerHTML;
          el.innerHTML = el.dataset.en;
        } else if (el.dataset.ja !== undefined){
          el.innerHTML = el.dataset.ja;
        }
      });
      langToggle.textContent = lang === "en" ? "日本語" : "EN";
      document.documentElement.lang = lang;
    }

    const saved = localStorage.getItem(STORAGE_KEY) || "ja";
    applyLang(saved);

    langToggle.addEventListener("click", () => {
      const next = document.documentElement.lang === "en" ? "ja" : "en";
      applyLang(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }

  /* ------------------------------ header scroll state ------------------------------ */
  const header = document.getElementById("site-header");
  if (header){
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------ mobile nav ------------------------------ */
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");

  if (navToggle && siteNav){
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    siteNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------ reveal on scroll ------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in-view"));
  }

  /* ------------------------------ hero countdown ------------------------------ */
  // Counts days in Japan time; shows "本日開催中" on event days and hides after.
  const countdown = document.getElementById("hero-countdown");
  if (countdown){
    const DAY = 86400000;
    const toDay = (ymd) => { const [y, m, d] = ymd.split("-").map(Number); return Date.UTC(y, m - 1, d) / DAY; };
    const today = Math.floor((Date.now() + 9 * 3600000) / DAY);
    const toStart = toDay(countdown.dataset.start) - today;
    const toEnd = toDay(countdown.dataset.end) - today;
    if (toStart > 0){
      document.getElementById("cd-num").textContent = toStart;
      countdown.hidden = false;
    } else if (toEnd >= 0){
      countdown.querySelector(".cd-before").hidden = true;
      countdown.querySelector(".cd-live").hidden = false;
      countdown.hidden = false;
    }
  }

  /* ------------------------------ footer year ------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
