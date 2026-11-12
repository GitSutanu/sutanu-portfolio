import { profile, navItems, enquiryTypes } from "./data/profile.js";
import { skillGroups, domains } from "./data/skills.js";
import { experience } from "./data/experience.js";
import { projectGroups } from "./data/projects.js";
import { education, certifications } from "./data/education.js";

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const esc = (v="") => String(v).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const asset = (p) => `./assets/${p}`;
const icon = (name) => {
  const paths = {
    download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    arrow:'<path d="M5 12h14M12 5l7 7-7 7"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.8a2 2 0 0 1-.6 1.7L7.1 10a16 16 0 0 0 6 6l1.8-1.9a2 2 0 0 1 1.7-.6l2.8.5a2 2 0 0 1 1.6 2z"/>',
    linkedin:'<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    ext:'<path d="M14 3h7v7M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    plus:'<path d="M12 5v14M5 12h14"/>'
  };
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.arrow}</svg>`;
};

function heading(id,title,note="") {
  return `<header class="sec-head"><h2 id="${id}">${title}</h2>${note?`<p class="sec-head__note">${note}</p>`:""}</header>`;
}
function projectMock(p) {
  const m=p.mock||{}, a=m.a||"#F5B800", b=m.b||"#0F5C5C";
  let body = `<div class="m-nav"><i class="m-dot"></i><i class="m-line"></i><i class="m-line"></i><i class="m-pill"></i></div><div class="m-hero" style="background:${a}"><i class="m-line"></i><i class="m-line" style="width:55%"></i></div><div class="m-row"><i class="m-card"></i><i class="m-card"></i><i class="m-card"></i></div>`;
  if(m.variant==="dashboard") body=`<div class="m-dash"><div class="m-side"><i></i><i></i><i></i></div><div class="m-main"><div class="m-row"><i class="m-card"></i><i class="m-card"></i><i class="m-card"></i></div><div class="m-bars">${[40,70,52,88,60,76,45].map(h=>`<i style="height:${h}%"></i>`).join("")}</div></div></div>`;
  if(m.variant==="store") body=`<div class="m-nav"><i class="m-dot"></i><i class="m-line"></i><i class="m-pill"></i></div><div class="m-grid">${Array.from({length:6},()=>'<i class="m-prod"></i>').join("")}</div>`;
  return `<div class="mock" style="--a:${a};--b:${b}"><div class="mock__bar"><i></i><i></i><i></i><span>${esc(new URL(p.url).host)}</span></div><div class="mock__body"><div class="mock__layer">${body}</div></div></div>`;
}
function projectCard(p) {
  const host = new URL(p.url).host;
  return `<article class="pcard" style="--span:${p.span||2}">
    <a class="pcard__preview" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">${projectMock(p)}</a>
    <div class="pcard__body"><p class="pcard__cat">${esc(p.category)}</p><h4>${esc(p.name)}</h4>
    <p class="pcard__desc">${esc(p.description)}</p><dl class="pcard__meta"><div><dt>My role</dt><dd>${esc(p.role)}</dd></div>
    ${p.platform?`<div><dt>Platform</dt><dd>${esc(p.platform)} (separate from my front-end work)</dd></div>`:""}</dl>
    <ul class="pcard__tech">${p.tech.map(t=>`<li>${esc(t)}</li>`).join("")}</ul>
    <a class="pcard__link" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer"><span>${esc(host)}</span>${icon("ext")}</a></div></article>`;
}
function render() {
  $("#desktop-nav").innerHTML=navItems.map(n=>`<li><a href="#${n.id}">${n.label}</a></li>`).join("");
  $("#mobile-nav").innerHTML=navItems.map((n,i)=>`<li style="--i:${i}"><a href="#${n.id}">${n.label}</a></li>`).join("");
  $("#app").innerHTML=`
  <section id="home" class="hero" aria-label="Introduction">
    <div id="hero-particles" class="hero__particles" aria-hidden="true"></div>
    <div class="hero__stage" aria-hidden="true"><div class="hero__disc"></div><span class="shape shape--ring"></span><span class="shape shape--square"></span><span class="shape shape--dot"></span></div>
    <div class="wrap hero__inner">
      <h1 class="hero__name" aria-label="${profile.name}"><span class="line">SUTANU</span><span class="line">GHOSH</span></h1>
      <p class="hero__role">FRONT-END DEVELOPER</p>
      <p class="hero__quote">“${esc(profile.tagline)}”</p><p class="hero__intro">${esc(profile.intro)}</p>
      <div class="hero__actions"><a class="btn btn--solid" href="${asset(profile.cv.pdf)}" download="Sutanu_Ghosh_Resume.pdf">${icon("download")}<span>Download My CV</span></a><a class="btn btn--ghost" href="#projects"><span>View My Work</span>${icon("arrow")}</a><a class="btn btn--ghost" href="${profile.linkedin}" target="_blank" rel="noopener noreferrer">${icon("linkedin")}<span>LinkedIn Profile</span></a></div>
    </div>
    <svg class="hero__badge" viewBox="0 0 160 160" aria-hidden="true"><defs><path id="badge-circle" d="M80 80 m-62 0 a62 62 0 1 1 124 0 a62 62 0 1 1 -124 0"/></defs><text><textPath href="#badge-circle">7+ years of experience / 300+ web projects delivered / </textPath></text><circle cx="80" cy="80" r="26" class="badge__core"/><path d="M80 68v24M70 83l10 10 10-10" class="badge__arrow"/></svg>
    <a class="hero__scroll" href="#about"><span class="hero__scroll-line"></span><span>Scroll</span></a>
  </section>
  <div class="marquee"><div class="marquee__track"><ul class="marquee__set">${[...domains,"Responsive web design","Figma and PSD to HTML"].map(t=>`<li>${esc(t)}</li>`).join("")}</ul><ul class="marquee__set" aria-hidden="true">${[...domains,"Responsive web design","Figma and PSD to HTML"].map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div></div>
  <section id="about" class="section about"><div class="wrap about__grid">
    <div class="about__media"><div class="portrait"><img src="${asset("images/profile.jpg")}" alt="Portrait of Sutanu Ghosh" onerror="this.parentElement.innerHTML='<div class=&quot;portrait__mono&quot; role=&quot;img&quot; aria-label=&quot;Monogram SG&quot;>SG</div>'"></div><p class="about__tag">${esc(profile.currentCompany)}<br><strong>${esc(profile.currentRole)}</strong></p></div>
    <div class="about__body"><h2 id="about-title" class="sr-only">About me</h2><p class="about__lead">I turn Figma and PSD designs into responsive interfaces that hold up in every browser.</p><p class="about__summary">${esc(profile.summary)}</p>
    <dl class="about__stats"><div><dt>Years of experience</dt><dd><span class="counter" data-to="${profile.years}">0</span>+</dd></div><div><dt>Web projects delivered</dt><dd><span class="counter" data-to="${profile.projects}">0</span>+</dd></div></dl>
    <dl class="about__facts"><div><dt>Current role</dt><dd>${esc(profile.currentRole)}, ${esc(profile.currentCompany)}</dd></div><div><dt>Location</dt><dd>${esc(profile.location)}</dd></div><div><dt>Technical focus</dt><dd>${esc(profile.focus)}</dd></div><div class="about__dob"><dt>Date of birth</dt><dd><span id="dob-value">${window.SUTANU_SHOW_DOB?profile.dob:"Hidden"}</span><button type="button" id="dob-toggle" aria-label="Toggle date of birth">◉</button></dd></div></dl></div>
  </div></section>
  <section id="skills" class="section"><div class="wrap">${heading("skills-title","Tools I work with every day","Listed exactly as they appear on my resume, with the level where it applies.")}<div class="skills">
    ${skillGroups.map((g,i)=>`<article class="skill-card skill-card--${i+1}"><h3>${esc(g.title)}</h3>${g.blurb?`<p class="skill-card__blurb">${esc(g.blurb)}</p>`:""}<ul>${g.items.map(s=>`<li><span>${esc(s.name)}</span>${s.note?`<em>${esc(s.note)}</em>`:""}</li>`).join("")}</ul></article>`).join("")}
  </div><p class="skills__domain"><strong>Domain experience:</strong> ${domains.map(esc).join(", ")}.</p></div></section>
  <section id="experience" class="section section--tint"><div class="wrap">${heading("exp-title","Where I have worked","Five roles since 2016. Open any one for the details.")}<ol class="tl"><span class="tl__line"><i class="tl__fill"></i></span>
    ${experience.map((job,i)=>`<li class="tl__item"><span class="tl__dot"></span><p class="tl__period">${esc(job.period)}${job.current?'<b>Current</b>':""}</p><div class="tl__card"><button type="button" class="tl__head" aria-expanded="${i===0}" aria-controls="job-${i}"><span><strong>${esc(job.role)}</strong><span class="tl__co">${esc(job.company)}, ${esc(job.place)}</span></span><span class="tl__icon ${i===0?"is-open":""}">${icon("plus")}</span></button><div id="job-${i}" class="tl__panel ${i===0?"is-open":""}"><div class="tl__panel-inner"><ul>${job.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div></div></div></li>`).join("")}
  </ol></div></section>
  <section id="projects" class="section"><div class="wrap">${heading("proj-title","Selected projects","Every link opens the live website. Previews are abstract mockups, not screenshots.")}${projectGroups.map(g=>`<div class="pgroup"><div class="pgroup__head"><h3>${esc(g.title)}</h3><p>${esc(g.note)}</p></div><div class="pgrid">${g.items.map(projectCard).join("")}</div></div>`).join("")}</div></section>
  <section id="education" class="section section--tint"><div class="wrap">${heading("edu-title","Education and certifications","Exactly as stated on my resume.")}<div class="edu"><div class="edu__list"><h3>Education</h3><ul>${education.map(e=>`<li><strong>${esc(e.school)}</strong><span>${esc(e.detail)}</span><em>${esc(e.status)}</em></li>`).join("")}</ul></div><div class="edu__certs"><h3>Certifications and coursework</h3><ul>${certifications.map(c=>`<li>${esc(c)}</li>`).join("")}</ul></div></div></div></section>
  <section id="contact" class="section"><div class="wrap contact"><div class="contact__info">${heading("contact-title","Let's talk about the role")}<p class="contact__lede">For recruiters, HR teams and hiring managers. I usually reply within one working day.</p><ul class="contact__list"><li>${icon("mail")}<a href="mailto:${profile.email}">${profile.email}</a></li><li>${icon("phone")}<a href="${profile.phoneHref}">${profile.phone}</a></li><li>${icon("linkedin")}<a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer">linkedin.com/in/sutanu-ghosh-b594991b7</a></li><li>${icon("pin")}<span>${esc(profile.location)}</span></li></ul><div class="contact__cv"><a class="btn btn--solid" href="${asset(profile.cv.pdf)}" download="Sutanu_Ghosh_Resume.pdf">${icon("download")}<span>Download CV (PDF)</span></a><a class="contact__pdf" href="${asset(profile.cv.file)}" download="Sutanu_Ghosh_Resume.docx">Word version</a></div></div>
  <form class="form" id="contact-form" aria-label="Professional enquiry form"><input type="hidden" name="reply_to"><div class="hp" aria-hidden="true"><label>Leave empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
    <div class="form__row"><label>Full name<input name="from_name" type="text" required minlength="2" maxlength="100" autocomplete="name"></label><label>Email address<input name="from_email" type="email" required maxlength="254" autocomplete="email"></label></div>
    <div class="form__row"><label>Company name <small>(optional)</small><input name="company" type="text" maxlength="100" autocomplete="organization"></label><label>Enquiry type<select name="enquiry_type" required><option value="" disabled selected>Select one</option>${enquiryTypes.map(t=>`<option>${esc(t)}</option>`).join("")}</select></label></div>
    <label>Subject<input name="subject" type="text" required minlength="3" maxlength="150"></label><label>Message<textarea name="message" rows="5" required minlength="10" maxlength="3000"></textarea></label>
    <button class="btn btn--solid form__submit" type="submit"><span>Send enquiry</span>${icon("arrow")}</button><p class="form-status" id="contact-status" role="status" aria-live="polite"></p>
  </form></div></section>
  <section id="stay-connected" class="section news"><div class="wrap news__grid"><div><h2 id="news-title">Stay Connected</h2><p>Occasional professional updates, development insights and new project highlights.</p></div>
  <form id="newsletter-form" aria-label="Newsletter subscription" method="POST" target="newsletter-response"><iframe name="newsletter-response" class="sr-only" title="Newsletter response"></iframe><input type="hidden" name="formType" value="newsletter"><input type="hidden" name="rid"><input type="hidden" name="fillMs"><div class="hp" aria-hidden="true"><label>Leave empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
  <div class="news__row"><label class="sr-only" for="news-email">Email address</label><input id="news-email" name="email" type="email" required maxlength="254" placeholder="you@company.com" autocomplete="email"><button class="btn btn--solid" type="submit"><span>Subscribe</span>${icon("arrow")}</button></div>
  <label class="news__consent"><input type="checkbox" name="consent" value="yes" required><span>I agree to receive occasional professional updates by email. No automated marketing, and I can ask to be removed at any time.</span></label><p class="form-status" id="newsletter-status" role="status" aria-live="polite"></p></form></div></section>
  <footer class="footer"><div class="wrap footer__in"><p>© ${new Date().getFullYear()} ${esc(profile.name)}. Designed and built by me.</p><nav aria-label="Footer">${navItems.map(n=>`<a href="#${n.id}">${n.label}</a>`).join("")}</nav></div></footer>`;
}
render();

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gsap = window.gsap;
let lenis = null;
if (!prefersReduced && window.Lenis) {
  lenis = new window.Lenis({
    duration: 1.18,
    smoothWheel: true,
    wheelMultiplier: 0.88,
    touchMultiplier: 1.12,
    lerp: 0.085,
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothTouch: false,
    normalizeWheel: true
  });
  if (gsap && window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
    lenis.on("scroll", window.ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}
if (gsap && window.ScrollTrigger) {
  gsap.registerPlugin(window.ScrollTrigger);
  window.addEventListener("load", () => window.ScrollTrigger.refresh(), { once: true });
}
function initMotion(){
  if (prefersReduced) { $("#loader")?.remove(); return; }
  const loaderNum=$("#loader-number"), loader=$("#loader");
  if (gsap && loader) {
    const obj={v:0};
    gsap.to(obj,{v:100,duration:1.15,ease:"power2.inOut",onUpdate:()=>loaderNum.textContent=Math.round(obj.v),onComplete:()=>gsap.to(loader,{yPercent:-100,duration:.8,ease:"power4.inOut",onComplete:()=>loader.remove()})});
  } else setTimeout(()=>loader?.remove(),900);

  if (gsap) {
    const splitTargets=$$(".hero__name .line");
    splitTargets.forEach(el=>{ if(window.SplitType){const split=new window.SplitType(el,{types:"chars"});gsap.from(split.chars,{yPercent:115,duration:1.05,stagger:.035,ease:"power4.out",delay:.35});} else gsap.from(el,{y:80,opacity:0,duration:1,delay:.3});});
    gsap.from([".hero__role",".hero__quote",".hero__intro",".hero__actions"],{y:22,opacity:0,duration:.8,stagger:.12,delay:.7,ease:"power3.out"});
    gsap.from(".hero__disc",{scale:.72,opacity:0,duration:1.3,ease:"power3.out"});
    $$(".sec-head h2,.skill-card,.tl__item,.pcard,.edu > div,.contact__info,.form").forEach((el,i)=>{
      gsap.from(el,{y:32,opacity:0,duration:.8,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%",once:true},delay:0});
    });
    gsap.fromTo(".tl__fill",{scaleY:0},{scaleY:1,ease:"none",scrollTrigger:{trigger:".tl",start:"top 65%",end:"bottom 65%",scrub:true}});
    $$(".counter").forEach(el=>{
      const target=Number(el.dataset.to); const obj={v:0};
      gsap.to(obj,{v:target,duration:1.7,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 90%",once:true},onUpdate:()=>el.textContent=Math.round(obj.v)});
    });
    if(window.matchMedia("(hover:hover) and (pointer:fine)").matches){
      window.addEventListener("pointermove",e=>{
        const nx=e.clientX/innerWidth-.5, ny=e.clientY/innerHeight-.5;
        gsap.to(".hero__disc",{x:nx*-32,y:ny*-24,duration:1.1,overwrite:true});
        $$(".shape").forEach((s,i)=>gsap.to(s,{x:nx*(i+1)*12,y:ny*(i+1)*12,duration:1,overwrite:true}));
      },{passive:true});
    }
  } else {
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");io.unobserve(e.target)}}),{threshold:.12});
    $$(".sec-head h2,.skill-card,.tl__item,.pcard,.edu > div").forEach(e=>io.observe(e));
  }
}
initMotion();

// Scroll progress
const progress=$(".progress i");
function updateProgress(){const h=document.documentElement;const p=h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight);if(progress)progress.style.transform=`scaleX(${Math.min(1,Math.max(0,p))})`;}
window.addEventListener("scroll",updateProgress,{passive:true});window.addEventListener("resize",updateProgress);updateProgress();

// Smooth anchor scrolling
document.addEventListener("click",e=>{
  const a=e.target.closest('a[href^="#"]'); if(!a)return;
  const id=a.getAttribute("href").slice(1), target=document.getElementById(id); if(!target)return;
  e.preventDefault(); if(lenis) lenis.scrollTo(target,{offset:id==="home"?0:-70,duration:1.25}); else target.scrollIntoView({behavior:prefersReduced?"auto":"smooth",block:"start"}); history.replaceState(null,"",`#${id}`);
});

// Active navigation
const sections=navItems.map(n=>document.getElementById(n.id)).filter(Boolean);
const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){$$(".nav__links a").forEach(a=>a.classList.toggle("is-active",a.getAttribute("href")==="#"+entry.target.id));}
}),{rootMargin:"-42% 0px -50% 0px"});
sections.forEach(s=>navObserver.observe(s));

// Mobile menu
const toggle=$(".nav__toggle"), drawer=$("#drawer");
toggle?.addEventListener("click",()=>{const open=toggle.getAttribute("aria-expanded")!=="true";toggle.setAttribute("aria-expanded",String(open));drawer.classList.toggle("is-open",open);drawer.setAttribute("aria-hidden",String(!open));document.body.style.overflow=open?"hidden":"";if(lenis){open?lenis.stop():lenis.start();}toggle.querySelector(".menu-icon").textContent=open?"×":"☰";});
drawer?.addEventListener("click",e=>{if(e.target.closest("a")){drawer.classList.remove("is-open");drawer.setAttribute("aria-hidden","true");toggle.setAttribute("aria-expanded","false");document.body.style.overflow="";if(lenis)lenis.start();toggle.querySelector(".menu-icon").textContent="☰";}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&drawer?.classList.contains("is-open")){drawer.classList.remove("is-open");drawer.setAttribute("aria-hidden","true");toggle.setAttribute("aria-expanded","false");document.body.style.overflow="";if(lenis)lenis.start();toggle.querySelector(".menu-icon").textContent="☰";}});

// Experience accordion
$$(".tl__head").forEach(btn=>btn.addEventListener("click",()=>{const panel=btn.parentElement.querySelector(".tl__panel");const open=!panel.classList.contains("is-open");panel.classList.toggle("is-open",open);btn.setAttribute("aria-expanded",String(open));btn.querySelector(".tl__icon").classList.toggle("is-open",open);}));

// DOB visibility control
$("#dob-toggle")?.addEventListener("click",()=>{const el=$("#dob-value");const shown=el.textContent!=="Hidden";el.textContent=shown?"Hidden":profile.dob;});

// Hover spotlights and project tilt
$$(".skill-card").forEach(card=>card.addEventListener("pointermove",e=>{const r=card.getBoundingClientRect();card.style.setProperty("--x",`${e.clientX-r.left}px`);card.style.setProperty("--y",`${e.clientY-r.top}px`);}));
$$(".pcard").forEach(card=>{card.addEventListener("pointermove",e=>{const r=card.getBoundingClientRect();card.style.setProperty("--mx",((e.clientX-r.left)/r.width-.5)*2);card.style.setProperty("--my",((e.clientY-r.top)/r.height-.5)*2);});card.addEventListener("pointerleave",()=>{card.style.setProperty("--mx",0);card.style.setProperty("--my",0);});});

// Custom cursor
if(window.matchMedia("(hover:hover) and (pointer:fine)").matches&&!prefersReduced){
  document.documentElement.classList.add("has-cursor");
  const ring=$(".cursor-ring"),dot=$(".cursor-dot"),label=$(".cursor-ring span");let x=0,y=0,rx=0,ry=0;
  window.addEventListener("pointermove",e=>{x=e.clientX;y=e.clientY;dot.style.transform=`translate(${x}px,${y}px)`;},{passive:true});
  const animate=()=>{rx+=(x-rx)*.18;ry+=(y-ry)*.18;ring.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(animate);};animate();
  document.addEventListener("pointerover",e=>{const t=e.target.closest("a,button,input,textarea,select");ring.classList.toggle("is-active",!!t);});
}

// Hero particles — particles.js with theme-aware colours and responsive density
function initHeroParticles() {
  const host = $("#hero-particles");
  if (!host || prefersReduced || !window.particlesJS) return;
  if (window.pJSDom?.length) {
    try { window.pJSDom[0].pJS.fn.vendors.destroypJS(); } catch (e) {}
    window.pJSDom = [];
  }
  host.innerHTML = "";
  const dark = document.documentElement.dataset.theme === "dark";
  const particleColor = dark ? "#F5C451" : "#0F5C5C";
  const lineColor = dark ? "#E9B94B" : "#0F5C5C";
  window.particlesJS("hero-particles", {
    particles: {
      number: { value: window.innerWidth < 600 ? 38 : 76, density: { enable: true, value_area: 900 } },
      color: { value: particleColor },
      shape: { type: ["circle", "edge"], stroke: { width: 0, color: particleColor } },
      opacity: { value: 0.42, random: true, anim: { enable: true, speed: 0.65, opacity_min: 0.12, sync: false } },
      size: { value: 2.2, random: true, anim: { enable: true, speed: 1.4, size_min: 0.5, sync: false } },
      line_linked: { enable: true, distance: 142, color: lineColor, opacity: dark ? 0.18 : 0.16, width: 1 },
      move: { enable: true, speed: 0.85, direction: "none", random: true, straight: false, out_mode: "out", bounce: false, attract: { enable: true, rotateX: 700, rotateY: 1200 } }
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
      modes: { grab: { distance: 175, line_linked: { opacity: 0.34 } }, push: { particles_nb: 3 } }
    },
    retina_detect: true
  });
}
initHeroParticles();

// Light / dark theme switch — persists across visits
const themeToggle = $("#theme-toggle");
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  themeToggle?.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  const themeMeta = $('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = isDark ? "#111820" : "#EDEEEA";
  try { localStorage.setItem("sutanu-theme", isDark ? "dark" : "light"); } catch (e) {}
  initHeroParticles();
}
applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
themeToggle?.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

// EmailJS contact form
const contactForm=$("#contact-form"), contactStatus=$("#contact-status");
contactForm?.addEventListener("submit",async e=>{
 e.preventDefault();contactStatus.className="form-status";contactStatus.textContent="";
 if(contactForm.website.value){return;}
 if(!contactForm.reportValidity())return;
 const cfg=window.SUTANU_EMAILJS||{};
 if(!window.emailjs||cfg.PUBLIC_KEY.startsWith("YOUR_")||cfg.SERVICE_ID.startsWith("YOUR_")||cfg.TEMPLATE_ID.startsWith("YOUR_")){
   contactStatus.classList.add("is-err");contactStatus.textContent="EmailJS is not configured yet. Please use the direct email link: sutanug100@gmail.com";return;
 }
 contactForm.reply_to.value=contactForm.from_email.value.trim();
 const btn=contactForm.querySelector('button[type="submit"]');btn.disabled=true;btn.querySelector("span").textContent="Sending…";
 try{
   await emailjs.sendForm(cfg.SERVICE_ID,cfg.TEMPLATE_ID,contactForm,{publicKey:cfg.PUBLIC_KEY});
   contactStatus.classList.add("is-ok");contactStatus.textContent="Thank you. Your enquiry has been sent successfully.";contactForm.reset();
 }catch(err){console.error("EmailJS error:",err);contactStatus.classList.add("is-err");contactStatus.textContent="Sorry, your message could not be sent. Please email sutanug100@gmail.com directly.";}
 finally{btn.disabled=false;btn.querySelector("span").textContent="Send enquiry";}
});

// Newsletter remains on the free Google Apps Script + Sheets backend
const newsletterForm=$("#newsletter-form"), newsletterStatus=$("#newsletter-status");
const newsletterUrl=window.SUTANU_NEWSLETTER?.APPS_SCRIPT_URL||"";
const newsletterLoadedAt=Date.now();let newsletterRid="";
newsletterForm?.addEventListener("submit",e=>{
 if(!newsletterUrl.startsWith("https://script.google.com/macros/s/")){e.preventDefault();newsletterStatus.classList.add("is-err");newsletterStatus.textContent="Newsletter is not connected yet. Please configure the Google Apps Script URL.";return;}
 if(!newsletterForm.reportValidity()){e.preventDefault();return;}
 newsletterRid=crypto.randomUUID();newsletterForm.rid.value=newsletterRid;newsletterForm.fillMs.value=String(Date.now()-newsletterLoadedAt);newsletterForm.action=newsletterUrl;
 const btn=newsletterForm.querySelector('button[type="submit"]');btn.disabled=true;btn.querySelector("span").textContent="Submitting…";
 newsletterStatus.className="form-status";newsletterStatus.textContent="Submitting your subscription…";
 setTimeout(()=>{if(newsletterRid){newsletterRid="";btn.disabled=false;btn.querySelector("span").textContent="Subscribe";newsletterStatus.classList.add("is-err");newsletterStatus.textContent="No server confirmation received. Please try again later."; }},25000);
});
window.addEventListener("message",ev=>{
 if(!/^https:\/\/([a-z0-9-]+\.)*(googleusercontent|google)\.com$/i.test(ev.origin))return;
 const d=ev.data;if(!d||d.source!=="sg-portfolio"||!newsletterRid||d.rid!==newsletterRid)return;
 newsletterRid="";const btn=newsletterForm.querySelector('button[type="submit"]');btn.disabled=false;btn.querySelector("span").textContent="Subscribe";
 newsletterStatus.className="form-status "+(d.ok?"is-ok":"is-err");newsletterStatus.textContent=String(d.message||"");
 if(d.ok)newsletterForm.reset();
});
