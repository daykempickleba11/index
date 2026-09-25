(() => {
  let audioCtx = null;
  const getAudio = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      if (!audioCtx || audioCtx.state === 'closed') audioCtx = new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    } catch { return null; }
  };

  function chime(kind = 'soft') {
    const ctx = getAudio();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = kind === 'big' ? [523.25, 659.25, 783.99, 1046.5] : [659.25, 783.99];
    notes.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(kind === 'big' ? 0.07 : 0.035, now + i * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.42);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.45);
    });
  }

  function toast(msg) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 1800);
  }

  function progress(percent, label) {
    let shell = document.querySelector('.progressShell');
    if (!shell) {
      shell = document.createElement('div');
      shell.className = 'progressShell';
      shell.innerHTML = '<div class="progressTop"><div class="progressText"></div><div class="progressTrack"><div class="progressBar"></div></div></div>';
      document.body.prepend(shell);
    }
    shell.querySelector('.progressText').textContent = `${label} • ${percent}%`;
    requestAnimationFrame(() => shell.querySelector('.progressBar').style.width = `${percent}%`);
  }

  let fxCanvas, fxCtx, particles = [], raf = 0, lastFrame = 0;
  function ensureCanvas() {
    if (fxCanvas) return;
    fxCanvas = document.createElement('canvas');
    fxCanvas.className = 'fxCanvas';
    document.body.appendChild(fxCanvas);
    fxCtx = fxCanvas.getContext('2d');
    resizeCanvas();
    addEventListener('resize', resizeCanvas, { passive: true });
  }
  function resizeCanvas() {
    if (!fxCanvas) return;
    const dpr = Math.min(1.25, devicePixelRatio || 1);
    fxCanvas.width = Math.round(innerWidth * dpr);
    fxCanvas.height = Math.round(innerHeight * dpr);
    fxCanvas.style.width = innerWidth + 'px';
    fxCanvas.style.height = innerHeight + 'px';
    fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function loop(t) {
    if (t - lastFrame < 28) { raf = requestAnimationFrame(loop); return; }
    lastFrame = t;
    fxCtx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += p.gravity || 0; p.life -= p.decay;
      if (p.spin) p.rot += p.spin;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      fxCtx.globalAlpha = Math.max(0, p.life);
      fxCtx.save();
      fxCtx.translate(p.x, p.y);
      fxCtx.rotate(p.rot || 0);
      if (p.type === 'dot') {
        fxCtx.fillStyle = p.color;
        fxCtx.beginPath(); fxCtx.arc(0, 0, p.size, 0, Math.PI * 2); fxCtx.fill();
      } else {
        fxCtx.font = `${p.size}px system-ui, Apple Color Emoji, Segoe UI Emoji`;
        fxCtx.textAlign = 'center'; fxCtx.textBaseline = 'middle';
        fxCtx.fillText(p.char, 0, 0);
      }
      fxCtx.restore();
    }
    fxCtx.globalAlpha = 1;
    if (particles.length) raf = requestAnimationFrame(loop); else { cancelAnimationFrame(raf); raf = 0; }
  }
  function kick() { ensureCanvas(); if (!raf) raf = requestAnimationFrame(loop); }

  function burst(count = 22, chars = ['💖','✨','🏮']) {
    ensureCanvas();
    const n = Math.min(count, 70);
    for (let i = 0; i < n; i++) {
      particles.push({
        type: 'emoji', char: chars[i % chars.length],
        x: innerWidth * (0.18 + Math.random() * 0.64), y: innerHeight * (0.55 + Math.random() * 0.18),
        vx: (Math.random() - .5) * 4.2, vy: -2.5 - Math.random() * 4.2,
        gravity: .055, life: 1, decay: .016 + Math.random() * .008,
        size: 15 + Math.random() * 18, rot: 0, spin: (Math.random() - .5) * .08
      });
    }
    if (particles.length > 220) particles.splice(0, particles.length - 220);
    kick();
  }

  function sparkAt(x, y, count = 10) {
    ensureCanvas();
    const chars = ['✨','💖','⭐'];
    for (let i = 0; i < Math.min(count, 18); i++) {
      particles.push({
        type: 'emoji', char: chars[i % chars.length], x, y,
        vx: (Math.random() - .5) * 4, vy: -1 - Math.random() * 3,
        gravity: .05, life: 1, decay: .03,
        size: 12 + Math.random() * 12, rot: 0, spin: (Math.random() - .5) * .1
      });
    }
    kick();
  }

  function fireworks(ms = 2600) {
    ensureCanvas();
    const colors = ['#ffd166','#ff6b9a','#f8f3ff','#ff8c42','#7bdff2'];
    const end = performance.now() + Math.min(ms, 4200);
    let shots = 0;
    const shoot = () => {
      if (performance.now() > end || shots > 10) return;
      shots++;
      const x = innerWidth * (.15 + Math.random() * .7);
      const y = innerHeight * (.12 + Math.random() * .38);
      const color = colors[shots % colors.length];
      for (let i = 0; i < 26; i++) {
        const a = Math.PI * 2 * i / 26 + Math.random() * .12;
        const s = 1.8 + Math.random() * 3.3;
        particles.push({ type:'dot', x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s, gravity:.025, life:1, decay:.018, size:1.5+Math.random()*1.5, color, rot:0 });
      }
      if (particles.length > 220) particles.splice(0, particles.length - 220);
      kick();
      setTimeout(shoot, 260 + Math.random() * 220);
    };
    shoot();
  }

  function selectionFX(el, msg) {
    const r = el.getBoundingClientRect();
    sparkAt(r.left + r.width/2, r.top + r.height/2, 10);
    chime();
    if (msg) toast(msg);
  }

  function go(url, delay = 180) {
    document.body.classList.add('pageLeaving');
    setTimeout(() => location.href = url, delay);
  }

  window.LoveFX = { chime, toast, progress, burst, sparkAt, fireworks, selectionFX, go };
})();
