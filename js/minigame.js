/* =====================================================================
   THE MARKETING GAME — minigame.js
   "Ad break": a 20-second targeting game. A brief names one age group
   and one interest; tap only the people who match both.
   ===================================================================== */
window.AdBreak = (function () {
  'use strict';

  const AGES = ['Gen Z', 'Millennial', 'Gen X', 'Boomer'];
  const INTERESTS = ['Coffee', 'Gaming', 'Sneakers', 'Gardening', 'Fitness', 'Travel'];
  const SKIN = ['#FBDDC2', '#F0C198', '#D69C6C', '#A96E46', '#6F4529'];
  const HAIR = ['#1C1747', '#5A3522', '#D8A23A', '#B8412C', '#E9E5F7', '#8E6A52'];
  const SHIRT = ['#FF5A36', '#49A8FF', '#27CF95', '#FF7EBE', '#FFC22E', '#9277FF'];
  const DURATION = 20000;
  const WASTE = 50;
  const INK = '#1C1747';

  const rnd = a => a[Math.floor(Math.random() * a.length)];
  const other = (a, not) => rnd(a.filter(x => x !== not));
  const lerp = (a, b, t) => a + (b - a) * t;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let st = null;

  function face() {
    const skin = rnd(SKIN), hair = rnd(HAIR), shirt = rnd(SHIRT);
    const style = Math.floor(Math.random() * 4);
    const glasses = Math.random() < 0.3;
    const back = style === 2 ? `<path d="M15 36c0-12 7-19 17-19s17 7 17 19v16H15z" fill="${hair}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` : '';
    const fronts = [
      `<path d="M17 33c0-10 6-16 15-16s15 6 15 16c-5-6-10-8-15-8s-10 2-15 8z" fill="${hair}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
      `<circle cx="32" cy="14" r="5.5" fill="${hair}" stroke="${INK}" stroke-width="2.5"/><path d="M17 33c0-10 6-16 15-16s15 6 15 16c-4-5-9-7-15-7s-11 2-15 7z" fill="${hair}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
      `<path d="M17 32c1-9 7-15 15-15s14 6 15 15c-6-2-12-6-15-10-3 4-9 8-15 10z" fill="${hair}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
      `<g fill="${hair}" stroke="${INK}" stroke-width="2.5"><circle cx="20" cy="26" r="5"/><circle cx="26" cy="20" r="5.5"/><circle cx="33" cy="18" r="5.5"/><circle cx="40" cy="21" r="5.5"/><circle cx="45" cy="27" r="5"/></g>`
    ];
    const specs = glasses ? `<g fill="none" stroke="${INK}" stroke-width="2"><circle cx="26.5" cy="36" r="4"/><circle cx="37.5" cy="36" r="4"/><path d="M30.5 36h3"/></g>` : '';
    return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      ${back}
      <path d="M12 64c2-11 10-16 20-16s18 5 20 16z" fill="${shirt}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="32" cy="35" r="14.5" fill="${skin}" stroke="${INK}" stroke-width="2.5"/>
      ${fronts[style]}
      <circle cx="26.5" cy="36" r="1.8" fill="${INK}"/><circle cx="37.5" cy="36" r="1.8" fill="${INK}"/>
      <path d="M27.5 42c2.8 2.4 6.2 2.4 9 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
      ${specs}
    </svg>`;
  }

  const chips = (age, interest) => `<span class="chip chip--age">${esc(age)}</span><span class="chip chip--int">${esc(interest)}</span>`;

  function mount(root, opts) {
    destroy();
    st = { root, opts: opts || {}, timers: [], raf: 0, running: false, cells: [], hits: 0, wrong: 0, missed: 0, targets: 0, t0: 0, onKey: null };
    st.onKey = e => {
      if (!st || !st.running) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 9) { e.preventDefault(); tap(st.cells[n - 1]); }
    };
    document.addEventListener('keydown', st.onKey);
    intro();
  }

  function sfx(name) { if (st && st.opts.sfx) st.opts.sfx.play(name); }
  function later(fn, ms) { const id = setTimeout(fn, ms); st.timers.push(id); return id; }

  function intro() {
    st.brief = { age: rnd(AGES), interest: rnd(INTERESTS) };
    st.root.innerHTML = `
      <div class="ab ab--intro">
        <p class="ab__kicker"><span class="ab__dot"></span>Ad break</p>
        <h2 class="ab__title" id="card-title">Hit your target audience</h2>
        <p class="ab__lead">You have 20 seconds and one campaign brief. Tap only the people who match <strong>both</strong> parts of it. Every wrong tap wastes $${WASTE} of budget.</p>
        <div class="ab__brief ab__brief--big"><span class="ab__brief-label">Your brief</span>${chips(st.brief.age, st.brief.interest)}</div>
        <button type="button" class="btn btn--primary btn--lg" data-ab-start>Start the campaign</button>
        <p class="ab__hint">On a keyboard, keys 1 to 9 tap the squares.</p>
      </div>`;
    st.root.querySelector('[data-ab-start]').addEventListener('click', play);
  }

  function play() {
    st.hits = 0; st.wrong = 0; st.missed = 0; st.targets = 0;
    st.root.innerHTML = `
      <div class="ab ab--play">
        <div class="ab__top">
          <div class="ab__brief"><span class="ab__brief-label">Brief</span>${chips(st.brief.age, st.brief.interest)}</div>
          <div class="ab__scores">
            <span><b data-hits>0</b> reached</span>
            <span><b data-waste>$0</b> wasted</span>
          </div>
        </div>
        <div class="ab__timer" aria-hidden="true"><span data-bar></span></div>
        <div class="ab__grid">
          ${Array.from({ length: 9 }, (_, i) => `<button type="button" class="ab__cell" data-cell="${i}" aria-label="Square ${i + 1}, empty"><span class="ab__num" aria-hidden="true">${i + 1}</span></button>`).join('')}
        </div>
        <div class="ab__count" data-count aria-live="assertive"></div>
      </div>`;
    st.cells = Array.from(st.root.querySelectorAll('.ab__cell')).map(b => ({ b, p: null, timer: 0 }));
    st.cells.forEach(c => c.b.addEventListener('pointerdown', e => { e.preventDefault(); tap(c); }));
    st.cells.forEach(c => c.b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(c); } }));
    const count = st.root.querySelector('[data-count]');
    const reduced = st.opts.reduced && st.opts.reduced();
    const seq = reduced ? ['Go!'] : ['3', '2', '1', 'Go!'];
    seq.forEach((s, k) => later(() => {
      count.textContent = s;
      count.classList.remove('pop'); void count.offsetWidth; count.classList.add('pop');
      sfx(s === 'Go!' ? 'go' : 'tick');
      if (s === 'Go!') later(() => { count.hidden = true; start(); }, 420);
    }, k * 600));
  }

  function start() {
    st.running = true;
    st.t0 = performance.now();
    const bar = st.root.querySelector('[data-bar]');
    const frame = t => {
      if (!st || !st.running) return;
      const k = Math.min(1, (t - st.t0) / DURATION);
      bar.style.transform = `scaleX(${1 - k})`;
      bar.parentElement.classList.toggle('is-low', k > 0.75);
      if (k >= 1) { end(); return; }
      st.raf = requestAnimationFrame(frame);
    };
    st.raf = requestAnimationFrame(frame);
    spawn();
  }

  function progress() { return Math.min(1, (performance.now() - st.t0) / DURATION); }

  function spawn() {
    if (!st || !st.running) return;
    const free = st.cells.filter(c => !c.p);
    if (free.length) {
      const c = rnd(free), b = st.brief;
      const isT = Math.random() < 0.46;
      let age = b.age, interest = b.interest;
      if (isT) st.targets++;
      else {
        const r = Math.random();
        if (r < 0.38) interest = other(INTERESTS, b.interest);
        else if (r < 0.76) age = other(AGES, b.age);
        else { age = other(AGES, b.age); interest = other(INTERESTS, b.interest); }
      }
      c.p = { isT, age, interest, done: false };
      c.b.classList.remove('is-hit', 'is-miss', 'is-leaving');
      c.b.insertAdjacentHTML('beforeend', `<span class="persona"><span class="persona__face">${face()}</span><span class="persona__chips">${chips(age, interest)}</span></span>`);
      c.b.setAttribute('aria-label', `Square ${st.cells.indexOf(c) + 1}: ${age}, ${interest}`);
      c.timer = later(() => expire(c), lerp(1650, 1050, progress()));
    }
    later(spawn, lerp(760, 440, progress()) * (0.8 + Math.random() * 0.4));
  }

  function clear(c, cls, delay) {
    c.b.classList.add(cls);
    later(() => {
      const p = c.b.querySelector('.persona');
      if (p) p.remove();
      c.b.classList.remove('is-hit', 'is-miss', 'is-leaving');
      c.b.setAttribute('aria-label', `Square ${st.cells.indexOf(c) + 1}, empty`);
      c.p = null;
    }, delay);
  }

  function expire(c) {
    if (!c.p || c.p.done) return;
    c.p.done = true;
    if (c.p.isT) st.missed++;
    clear(c, 'is-leaving', 220);
  }

  function floatText(c, text, good) {
    const f = document.createElement('span');
    f.className = 'ab__float ' + (good ? 'is-good' : 'is-bad');
    f.textContent = text;
    c.b.appendChild(f);
    later(() => f.remove(), 700);
  }

  function tap(c) {
    if (!st || !st.running || !c || !c.p || c.p.done) return;
    c.p.done = true;
    clearTimeout(c.timer);
    if (c.p.isT) {
      st.hits++;
      sfx('good');
      floatText(c, '+1', true);
      clear(c, 'is-hit', 300);
    } else {
      st.wrong++;
      sfx('bad');
      floatText(c, `−$${WASTE}`, false);
      clear(c, 'is-miss', 340);
    }
    st.root.querySelector('[data-hits]').textContent = st.hits;
    st.root.querySelector('[data-waste]').textContent = '$' + (st.wrong * WASTE).toLocaleString('en-AU');
  }

  function grade(hits, precision) {
    if (hits >= 10 && precision >= 0.9) return 'A+';
    if (hits >= 7 && precision >= 0.8) return 'A';
    if (hits >= 4 && precision >= 0.6) return 'B';
    return 'C';
  }

  function end() {
    st.running = false;
    st.timers.forEach(clearTimeout);
    st.timers = [];
    cancelAnimationFrame(st.raf);
    const taps = st.hits + st.wrong;
    const precision = taps ? st.hits / taps : 0;
    const g = grade(st.hits, precision);
    const buzz = st.hits * 25 + (g === 'A+' ? 100 : 0);
    const lines = {
      'A+': 'Perfectly targeted. The CMO wants a word.',
      'A': 'Sharp targeting. That’s a campaign worth scaling.',
      'B': 'Solid reach, a little leaky on budget.',
      'C': 'The algorithm is confused. Tighten the aim and go again.'
    };
    const res = { hits: st.hits, wrong: st.wrong, missed: st.missed, targets: st.targets, precision, grade: g, buzz };
    st.root.innerHTML = `
      <div class="ab ab--result">
        <p class="ab__kicker"><span class="ab__dot"></span>Campaign report</p>
        <div class="ab__grade" data-grade="${g.charAt(0)}" aria-hidden="true">${g}</div>
        <h2 class="ab__title" id="card-title"><span class="sr-only">Grade ${g}. </span>${lines[g]}</h2>
        <div class="kpis kpis--compact ab__kpis">
          <div class="kpi"><span class="kpi__value">${st.hits}<small> of ${st.targets}</small></span><span class="kpi__label">Target customers reached</span></div>
          <div class="kpi"><span class="kpi__value">${Math.round(precision * 100)}%</span><span class="kpi__label">Precision</span></div>
          <div class="kpi"><span class="kpi__value">$${(st.wrong * WASTE).toLocaleString('en-AU')}</span><span class="kpi__label">Wasted spend</span></div>
        </div>
        <p class="ab__reward">+${buzz} Buzz</p>
        <div class="ab__actions">
          <button type="button" class="btn btn--primary" data-ab-again>Play again</button>
          <button type="button" class="btn btn--paper" data-close>Back to the board</button>
        </div>
      </div>`;
    st.root.querySelector('[data-ab-again]').addEventListener('click', intro);
    sfx(g.charAt(0) === 'A' ? 'win' : 'land');
    if (st.opts.onFinish) st.opts.onFinish(res);
  }

  function destroy() {
    if (!st) return;
    st.running = false;
    st.timers.forEach(clearTimeout);
    cancelAnimationFrame(st.raf);
    document.removeEventListener('keydown', st.onKey);
    st = null;
  }

  return { mount, destroy };
})();
