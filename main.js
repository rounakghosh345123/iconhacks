/* ===== CONFIG: edit this block only. Leave "" / [] where info is not yet confirmed. ===== */
const CONFIG = {
  eventName: "IconHacks 2027",
  conferenceUrl: "https://www.iconcise.in/",
  venue: "Asansol Engineering College, Asansol, West Bengal",
  sprintStart: "",               // ISO 8601, e.g. "2027-01-08T12:30:00+05:30". Empty = no countdown.
  registrationUrl: "",           // official application link
  registrationStatus: "pending", // "pending" | "open" | "closed"
  contactEmail: "",
  mentorEmail: "",
  sponsorEmail: "",
  prizes: { approved: false, items: [
    { label: "Winner", amount: "₹20,000" },
    { label: "First runner-up", amount: "₹10,000" },
    { label: "Second runner-up", amount: "₹5,000" } ] },
  mentors: [],  // { name, role, org }
  sponsors: [], // { name, logo }
  socials: []   // { label, url }
};
/* ========================================================================================= */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (t, c, txt) => { const e = document.createElement(t); if (c) e.className = c; if (txt) e.textContent = txt; return e; };
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2200); }

function wireActions() {
  const regOpen = CONFIG.registrationStatus === "open" && CONFIG.registrationUrl;
  const targets = { apply: regOpen ? CONFIG.registrationUrl : null,
    mentor: CONFIG.mentorEmail ? "mailto:" + CONFIG.mentorEmail : null,
    sponsor: CONFIG.sponsorEmail ? "mailto:" + CONFIG.sponsorEmail : null };
  const pending = { apply: "Registration opening soon", mentor: "Mentor enquiries opening soon", sponsor: "Sponsor enquiries opening soon" };
  $$("[data-action]").forEach(a => {
    const k = a.dataset.action, url = targets[k];
    if (url) { a.href = url; if (url.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; } }
    else { a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); a.setAttribute("role", "link");
      if (a.classList.contains("btn")) { a.classList.add("pending"); a.textContent = pending[k].toUpperCase(); } else a.title = pending[k]; }
  });
  const st = $("[data-status]"), led = st.previousElementSibling;
  if (regOpen) { st.textContent = "STATUS: REGISTRATION OPEN"; led.classList.remove("amber"); }
  else if (CONFIG.registrationStatus === "closed") st.textContent = "STATUS: REGISTRATION CLOSED";
}

function render() {
  const pl = $("#prizeList");
  CONFIG.prizes.items.forEach((p, i) => { const d = el("div", "prize" + (i === 0 ? " first" : "")); d.append(el("span", "mono id", p.label.toUpperCase()), el("div", "amt", p.amount)); pl.append(d); });
  if (CONFIG.prizes.approved) $("#prizeNote").textContent = "Team prizes approved by the organizing team.";
  if (CONFIG.mentors.length) {
    $("#mentorStatus").textContent = "MENTOR NETWORK: " + CONFIG.mentors.length + " CONFIRMED";
    CONFIG.mentors.forEach(m => { const d = el("div"); d.append(el("b", "", m.name), el("div", "dim", [m.role, m.org].filter(Boolean).join(", "))); $("#mentorList").append(d); });
  }
  if (CONFIG.sponsors.length) {
    $("#sponsorBox .id").textContent = "CONFIRMED PARTNERS";
    CONFIG.sponsors.forEach(s => { const i = el("img"); i.src = s.logo; i.alt = s.name; i.loading = "lazy"; i.height = 44; $("#sponsorList").append(i); });
  }
  const cb = $("#contactBox");
  if (CONFIG.contactEmail) {
    cb.textContent = ""; const a = el("a", "", CONFIG.contactEmail); a.href = "mailto:" + CONFIG.contactEmail;
    const b = el("button", "btn ghost sm copybtn", "Copy email"); b.type = "button";
    b.addEventListener("click", async () => { try { await navigator.clipboard.writeText(CONFIG.contactEmail); toast("Email copied"); } catch { toast("Copy failed. Select the email manually."); } });
    cb.append(a, el("br"), b);
  }
  $("#yr").textContent = new Date().getFullYear();
}

function countdown() {
  const t = Date.parse(CONFIG.sprintStart); if (!CONFIG.sprintStart || isNaN(t)) return;
  const box = $("#countdown"); box.hidden = false; let id;
  const tick = () => { const d = t - Date.now();
    if (d <= 0) { box.textContent = "SPRINT STARTED"; return clearInterval(id); }
    const s = Math.floor(d / 1e3), p = n => String(n).padStart(2, "0");
    box.textContent = `T-MINUS ${p(Math.floor(s / 86400))}d ${p(Math.floor(s % 86400 / 3600))}h ${p(Math.floor(s % 3600 / 60))}m` + (reduce ? "" : ` ${p(s % 60)}s`); };
  id = setInterval(tick, reduce ? 60000 : 1000); tick();
}

function bootTerminal() {
  const out = $("#termOut"); if (reduce) return;
  try { if (sessionStorage.getItem("booted")) return; sessionStorage.setItem("booted", "1"); } catch {}
  const lines = out.innerHTML.split("\n"); out.innerHTML = ""; let i = 0;
  const next = () => { if (i >= lines.length) return; out.innerHTML = lines.slice(0, ++i).join("\n"); setTimeout(next, 380); };
  next();
}

function mobileMenu() {
  const b = $(".burger"), m = $("#menu");
  const set = o => { m.classList.toggle("open", o); b.setAttribute("aria-expanded", o); };
  b.addEventListener("click", () => set(!m.classList.contains("open")));
  m.addEventListener("click", e => { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && m.classList.contains("open")) { set(false); b.focus(); } });
}

function accordions() {
  $$(".item button").forEach(b => b.addEventListener("click", () => {
    const open = b.getAttribute("aria-expanded") === "true";
    b.setAttribute("aria-expanded", String(!open)); b.closest(".item").querySelector(".ans").hidden = open; }));
}

function reveal() {
  const els = $$(".reveal"); if (!("IntersectionObserver" in window)) return els.forEach(e => e.classList.add("in"));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  els.forEach(e => io.observe(e));
}

function activeNav() {
  const links = $$(".menu a[href^='#']"), map = new Map(links.map(l => [l.getAttribute("href").slice(1), l]));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { links.forEach(l => l.classList.remove("on")); const l = map.get(e.target.id); if (l) l.classList.add("on"); } }), { rootMargin: "-40% 0px -55% 0px" });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

function toTop() {
  const b = $(".totop"); addEventListener("scroll", () => { b.hidden = scrollY < 600; }, { passive: true });
  b.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
}

document.addEventListener("DOMContentLoaded", () => {
  wireActions(); render(); countdown(); mobileMenu(); accordions(); reveal(); activeNav(); toTop(); bootTerminal();
});
