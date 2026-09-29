/* =====================================================================
   THE MARKETING GAME — confetti.js
   A tiny canvas confetti cannon for big moments. Respects reduced motion.
   ===================================================================== */
window.Confetti = (function () {
  'use strict';
  const COLOURS = ['#FF5A36', '#FFC22E', '#27CF95', '#FF7EBE', '#49A8FF', '#9277FF', '#FFFFFF'];
  let cv, cx, W = 0, H = 0, parts = [], raf = 0;

  function setup() {
    cv = document.getElementById('confetti');
    if (!cv) return false;
    cx = cv.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    return true;
  }

  function resize() {
    if (!cv) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function show() {
    cv.classList.add('is-on');
    if (cv.showPopover) { try { if (cv.matches(':popover-open')) cv.hidePopover(); cv.showPopover(); } catch (e) {} }
  }
  function hide() {
    cv.classList.remove('is-on');
    if (cv.hidePopover) { try { cv.hidePopover(); } catch (e) {} }
  }

  function particle(x, y, vx, vy) {
    return {
      x, y, vx, vy,
      g: 0.28 + Math.random() * 0.12,
      w: 7 + Math.random() * 7, h: 9 + Math.random() * 9,
      r: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.32,
      c: COLOURS[Math.floor(Math.random() * COLOURS.length)],
      round: Math.random() < 0.22, life: 0, flip: Math.random() * 10
    };
  }

  function burst(opts) {
    opts = opts || {};
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!cv && !setup()) return;
    resize();
    show();
    const n = opts.count || 160;
    if (opts.x != null) {
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
        const s = 7 + Math.random() * 10;
        parts.push(particle(opts.x, opts.y, Math.cos(a) * s, Math.sin(a) * s));
      }
    } else {
      // two cannons, one from each bottom corner
      for (let i = 0; i < n; i++) {
        const left = i % 2 === 0;
        const vx = (left ? 1 : -1) * (4 + Math.random() * 10);
        const vy = -(13 + Math.random() * 11);
        parts.push(particle(left ? -10 : W + 10, H * 0.9, vx, vy));
      }
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function tick() {
    cx.clearRect(0, 0, W, H);
    parts = parts.filter(p => p.y < H + 60 && p.life < 420);
    for (const p of parts) {
      p.vy += p.g; p.vx *= 0.985; p.vy *= 0.985;
      p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
      const squash = Math.cos(p.life * 0.18 + p.flip);
      cx.save();
      cx.translate(p.x, p.y);
      cx.rotate(p.r);
      cx.scale(1, squash);
      cx.fillStyle = p.c;
      cx.strokeStyle = '#1C1747';
      cx.lineWidth = 1.5;
      if (p.round) { cx.beginPath(); cx.arc(0, 0, p.w / 2, 0, Math.PI * 2); cx.fill(); cx.stroke(); }
      else { cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h); }
      cx.restore();
    }
    if (parts.length) raf = requestAnimationFrame(tick);
    else { raf = 0; cx.clearRect(0, 0, W, H); hide(); }
  }

  return { burst };
})();
