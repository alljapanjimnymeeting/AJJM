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

  /* ------------------------------ field guide tabs ------------------------------ */
  const fgTabs = document.querySelectorAll(".fg-tab");
  const fgBlocks = document.querySelectorAll(".fg-block");
  const fgPanels = document.querySelectorAll(".fg-panel");

  function setZone(zone){
    fgTabs.forEach(el => {
      const active = el.dataset.zone === zone;
      el.classList.toggle("is-active", active);
      el.setAttribute("aria-pressed", String(active));
    });
    fgBlocks.forEach(el => el.classList.toggle("is-active", el.dataset.zone === zone));
    fgPanels.forEach(el => el.classList.toggle("is-active", el.dataset.zone === zone));
  }

  fgTabs.forEach(tab => {
    tab.addEventListener("click", () => setZone(tab.dataset.zone));
    tab.addEventListener("mouseenter", () => setZone(tab.dataset.zone));
  });

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

  /* ------------------------------ footer year ------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------ visitor counter ------------------------------ */
  const counterValue = document.getElementById("counter-value");
  function renderCounter(text){
    counterValue.innerHTML = text.split("").map((ch, i) =>
      `<span class="${i % 2 === 0 ? "digit-a" : "digit-b"}">${ch}</span>`
    ).join("");
  }
  if (counterValue){
    fetch("https://abacus.jasoncameron.dev/hit/alljapanjimnymeeting-ajjm/visits")
      .then(res => res.json())
      .then(data => {
        renderCounter(String(data.value).padStart(6, "0"));
      })
      .catch(() => {
        renderCounter("------");
      });
  }

})();
