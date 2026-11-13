/* Sutanu Ghosh portfolio: plain JavaScript (no framework). Libraries: GSAP, ScrollTrigger, Lenis, SplitType, particles.js, EmailJS. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var html = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var animate = hasGsap && !reduced;
  var lenis = null;

  if (!hasGsap) html.classList.add("no-gsap");
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Smooth scroll (Lenis) + anchors ---------- */
  if (animate && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9, lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function goTo(id) {
    var el = document.getElementById(id); if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: id === "home" ? 0 : -64, duration: 1.3 });
    else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", "#" + id);
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute("href").slice(1); if (!document.getElementById(id)) return;
    e.preventDefault(); closeDrawer(); goTo(id);
  });

  /* ---------- Theme (light / dark) ---------- */
  var themeBtn = $("#theme-toggle");
  function applyTheme(t, save) {
    var dark = t === "dark";
    html.dataset.theme = dark ? "dark" : "light";
    if (themeBtn) { themeBtn.setAttribute("aria-pressed", String(dark)); themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme"); }
    var m = $('meta[name="theme-color"]'); if (m) m.content = dark ? "#0C1117" : "#F5F6F1";
    if (save) { try { localStorage.setItem("sutanu-theme-v2", html.dataset.theme); } catch (e) {} }
    initParticles();
  }
  if (themeBtn) themeBtn.addEventListener("click", function () { applyTheme(html.dataset.theme === "dark" ? "light" : "dark", true); });

  /* ---------- Particles (particles.js, theme-aware) ---------- */
  function initParticles() {
    var host = $("#hero-particles"); if (!host || reduced || !window.particlesJS) return;
    if (window.pJSDom && window.pJSDom.length) { try { window.pJSDom[0].pJS.fn.vendors.destroypJS(); } catch (e) {} window.pJSDom = []; }
    host.innerHTML = "";
    var dark = html.dataset.theme === "dark";
    var c1 = dark ? "#FFC93C" : "#0A6B67", c2 = dark ? "#5ED3C4" : "#C8472B";
    window.particlesJS("hero-particles", {
      particles: {
        number: { value: window.innerWidth < 700 ? 34 : 70, density: { enable: true, value_area: 900 } },
        color: { value: [c1, c2] },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true, anim: { enable: true, speed: 0.6, opacity_min: 0.15, sync: false } },
        size: { value: 2.4, random: true, anim: { enable: true, speed: 1.2, size_min: 0.6, sync: false } },
        line_linked: { enable: true, distance: 140, color: c1, opacity: dark ? 0.2 : 0.22, width: 1 },
        move: { enable: true, speed: 0.8, direction: "none", random: true, straight: false, out_mode: "out" }
      },
      interactivity: { detect_on: "window", events: { onhover: { enable: fine, mode: "grab" }, onclick: { enable: false, mode: "push" }, resize: true }, modes: { grab: { distance: 170, line_linked: { opacity: 0.4 } }, push: { particles_nb: 3 } } },
      retina_detect: true
    });
  }
  applyTheme(html.dataset.theme === "light" ? "light" : "dark", false);

  /* ---------- Mobile drawer ---------- */
  var toggle = $(".nav__toggle"), drawer = $("#drawer");
  function setDrawer(open) {
    if (!toggle || !drawer) return;
    toggle.setAttribute("aria-expanded", String(open));
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    if (open) { html.style.overflow = "hidden"; if (lenis) lenis.stop(); } else { html.style.overflow = ""; if (lenis) lenis.start(); }
  }
  function closeDrawer() { if (drawer && drawer.classList.contains("is-open")) setDrawer(false); }
  if (toggle) toggle.addEventListener("click", function () { setDrawer(toggle.getAttribute("aria-expanded") !== "true"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

  /* ---------- Active nav, progress, back-to-top ---------- */
  var ids = ["home", "about", "skills", "experience", "projects", "education", "contact"];
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) $$(".nav__links a, .drawer a").forEach(function (a) { var on = a.getAttribute("href") === "#" + en.target.id; a.classList.toggle("is-active", on); if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); }); });
  }, { rootMargin: "-42% 0px -52% 0px" });
  ids.forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  var bar = $(".progress i"), toTop = $(".to-top");
  function onScroll() {
    var h = html, p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    if (bar) bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
    if (toTop) toTop.classList.toggle("is-visible", h.scrollTop > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll); onScroll();

  /* ---------- Experience accordion ---------- */
  $$(".tl__head").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = btn.parentElement.querySelector(".tl__panel"), open = !panel.classList.contains("is-open");
      panel.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", String(open));
      btn.querySelector(".tl__icon").classList.toggle("is-open", open);
      if (hasGsap) setTimeout(function () { ScrollTrigger.refresh(); }, 560);
    });
  });

  /* ---------- Date of birth show / hide ---------- */
  var dobVal = $("#dob-value"), dobBtn = $("#dob-toggle");
  if (dobVal && dobBtn) {
    var shown = window.SUTANU_SHOW_DOB !== false, dob = dobVal.dataset.dob;
    var eye = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
    var eyeOff = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18M10.6 6.1A9.7 9.7 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.7M6.5 7.7A17 17 0 0 0 2 12s4 7 10 7a9.6 9.6 0 0 0 4-.9"/></svg>';
    var renderDob = function () { dobVal.textContent = shown ? dob : "Hidden"; dobBtn.innerHTML = shown ? eyeOff : eye; dobBtn.setAttribute("aria-pressed", String(!shown)); dobBtn.setAttribute("aria-label", shown ? "Hide date of birth" : "Show date of birth"); };
    dobBtn.addEventListener("click", function () { shown = !shown; renderDob(); }); renderDob();
  }

  /* ---------- Project filters + Load more / Show less ---------- */
  var grid = $("#pgrid"), cards = $$(".pcard"), fbtns = $$(".filters button");
  var moreWrap = $("#pmore"), moreBtn = $("#pmore-btn"), moreLabel = $(".pmore__label"), moreCount = $("#pmore-count");
  var currentKey = "all", expanded = false, busy = false;
  var LOAD_MS = reduced ? 250 : 1200; /* short loader before more projects appear */
  function perPage() { return Math.max(4, getComputedStyle(grid).gridTemplateColumns.split(" ").length * 2); } /* 2 rows */
  function render(animateNew) {
    var limit = perPage(), total = 0, shown = 0, fresh = [];
    cards.forEach(function (c) {
      var match = currentKey === "all" || c.dataset.cat === currentKey;
      c.classList.toggle("is-hidden", !match);
      if (!match) { c.classList.remove("is-collapsed"); return; }
      total++;
      var collapse = !expanded && total > limit, was = c.classList.contains("is-collapsed");
      c.classList.toggle("is-collapsed", collapse);
      if (!collapse) { shown++; if (animateNew && was) fresh.push(c); }
    });
    moreWrap.hidden = total <= limit;
    moreLabel.textContent = expanded ? "Show less" : "Load more projects";
    moreBtn.setAttribute("aria-expanded", String(expanded));
    moreCount.textContent = "Showing " + shown + " of " + total + " projects";
    if (animate && fresh.length) gsap.fromTo(fresh, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .55, stagger: .06, ease: "power3.out", clearProps: "transform,opacity" });
    if (hasGsap) ScrollTrigger.refresh();
  }
  fbtns.forEach(function (b) {
    b.addEventListener("click", function () {
      if (busy) return;
      fbtns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      var apply = function () {
        currentKey = b.dataset.filter; expanded = false; render(false);
        var vis = cards.filter(function (c) { return !c.classList.contains("is-hidden") && !c.classList.contains("is-collapsed"); });
        if (animate) gsap.fromTo(vis, { opacity: 0, y: 18, scale: .97 }, { opacity: 1, y: 0, scale: 1, duration: .5, stagger: .05, ease: "power3.out", clearProps: "transform,opacity" });
      };
      var now = cards.filter(function (c) { return !c.classList.contains("is-hidden") && !c.classList.contains("is-collapsed"); });
      if (animate) gsap.to(now, { opacity: 0, y: -10, duration: .18, onComplete: apply }); else apply();
    });
  });
  moreBtn.addEventListener("click", function () {
    if (busy) return;
    if (expanded) { expanded = false; render(false); goTo("projects"); return; } /* Show less: collapse and go back to the top of the section */
    busy = true; moreBtn.disabled = true; moreBtn.classList.add("is-loading"); moreBtn.setAttribute("aria-busy", "true"); moreLabel.textContent = "Loading…";
    setTimeout(function () {
      expanded = true; busy = false; moreBtn.disabled = false; moreBtn.classList.remove("is-loading"); moreBtn.removeAttribute("aria-busy");
      render(true);
    }, LOAD_MS);
  });
  var rsT; window.addEventListener("resize", function () { clearTimeout(rsT); rsT = setTimeout(function () { if (!busy) render(false); }, 200); });
  render(false);

  /* ---------- Card hover: spotlight, mock parallax, cursor label ---------- */
  cards.forEach(function (card) {
    card.setAttribute("data-cursor", "Open");
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--gx", (e.clientX - r.left) + "px"); card.style.setProperty("--gy", (e.clientY - r.top) + "px");
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width - .5) * 2); card.style.setProperty("--my", ((e.clientY - r.top) / r.height - .5) * 2);
    });
    card.addEventListener("pointerleave", function () { card.style.setProperty("--mx", 0); card.style.setProperty("--my", 0); });
  });
  $$(".skill-card").forEach(function (c) { c.addEventListener("pointermove", function (e) { var r = c.getBoundingClientRect(); c.style.setProperty("--x", (e.clientX - r.left) + "px"); c.style.setProperty("--y", (e.clientY - r.top) + "px"); }); });

  /* ---------- Button ripple ---------- */
  $$(".btn").forEach(function (b) {
    b.addEventListener("pointerdown", function (e) {
      if (reduced) return; var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, sp = document.createElement("span");
      sp.className = "ripple"; sp.style.cssText = "width:" + s + "px;height:" + s + "px;left:" + (e.clientX - r.left - s / 2) + "px;top:" + (e.clientY - r.top - s / 2) + "px";
      b.appendChild(sp); setTimeout(function () { sp.remove(); }, 700);
    });
  });

  /* ---------- Custom cursor + magnetic buttons (desktop) ---------- */
  if (animate && fine) {
    html.classList.add("has-cursor");
    var ring = $(".cursor-ring"), dot = $(".cursor-dot"), lab = $(".cursor-ring span");
    var rx = gsap.quickTo(ring, "x", { duration: .45, ease: "power3" }), ry = gsap.quickTo(ring, "y", { duration: .45, ease: "power3" });
    var dx = gsap.quickTo(dot, "x", { duration: .08 }), dy = gsap.quickTo(dot, "y", { duration: .08 });
    window.addEventListener("pointermove", function (e) { rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); }, { passive: true });
    document.addEventListener("pointerover", function (e) {
      var t = e.target.closest("a, button, input, textarea, select, [data-cursor]");
      ring.classList.toggle("is-active", !!t);
      var txt = t && t.dataset.cursor ? t.dataset.cursor : "";
      lab.textContent = txt; ring.classList.toggle("has-label", !!txt);
    });
    $$("[data-magnetic]").forEach(function (el) {
      var xt = gsap.quickTo(el, "x", { duration: .5, ease: "power3" }), yt = gsap.quickTo(el, "y", { duration: .5, ease: "power3" });
      el.addEventListener("pointermove", function (e) { var r = el.getBoundingClientRect(); xt((e.clientX - r.left - r.width / 2) * .22); yt((e.clientY - r.top - r.height / 2) * .3); });
      el.addEventListener("pointerleave", function () { xt(0); yt(0); });
    });
  }

  /* ---------- Counters ---------- */
  function runCounter(el, delay) {
    var to = Number(el.dataset.to), o = { v: 0 }; el.textContent = "0";
    gsap.to(o, { v: to, duration: 1.8, delay: delay || 0, ease: "power3.out", onUpdate: function () { el.textContent = Math.round(o.v); } });
  }

  /* ---------- Hero intro + loader ---------- */
  var loader = $("#loader");
  var heroTl = null;
  function buildHero() {
    if (!animate) return;
    var chars = [];
    $$(".hero__name .line").forEach(function (l) { if (window.SplitType) { chars = chars.concat(new SplitType(l, { types: "chars" }).chars); } });
    var vis = $$(".vis"), copy = $$("[data-hero]");
    gsap.set(copy, { opacity: 0, y: 24 });
    if (chars.length) gsap.set(chars, { yPercent: 118 }); else gsap.set($$(".hero__name .line"), { opacity: 0, y: 40 });
    gsap.set(vis, { opacity: 0, scale: .88, y: 30 });
    heroTl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
    if (chars.length) heroTl.to(chars, { yPercent: 0, duration: 1.1, stagger: .045 }, 0); else heroTl.to($$(".hero__name .line"), { opacity: 1, y: 0, duration: 1 }, 0);
    heroTl.to(copy, { opacity: 1, y: 0, duration: .8, stagger: .1 }, .35)
          .to(vis, { opacity: 1, scale: 1, y: 0, duration: 1.1, stagger: .09, ease: "back.out(1.4)" }, .45)
          .add(function () { $$(".hero .counter").forEach(function (c) { runCounter(c, 0); }); }, .9)
          .add(startTyped, 1.2);

    if (fine) {
      var layers = $$("[data-depth]").map(function (el) { return { el: el, d: Number(el.dataset.depth), x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3" }), y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3" }) }; });
      var blobs = $$(".blob").map(function (el, i) { return { x: gsap.quickTo(el, "x", { duration: 1.8, ease: "power3" }), y: gsap.quickTo(el, "y", { duration: 1.8, ease: "power3" }), k: (i + 1) * 18 }; });
      $("#home").addEventListener("pointermove", function (e) {
        var nx = e.clientX / window.innerWidth - .5, ny = e.clientY / window.innerHeight - .5;
        layers.forEach(function (l) { l.x(nx * l.d * 2); l.y(ny * l.d * 2); });
        blobs.forEach(function (b) { b.x(nx * -b.k); b.y(ny * -b.k); });
      });
    }
    gsap.to(".hero__copy", { yPercent: -6, ease: "none", scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__visual", { yPercent: 8, ease: "none", scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: true } });
  }
  var typedStarted = false;
  function startTyped() {
    if (typedStarted) return; typedStarted = true;
    var el = $("#typed"); if (!el || reduced) return;
    var words = ["Pixel-perfect UI", "Responsive layouts", "Figma and PSD to HTML", "Cross-browser builds", "Clean, semantic code"], w = 0, c = words[0].length, del = true;
    (function tick() {
      var word = words[w]; c += del ? -1 : 1; el.textContent = word.slice(0, c);
      var wait = del ? 35 : 70;
      if (!del && c === word.length) { del = true; wait = 1700; } else if (del && c === 0) { del = false; w = (w + 1) % words.length; wait = 250; }
      setTimeout(tick, wait);
    })();
  }
  function revealPage() { html.classList.remove("is-loading"); if (lenis) lenis.start(); if (hasGsap) ScrollTrigger.refresh(); if (heroTl) heroTl.play(); }

  buildHero();
  if (!animate || !loader) { if (loader) loader.remove(); revealPage(); }
  else {
    html.classList.add("is-loading"); if (lenis) lenis.stop();
    var num = $("#loader-number"), lbar = $("#loader-bar"), panel = $(".loader__panel"), inner = $(".loader__inner"), o = { v: 0 };
    gsap.timeline()
      .to(o, { v: 100, duration: 1.3, ease: "power2.inOut", onUpdate: function () { num.textContent = Math.round(o.v); lbar.style.width = o.v + "%"; } })
      .to(inner, { opacity: 0, y: -16, duration: .3 })
      .fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: .5, ease: "power3.inOut" }, "<")
      .add(revealPage, ">-0.05")
      .to(loader, { yPercent: -100, duration: .85, ease: "power4.inOut", onComplete: function () { loader.remove(); } }, "<");
  }

  /* ---------- Scroll animations ---------- */
  if (animate) {
    // Section headings: words slide up
    $$("[data-split]").forEach(function (el) {
      if (!window.SplitType) return;
      var s = new SplitType(el, { types: "words" });
      gsap.from(s.words, { yPercent: 105, opacity: 0, duration: .9, ease: "power4.out", stagger: .05, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });
    // Eyebrows: line draws in
    $$(".sec-head__eyebrow").forEach(function (el) { gsap.from(el, { opacity: 0, x: -16, duration: .7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }); });
    // Cards and blocks: staggered batch reveal
    var rev = $$("[data-reveal]");
    gsap.set(rev, { opacity: 0, y: 28 });
    ScrollTrigger.batch(rev, { start: "top 91%", once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: .85, stagger: .08, ease: "power3.out", clearProps: "transform,opacity" }); } });
    // About counters, portrait clip reveal + parallax
    $$(".about .counter").forEach(function (c) { c.textContent = "0"; ScrollTrigger.create({ trigger: c, start: "top 92%", once: true, onEnter: function () { runCounter(c, 0); } }); });
    var pt = $(".portrait");
    if (pt) {
      gsap.from(pt, { clipPath: "inset(100% 0 0 0)", duration: 1.3, ease: "power4.inOut", scrollTrigger: { trigger: pt, start: "top 85%", once: true } });
      var inner2 = pt.firstElementChild; if (inner2) gsap.fromTo(inner2, { y: -22 }, { y: 22, ease: "none", scrollTrigger: { trigger: pt, start: "top bottom", end: "bottom top", scrub: true } });
    }
    // Project previews: clip-path wipe
    $$(".pcard:not(.is-collapsed) .mock").forEach(function (m) { gsap.from(m, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "power4.inOut", scrollTrigger: { trigger: m, start: "top 94%", once: true } }); });
    // Timeline progress + dots
    var tl = $(".tl");
    if (tl) {
      gsap.fromTo(".tl__fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: tl, start: "top 70%", end: "bottom 70%", scrub: true } });
      $$(".tl__item").forEach(function (it) { ScrollTrigger.create({ trigger: it, start: "top 70%", onEnter: function () { it.classList.add("is-seen"); }, onLeaveBack: function () { it.classList.remove("is-seen"); } }); });
    }
    // Open-to-opportunity band
    gsap.from(".open__details p", { y: 24, opacity: 0, stagger: .1, duration: .7, ease: "power3.out", scrollTrigger: { trigger: ".open", start: "top 85%", once: true } });
  }

  /* ---------- Contact form (EmailJS) ---------- */
  var form = $("#contact-form"), status = $("#contact-status");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status"; status.textContent = "";
      if (form.website.value) { status.classList.add("is-err"); status.textContent = "Submission blocked."; return; }
      if (!form.reportValidity()) return;
      var cfg = window.SUTANU_EMAILJS || {};
      var bad = function (v) { return !v || /^YOUR_/.test(v); };
      if (!window.emailjs || bad(cfg.PUBLIC_KEY) || bad(cfg.SERVICE_ID) || bad(cfg.TEMPLATE_ID)) {
        status.classList.add("is-err"); status.textContent = "The email service is not configured, so nothing was sent. Please email sutanug100@gmail.com directly."; return;
      }
      form.reply_to.value = form.from_email.value.trim();
      var btn = form.querySelector('button[type="submit"]'), label = btn.querySelector("span");
      btn.disabled = true; label.textContent = "Sending…";
      emailjs.sendForm(cfg.SERVICE_ID, cfg.TEMPLATE_ID, form, { publicKey: cfg.PUBLIC_KEY }).then(function () {
        status.classList.add("is-ok"); status.textContent = "Thank you. Your enquiry has been sent successfully."; form.reset();
      }).catch(function (err) {
        console.error("EmailJS error:", err);
        status.classList.add("is-err"); status.textContent = "Email could not be sent: " + ((err && (err.text || err.message)) || "please try again or email sutanug100@gmail.com directly.");
      }).finally(function () { btn.disabled = false; label.textContent = "Send enquiry"; });
    });
  }
})();
