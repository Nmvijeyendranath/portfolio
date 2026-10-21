const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function initializeAmbientField() {
  const canvas = document.querySelector('#ambient-particles');
  const context = canvas?.getContext('2d', { alpha: true, desynchronized: true });
  if (!canvas || !context) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactLayout = window.matchMedia('(max-width: 760px)');
  const pointer = { x: 0, y: 0, active: false, pulseAt: 0 };
  const cursorTrail = [];
  const trailLifeMs = 760;
  let particles = [];
  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let inView = true;
  let frame = 0;
  let resizeFrame = 0;
  let previousFrame = 0;
  let disposed = false;

  function createParticles() {
    const columns = compactLayout.matches ? 8 : clamp(Math.round(width / 118), 9, 15);
    const rows = clamp(Math.ceil(height / (compactLayout.matches ? 245 : 280)), 8, 40);
    const count = columns * rows;
    particles = Array.from({ length: count }, (_, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      return {
        x: ((column + 0.5 + (Math.random() - 0.5) * 0.42) / columns) * width,
        y: ((row + 0.5 + (Math.random() - 0.5) * 0.48) / rows) * height,
        phase: Math.random() * Math.PI * 2,
        size: 0.65 + Math.random() * 1.15,
        sage: Math.random() > 0.72
      };
    });
  }

  function drawWaves(seconds) {
    const step = clamp(width / 82, 10, 18);
    const bandSpacing = compactLayout.matches ? 390 : 440;
    const waveTrail = [];
    const trailStep = Math.max(1, Math.ceil(cursorTrail.length / 5));
    for (let index = 0; index < cursorTrail.length; index += trailStep) {
      const point = cursorTrail[index];
      const age = clamp(1 - (seconds * 1000 - point.time) / trailLifeMs, 0, 1);
      if (age > 0) waveTrail.push({ x: point.x, y: point.y, age, time: point.time });
    }
    const latestPoint = cursorTrail[cursorTrail.length - 1];
    if (latestPoint && waveTrail[waveTrail.length - 1]?.time !== latestPoint.time) {
      const age = clamp(1 - (seconds * 1000 - latestPoint.time) / trailLifeMs, 0, 1);
      if (age > 0) waveTrail.push({ x: latestPoint.x, y: latestPoint.y, age, time: latestPoint.time });
    }

    for (let band = 115; band < height + bandSpacing; band += bandSpacing) {
      for (let layer = 0; layer < 2; layer += 1) {
        const phase = band * 0.0018 + layer * 1.7;
        context.beginPath();
        for (let x = 0; x <= width + step; x += step) {
          const baseY = band + layer * 15;
          const dx = x - pointer.x;
          const dy = baseY - pointer.y;
          const influence = pointer.active ? Math.exp(-(dx * dx + dy * dy) / 42000) : 0;
          const ripple = Math.sin(seconds * 2.1 + phase) * influence * 23;
          let trailInfluence = 0;
          for (const point of waveTrail) {
            const trailX = x - point.x;
            const trailY = baseY - point.y;
            const energy = point.age / (1 + (trailX * trailX + trailY * trailY) / 22000);
            if (energy > trailInfluence) trailInfluence = energy;
          }
          const trailRipple = Math.sin(seconds * 3.1 + phase) * trailInfluence * 7.5;
          const y = baseY
            + Math.sin(x * 0.007 + seconds * 0.22 + phase) * 12
            + Math.sin(x * 0.0028 - seconds * 0.13 + phase) * 7
            + ripple
            + trailRipple;
          if (x === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = layer === 0
          ? 'rgba(210, 167, 141, 0.23)'
          : 'rgba(151, 173, 134, 0.22)';
        context.lineWidth = layer === 0 ? 1 : 0.8;
        context.stroke();
      }
    }
  }

  function drawCursorTrail(now) {
    while (cursorTrail.length && now - cursorTrail[0].time > trailLifeMs) cursorTrail.shift();
    if (!cursorTrail.length) return;

    const tail = cursorTrail[0];
    const head = cursorTrail[cursorTrail.length - 1];
    const headFade = clamp(1 - (now - head.time) / trailLifeMs, 0, 1);
    context.save();
    context.globalCompositeOperation = 'lighter';
    context.lineCap = 'round';
    context.lineJoin = 'round';

    if (cursorTrail.length > 1 && headFade > 0) {
      const glow = context.createLinearGradient(tail.x, tail.y, head.x, head.y);
      glow.addColorStop(0, 'rgba(151, 173, 134, 0)');
      glow.addColorStop(0.48, `rgba(151, 173, 134, ${headFade * 0.18})`);
      glow.addColorStop(0.82, `rgba(220, 184, 162, ${headFade * 0.48})`);
      glow.addColorStop(1, `rgba(255, 241, 230, ${headFade * 0.82})`);
      context.beginPath();
      context.moveTo(tail.x, tail.y);
      for (let index = 1; index < cursorTrail.length; index += 1) {
        context.lineTo(cursorTrail[index].x, cursorTrail[index].y);
      }
      context.strokeStyle = glow;
      context.lineWidth = 3.4;
      context.shadowColor = `rgba(239, 195, 164, ${headFade * 0.72})`;
      context.shadowBlur = 12 * headFade;
      context.stroke();
    }

    if (headFade > 0) {
      const halo = context.createRadialGradient(head.x, head.y, 0, head.x, head.y, 32);
      halo.addColorStop(0, `rgba(255, 241, 230, ${headFade * 0.72})`);
      halo.addColorStop(0.2, `rgba(220, 184, 162, ${headFade * 0.38})`);
      halo.addColorStop(1, 'rgba(220, 184, 162, 0)');
      context.fillStyle = halo;
      context.fillRect(head.x - 32, head.y - 32, 64, 64);
    }
    context.restore();
  }

  function drawParticles(seconds, now) {
    for (const particle of particles) {
      const driftX = Math.sin(seconds * 0.32 + particle.phase) * 4.2;
      const driftY = Math.cos(seconds * 0.29 + particle.phase) * 5.5;
      let x = particle.x + driftX;
      let y = particle.y + driftY;
      let trailEnergy = 0;
      let trailPushX = 0;
      let trailPushY = 0;

      if (pointer.active) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy) || 1;
        const strength = Math.max(0, 1 - distance / 148);
        const nudge = strength * 16;
        x += (dx / distance) * nudge;
        y += (dy / distance) * nudge;
      }

      for (let index = cursorTrail.length - 1, checked = 0; index >= 0 && checked < 10; index -= 1, checked += 1) {
        const point = cursorTrail[index];
        const age = clamp(1 - (now - point.time) / trailLifeMs, 0, 1);
        if (age <= 0) continue;
        const dx = x - point.x;
        const dy = y - point.y;
        const distance = Math.hypot(dx, dy) || 1;
        const influence = Math.max(0, 1 - distance / 122) * age;
        if (influence > trailEnergy) trailEnergy = influence;
        trailPushX += (dx / distance) * influence;
        trailPushY += (dy / distance) * influence;
      }
      x += trailPushX * 7;
      y += trailPushY * 7;

      context.beginPath();
      context.arc(x, y, particle.size + trailEnergy * 0.9, 0, Math.PI * 2);
      context.fillStyle = particle.sage
        ? `rgba(164, 184, 148, ${0.42 + trailEnergy * 0.3})`
        : `rgba(220, 184, 162, ${0.43 + trailEnergy * 0.3})`;
      context.shadowColor = particle.sage ? 'rgba(164,184,148,0.75)' : 'rgba(220,184,162,0.75)';
      context.shadowBlur = trailEnergy * 11;
      context.fill();
      context.shadowBlur = 0;
    }
  }

  function drawPulse(now) {
    const elapsed = now - pointer.pulseAt;
    if (!pointer.pulseAt || elapsed < 0 || elapsed > 900) return;
    const progress = elapsed / 900;
    context.beginPath();
    context.arc(pointer.x, pointer.y, 10 + progress * 150, 0, Math.PI * 2);
    context.strokeStyle = `rgba(220, 184, 162, ${(1 - progress) * 0.25})`;
    context.lineWidth = 1;
    context.stroke();
  }

  function draw(now = 0) {
    const seconds = now * 0.001;
    context.clearRect(0, 0, width, height);
    drawWaves(seconds);
    drawParticles(seconds, now);
    drawCursorTrail(now);
    drawPulse(now);
  }

  function resize() {
    if (disposed) return;
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    pixelRatio = Math.min(1.25, Math.max(1, window.devicePixelRatio || 1));
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    createParticles();
    draw(0);
  }

  function scheduleResize() {
    if (resizeFrame || disposed) return;
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      resize();
    });
  }

  function animate(now) {
    frame = 0;
    if (disposed || !inView || document.hidden || reducedMotion.matches) return;
    if (now - previousFrame < 28) {
      frame = window.requestAnimationFrame(animate);
      return;
    }
    previousFrame = now;
    draw(now);
    frame = window.requestAnimationFrame(animate);
  }

  function start() {
    if (frame || disposed || !inView || document.hidden || reducedMotion.matches) return;
    previousFrame = 0;
    frame = window.requestAnimationFrame(animate);
  }

  function stop() {
    if (!frame) return;
    window.cancelAnimationFrame(frame);
    frame = 0;
  }

  function updatePointer(event, allowTouch = false) {
    if (reducedMotion.matches || (event.pointerType === 'touch' && !allowTouch)) return;
    const nextX = clamp(event.clientX, 0, width);
    const nextY = clamp(event.clientY, 0, height);
    if (event.pointerType !== 'touch') {
      if (!pointer.active) cursorTrail.push({ x: nextX, y: nextY, time: performance.now() });
      else {
        const distance = Math.hypot(nextX - pointer.x, nextY - pointer.y);
        if (distance > 2.4) {
          const segments = Math.min(12, Math.max(1, Math.ceil(distance / 18)));
          const now = performance.now();
          for (let index = 1; index <= segments; index += 1) {
            const progress = index / segments;
            cursorTrail.push({
              x: pointer.x + (nextX - pointer.x) * progress,
              y: pointer.y + (nextY - pointer.y) * progress,
              time: now - (segments - index) * 3
            });
          }
        }
      }
      if (cursorTrail.length > 28) cursorTrail.splice(0, cursorTrail.length - 28);
    }
    pointer.x = nextX;
    pointer.y = nextY;
    pointer.active = true;
  }

  window.addEventListener('pointermove', (event) => updatePointer(event), { passive: true });
  window.addEventListener('pointerdown', (event) => {
    updatePointer(event, true);
    if (!reducedMotion.matches) pointer.pulseAt = performance.now();
  }, { passive: true });
  window.addEventListener('pointerup', (event) => {
    if (event.pointerType === 'touch') pointer.active = false;
  }, { passive: true });
  window.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
  window.addEventListener('pointercancel', () => { pointer.active = false; }, { passive: true });
  window.addEventListener('blur', () => { pointer.active = false; }, { passive: true });

  window.addEventListener('ambient-pulse', (event) => {
    if (reducedMotion.matches) return;
    const x = Number(event.detail?.x);
    const y = Number(event.detail?.y);
    pointer.x = clamp(Number.isFinite(x) ? x : width / 2, 0, width);
    pointer.y = clamp(Number.isFinite(y) ? y : height / 2, 0, height);
    pointer.active = true;
    pointer.pulseAt = performance.now();
    start();
  }, { passive: true });

  window.addEventListener('resize', scheduleResize, { passive: true });
  compactLayout.addEventListener?.('change', scheduleResize);

  const onMotionPreferenceChange = () => {
    if (reducedMotion.matches) {
      stop();
      cursorTrail.length = 0;
      pointer.active = false;
      pointer.pulseAt = 0;
      draw(0);
    } else start();
  };
  reducedMotion.addEventListener?.('change', onMotionPreferenceChange);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });
  window.addEventListener('pagehide', () => {
    disposed = true;
    stop();
    if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
  }, { once: true });

  resize();
  start();
}


initializeAmbientField();
