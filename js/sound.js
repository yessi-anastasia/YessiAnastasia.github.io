/* =====================================================================
   THE MARKETING GAME — sound.js
   Every sound is synthesised live with the Web Audio API, so there are
   no audio files to download. Sounds only ever play after a click.
   ===================================================================== */
window.SFX = (function () {
  'use strict';
  let ctx = null, master = null, noiseBuf = null;
  let enabled = true;

  function ensure() {
    if (!enabled) return null;
    // Browsers only allow audio after the visitor has interacted with the page
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC(); } catch (e) { return null; }
      master = ctx.createGain();
      master.gain.value = 0.26;
      master.connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.6), ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, t0, dur, type, vol, freqEnd) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.3, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.03);
  }

  function noise(t0, dur, freq, q, vol) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf;
    f.type = 'bandpass'; f.frequency.value = freq || 2000; f.Q.value = q || 1;
    g.gain.setValueAtTime(vol || 0.3, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t0, Math.random() * 0.3); s.stop(t0 + dur + 0.03);
  }

  const S = {
    rattle() {
      const t = ctx.currentTime;
      for (let i = 0; i < 11; i++) {
        const tt = t + i * 0.075 + Math.random() * 0.03;
        const k = 1 - i / 13;
        noise(tt, 0.045, 1600 + Math.random() * 2600, 4, 0.5 * k);
        tone(260 + Math.random() * 240, tt, 0.035, 'triangle', 0.1 * k);
      }
      noise(t + 0.9, 0.08, 700, 1.4, 0.35);
    },
    hop(i) {
      const t = ctx.currentTime, k = (i || 0) % 7;
      tone(480 + k * 70, t, 0.1, 'sine', 0.22, 760 + k * 70);
      noise(t + 0.08, 0.03, 1200, 2, 0.12);
    },
    land() {
      const t = ctx.currentTime;
      tone(240, t, 0.14, 'triangle', 0.3, 150);
      noise(t, 0.05, 900, 1, 0.18);
    },
    flip() {
      const t = ctx.currentTime;
      noise(t, 0.16, 3200, 0.7, 0.22);
      noise(t + 0.05, 0.12, 5200, 0.9, 0.12);
    },
    open() {
      const t = ctx.currentTime;
      noise(t, 0.35, 1400, 0.6, 0.25);
      [392, 523.25, 659.25, 783.99].forEach((f, i) => tone(f, t + 0.15 + i * 0.07, 0.3, 'triangle', 0.18));
    },
    coin() {
      const t = ctx.currentTime;
      tone(987.8, t, 0.08, 'square', 0.1);
      tone(1318.5, t + 0.075, 0.26, 'square', 0.1);
    },
    unlock() {
      const t = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, t + i * 0.075, 0.34, 'triangle', 0.22));
      tone(1567.98, t + 0.32, 0.4, 'sine', 0.1);
    },
    good() {
      const t = ctx.currentTime;
      tone(660, t, 0.09, 'sine', 0.3, 990);
      tone(1320, t + 0.06, 0.12, 'sine', 0.12);
    },
    bad() {
      const t = ctx.currentTime;
      tone(190, t, 0.2, 'sawtooth', 0.12, 110);
    },
    tick() {
      const t = ctx.currentTime;
      tone(1100, t, 0.04, 'square', 0.06);
    },
    go() {
      const t = ctx.currentTime;
      tone(880, t, 0.25, 'square', 0.1);
      tone(1760, t, 0.25, 'sine', 0.08);
    },
    win() {
      const t = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
      notes.forEach((f, i) => tone(f, t + i * 0.1, i === notes.length - 1 ? 0.7 : 0.18, 'triangle', 0.2));
    }
  };

  return {
    get enabled() { return enabled; },
    set enabled(v) {
      enabled = !!v;
      if (ctx) { try { enabled ? ctx.resume() : ctx.suspend(); } catch (e) {} }
    },
    ensure,
    play(name, arg) {
      if (!enabled || !S[name]) return;
      if (!ensure()) return;
      try { S[name](arg); } catch (e) { /* never let audio break the game */ }
    }
  };
})();
