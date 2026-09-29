/* =====================================================================
   THE MARKETING GAME — app.js
   The game engine. You shouldn't need to edit this file:
   all the words, numbers and links live in js/content.js
   ===================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  Setup & helpers                                                    */
  /* ------------------------------------------------------------------ */
  const C = window.PORTFOLIO || {};
  const P = Object.assign({ name: 'Your Name', role: 'Marketer', bio: [] }, C.person || {});
  const FIRST = P.firstName || P.name.split(' ')[0];
  const INITIALS = (P.initials || P.name.split(/\s+/).map(w => w[0]).join('')).slice(0, 2).toUpperCase();
  const CASES = (C.caseStudies || []).slice(0, 6);
  const TESTIMONIALS = C.testimonials || [];
  const WILDCARDS = (C.wildcards && C.wildcards.length) ? C.wildcards : [{ title: 'Fun fact', text: 'This card is waiting for a fun fact.' }];

  const SFX = window.SFX || { play() {}, ensure() {}, enabled: false };
  const Confetti = window.Confetti || { burst() {} };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => mqReduce.matches;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (v, d = 0) => Number(v).toLocaleString('en-AU', { minimumFractionDigits: d, maximumFractionDigits: d });
  const metric = r => (r.prefix || '') + fmt(r.value, r.decimals || 0) + (r.suffix || '');
  const plural = (n, one, many) => `${fmt(n)} ${n === 1 ? one : many}`;

  const HEX = { tomato: '#FF5A36', sky: '#49A8FF', mint: '#27CF95', pink: '#FF7EBE', sun: '#FFC22E', grape: '#9277FF', ink: '#1C1747' };
  const ORDER = ['tomato', 'sky', 'pink', 'grape', 'mint', 'sun'];

  /* Icons: simple 24px strokes (adapted from Lucide, ISC licence) */
  const ICONS = {
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    coffee: '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M6 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/><path d="M22 10v6"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    dice: '<rect width="18" height="18" x="3" y="3" rx="3"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01"/>',
    volume: '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    mute: '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>'
  };
  const icon = (name, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;

  const PAWN = `<svg viewBox="0 0 40 52" aria-hidden="true" focusable="false"><g stroke="#1C1747" stroke-width="2.6" stroke-linejoin="round">
    <rect class="pawn-base" x="5" y="42" width="30" height="7.5" rx="3.75"/>
    <path class="pawn-body" d="M11 43.5C11 35.5 14 30.5 17.5 27.5h5C26 30.5 29 35.5 29 43.5Z"/>
    <rect class="pawn-collar" x="12.5" y="24" width="15" height="5.5" rx="2.75"/>
    <circle class="pawn-head" cx="20" cy="14.5" r="9.5"/></g>
    <ellipse cx="16.4" cy="11" rx="3.2" ry="2.2" fill="#fff" opacity=".7"/>
    <path d="M15 40c0-4 1-7 3-9" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".45"/></svg>`;

  /* ------------------------------------------------------------------ */
  /*  The board                                                          */
  /* ------------------------------------------------------------------ */
  // 20 spaces, clockwise from the top-left corner.
  const TEMPLATE = ['launch', 'case', 'wild', 'case', 'skills',
                    'about', 'case', 'mouth', 'tools', 'case',
                    'game', 'experience', 'wild', 'case', 'mouth',
                    'pitch', 'case', 'education', 'wild', 'playbook'];
  const N = TEMPLATE.length;

  const HAS = {
    mouth: TESTIMONIALS.length > 0,
    skills: (C.skills || []).length > 0,
    tools: (C.toolkit || []).length > 0,
    experience: (C.experience || []).length > 0,
    education: (C.education || []).length > 0,
    playbook: (C.playbook || []).length > 0
  };

  const META = {
    launch:     { title: 'Launch day',   icon: 'rocket', colour: 'sun',    corner: true, foot: 'Pass for +200 Buzz', points: 50 },
    about:      { title: 'Coffee break', icon: 'coffee', colour: 'pink',   corner: true, foot: `Meet ${FIRST}`,       points: 100 },
    game:       { title: 'Ad break',     icon: 'target', colour: 'mint',   corner: true, foot: 'Mini-game',          points: 100 },
    pitch:      { title: 'The pitch',    icon: 'mail',   colour: 'tomato', corner: true, foot: 'Get in touch',        points: 100 },
    wild:       { title: 'Wildcard',     icon: 'star',   colour: 'pink',   foot: 'Draw a card',   points: 75 },
    mouth:      { title: 'Word of mouth', icon: 'chat',  colour: 'sky',    foot: 'Kind words',    points: 75 },
    skills:     { title: 'Skills',       icon: 'zap',    colour: 'sun',    foot: 'What I do',     points: 75 },
    tools:      { title: 'Toolkit',      icon: 'grid',   colour: 'mint',   foot: 'What I use',    points: 75 },
    experience: { title: 'Career path',  icon: 'flag',   colour: 'grape',  foot: 'Where I’ve been', points: 75 },
    education:  { title: 'Training',     icon: 'cap',    colour: 'sky',    foot: 'Study & certs', points: 75 },
    playbook:   { title: 'Playbook',     icon: 'book',   colour: 'tomato', foot: 'How I work',    points: 75 },
    case:       { title: '', icon: 'megaphone', points: 150 }
  };

  function buildBoard() {
    let ci = 0;
    return TEMPLATE.map((type, i) => {
      let t = type;
      if (t === 'case' && ci >= CASES.length) t = 'wild';
      else if (HAS[t] === false) t = 'wild';
      const m = META[t];
      const s = { i, type: t, title: m.title, icon: m.icon, colour: m.colour, foot: m.foot, corner: !!m.corner, points: m.points };
      if (t === 'case') {
        const cs = CASES[ci];
        s.caseIndex = ci;
        s.data = cs;
        s.title = cs.title;
        s.colour = HEX[cs.colour] ? cs.colour : ORDER[ci % ORDER.length];
        s.mono = String(cs.client || cs.title || '?').trim().charAt(0).toUpperCase();
        s.foot = cs.headline ? metric(cs.headline) : (cs.year || '');
        ci++;
      }
      return s;
    });
  }
  const BOARD = buildBoard();
  const CASE_SPACES = BOARD.filter(s => s.type === 'case');

  function gridPos(i) {
    if (i === 0) return [1, 1];
    if (i < 5) return [1, i + 1];
    if (i === 5) return [1, 6];
    if (i < 10) return [i - 4, 6];
    if (i === 10) return [6, 6];
    if (i < 15) return [6, 6 - (i - 10)];
    if (i === 15) return [6, 1];
    return [6 - (i - 15), 1];
  }
  function sideOf(i) {
    if (i % 5 === 0) return 'corner';
    if (i < 5) return 'top';
    if (i < 10) return 'right';
    if (i < 15) return 'bottom';
    return 'left';
  }

  /* ------------------------------------------------------------------ */
  /*  Save game                                                          */
  /* ------------------------------------------------------------------ */
  const SAVE_KEY = 'the-marketing-game:' + P.name;
  function load() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        pos: state.pos, visited: [...state.visited], score: state.score, ach: [...state.ach],
        rolls: state.rolls, laps: state.laps, log: state.log.slice(0, 30), done: state.done,
        golden: state.golden, best: state.best, sound: SFX.enabled
      }));
    } catch (e) { /* storage blocked: the game still works, it just won't remember */ }
  }

  const state = {
    pos: 0, visited: new Set(), score: 0, ach: new Set(), rolls: 0, laps: 0, log: [],
    done: false, golden: false, best: null, busy: false, opened: false, view: 'play'
  };
  (function restore() {
    const s = load();
    if (!s) return;
    state.pos = Number.isInteger(s.pos) && s.pos >= 0 && s.pos < N ? s.pos : 0;
    state.visited = new Set((s.visited || []).filter(n => Number.isInteger(n) && n >= 0 && n < N));
    state.score = Math.max(0, Number(s.score) || 0);
    state.ach = new Set(s.ach || []);
    state.rolls = s.rolls || 0;
    state.laps = s.laps || 0;
    state.log = Array.isArray(s.log) ? s.log : [];
    state.done = !!s.done;
    state.golden = !!s.golden;
    state.best = s.best || null;
    if (s.sound === false) SFX.enabled = false;
  })();

  /* ------------------------------------------------------------------ */
  /*  Achievements                                                       */
  /* ------------------------------------------------------------------ */
  const ACH = [
    { id: 'roll',     name: 'Opening move',    desc: 'Roll the die for the first time', buzz: 50,  icon: 'dice' },
    { id: 'case',     name: 'Case opened',     desc: 'Read a case study',               buzz: 50,  icon: 'megaphone' },
    { id: 'wild',     name: 'Wild one',        desc: 'Draw a wildcard',                 buzz: 50,  icon: 'star' },
    { id: 'lap',      name: 'Full lap',        desc: 'Pass Launch day',                 buzz: 0,   icon: 'rocket' },
    { id: 'bullseye', name: 'Bullseye',        desc: 'Score an A in Ad break',          buzz: 200, icon: 'target' },
    { id: 'pitch',    name: 'Let’s talk',      desc: 'Visit The pitch',                 buzz: 50,  icon: 'mail' },
    { id: 'cases',    name: 'Case closed',     desc: 'Read every case study',           buzz: 300, icon: 'book' },
    { id: 'all',      name: 'Board certified', desc: 'Visit all ' + N + ' spaces',      buzz: 500, icon: 'trophy' },
    { id: 'cheat',    name: 'Cheat code',      desc: 'Found the secret',                buzz: 0,   icon: 'key', secret: true }
  ];

  function unlock(id) {
    if (state.ach.has(id)) return;
    const a = ACH.find(x => x.id === id);
    if (!a) return;
    state.ach.add(id);
    if (a.buzz) addScore(a.buzz);
    toast({ kicker: 'Achievement unlocked', title: a.name, pts: a.buzz, icon: a.icon });
    SFX.play('unlock');
    addLog(`Unlocked “${a.name}”`, a.buzz);
    renderAchievements();
    save();
  }

  /* ------------------------------------------------------------------ */
  /*  DOM references                                                     */
  /* ------------------------------------------------------------------ */
  const el = {};
  let spaceEls = [];
  let tokenEl, grid, boardEl;

  /* ------------------------------------------------------------------ */
  /*  Rendering: HUD                                                     */
  /* ------------------------------------------------------------------ */
  function renderHud() {
    $('#hud').innerHTML = `
      <a class="hud__brand" href="./" data-view="play" aria-label="${esc(P.name)}, back to the board">
        <span class="hud__mark" aria-hidden="true">${esc(INITIALS)}</span>
        <span class="hud__name">${esc(P.name)}<small>${esc(P.role)}</small></span>
      </a>
      <div class="hud__stats">
        <div class="hud__progress" title="Spaces visited">
          <span class="hud__count"><b id="hud-visited">0</b><span class="hud__of">/${N}</span><span class="hud__word"> spaces</span></span>
          <span class="pips" id="pips" aria-hidden="true">${BOARD.map(s => `<i style="--c:var(--${s.colour || 'board'})"></i>`).join('')}</span>
        </div>
        <div class="hud__buzz" title="Buzz: points for exploring">
          <span class="coin" aria-hidden="true"></span><b id="hud-score">0</b><span class="hud__word">Buzz</span>
        </div>
      </div>
      <div class="hud__actions">
        <button class="icon-btn hud__help" id="btn-help" type="button" aria-label="How to play">${icon('help')}</button>
        <button class="icon-btn" id="btn-sound" type="button" aria-label="Sound effects" aria-pressed="${SFX.enabled}">${icon(SFX.enabled ? 'volume' : 'mute')}</button>
        <div class="seg" role="group" aria-label="Choose a view">
          <button type="button" data-view="play" data-view-btn="play" aria-pressed="true">${icon('dice')}<span>Board</span></button>
          <button type="button" data-view="read" data-view-btn="read" aria-pressed="false">${icon('book')}<span>Read</span></button>
        </div>
      </div>`;
    el.visited = $('#hud-visited');
    el.score = $('#hud-score');
    el.pips = $('#pips');
    updateHud(false);
  }

  let shownScore = 0;
  function updateHud(animate = true) {
    el.visited.textContent = state.visited.size;
    $$('i', el.pips).forEach((p, i) => p.classList.toggle('on', state.visited.has(i)));
    const to = state.score;
    if (!animate || reduced()) { shownScore = to; el.score.textContent = fmt(to); return; }
    const from = shownScore;
    shownScore = to;
    const t0 = performance.now(), dur = 700;
    el.score.parentElement.classList.remove('bump');
    void el.score.offsetWidth;
    el.score.parentElement.classList.add('bump');
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      el.score.textContent = fmt(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  function addScore(n) {
    if (!n) return;
    state.score += n;
    updateHud();
  }

  /* ------------------------------------------------------------------ */
  /*  Rendering: box lid                                                 */
  /* ------------------------------------------------------------------ */
  function burst(text) {
    const pts = [], n = 18, cx = 70, cy = 70;
    for (let k = 0; k < n * 2; k++) {
      const r = k % 2 ? 56 : 68, a = (Math.PI * k) / n - Math.PI / 2;
      pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1));
    }
    const words = text.split(' ');
    const mid = Math.ceil(words.length / 2);
    return `<svg viewBox="0 0 140 140"><polygon points="${pts.join(' ')}" fill="${HEX.tomato}" stroke="${HEX.ink}" stroke-width="3.5" stroke-linejoin="round"/>
      <text x="70" y="66" text-anchor="middle">${esc(words.slice(0, mid).join(' '))}</text>
      <text x="70" y="86" text-anchor="middle">${esc(words.slice(mid).join(' '))}</text></svg>`;
  }

  function lidArt() {
    const picks = CASES.slice(0, 3);
    while (picks.length < 3) picks.push({ colour: ORDER[picks.length], headline: null, title: '' });
    const card = (cs, x, y, rot, k, align) => {
      const c = HEX[cs.colour] || HEX[ORDER[k]];
      const big = cs.headline ? metric(cs.headline) : '';
      const tx = align === 'start' ? x + 12 : align === 'end' ? x + 108 : x + 60;
      return `<g transform="rotate(${rot} ${x + 60} ${y + 190})">
        <rect x="${x}" y="${y}" width="120" height="168" rx="14" fill="#fff"/>
        <path d="M${x} ${y + 14}a14 14 0 0 1 14-14h92a14 14 0 0 1 14 14v26H${x}z" fill="${c}"/>
        <text x="${tx}" y="${y + 104}" text-anchor="${align || 'middle'}" class="art-metric"${big.length > 5 ? ' style="font-size:24px"' : ''}>${esc(big)}</text>
        <rect x="${x + 22}" y="${y + 122}" width="76" height="7" rx="3.5" fill="#E4DFFA" stroke="none"/>
        <rect x="${x + 32}" y="${y + 137}" width="56" height="7" rx="3.5" fill="#E4DFFA" stroke="none"/>
      </g>`;
    };
    const sparkle = (x, y, s, c) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0-12C1.5-3 3-1.5 12 0 3 1.5 1.5 3 0 12-1.5 3-3 1.5-12 0-3-1.5-1.5-3 0-12Z" fill="${c}"/>`;
    return `<svg viewBox="0 0 560 236" class="lid__svg">
      <ellipse cx="290" cy="222" rx="236" ry="11" fill="${HEX.ink}" opacity=".16"/>
      <g stroke="${HEX.ink}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
        ${card(picks[0], 158, 44, -15, 0, 'start')}
        ${card(picks[2], 302, 44, 15, 2, 'end')}
        ${card(picks[1], 230, 22, 0, 1)}
        <g transform="translate(424 78) rotate(14 48 48)">
          <rect x="9" y="11" width="96" height="96" rx="18" fill="#CFC6FF"/>
          <rect x="0" y="0" width="96" height="96" rx="18" fill="#fff"/>
          <g fill="${HEX.ink}" stroke="none"><circle cx="26" cy="26" r="8.5"/><circle cx="70" cy="26" r="8.5"/><circle cx="48" cy="48" r="8.5"/><circle cx="26" cy="70" r="8.5"/><circle cx="70" cy="70" r="8.5"/></g>
        </g>
        <g transform="translate(38 70) scale(2.9)" class="art-pawn">
          <rect x="5" y="42" width="30" height="7.5" rx="3.75" stroke-width="1.4"/>
          <path d="M11 43.5C11 35.5 14 30.5 17.5 27.5h5C26 30.5 29 35.5 29 43.5Z" stroke-width="1.4"/>
          <rect x="12.5" y="24" width="15" height="5.5" rx="2.75" fill="${HEX.sun}" stroke-width="1.4"/>
          <circle cx="20" cy="14.5" r="9.5" stroke-width="1.4"/>
          <ellipse cx="16.4" cy="11" rx="3.2" ry="2.2" fill="#fff" opacity=".7" stroke="none"/>
        </g>
        ${sparkle(150, 34, 1, '#fff')}
        ${sparkle(410, 40, .8, HEX.tomato)}
        ${sparkle(536, 178, .7, '#fff')}
      </g>
    </svg>`;
  }

  function renderLid() {
    const resume = state.visited.size > 0;
    $('#lid').innerHTML = `
      <div class="lid">
        <ul class="lid__badges" aria-label="Game details">
          <li>1 player</li><li>Ages 18+</li><li>3–5 minutes</li>
        </ul>
        <div class="lid__burst" aria-hidden="true">${burst('Real results inside!')}</div>
        <h1 class="lid__title">
          <span class="lid__name">${esc(P.name)}</span>
          <span class="lid__ribbon">The Marketing Game</span>
        </h1>
        <div class="lid__art" aria-hidden="true">${lidArt()}</div>
        <p class="lid__tagline">Roll the die and land on ${esc(FIRST)}’s best work. Every space is a campaign, a skill or a story.</p>
        <div class="lid__actions">
          <button class="btn btn--primary btn--lg" id="btn-open" type="button">${resume ? 'Continue the game' : 'Open the box'}</button>
          <a class="btn btn--paper btn--lg" href="#read" data-view="read">Skip to the portfolio</a>
        </div>
        ${resume ? `<button class="lid__new" id="btn-new" type="button">Start a new game instead</button>` : ''}
      </div>`;
  }

  /* ------------------------------------------------------------------ */
  /*  Rendering: board                                                   */
  /* ------------------------------------------------------------------ */
  function ariaFor(s) {
    const kind = s.type === 'case' ? `case study, ${s.data.client}` : (s.corner ? s.foot : s.foot);
    return `Space ${s.i + 1} of ${N}: ${s.title}, ${kind}${state.visited.has(s.i) ? ', visited' : ''}`;
  }

  function spaceHTML(s) {
    const [r, c] = gridPos(s.i);
    const side = sideOf(s.i);
    const cls = ['space', `space--${s.type}`];
    if (s.corner) cls.push('space--corner');
    if (s.type === 'case') cls.push('space--band');
    if (state.visited.has(s.i)) cls.push('is-seen');
    const glyph = s.type === 'case' ? `<span class="space__mono">${esc(s.mono)}</span>` : icon(s.icon);
    return `<button type="button" class="${cls.join(' ')}" data-i="${s.i}" data-side="${side}"
      style="grid-row:${r};grid-column:${c};--c:var(--${s.colour})" aria-label="${esc(ariaFor(s))}">
      ${s.type === 'case' ? '<span class="space__band" aria-hidden="true"></span>' : ''}
      <span class="space__body" aria-hidden="true">
        <span class="space__title">${esc(s.title)}</span>
        <span class="space__icon">${glyph}</span>
        <span class="space__foot">${esc(s.foot || '')}</span>
      </span>
      <span class="space__seen" aria-hidden="true">${icon('check')}</span>
    </button>`;
  }

  function dieHTML() {
    const PIPS = { 1: [5], 2: [3, 7], 3: [3, 5, 7], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] };
    const face = n => `<div class="die__face die__face--${n}">${PIPS[n].map(p => `<i class="pip" style="grid-area:${Math.ceil(p / 3)}/${((p - 1) % 3) + 1}"></i>`).join('')}</div>`;
    return `<div class="die-tray"><div class="die" id="die"><div class="die__cube" id="die-cube">
      <div class="die__core die__core--x"></div><div class="die__core die__core--y"></div><div class="die__core die__core--z"></div>
      ${[1, 2, 3, 4, 5, 6].map(face).join('')}</div></div><div class="die__shadow"></div></div>`;
  }

  function deckHTML(kind, label, iconName) {
    return `<button type="button" class="deck deck--${kind}" data-deck="${kind}" aria-label="${esc(label)}">
      <span class="deck__card"></span><span class="deck__card"></span>
      <span class="deck__card deck__card--top">${icon(iconName)}</span>
      <span class="deck__label">${esc(kind === 'wild' ? 'Wildcards' : 'Word of mouth')}</span>
    </button>`;
  }

  function renderBoard() {
    boardEl = $('#board');
    boardEl.innerHTML = `
      <div class="board__grid" id="board-grid">
        ${BOARD.map(spaceHTML).join('')}
        <div class="center">
          <div class="center__logo" aria-hidden="true">
            <span class="center__name">${esc(P.name)}</span>
            <span class="center__ribbon">The Marketing Game</span>
          </div>
          <div class="center__play">
            ${deckHTML('wild', 'Draw a wildcard', 'star')}
            ${dieHTML()}
            ${TESTIMONIALS.length ? deckHTML('mouth', 'Read a kind word', 'chat') : '<span class="deck deck--empty"></span>'}
          </div>
          <button type="button" class="btn btn--primary roll" id="btn-roll" disabled>${icon('dice')}<span>Roll the die</span><kbd aria-hidden="true">R</kbd></button>
          <p class="center__status" id="status">Open the box to start.</p>
        </div>
      </div>
      <div class="token${state.golden ? ' is-golden' : ''}" id="token" aria-hidden="true"><div class="token__shadow"></div><div class="token__pawn">${PAWN}</div></div>`;
    grid = $('#board-grid');
    tokenEl = $('#token');
    spaceEls = $$('.space', grid);
    el.roll = $('#btn-roll');
    el.status = $('#status');
    el.cube = $('#die-cube');
    el.die = $('#die');
    setDie(state.lastRoll || 5, true);
  }

  function refreshSpace(i) {
    const s = BOARD[i], e = spaceEls[i];
    e.classList.toggle('is-seen', state.visited.has(i));
    e.setAttribute('aria-label', ariaFor(s));
  }

  function markHere() {
    spaceEls.forEach((e, i) => e.classList.toggle('is-here', i === state.pos));
  }

  /* ------------------------------------------------------------------ */
  /*  Rendering: side panels                                             */
  /* ------------------------------------------------------------------ */
  function portrait(cls) {
    if (P.photo) return `<div class="portrait ${cls}"><img src="${esc(P.photo)}" alt="Portrait of ${esc(P.name)}" loading="lazy"></div>`;
    return `<div class="portrait portrait--mono ${cls}" role="img" aria-label="${esc(P.name)}"><span>${esc(INITIALS)}</span></div>`;
  }

  function meters(list) {
    return `<div class="meters">${list.map((s, k) => {
      const v = Math.max(0, Math.min(100, Number(s.value) || 0));
      return `<div class="meter" style="--c:var(--${ORDER[k % ORDER.length]});--v:${v}">
        <span class="meter__label">${esc(s.label)}</span><span class="meter__value">${v}</span>
        <span class="meter__track" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${v}" aria-label="${esc(s.label)}"><span class="meter__fill"></span></span>
      </div>`;
    }).join('')}</div>`;
  }

  function renderPanels() {
    const stats = (C.stats || []).slice(0, 4);
    $('#panel-player').innerHTML = `
      <div class="pcard">
        <div class="pcard__top">
          ${portrait('pcard__portrait')}
          <div>
            <p class="pcard__kicker">Player 1</p>
            <h2 class="pcard__name">${esc(P.name)}</h2>
            <p class="pcard__role">${esc(P.role)}</p>
          </div>
        </div>
        <p class="pcard__tagline">${esc(P.tagline || '')}</p>
        ${stats.length ? meters(stats) : ''}
        <div class="pcard__actions">
          ${P.email ? `<a class="btn btn--primary btn--sm" href="mailto:${esc(P.email)}">${icon('mail')}Email ${esc(FIRST)}</a>` : ''}
          <button type="button" class="btn btn--paper btn--sm" data-open="about">${icon('user')}Player card</button>
        </div>
      </div>`;

    $('#panel-progress').innerHTML = `
      <div class="ppanel">
        <section class="ppanel__sec" aria-labelledby="log-h">
          <h2 id="log-h" class="ppanel__h">Game log</h2>
          <ol class="log" id="log"></ol>
        </section>
        <section class="ppanel__sec" aria-labelledby="ach-h">
          <h2 id="ach-h" class="ppanel__h">Achievements <span id="ach-count"></span></h2>
          <ul class="achs" id="achs"></ul>
        </section>
        <button type="button" class="ppanel__reset" data-reset>${icon('reset')}Reset game</button>
      </div>`;
    renderLog();
    renderAchievements();
  }

  function addLog(text, pts) {
    state.log.unshift({ text, pts: pts || 0 });
    state.log = state.log.slice(0, 30);
    renderLog();
  }

  function renderLog() {
    const list = $('#log');
    if (!list) return;
    if (!state.log.length) {
      list.innerHTML = `<li class="log__empty">Nothing yet. Roll the die to make your first move.</li>`;
      return;
    }
    list.innerHTML = state.log.slice(0, 6).map(l =>
      `<li><span>${esc(l.text)}</span>${l.pts ? `<b>+${fmt(l.pts)}</b>` : ''}</li>`).join('');
  }

  function renderAchievements() {
    const list = $('#achs');
    if (!list) return;
    const visible = ACH.filter(a => !a.secret || state.ach.has(a.id));
    list.innerHTML = visible.map(a => {
      const on = state.ach.has(a.id);
      return `<li class="ach ${on ? 'is-on' : ''}" title="${esc(a.name)}: ${esc(a.desc)}">
        <span class="ach__badge">${icon(on ? a.icon : 'lock')}</span>
        <span class="sr-only">${esc(a.name)}: ${esc(a.desc)}. ${on ? 'Unlocked' : 'Locked'}.</span>
      </li>`;
    }).join('');
    const total = ACH.filter(a => !a.secret).length;
    const got = ACH.filter(a => !a.secret && state.ach.has(a.id)).length;
    $('#ach-count').textContent = `${got}/${total}`;
  }

  /* ------------------------------------------------------------------ */
  /*  Token movement                                                     */
  /* ------------------------------------------------------------------ */
  function pointFor(i) {
    const cell = spaceEls[i];
    const target = cell.querySelector('.space__icon') || cell;
    let x = target.offsetWidth / 2, y = target.offsetHeight / 2, n = target;
    while (n && n !== boardEl) {
      x += n.offsetLeft; y += n.offsetTop;
      const p = n.offsetParent;
      if (p && p !== boardEl) { x += p.clientLeft; y += p.clientTop; }
      n = p;
    }
    // stand the pawn slightly below the icon's centre so its base sits on it
    return { x, y: y + target.offsetHeight * 0.35 };
  }

  function placeToken() {
    if (!tokenEl || !spaceEls.length) return;
    const p = pointFor(state.pos);
    tokenEl.style.transform = `translate(${p.x}px, ${p.y}px)`;
    markHere();
  }

  function hop(to, dur, lift) {
    const a = pointFor(state.pos), b = pointFor(to);
    state.pos = to;
    tokenEl.style.transform = `translate(${b.x}px, ${b.y}px)`;
    if (!dur) return Promise.resolve();
    const pawn = tokenEl.querySelector('.token__pawn'), shadow = tokenEl.querySelector('.token__shadow');
    const h = lift || Math.max(16, tokenEl.offsetHeight * 0.75);
    const moves = tokenEl.animate([
      { transform: `translate(${a.x}px, ${a.y}px)` },
      { transform: `translate(${b.x}px, ${b.y}px)` }
    ], { duration: dur, easing: 'cubic-bezier(.45,.05,.35,1)' });
    pawn.animate([
      { transform: 'translateY(0) scale(1)' },
      { transform: `translateY(${-h}px) scale(1.1)`, offset: 0.45 },
      { transform: 'translateY(0) scale(1.06, .9)', offset: 0.86 },
      { transform: 'translateY(0) scale(1)' }
    ], { duration: dur, easing: 'ease-out' });
    shadow.animate([
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(.55)', opacity: .45, offset: 0.45 },
      { transform: 'scale(1)', opacity: 1 }
    ], { duration: dur });
    return moves.finished.catch(() => {});
  }

  async function walk(steps) {
    const dir = steps < 0 ? -1 : 1;
    for (let k = 0; k < Math.abs(steps); k++) {
      const next = (state.pos + dir + N) % N;
      markHere();
      await hop(next, reduced() ? 0 : 250);
      SFX.play('hop', k);
      if (dir > 0 && next === 0) passLaunch();
      if (reduced()) await wait(60);
    }
    markHere();
  }

  function passLaunch() {
    state.laps++;
    addScore(200);
    addLog('Passed Launch day', 200);
    floatPoints(200);
    SFX.play('coin');
    unlock('lap');
  }

  function floatPoints(n) {
    if (!tokenEl || reduced()) return;
    const p = pointFor(state.pos);
    const f = document.createElement('span');
    f.className = 'float-pts';
    f.textContent = `+${fmt(n)}`;
    f.style.left = p.x + 'px';
    f.style.top = (p.y - tokenEl.offsetHeight) + 'px';
    boardEl.appendChild(f);
    f.addEventListener('animationend', () => f.remove());
  }

  /* ------------------------------------------------------------------ */
  /*  The die                                                            */
  /* ------------------------------------------------------------------ */
  const FACE = { 1: [0, 0], 2: [0, -90], 3: [-90, 0], 4: [90, 0], 5: [0, 90], 6: [0, 180] };
  const rot = { x: 0, y: 0 };
  function setDie(n, instant) {
    const [bx, by] = FACE[n];
    if (instant) { rot.x = bx; rot.y = by; }
    else {
      const spinsX = 2 + Math.floor(Math.random() * 2), spinsY = 1 + Math.floor(Math.random() * 2);
      let tx = bx; while (tx < rot.x + 360 * spinsX) tx += 360;
      let ty = by; while (ty < rot.y + 360 * spinsY) ty += 360;
      rot.x = tx; rot.y = ty;
    }
    el.cube.classList.toggle('no-anim', !!instant || reduced());
    el.cube.style.transform = `rotateX(-18deg) rotateY(24deg) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`;
  }

  async function spinDie(n) {
    state.lastRoll = n;
    if (reduced()) { setDie(n, true); return; }
    el.die.classList.remove('is-rolling');
    void el.die.offsetWidth;
    el.die.classList.add('is-rolling');
    setDie(n);
    await wait(1050);
    el.die.classList.remove('is-rolling');
  }

  /* ------------------------------------------------------------------ */
  /*  Turns                                                              */
  /* ------------------------------------------------------------------ */
  function setStatus(t) { if (el.status) el.status.textContent = t; announce(t); }
  function announce(t) { const a = $('#announcer'); if (a) { a.textContent = ''; setTimeout(() => { a.textContent = t; }, 30); } }
  function setBusy(b) {
    state.busy = b;
    if (el.roll) el.roll.disabled = b || !state.opened;
    document.body.classList.toggle('is-busy', b);
  }

  async function roll() {
    if (state.busy || !state.opened || dlg.open || state.view !== 'play') return;
    setBusy(true);
    SFX.play('rattle');
    const n = 1 + Math.floor(Math.random() * 6);
    state.rolls++;
    setStatus('Rolling…');
    await spinDie(n);
    setStatus(`You rolled a ${n}.`);
    unlock('roll');
    await walk(n);
    setBusy(false);
    land(`Rolled a ${n}`);
  }

  async function travelTo(i, how = 'Jumped') {
    if (state.busy || dlg.open) return;
    if (i === state.pos) { land('Revisited'); return; }
    setBusy(true);
    SFX.play('hop', 3);
    await hop(i, reduced() ? 0 : 520, 60);
    setBusy(false);
    land(how);
  }

  function land(how) {
    const s = BOARD[state.pos];
    markHere();
    const cell = spaceEls[state.pos];
    cell.classList.remove('is-landed'); void cell.offsetWidth; cell.classList.add('is-landed');
    SFX.play('land');
    if (navigator.vibrate && matchMedia('(pointer: coarse)').matches) { try { navigator.vibrate(14); } catch (e) {} }
    const fresh = visit(s, how);
    setStatus(`${how === 'Revisited' ? 'Back on' : 'Landed on'} ${s.title}.${fresh ? ` +${s.points} Buzz` : ''}`);
    setTimeout(() => openSpace(s), reduced() ? 0 : 280);
  }

  function visit(s, how) {
    const fresh = !state.visited.has(s.i);
    if (fresh) {
      state.visited.add(s.i);
      addScore(s.points);
      floatPoints(s.points);
      const verb = how === 'Jumped' ? 'Jumped to'
        : how === 'Revisited' ? 'Visited'
        : /^(Rolled|Moved)/.test(how) ? `${how}, landed on` : how;
      addLog(`${verb} ${s.title}`, s.points);
      refreshSpace(s.i);
      updateHud();
    }
    if (s.type === 'case') {
      unlock('case');
      if (CASE_SPACES.every(c => state.visited.has(c.i))) unlock('cases');
    }
    if (s.type === 'pitch') unlock('pitch');
    if (state.visited.size === N) unlock('all');
    save();
    return fresh;
  }

  /* ------------------------------------------------------------------ */
  /*  Cards (dialog)                                                     */
  /* ------------------------------------------------------------------ */
  const dlg = document.getElementById('card');
  let afterClose = null, onCloseHook = null;

  function openCard(html, opts = {}) {
    // Swapping one card for another: run the old card's cleanup, keep the dialog open
    if (dlg.open && onCloseHook) { try { onCloseHook(); } catch (e) {} }
    afterClose = null;
    onCloseHook = opts.onClose || null;
    dlg.dataset.size = opts.size || 'm';
    dlg.dataset.type = opts.type || '';
    dlg.classList.remove('is-closing');
    dlg.innerHTML = html;
    if (!dlg.open) dlg.showModal();
    if (toastBox.children.length) lift(toastBox);
    const scroller = dlg.querySelector('.sheet__scroll');
    if (scroller) scroller.scrollTop = 0;
    SFX.play('flip');
    if (opts.onOpen) opts.onOpen(dlg);
  }

  function closeCard(then) {
    if (!dlg.open) { if (then) then(); return; }
    afterClose = then || null;
    if (reduced()) { dlg.close(); return; }
    dlg.classList.add('is-closing');
    setTimeout(() => { if (dlg.open) dlg.close(); }, 170);
  }

  dlg.addEventListener('cancel', e => { e.preventDefault(); closeCard(); });
  dlg.addEventListener('close', () => {
    dlg.classList.remove('is-closing');
    if (onCloseHook) { try { onCloseHook(); } catch (e) {} onCloseHook = null; }
    if (/^#case\//.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
    const then = afterClose;
    afterClose = null;
    dlg.innerHTML = '';
    if (then) { then(); return; }
    if (state.view === 'play' && el.roll && !el.roll.disabled) el.roll.focus({ preventScroll: true });
    maybeEnd();
  });
  dlg.addEventListener('click', e => {
    e.stopPropagation(); // card clicks are handled here, never by the page-level handler
    if (e.target === dlg) { closeCard(); return; }
    const t = e.target.closest('[data-close],[data-roll],[data-goto-case],[data-copy],[data-action],[data-view],[data-open],[data-reset],[data-mouth-next]');
    if (!t) return;
    if (t.hasAttribute('data-close')) closeCard();
    else if (t.hasAttribute('data-roll')) closeCard(() => roll());
    else if (t.hasAttribute('data-goto-case')) { const i = caseSpace(Number(t.dataset.gotoCase)); closeCard(() => travelTo(i, 'Jumped')); }
    else if (t.hasAttribute('data-copy')) copy(t.dataset.copy, t.dataset.copyLabel || 'Copied');
    else if (t.hasAttribute('data-action')) { const a = JSON.parse(t.dataset.action); closeCard(() => doAction(a)); }
    else if (t.hasAttribute('data-view')) { e.preventDefault(); closeCard(() => setView(t.dataset.view)); }
    else if (t.hasAttribute('data-open')) { closeCard(() => openSpace(BOARD.find(s => s.type === t.dataset.open))); }
    else if (t.hasAttribute('data-reset')) { closeCard(() => { resetGame(); }); }
    else if (t.hasAttribute('data-mouth-next')) { showMouth(Number(t.dataset.mouthNext)); }
  });

  const closeBtn = `<button type="button" class="sheet__close" data-close aria-label="Close card">${icon('x')}</button>`;
  const btnBoard = `<button type="button" class="btn btn--paper" data-close>Back to the board</button>`;
  const btnRoll = `<button type="button" class="btn btn--primary" data-roll>${icon('dice')}Roll again</button>`;
  const sheet = (cls, body, foot, style = '') =>
    `<div class="sheet ${cls}" tabindex="-1" autofocus${style ? ` style="${style}"` : ''}>${closeBtn}<div class="sheet__scroll">${body}</div>${foot ? `<footer class="sheet__foot">${foot}</footer>` : ''}</div>`;

  function openSpace(s) {
    if (!s) return;
    const R = {
      case: () => caseCard(s.caseIndex), wild: wildCard, mouth: () => showMouth(nextMouth()), about: aboutCard,
      pitch: pitchCard, game: gameCard, launch: rulesCard, skills: skillsCard, tools: toolsCard,
      experience: expCard, education: eduCard, playbook: playbookCard
    };
    (R[s.type] || rulesCard)();
  }

  const caseSpace = ci => BOARD.findIndex(s => s.type === 'case' && s.caseIndex === ci);

  /* ---- Case study ---------------------------------------------------- */
  function coverArt(cs, k) {
    const c = HEX[cs.colour] || HEX[ORDER[k % ORDER.length]];
    const h = cs.headline || (cs.results || [])[0];
    const big = h ? metric(h) : '';
    const label = h ? (h.label || '') : '';
    const size = big.length > 7 ? 96 : 132;
    const variant = k % 3;
    let deco = '';
    if (variant === 0) {
      deco = `<circle cx="560" cy="40" r="180" fill="#fff" opacity=".22"/>
        <circle cx="560" cy="40" r="104" fill="none" stroke="${HEX.ink}" stroke-width="4"/>
        <g stroke="${HEX.ink}" stroke-width="4" opacity=".9">${[0, 1, 2, 3].map(j => `<line x1="${430 + j * 30}" y1="320" x2="${560 + j * 30}" y2="190"/>`).join('')}</g>`;
    } else if (variant === 1) {
      deco = `<rect x="438" y="-40" width="240" height="240" rx="120" fill="#fff" opacity=".22"/>
        <g fill="${HEX.ink}" opacity=".85">${Array.from({ length: 20 }, (_, j) => `<circle cx="${470 + (j % 5) * 30}" cy="${196 + Math.floor(j / 5) * 30}" r="4.5"/>`).join('')}</g>
        <path d="M600 40l12 26 28 4-20 20 5 28-25-13-25 13 5-28-20-20 28-4z" fill="#fff" stroke="${HEX.ink}" stroke-width="4" stroke-linejoin="round"/>`;
    } else {
      deco = `<g opacity=".24" fill="#fff"><rect x="400" y="-20" width="70" height="380" transform="rotate(24 435 160)"/><rect x="510" y="-20" width="70" height="380" transform="rotate(24 545 160)"/></g>
        <circle cx="560" cy="236" r="62" fill="#fff" stroke="${HEX.ink}" stroke-width="4"/>
        <circle cx="560" cy="236" r="30" fill="${c}" stroke="${HEX.ink}" stroke-width="4"/>`;
    }
    return `<svg class="cover" viewBox="0 0 640 320" role="img" aria-label="${esc(cs.client)}: ${esc(big)} ${esc(label)}">
      <rect width="640" height="320" fill="${c}"/>${deco}
      <text x="40" y="64" class="cover__client">${esc(cs.client || '')}</text>
      <text x="34" y="${size > 100 ? 226 : 214}" class="cover__big" style="font-size:${size}px">${esc(big)}</text>
      <text x="40" y="272" class="cover__label">${esc(label)}</text>
    </svg>`;
  }

  function coverFor(cs, k) {
    return cs.image
      ? `<img class="cover cover--img" src="${esc(cs.image)}" alt="${esc(cs.title)} for ${esc(cs.client)}" loading="lazy">`
      : coverArt(cs, k);
  }

  function kpis(results, big = true) {
    return `<div class="kpis${big ? '' : ' kpis--compact'}">${(results || []).map(r => `
      <div class="kpi">
        <span class="kpi__value" aria-hidden="true" data-count data-to="${Number(r.value)}" data-dec="${r.decimals || 0}" data-pre="${esc(r.prefix || '')}" data-suf="${esc(r.suffix || '')}">${esc(metric(r))}</span>
        <span class="sr-only">${esc(metric(r))}</span>
        <span class="kpi__label">${esc(r.label)}</span>
      </div>`).join('')}</div>`;
  }

  function countUp(root) {
    if (reduced()) return;
    $$('[data-count]', root).forEach(e => {
      const to = Number(e.dataset.to), d = Number(e.dataset.dec), pre = e.dataset.pre, suf = e.dataset.suf;
      const t0 = performance.now() + 250, dur = 1000;
      e.textContent = pre + fmt(0, d) + suf;
      (function step(t) {
        const k = Math.max(0, Math.min(1, (t - t0) / dur));
        const v = to * (1 - Math.pow(1 - k, 4));
        e.textContent = pre + fmt(d ? v : Math.round(v), d) + suf;
        if (k < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }

  function caseCard(ci) {
    const cs = CASES[ci];
    if (!cs) return;
    const s = BOARD[caseSpace(ci)];
    const n = CASES.length;
    const body = `
      <header class="case-head">
        <p class="case-head__count"><span class="swatch"></span>Case study ${ci + 1} of ${n}</p>
        <h2 class="case-head__title" id="card-title">${esc(cs.title)}</h2>
        <ul class="badges">${[cs.client, cs.year, cs.role].filter(Boolean).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
      </header>
      <figure class="case-cover">${coverFor(cs, ci)}</figure>
      <div class="case-body">
        <p class="case-summary">${esc(cs.summary || '')}</p>
        ${cs.challenge ? `<section class="case-sec"><h3>The brief</h3><p>${esc(cs.challenge)}</p></section>` : ''}
        ${(cs.approach || []).length ? `<section class="case-sec"><h3>The play</h3><ol class="steps">${cs.approach.map(a => `<li>${esc(a)}</li>`).join('')}</ol></section>` : ''}
        ${(cs.results || []).length ? `<section class="case-sec"><h3>The score</h3>${kpis(cs.results)}</section>` : ''}
        ${(cs.tags || []).length ? `<ul class="tags" aria-label="Skills used">${cs.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        ${cs.link ? `<p><a class="text-link" href="${esc(cs.link)}" target="_blank" rel="noopener">See the campaign live</a></p>` : ''}
      </div>`;
    const url = location.href.split('#')[0] + '#case/' + encodeURIComponent(cs.id || ci);
    const foot = `
      <button type="button" class="btn btn--paper btn--sm" data-copy="${esc(url)}" data-copy-label="Link to this case study copied">${icon('link')}<span>Copy link</span></button>
      <span class="spacer"></span>
      ${n > 1 ? `<button type="button" class="btn btn--paper btn--sm btn--icon" data-goto-case="${(ci - 1 + n) % n}" aria-label="Previous case study">${icon('left')}</button>
      <button type="button" class="btn btn--primary btn--sm" data-goto-case="${(ci + 1) % n}"><span>Next case study</span>${icon('right')}</button>` : btnRoll}`;
    openCard(sheet('sheet--case', body, foot, `--c:var(--${s.colour})`), {
      size: 'l', type: 'case',
      onOpen: d => { countUp(d); history.replaceState(null, '', '#case/' + encodeURIComponent(cs.id || ci)); }
    });
  }

  /* ---- Wildcards ----------------------------------------------------- */
  let wildDeck = [];
  function drawWild() {
    if (!wildDeck.length) {
      wildDeck = WILDCARDS.map((_, i) => i);
      for (let i = wildDeck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [wildDeck[i], wildDeck[j]] = [wildDeck[j], wildDeck[i]]; }
    }
    return WILDCARDS[wildDeck.pop()];
  }

  function wildCard() {
    const w = drawWild();
    unlock('wild');
    const act = w.action ? `<button type="button" class="btn btn--primary" data-action='${esc(JSON.stringify(w.action))}'>${esc(w.button || 'Continue')}</button>` : btnRoll;
    const html = `
      <div class="sheet sheet--wild" tabindex="-1" autofocus>
        <div class="flip${reduced() ? ' is-flipped' : ''}">
          <div class="flip__back" aria-hidden="true"><span class="flip__emblem">${icon('star')}</span><span class="flip__word">Wildcard</span></div>
          <div class="flip__front">
            ${closeBtn}
            <p class="wild__kicker">${icon('star')}Wildcard</p>
            <h2 class="wild__title" id="card-title">${esc(w.title || 'Wildcard')}</h2>
            <p class="wild__text">${esc(w.text)}</p>
            <div class="wild__actions">${act}</div>
          </div>
        </div>
      </div>`;
    openCard(html, {
      size: 's', type: 'wild',
      onOpen: d => { if (!reduced()) setTimeout(() => { const f = d.querySelector('.flip'); if (f) { f.classList.add('is-flipped'); SFX.play('flip'); } }, 420); }
    });
  }

  function doAction(a) {
    if (!a) return;
    if (a.type === 'move') {
      (async () => {
        setBusy(true);
        await walk(Number(a.steps) || 0);
        setBusy(false);
        land(Number(a.steps) < 0 ? `Moved back ${Math.abs(a.steps)}` : `Moved ahead ${a.steps}`);
      })();
    } else if (a.type === 'goto') {
      const i = BOARD.findIndex(s => s.type === a.target);
      if (i >= 0) travelTo(i, 'Jumped');
    } else if (a.type === 'nextCase') {
      for (let k = 1; k <= N; k++) {
        const i = (state.pos + k) % N;
        if (BOARD[i].type === 'case') { travelTo(i, 'Jumped'); break; }
      }
    } else if (a.type === 'roll') {
      roll();
    } else if (a.type === 'buzz') {
      const amt = Number(a.amount) || 0;
      addScore(amt);
      addLog('Wildcard bonus', amt);
      floatPoints(amt);
      SFX.play('coin');
      save();
    }
  }

  /* ---- Word of mouth ------------------------------------------------- */
  let mouthIdx = -1;
  function nextMouth() { mouthIdx = (mouthIdx + 1) % Math.max(1, TESTIMONIALS.length); return mouthIdx; }
  function showMouth(k) {
    const t = TESTIMONIALS[k];
    if (!t) return;
    mouthIdx = k;
    const n = TESTIMONIALS.length;
    const body = `
      <div class="mouth">
        <p class="mouth__kicker">${icon('chat')}Word of mouth${n > 1 ? `<span>${k + 1} of ${n}</span>` : ''}</p>
        <blockquote class="mouth__quote" id="card-title"><p>${esc(t.quote)}</p></blockquote>
        <p class="mouth__who"><strong>${esc(t.name)}</strong>${t.title ? `<span>${esc(t.title)}</span>` : ''}</p>
      </div>`;
    const foot = `${n > 1 ? `<button type="button" class="btn btn--paper btn--sm" data-mouth-next="${(k + 1) % n}">Next quote${icon('right')}</button>` : ''}<span class="spacer"></span>${btnRoll}`;
    if (dlg.open && dlg.dataset.type === 'mouth') {
      $('.sheet__scroll', dlg).innerHTML = body;
      $('.sheet__foot', dlg).innerHTML = foot;
      SFX.play('flip');
      return;
    }
    openCard(sheet('sheet--mouth', body, foot), { size: 'm', type: 'mouth' });
  }

  /* ---- Player card --------------------------------------------------- */
  function contactLinks() {
    const L = [];
    if (P.linkedin) L.push({ href: P.linkedin, label: 'LinkedIn', icon: 'linkedin', ext: true });
    if (P.instagram) L.push({ href: P.instagram, label: 'Instagram', icon: 'instagram', ext: true });
    if (P.website) L.push({ href: P.website, label: 'Website', icon: 'globe', ext: true });
    if (P.calendly) L.push({ href: P.calendly, label: 'Book a call', icon: 'calendar', ext: true });
    if (P.cv) L.push({ href: P.cv, label: 'Download CV', icon: 'download', download: true });
    return L;
  }
  const linkBtn = (l, cls = 'btn btn--paper btn--sm') =>
    `<a class="${cls}" href="${esc(l.href)}"${l.ext ? ' target="_blank" rel="noopener"' : ''}${l.download ? ' download' : ''}>${icon(l.icon)}${esc(l.label)}</a>`;

  function aboutCard() {
    const body = `
      <header class="player">
        ${portrait('player__portrait')}
        <div class="player__id">
          <p class="player__kicker">Player 1</p>
          <h2 class="player__name" id="card-title">${esc(P.name)}</h2>
          <p class="player__class">${esc(P.role)}${P.location ? `<span>${esc(P.location)}</span>` : ''}</p>
        </div>
      </header>
      <div class="player__body">
        <div class="player__bio">
          ${(P.bio || []).map(p => `<p>${esc(p)}</p>`).join('')}
          <dl class="traits">
            ${C.superpower ? `<div><dt>Superpower</dt><dd>${esc(C.superpower)}</dd></div>` : ''}
            ${C.weakness ? `<div><dt>Weakness</dt><dd>${esc(C.weakness)}</dd></div>` : ''}
          </dl>
        </div>
        ${(C.stats || []).length ? `<div class="player__stats"><h3>Stats</h3>${meters(C.stats)}</div>` : ''}
      </div>
      ${P.lookingFor ? `<p class="looking"><strong>Looking for</strong>${esc(P.lookingFor)}</p>` : ''}`;
    const foot = `${P.email ? `<a class="btn btn--primary btn--sm" href="mailto:${esc(P.email)}">${icon('mail')}Email ${esc(FIRST)}</a>` : ''}
      ${contactLinks().slice(0, 2).map(l => linkBtn(l)).join('')}<span class="spacer"></span>${btnBoard}`;
    openCard(sheet('sheet--player', body, foot), { size: 'l', type: 'about' });
  }

  /* ---- The pitch ----------------------------------------------------- */
  function pitchCard() {
    const body = `
      <div class="pitch">
        <p class="pitch__kicker">${icon('mail')}The pitch</p>
        <h2 class="pitch__title" id="card-title">Your move.</h2>
        <p class="pitch__lead">You’ve seen the work. If there’s a role, a brief or a coffee in it, ${esc(FIRST)} would love to hear from you.</p>
        ${P.email ? `<div class="pitch__email">
          <a href="mailto:${esc(P.email)}">${esc(P.email)}</a>
          <button type="button" class="btn btn--paper btn--sm" data-copy="${esc(P.email)}" data-copy-label="Email address copied">${icon('copy')}Copy</button>
        </div>` : ''}
        <div class="pitch__links">${contactLinks().map(l => linkBtn(l)).join('')}</div>
        ${P.lookingFor ? `<p class="looking"><strong>Looking for</strong>${esc(P.lookingFor)}</p>` : ''}
      </div>`;
    openCard(sheet('sheet--pitch', body, `<span class="spacer"></span>${btnBoard}${btnRoll}`), { size: 'm', type: 'pitch' });
  }

  /* ---- Rules --------------------------------------------------------- */
  function rulesCard() {
    const body = `
      <div class="info">
        <p class="info__kicker">${icon('rocket')}Launch day</p>
        <h2 class="info__title" id="card-title">How to play</h2>
        <ol class="steps steps--big">
          <li><strong>Roll the die.</strong> Hit the button in the middle of the board, or press R.</li>
          <li><strong>Land on a space.</strong> The coloured-band spaces are case studies. The rest are skills, stories and surprises.</li>
          <li><strong>Jump anywhere.</strong> Click any space to go straight to it.</li>
          <li><strong>Clear the board.</strong> Visit all ${N} spaces to finish. Every lap past Launch day earns 200 Buzz.</li>
        </ol>
        <p class="info__aside">In a hurry? The whole portfolio is also on one page. <a href="#read" data-view="read" class="text-link">Read it instead</a></p>
      </div>`;
    openCard(sheet('sheet--info', body, `<span class="spacer"></span>${state.opened ? btnRoll : btnBoard}`, '--c:var(--sun)'), { size: 'm', type: 'rules' });
  }

  /* ---- Info spaces --------------------------------------------------- */
  function infoCard(type, title, inner, colour) {
    const m = META[type];
    const body = `<div class="info"><p class="info__kicker">${icon(m.icon)}${esc(m.title)}</p><h2 class="info__title" id="card-title">${esc(title)}</h2>${inner}</div>`;
    openCard(sheet('sheet--info', body, `<span class="spacer"></span>${btnRoll}`, `--c:var(--${colour || m.colour})`), { size: 'm', type });
  }

  function skillsCard() {
    infoCard('skills', 'What I bring to the table', `<ul class="skills">${(C.skills || []).map((s, k) =>
      `<li style="--c:var(--${ORDER[k % ORDER.length]})"><span class="skills__dot"></span><div><strong>${esc(s.name)}</strong><p>${esc(s.detail || '')}</p></div></li>`).join('')}</ul>`);
  }

  function toolsCard() {
    const tools = C.toolkit || [];
    infoCard('tools', 'Inventory', `<p class="info__lead">${plural(tools.length, 'item', 'items')} in the bag, used weekly.</p>
      <ul class="inventory">${tools.map((t, k) => `<li style="--c:var(--${ORDER[k % ORDER.length]})"><span>${esc(t)}</span></li>`).join('')}</ul>`);
  }

  function expCard() {
    infoCard('experience', 'Levels completed', `<ol class="path">${(C.experience || []).map((x, k) =>
      `<li style="--c:var(--${ORDER[k % ORDER.length]})"><p class="path__when">${esc(x.period)}</p><h3>${esc(x.role)}</h3><p class="path__where">${esc(x.company)}</p>${x.detail ? `<p>${esc(x.detail)}</p>` : ''}</li>`).join('')}</ol>`);
  }

  function eduCard() {
    infoCard('education', 'Training & certifications', `<ul class="certs">${(C.education || []).map((x, k) =>
      `<li style="--c:var(--${ORDER[k % ORDER.length]})"><span class="certs__badge">${icon('cap')}</span><div><strong>${esc(x.title)}</strong><span>${esc(x.place)}</span></div><span class="certs__year">${esc(x.year || '')}</span></li>`).join('')}</ul>`);
  }

  function playbookCard() {
    infoCard('playbook', 'How I work', `<ol class="steps steps--big">${(C.playbook || []).map(p =>
      `<li><strong>${esc(p.step)}.</strong> ${esc(p.detail)}</li>`).join('')}</ol>`);
  }

  /* ---- Mini-game ----------------------------------------------------- */
  function gameCard() {
    const html = sheet('sheet--game', `<div class="ab-root"></div>`, '', '--c:var(--mint)');
    openCard(html, {
      size: 'm', type: 'game',
      onOpen: d => {
        if (!window.AdBreak) return;
        window.AdBreak.mount($('.ab-root', d), {
          sfx: SFX,
          reduced,
          onFinish: res => {
            const pts = res.buzz;
            addScore(pts);
            addLog(`Ad break: grade ${res.grade}`, pts);
            if (!state.best || res.hits > state.best.hits) state.best = { hits: res.hits, grade: res.grade };
            if (/^A/.test(res.grade)) {
              unlock('bullseye');
              const r = d.querySelector('.sheet').getBoundingClientRect();
              Confetti.burst({ x: r.left + r.width / 2, y: r.top + 80, count: 90, spread: 'up' });
            }
            save();
          }
        });
      },
      onClose: () => { if (window.AdBreak) window.AdBreak.destroy(); }
    });
  }

  /* ---- End of game --------------------------------------------------- */
  function maybeEnd() {
    if (state.visited.size === N && !state.done) {
      state.done = true;
      save();
      setTimeout(endCard, 350);
    }
  }

  function endCard() {
    const body = `
      <div class="end">
        <div class="end__trophy">${icon('trophy')}</div>
        <h2 class="end__title" id="card-title">You cleared the board!</h2>
        <p class="end__score"><b>${fmt(state.score)}</b> Buzz from ${plural(state.rolls, 'roll', 'rolls')}</p>
        <p class="end__lead">That’s every campaign, every skill and every story. There’s only one move left, and it’s yours.</p>
        <div class="end__actions">
          ${P.email ? `<a class="btn btn--primary btn--lg" href="mailto:${esc(P.email)}?subject=${encodeURIComponent('I just finished your portfolio game')}">${icon('mail')}Email ${esc(FIRST)}</a>` : ''}
          <a class="btn btn--paper btn--lg" href="#read" data-view="read">${icon('book')}Read the portfolio</a>
        </div>
        <button type="button" class="end__again" data-reset>${icon('reset')}Play again from the start</button>
      </div>`;
    openCard(sheet('sheet--end', body, ''), { size: 'm', type: 'end' });
    SFX.play('win');
    Confetti.burst({ count: 220 });
  }

  /* ------------------------------------------------------------------ */
  /*  Read-only portfolio                                                */
  /* ------------------------------------------------------------------ */
  function renderRead() {
    const links = contactLinks();
    const readCase = (cs, k) => {
      const s = BOARD[caseSpace(k)];
      return `
      <article class="r-case" id="work-${esc(cs.id || k)}" style="--c:var(--${s.colour})">
        <div class="r-case__cover">${coverFor(cs, k)}</div>
        <div class="r-case__text">
          <h3>${esc(cs.title)}</h3>
          <ul class="badges">${[cs.client, cs.year, cs.role].filter(Boolean).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
          <p class="r-case__summary">${esc(cs.summary || '')}</p>
          ${kpis(cs.results, false)}
          <details class="r-case__more">
            <summary>The brief and the play</summary>
            ${cs.challenge ? `<p>${esc(cs.challenge)}</p>` : ''}
            ${(cs.approach || []).length ? `<ol class="steps">${cs.approach.map(a => `<li>${esc(a)}</li>`).join('')}</ol>` : ''}
          </details>
          ${(cs.tags || []).length ? `<ul class="tags">${cs.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        </div>
      </article>`;
    };

    $('#portfolio').innerHTML = `
      <div class="read__inner">
        <header class="r-hero">
          <div class="r-hero__text">
            <p class="r-hero__role">${esc(P.role)}${P.location ? `, ${esc(P.location)}` : ''}</p>
            <h1 class="r-hero__name">${esc(P.name)}</h1>
            <p class="r-hero__tagline">${esc(P.tagline || '')}</p>
            <div class="r-hero__bio">${(P.bio || []).map(p => `<p>${esc(p)}</p>`).join('')}</div>
            <div class="r-hero__cta">
              ${P.email ? `<a class="btn btn--primary" href="mailto:${esc(P.email)}">${icon('mail')}Email ${esc(FIRST)}</a>` : ''}
              ${links.map(l => linkBtn(l, 'btn btn--paper')).join('')}
            </div>
          </div>
          <aside class="r-hero__side">
            ${portrait('r-portrait')}
            <button type="button" class="btn btn--ink" data-view="play">${icon('dice')}Play it as a board game</button>
          </aside>
        </header>

        ${CASES.length ? `<section class="r-sec" aria-labelledby="r-work"><h2 id="r-work">Selected work</h2><div class="r-cases">${CASES.map(readCase).join('')}</div></section>` : ''}

        <section class="r-sec r-cols">
          ${(C.skills || []).length ? `<div><h2>What I do</h2><ul class="skills">${C.skills.map((s, k) => `<li style="--c:var(--${ORDER[k % ORDER.length]})"><span class="skills__dot"></span><div><strong>${esc(s.name)}</strong><p>${esc(s.detail || '')}</p></div></li>`).join('')}</ul></div>` : ''}
          ${(C.playbook || []).length ? `<div><h2>How I work</h2><ol class="steps steps--big">${C.playbook.map(p => `<li><strong>${esc(p.step)}.</strong> ${esc(p.detail)}</li>`).join('')}</ol></div>` : ''}
        </section>

        ${(C.experience || []).length ? `<section class="r-sec" aria-labelledby="r-exp"><h2 id="r-exp">Experience</h2>
          <ol class="r-exp">${C.experience.map(x => `<li><span class="r-exp__when">${esc(x.period)}</span><div><h3>${esc(x.role)}<span>${esc(x.company)}</span></h3>${x.detail ? `<p>${esc(x.detail)}</p>` : ''}</div></li>`).join('')}</ol></section>` : ''}

        <section class="r-sec r-cols">
          ${(C.toolkit || []).length ? `<div><h2>Toolkit</h2><ul class="tags tags--lg">${C.toolkit.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>` : ''}
          ${(C.education || []).length ? `<div><h2>Training</h2><ul class="certs">${C.education.map((x, k) => `<li style="--c:var(--${ORDER[k % ORDER.length]})"><span class="certs__badge">${icon('cap')}</span><div><strong>${esc(x.title)}</strong><span>${esc(x.place)}</span></div><span class="certs__year">${esc(x.year || '')}</span></li>`).join('')}</ul></div>` : ''}
        </section>

        ${TESTIMONIALS.length ? `<section class="r-sec" aria-labelledby="r-words"><h2 id="r-words">Kind words</h2>
          <div class="r-quotes">${TESTIMONIALS.map(t => `<figure class="r-quote"><blockquote><p>${esc(t.quote)}</p></blockquote><figcaption><strong>${esc(t.name)}</strong>${t.title ? `<span>${esc(t.title)}</span>` : ''}</figcaption></figure>`).join('')}</div></section>` : ''}

        <footer class="r-contact">
          <h2>Let’s make something people talk about.</h2>
          ${P.lookingFor ? `<p class="r-contact__looking">${esc(P.lookingFor)}</p>` : ''}
          ${P.email ? `<a class="r-contact__email" href="mailto:${esc(P.email)}">${esc(P.email)}</a>` : ''}
          <div class="r-contact__links">${links.map(l => linkBtn(l, 'btn btn--paper btn--sm')).join('')}</div>
          <p class="r-contact__fine">© ${new Date().getFullYear()} ${esc(P.name)}. Built as a board game, because a PDF felt too easy.</p>
        </footer>
      </div>`;
  }

  /* ------------------------------------------------------------------ */
  /*  Views, lid, routing                                                */
  /* ------------------------------------------------------------------ */
  function setView(v, push = true) {
    if (v !== 'read') v = 'play';
    state.view = v;
    document.body.dataset.mode = v;
    $('#stage').hidden = v !== 'play';
    $('#portfolio').hidden = v !== 'read';
    $$('[data-view-btn]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.viewBtn === v)));
    if (push) {
      const url = v === 'read' ? '#read' : location.pathname + location.search;
      if ((v === 'read') !== (location.hash === '#read')) history.pushState({ v }, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (v === 'play') {
      requestAnimationFrame(placeToken);
      if (!state.opened) setTimeout(() => { const b = $('#btn-open'); if (b) b.focus({ preventScroll: true }); }, 50);
    } else {
      const h = $('#portfolio h1');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
  }

  function openLid(instant) {
    if (state.opened) return;
    state.opened = true;
    SFX.ensure();
    const stage = $('#stage');
    const done = () => {
      $('#lid').hidden = true;
      stage.classList.remove('is-opening');
      placeToken();
      setBusy(false);
      setStatus(state.visited.size ? 'Welcome back. Roll the die to keep going.' : 'Roll the die to start, or click any space to jump there.');
      if (!instant) el.roll.focus({ preventScroll: true });
      if (!state.visited.size) el.roll.classList.add('is-inviting');
    };
    if (instant || reduced()) { stage.classList.add('is-open'); done(); return; }
    SFX.play('open');
    stage.classList.add('is-opening');
    setTimeout(() => stage.classList.add('is-open'), 220);
    setTimeout(done, 950);
  }

  function resetGame() {
    Object.assign(state, { pos: 0, score: 0, rolls: 0, laps: 0, log: [], done: false, golden: false, best: null });
    state.visited.clear();
    state.ach.clear();
    shownScore = 0;
    save();
    tokenEl.classList.remove('is-golden');
    spaceEls.forEach((_, i) => refreshSpace(i));
    renderLog();
    renderAchievements();
    updateHud(false);
    placeToken();
    setStatus('New game. Roll the die to start.');
    toast({ kicker: 'Fresh start', title: 'The board has been reset', icon: 'reset' });
  }

  function route(initial) {
    const h = decodeURIComponent(location.hash || '');
    if (h === '#read') { setView('read', false); return; }
    const m = h.match(/^#case\/(.+)$/);
    if (m) {
      setView('play', false);
      openLid(true);
      const ci = CASES.findIndex((c, k) => String(c.id || k) === m[1]);
      if (ci >= 0) {
        const i = caseSpace(ci);
        if (initial || i !== state.pos || !dlg.open) {
          state.pos = i;
          placeToken();
          if (dlg.open) dlg.close();
          land('Opened a link to');
        }
      }
      return;
    }
    setView('play', false);
  }

  /* ------------------------------------------------------------------ */
  /*  Toasts, copying, sample note                                       */
  /* ------------------------------------------------------------------ */
  const toastBox = document.getElementById('toasts');
  function lift(layer) {
    // Keep toasts and confetti above an open card (both live in the top layer)
    if (!layer.showPopover) return;
    try { if (layer.matches(':popover-open')) layer.hidePopover(); layer.showPopover(); } catch (e) {}
  }
  function toast({ kicker, title, pts, icon: ic }) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span class="toast__icon">${icon(ic || 'trophy')}</span><span class="toast__text"><span class="toast__kicker">${esc(kicker)}</span><span class="toast__title">${esc(title)}</span></span>${pts ? `<span class="toast__pts">+${fmt(pts)}</span>` : ''}`;
    toastBox.appendChild(t);
    lift(toastBox);
    setTimeout(() => {
      t.classList.add('is-leaving');
      setTimeout(() => {
        t.remove();
        if (!toastBox.children.length && toastBox.hidePopover) { try { toastBox.hidePopover(); } catch (e) {} }
      }, 320);
    }, 3200);
  }

  async function copy(text, label) {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      (dlg.open ? dlg : document.body).appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (e2) {}
      ta.remove();
    }
    toast({ kicker: ok ? 'Done' : 'Copy failed', title: ok ? label : 'Select the text and copy it manually', icon: ok ? 'check' : 'x' });
    SFX.play(ok ? 'good' : 'bad');
  }

  function sampleNote() {
    const note = $('#sample-note');
    if (!C.sampleContent || !note) return;
    let dismissed = false;
    try { dismissed = sessionStorage.getItem('sample-note') === '1'; } catch (e) {}
    if (dismissed) return;
    note.innerHTML = `<button type="button" class="sticky-note__x" aria-label="Hide this note">${icon('x')}</button>
      <strong>Sample content</strong>Edit <code>js/content.js</code> to make this portfolio yours, then set <code>sampleContent: false</code>.`;
    note.hidden = false;
    note.querySelector('button').addEventListener('click', () => {
      note.hidden = true;
      try { sessionStorage.setItem('sample-note', '1'); } catch (e) {}
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Events                                                             */
  /* ------------------------------------------------------------------ */
  function bind() {
    document.addEventListener('click', e => {
      const v = e.target.closest('[data-view]');
      if (v && !dlg.contains(v)) {
        e.preventDefault();
        if (v.dataset.view === 'play' && !state.opened && state.view === 'play') { $('#btn-open')?.focus(); return; }
        setView(v.dataset.view);
        return;
      }
      if (e.target.closest('#btn-open')) { openLid(); return; }
      if (e.target.closest('#btn-new')) { resetGame(); openLid(); return; }
      if (e.target.closest('#btn-roll')) { el.roll.classList.remove('is-inviting'); roll(); return; }
      if (e.target.closest('#btn-help')) { rulesCard(); return; }
      if (e.target.closest('#btn-sound')) {
        SFX.enabled = !SFX.enabled;
        const b = $('#btn-sound');
        b.setAttribute('aria-pressed', String(SFX.enabled));
        b.innerHTML = icon(SFX.enabled ? 'volume' : 'mute');
        if (SFX.enabled) SFX.play('coin');
        save();
        return;
      }
      const deck = e.target.closest('[data-deck]');
      if (deck && state.opened && !state.busy) {
        deck.classList.remove('is-drawing'); void deck.offsetWidth; deck.classList.add('is-drawing');
        setTimeout(() => (deck.dataset.deck === 'wild' ? wildCard() : showMouth(nextMouth())), reduced() ? 0 : 220);
        return;
      }
      const sp = e.target.closest('.space');
      if (sp && state.opened) { el.roll.classList.remove('is-inviting'); travelTo(Number(sp.dataset.i)); return; }
      const open = e.target.closest('[data-open]');
      if (open && !dlg.contains(open)) { openSpace(BOARD.find(s => s.type === open.dataset.open)); return; }
      if (e.target.closest('[data-reset]') && !dlg.contains(e.target)) {
        if (window.confirm('Reset the game? Your progress and Buzz will be cleared.')) resetGame();
      }
    });

    const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
    let kIdx = 0;
    document.addEventListener('keydown', e => {
      const k = (e.key || '').toLowerCase();
      kIdx = k === KONAMI[kIdx] ? kIdx + 1 : (k === KONAMI[0] ? 1 : 0);
      if (kIdx === KONAMI.length) { kIdx = 0; cheat(); }
      if (dlg.open || state.view !== 'play' || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest && e.target.closest('input, textarea, select')) return;
      if (!state.opened) return;
      if (k === 'r') { e.preventDefault(); el.roll.classList.remove('is-inviting'); roll(); }
      else if (k === ' ' && !(e.target.closest && e.target.closest('button, a'))) { e.preventDefault(); roll(); }
      else if (k === '?') { rulesCard(); }
    });

    window.addEventListener('popstate', () => route(false));
    window.addEventListener('hashchange', () => route(false));

    new ResizeObserver(() => placeToken()).observe($('#board'));
    window.addEventListener('beforeprint', () => $$('details').forEach(d => { d.open = true; }));

    // A gentle tilt so the board feels like a physical object
    const table = $('#table');
    if (matchMedia('(pointer: fine)').matches) {
      let raf = 0;
      table.addEventListener('pointermove', e => {
        if (reduced() || !state.opened || raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = boardEl.getBoundingClientRect();
          const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / r.width));
          const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / r.height));
          boardEl.style.transform = `perspective(1600px) rotateX(${(-dy * 2.4).toFixed(2)}deg) rotateY(${(dx * 2.4).toFixed(2)}deg)`;
        });
      });
      table.addEventListener('pointerleave', () => { boardEl.style.transform = ''; });
    }
  }

  function cheat() {
    if (state.golden) return;
    state.golden = true;
    tokenEl.classList.add('is-golden');
    unlock('cheat');
    Confetti.burst({ count: 140 });
    SFX.play('win');
    save();
  }

  /* ------------------------------------------------------------------ */
  /*  Boot                                                               */
  /* ------------------------------------------------------------------ */
  function boot() {
    document.title = `${P.name} | The Marketing Game`;
    renderHud();
    renderLid();
    renderBoard();
    renderPanels();
    renderRead();
    bind();
    sampleNote();
    route(true);
    requestAnimationFrame(() => { placeToken(); document.body.classList.add('is-ready'); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeToken);
  }

  boot();
})();
