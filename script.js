// ---------- Theme toggle ----------
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function currentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
root.dataset.theme = currentTheme();

themeToggle.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Mobile menu ----------
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    burger.setAttribute("aria-expanded", false);
  })
);

// ---------- Nav border + active link on scroll ----------
const nav = document.querySelector(".nav");
const sections = [...document.querySelectorAll("main section[id]")];
const links = [...navLinks.querySelectorAll("a")];

function onScroll() {
  nav.classList.toggle("is-scrolled", scrollY > 8);
  let current = "";
  for (const s of sections) {
    if (scrollY >= s.offsetTop - 120) current = s.id;
  }
  links.forEach((l) => l.classList.toggle("is-active", l.hash === "#" + current));
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Typing effect ----------
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const typed = document.getElementById("typed");
const words = ["growth decisions", "clear dashboards", "useful tools", "better campaigns"];

if (!reduceMotion) {
  let w = 0, i = words[0].length, deleting = true;
  setTimeout(function tick() {
    const word = words[w];
    i += deleting ? -1 : 1;
    typed.textContent = word.slice(0, i);
    let delay = deleting ? 45 : 85;
    if (!deleting && i === word.length) { deleting = true; delay = 1800; }
    else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
    setTimeout(tick, delay);
  }, 2000);
}

// ---------- Reveal on scroll + stat counters ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

document.querySelectorAll("[data-count]").forEach((el) => {
  const target = +el.dataset.count;
  if (reduceMotion) { el.textContent = target; return; }
  const start = performance.now();
  const dur = 1200;
  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(start);
});

// ---------- Project filter ----------
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");

filters.forEach((btn) =>
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.toggle("is-active", b === btn));
    const f = btn.dataset.filter;
    projects.forEach((p) =>
      p.classList.toggle("is-hidden", f !== "all" && p.dataset.cat !== f)
    );
  })
);

// ---------- Contact form (opens email client) ----------
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target.elements.name.value.trim();
  const msg = e.target.elements.message.value.trim();
  const subject = encodeURIComponent(`Hello from ${name}`);
  const body = encodeURIComponent(msg);
  location.href = `mailto:faqih@bukuwarung.com?subject=${subject}&body=${body}`;
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
