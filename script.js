/* A small, dependency-free motion layer. All portfolio content is static HTML. */
(() => {
  "use strict";
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionButton = document.getElementById("motion-toggle");
  const motionLabel = document.getElementById("motion-label");
  const menu = document.getElementById("site-menu");
  const hero = document.getElementById("hero");
  let manualPause = false;
  try {
    manualPause = localStorage.getItem("portfolio-motion") === "off";
  } catch {
    /* Storage may be unavailable. */
  }
  const paused = () => manualPause || media.matches;
  let sceneController = null;

  function syncMotion() {
    root.classList.toggle("motion-paused", paused());
    motionButton.hidden = false;
    motionButton.disabled = media.matches;
    motionButton.setAttribute("aria-pressed", String(paused()));
    motionButton.setAttribute(
      "aria-label",
      media.matches
        ? "Reduced motion follows your device preference"
        : paused()
          ? "Resume decorative motion"
          : "Pause decorative motion",
    );
    motionLabel.textContent = media.matches
      ? "Reduced motion"
      : paused()
        ? "Motion off"
        : "Motion on";
    sceneController?.sync();
  }
  motionButton.addEventListener("click", () => {
    manualPause = !manualPause;
    try {
      localStorage.setItem("portfolio-motion", manualPause ? "off" : "on");
    } catch {
      /* Keep the setting for this page. */
    }
    syncMotion();
  });
  media.addEventListener("change", syncMotion);
  syncMotion();

  // Native details navigation remains usable with JavaScript disabled.
  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.open = false;
      if (link.hash) {
        const target = document.querySelector(link.hash + " h2");
        target?.focus({ preventScroll: true });
      }
    }),
  );

  if ("IntersectionObserver" in window) {
    // Observe before hiding; a failure leaves the complete HTML readable.
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -15px 0px" },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => revealObserver.observe(element));
    root.classList.add("reveal-ready");
  }

  const filters = document.querySelector(".project-filters");
  const rows = [...document.querySelectorAll(".project-row")];
  filters.hidden = false;
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    filters
      .querySelectorAll("button")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    let count = 0;
    rows.forEach((row) => {
      row.hidden =
        button.dataset.filter !== "all" &&
        row.dataset.category !== button.dataset.filter;
      if (!row.hidden) count++;
    });
    document.getElementById("filter-status").textContent =
      `${count} projects shown in More things I’ve built.`;
  });

  let scrollTicking = false;
  function updateScroll() {
    scrollTicking = false;
    const distance = root.scrollHeight - window.innerHeight;
    const progress =
      distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
    root.style.setProperty("--scroll", String(progress));
    document.getElementById("progress-value").textContent = String(
      Math.round(progress * 100),
    ).padStart(2, "0");
    document
      .getElementById("site-header")
      .classList.toggle("scrolled", window.scrollY > 30);
    root.classList.toggle(
      "has-scrolled",
      window.scrollY > window.innerHeight * 0.5,
    );
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(updateScroll);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", updateScroll, { passive: true });
  updateScroll();
  function updateClock() {
    document.getElementById("local-time").textContent =
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date()) + " IST";
    document.getElementById("year").textContent = new Date().getFullYear();
  }
  updateClock();
  setInterval(() => {
    if (!document.hidden) updateClock();
  }, 60000);

  // Original procedural torus, projected from 3D to Canvas 2D. No model, video,
  // WebGL dependency or third-party animation library is downloaded.
  function createCore() {
    const canvas = document.getElementById("core-canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null; // The CSS halo and monogram are the visual fallback.
    let width = 0,
      height = 0,
      radius = 0;
    let inView = true,
      frame = 0,
      lastPaint = 0,
      elapsed = 0;
    let pointerX = 0,
      pointerY = 0;
    const rings = 56,
      segments = 16;
    const vertices = [];
    for (let u = 0; u < rings; u++) {
      const a = (u / rings) * Math.PI * 2;
      for (let v = 0; v < segments; v++) {
        const b = (v / segments) * Math.PI * 2;
        const r = 1 + 0.32 * Math.cos(b);
        vertices.push({
          x: r * Math.cos(a),
          y: r * Math.sin(a),
          z: 0.32 * Math.sin(b),
        });
      }
    }
    // Deterministic dust avoids layout-dependent flicker and stays inexpensive.
    const dust = Array.from({ length: 110 }, (_, i) => ({
      angle: i * 2.399963,
      distance: 1.4 + (((i * 47) % 101) / 100) * 0.75,
      size: i % 5 === 0 ? 1.4 : 0.7,
      opacity: 0.12 + (i % 7) * 0.04,
    }));
    function paint() {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2,
        cy = height / 2;
      const scroll = Math.min(1, window.scrollY / window.innerHeight);
      const t = elapsed * 0.00013;
      const ax = 0.42 + Math.sin(t * 0.8) * 0.16 + pointerY * 0.1;
      const ay =
        -0.42 + Math.cos(t * 0.6) * 0.17 + pointerX * 0.12 + scroll * 0.7;
      const az = -0.25 + t * 0.25;
      const sx = Math.sin(ax),
        cox = Math.cos(ax),
        sy = Math.sin(ay),
        coy = Math.cos(ay),
        sz = Math.sin(az),
        coz = Math.cos(az);
      function project(p) {
        const y = p.y * cox - p.z * sx;
        const z = p.y * sx + p.z * cox;
        const x = p.x * coy + z * sy;
        const z2 = -p.x * sy + z * coy;
        const perspective = 3.8 / (3.8 - z2);
        return {
          x: cx + (x * coz - y * sz) * radius * perspective,
          y: cy + (x * sz + y * coz) * radius * perspective,
          depth: z2,
        };
      }
      const glow = ctx.createRadialGradient(
        cx,
        cy,
        radius * 0.5,
        cx,
        cy,
        radius * 1.8,
      );
      glow.addColorStop(0, "rgba(32,114,184,0)");
      glow.addColorStop(0.4, "rgba(21,101,177,0.13)");
      glow.addColorStop(0.65, "rgba(10,65,118,0.09)");
      glow.addColorStop(1, "rgba(10,65,118,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      // Broad orbital guides sit behind the wire surface.
      ctx.strokeStyle = "rgba(94,164,219,0.08)";
      ctx.lineWidth = 0.7;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          radius * (1.55 + i * 0.12),
          radius * (0.56 + i * 0.08),
          -0.5 + i * 0.2,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
      const points = vertices.map(project);
      // Dark far-side lines first, then brighter near-side lines and points.
      for (let layer = 0; layer < 2; layer++) {
        for (let u = 0; u < rings; u++) {
          for (let v = 0; v < segments; v++) {
            const p = points[u * segments + v];
            if ((p.depth > 0 ? 1 : 0) !== layer) continue;
            const a = Math.max(0.04, 0.12 + p.depth * 0.14);
            const n1 = points[((u + 1) % rings) * segments + v];
            const n2 = points[u * segments + ((v + 1) % segments)];
            ctx.strokeStyle = `rgba(103,182,248,${a})`;
            ctx.lineWidth = layer ? 0.7 : 0.45;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(p.x, p.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
            if ((u + v) % 3 === 0) {
              ctx.fillStyle = `rgba(153,211,255,${Math.min(0.8, a * 2.8)})`;
              ctx.beginPath();
              ctx.arc(p.x, p.y, layer ? 1.1 : 0.65, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
      dust.forEach((dot, i) => {
        const angle = dot.angle + t * (i % 2 ? 0.12 : -0.1);
        const x = cx + Math.cos(angle) * dot.distance * radius;
        const y = cy + Math.sin(angle) * dot.distance * radius * 0.78;
        ctx.fillStyle = `rgba(104,184,249,${dot.opacity})`;
        ctx.fillRect(x, y, dot.size, dot.size);
      });
    }
    function active() {
      return inView && !document.hidden && !paused();
    }
    function tick(now) {
      frame = 0;
      if (!active()) return;
      if (lastPaint === 0) lastPaint = now;
      const delta = now - lastPaint;
      if (delta >= 1000 / 30) {
        elapsed += Math.min(delta, 70);
        lastPaint = now;
        paint();
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastPaint = 0;
      if (active()) frame = requestAnimationFrame(tick);
      else if (inView && !document.hidden) paint();
    }
    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(width * 0.29, height * 0.28);
      paint();
    }
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
    else window.addEventListener("resize", resize, { passive: true });
    if ("IntersectionObserver" in window)
      new IntersectionObserver(
        (entries) => {
          inView = entries[0].isIntersecting;
          sync();
        },
        { threshold: 0 },
      ).observe(hero);
    hero.addEventListener(
      "pointermove",
      (event) => {
        if (paused() || event.pointerType !== "mouse") return;
        const rect = hero.getBoundingClientRect();
        pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      },
      { passive: true },
    );
    hero.addEventListener("pointerleave", () => {
      pointerX = 0;
      pointerY = 0;
    });
    document.addEventListener("visibilitychange", sync);
    resize();
    sync();
    return { sync };
  }
  try {
    sceneController = createCore();
  } catch {
    /* Text and CSS scenery work without canvas. */
  }
})();
