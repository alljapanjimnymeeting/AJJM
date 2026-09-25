/* ==========================================================================
   ALL JAPAN JIMNY MEETING — analytics.js
   GA4 の読み込みとクリック計測。GA4_ID に測定ID(G-XXXXXXXXXX)を入れるだけで有効になる。
   空のままなら何もしない。
   ========================================================================== */
(() => {
  "use strict";

  const GA4_ID = "";  // 例: "G-XXXXXXXXXX"(GA4 → 管理 → データストリーム → ウェブ)

  // ローカル確認(file:// や localhost)では計測しない
  const isLocal = location.protocol === "file:" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  if (!GA4_ID || isLocal) return;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4_ID);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID);

  /* ------------------------------ click tracking ------------------------------ */
  // Instagram への移動 = 参加・出店の問い合わせ(DM)の入口なので click_instagram で数える
  // GA4 で click_instagram をキーイベントにすると「問い合わせ数」として見られる
  // その他の外部リンクは GA4 の拡張計測(click イベント)が自動で取る
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || !/instagram\.com/.test(a.href)) return;
    const section = a.closest("section[id]");
    const where = (location.pathname.split("/").pop() || "index.html") + (section ? "#" + section.id : "");
    window.gtag("event", "click_instagram", { link_url: a.href, link_location: where });
  });
})();
