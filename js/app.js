import { profile, navItems } from "./data/profile.js";
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

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
 }catch(err){console.error("EmailJS error:",err);contactStatus.classList.add("is-err");contactStatus.textContent=`Email could not be sent: ${err?.text || err?.message || "Please try again or email sutanug100@gmail.com directly."}`;}
 finally{btn.disabled=false;btn.querySelector("span").textContent="Send enquiry";}
});
