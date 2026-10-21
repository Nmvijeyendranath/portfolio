/* ═══════════════════════════════════════════════════════════════
   Interactive project worlds — each project gets a playable demo.
   Every demo is an ILLUSTRATIVE simulation of inputs/mechanics,
   clearly labeled; no fabricated model results or metrics.
   ═══════════════════════════════════════════════════════════════ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const EMBER = '#D2A78D', SADDLE = '#9E6B4E', SAGE = '#97AD86', CHALK = '#FBFBFA', TAUPE = '#8C827A';

const projects = [
  {
    id: 'scanner', title: 'Plant disease identification', category: 'COMPUTER VISION · APPLIED AI', focus: 'ai',
    summary: 'An image-based exploration into recognizing possible disease categories from tomato and potato leaves. The supplied project description mentions EfficientNetV2B0 transfer learning, TensorFlow/Keras, and a Flask interface.',
    note: 'Supported classes, test accuracy, and deployment details have not been confirmed. Treat model output as a starting point for investigation, not a diagnosis.',
    link: 'https://github.com/Nmvijeyendranath/plant-disease-detection-system',
    demoTag: 'SPECIMEN SCANNER'
  },
  {
    id: 'soil', title: 'Crop recommendation system', category: 'MACHINE LEARNING · STREAMLIT', focus: 'ai',
    summary: 'A supervised-learning application exploring crop recommendations from seven soil and weather inputs: N, P, K, temperature, humidity, pH, and rainfall.',
    note: 'The described approach uses a Random Forest classifier and Streamlit. Repository, final accuracy, and deployment link were not supplied.',
    demoTag: 'SOIL CONSOLE'
  },
  {
    id: 'market', title: 'AI & Data Science job market', category: 'ANALYTICS · TABLEAU', focus: 'analytics',
    summary: 'A Tableau dashboard exploration intended to make patterns in AI and Data Science job-market information easier to inspect.',
    note: 'The dataset, published dashboard, and verified findings were not provided; no market conclusions are claimed.',
    demoTag: 'MARKET LENS'
  },
  {
    id: 'pipeline', title: 'Amazon ML Challenge', category: 'MACHINE LEARNING · COMPETITION', focus: 'ai',
    summary: 'A team exploration involving a TSV dataset, preprocessing, and potential machine-learning approaches.',
    note: 'The exact problem, individual contribution, validation metric, final score, and competition outcome were not provided.',
    demoTag: 'PIPELINE TRACE'
  },
  {
    id: 'network', title: 'Social network analysis', category: 'GRAPH ANALYTICS · COURSEWORK', focus: 'coursework',
    summary: 'An academic exploration of potential network-analysis project directions.',
    note: 'A final dataset, implementation, analysis, and findings have not been established.',
    demoTag: 'NETWORK LAB'
  }
];

/* ── shared canvas stage helper ─────────────────────────────── */
function stageLoop(canvas, draw) {
  const ctx = canvas.getContext('2d');
  let width = 1, height = 1, raf = 0, inView = false, last = 0;
  const resize = () => {
    const b = canvas.parentElement.getBoundingClientRect();
    width = Math.max(1, b.width); height = Math.max(1, b.height);
    const ratio = Math.min(1.6, window.devicePixelRatio || 1);
    canvas.width = width * ratio; canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(ctx, width, height, 0);
  };
  const tick = (now) => {
    raf = 0;
    if (!inView || document.hidden) return;
    if (now - last >= 30) { last = now; draw(ctx, width, height, now * 0.001); }
    raf = requestAnimationFrame(tick);
  };
  const start = () => { if (!raf && !reducedMotion) raf = requestAnimationFrame(tick); };
  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    if (inView) { resize(); start(); }
  }, { threshold: 0.05 }).observe(canvas.parentElement);
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && inView) start(); });
  resize();
  return { get width() { return width; }, get height() { return height; }, redraw: (t = 0) => draw(ctx, width, height, t), ctx };
}

/* ══════════ 02 · SPECIMEN SCANNER (plant disease) ══════════ */
function initScanner(stage) {
  const canvas = stage.querySelector('.lab-canvas');
  const ui = stage.querySelector('.lab-ui');
  let crop = 'tomato', scanning = 0, result = null, spots = [];
  const regenSpots = () => {
    spots = Array.from({ length: 7 + Math.floor(Math.random() * 5) }, () => ({
      a: Math.random() * Math.PI * 2, r: Math.random() * 0.62, s: 3 + Math.random() * 8
    }));
  };
  regenSpots();
  const loop = stageLoop(canvas, (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2 - 18, size = Math.min(w, h) * 0.34;
    // leaf body
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.4);
    const grad = ctx.createRadialGradient(-size * 0.2, -size * 0.25, size * 0.1, 0, 0, size * 1.15);
    grad.addColorStop(0, 'rgba(151,173,134,.5)');
    grad.addColorStop(1, 'rgba(76,91,63,.32)');
    ctx.beginPath();
    ctx.moveTo(0, -size * 1.05);
    ctx.bezierCurveTo(size * 0.95, -size * 0.5, size * 0.85, size * 0.55, 0, size * 1.05);
    ctx.bezierCurveTo(-size * 0.85, size * 0.55, -size * 0.95, -size * 0.5, 0, -size * 1.05);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(210,167,141,.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // veins
    ctx.strokeStyle = 'rgba(210,167,141,.34)';
    ctx.beginPath(); ctx.moveTo(0, -size); ctx.lineTo(0, size); ctx.stroke();
    for (let i = -3; i <= 3; i++) {
      if (!i) continue;
      ctx.beginPath();
      ctx.moveTo(0, i * size * 0.26);
      ctx.quadraticCurveTo(Math.sign(i) * size * 0.4, i * size * 0.22, Math.sign(i) * size * 0.62, i * size * 0.3 - size * 0.1);
      ctx.stroke();
    }
    // lesions
    for (const s of spots) {
      const sx = Math.cos(s.a) * s.r * size * 0.8, sy = Math.sin(s.a) * s.r * size;
      ctx.beginPath();
      ctx.arc(sx, sy, s.s, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(158,107,78,.5)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(20,18,18,.4)';
      ctx.stroke();
    }
    ctx.restore();
    // scan sweep
    if (scanning > 0) {
      const y = cy - size * 1.2 + (cy + size * 1.2 - (cy - size * 1.2)) * scanning;
      const beam = ctx.createLinearGradient(0, y - 34, 0, y + 6);
      beam.addColorStop(0, 'rgba(210,167,141,0)');
      beam.addColorStop(1, 'rgba(210,167,141,.5)');
      ctx.fillStyle = beam;
      ctx.fillRect(cx - size * 1.3, y - 34, size * 2.6, 40);
      ctx.fillStyle = EMBER;
      ctx.fillRect(cx - size * 1.3, y, size * 2.6, 1.5);
    }
    // result bars
    if (result) {
      const bx = cx - size * 1.05, by = cy + size * 1.28;
      result.forEach((bar, i) => {
        ctx.fillStyle = 'rgba(251,251,250,.14)';
        ctx.fillRect(bx, by + i * 17, size * 2.1, 7);
        ctx.fillStyle = i === 0 ? EMBER : 'rgba(210,167,141,.4)';
        ctx.fillRect(bx, by + i * 17, size * 2.1 * bar.v, 7);
        ctx.fillStyle = CHALK;
        ctx.font = '8px "DM Mono", monospace';
        ctx.fillText(bar.label.toUpperCase(), bx, by + i * 17 - 3);
      });
    }
  });
  const categories = {
    tomato: [['Early blight', 0.62], ['Leaf mold', 0.24], ['Healthy', 0.14]],
    potato: [['Late blight', 0.55], ['Early blight', 0.3], ['Healthy', 0.15]]
  };
  ui.innerHTML = `
    <button type="button" data-crop="tomato" class="is-on">TOMATO</button>
    <button type="button" data-crop="potato">POTATO</button>
    <button type="button" data-run>RUN SCAN ↗</button>
    <span class="lab-readout">SIMULATED OUTPUT — NOT A DIAGNOSIS</span>`;
  ui.querySelectorAll('[data-crop]').forEach((btn) => btn.addEventListener('click', () => {
    crop = btn.dataset.crop;
    ui.querySelectorAll('[data-crop]').forEach((b) => b.classList.toggle('is-on', b === btn));
    result = null; regenSpots(); loop.redraw();
  }));
  ui.querySelector('[data-run]').addEventListener('click', () => {
    if (scanning > 0) return;
    const t0 = performance.now();
    const step = () => {
      scanning = Math.min(1, (performance.now() - t0) / 1600);
      loop.redraw();
      if (scanning < 1) requestAnimationFrame(step);
      else {
        scanning = 0;
        result = categories[crop].map(([label, v]) => ({ label, v: v * (0.85 + Math.random() * 0.3) }));
        loop.redraw();
      }
    };
    step();
  });
}

/* ══════════ 03 · SOIL CONSOLE (crop recommendation) ══════════ */
function initSoil(stage) {
  const canvas = stage.querySelector('.lab-canvas');
  const ui = stage.querySelector('.lab-ui');
  const params = [
    ['N', 40, 0, 120], ['P', 40, 0, 120], ['K', 40, 0, 120],
    ['TEMP °C', 24, 8, 44], ['HUMID %', 70, 10, 100], ['PH', 6.5, 3.5, 9.5], ['RAIN mm', 120, 20, 300]
  ];
  let values = params.map((p) => p[1]);
  let recommendation = null;
  const loop = stageLoop(canvas, (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2 - 30, radius = Math.min(w, h) * 0.27;
    // radar grid
    for (let ring = 1; ring <= 3; ring++) {
      ctx.beginPath();
      for (let i = 0; i <= params.length; i++) {
        const a = (i / params.length) * Math.PI * 2 - Math.PI / 2;
        const r = (ring / 3) * radius;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = 'rgba(210,167,141,.22)';
      ctx.stroke();
    }
    params.forEach((p, i) => {
      const a = (i / params.length) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
      ctx.strokeStyle = 'rgba(210,167,141,.14)';
      ctx.stroke();
      ctx.fillStyle = TAUPE;
      ctx.font = '7.5px "DM Mono", monospace';
      ctx.fillText(p[0], cx + Math.cos(a) * (radius + 14) - 10, cy + Math.sin(a) * (radius + 14) + 3);
    });
    // value polygon
    ctx.beginPath();
    values.forEach((v, i) => {
      const [, , min, max] = params[i];
      const norm = (v - min) / (max - min);
      const a = (i / params.length) * Math.PI * 2 - Math.PI / 2;
      const r = Math.max(0.06, norm) * radius;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(158,107,78,.3)';
    ctx.fill();
    ctx.strokeStyle = EMBER;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    // recommendation readout
    if (recommendation) {
      ctx.fillStyle = CHALK;
      ctx.font = '500 22px "Cormorant Garamond", serif';
      ctx.textAlign = 'center';
      ctx.fillText(recommendation, cx, h - 64);
      ctx.fillStyle = TAUPE;
      ctx.font = '7.5px "DM Mono", monospace';
      ctx.fillText('ILLUSTRATIVE RULE-BASED GUESS — NOT MODEL OUTPUT', cx, h - 48);
      ctx.textAlign = 'left';
    } else {
      ctx.fillStyle = TAUPE;
      ctx.font = '8px "DM Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ADJUST THE SEVEN INPUTS, THEN RUN THE RECOMMENDER', cx, h - 56);
      ctx.textAlign = 'left';
    }
  });
  ui.innerHTML = params.map((p, i) => `
    <div class="lab-slider"><label>${p[0]} <b id="sv-${i}">${p[1]}</b></label>
    <input type="range" min="${p[2]}" max="${p[3]}" step="${p[3] - p[2] > 60 ? 1 : 0.1}" value="${p[1]}" data-i="${i}" aria-label="${p[0]}"></div>
  `).join('') + `<button type="button" data-run>RUN RECOMMENDER ↗</button><span class="lab-readout">RANDOM FOREST INTERFACE — SIMULATION</span>`;
  ui.querySelectorAll('input').forEach((input) => input.addEventListener('input', () => {
    values[Number(input.dataset.i)] = Number(input.value);
    ui.querySelector(`#sv-${input.dataset.i}`).textContent = input.value;
    recommendation = null;
    loop.redraw();
  }));
  ui.querySelector('[data-run]').addEventListener('click', () => {
    const [n, , , temp, humid, ph, rain] = values;
    recommendation =
      rain > 220 && humid > 80 ? 'rice' :
      temp > 30 && rain < 90 ? 'mothbeans' :
      ph > 7.5 && temp < 22 ? 'chickpea' :
      n > 85 && humid > 75 ? 'jute' :
      temp >= 20 && temp <= 30 && rain >= 90 && rain <= 220 ? (humid > 65 ? 'coffee' : 'maize') :
      temp < 20 ? 'lentil' : 'cotton';
    loop.redraw();
  });
}

/* ══════════ 04 · MARKET LENS (job market analytics) ══════════ */
function initMarket(stage) {
  const canvas = stage.querySelector('.lab-canvas');
  const ui = stage.querySelector('.lab-ui');
  // Illustrative shapes only — no real dataset was supplied.
  const views = {
    roles: { label: 'ROLE FAMILY', bars: [['Data Analyst', .82], ['ML Engineer', .66], ['Data Scientist', .74], ['AI Research', .38], ['BI Analyst', .55], ['Data Engineer', .7]] },
    skills: { label: 'SKILL SIGNAL', bars: [['Python', .9], ['SQL', .84], ['ML Ops', .4], ['Deep Learning', .58], ['Tableau', .62], ['Statistics', .7]] },
    timeline: { label: 'POSTING RHYTHM', bars: [['Q1', .44], ['Q2', .58], ['Q3', .66], ['Q4', .5], ['Q5', .78], ['Q6', .86]] }
  };
  let view = 'roles', anim = 1;
  const loop = stageLoop(canvas, (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const data = views[view];
    const padL = 30, padB = 52, padT = 42;
    const bw = (w - padL * 2) / data.bars.length;
    // gridlines
    for (let g = 0; g <= 4; g++) {
      const y = padT + ((h - padB - padT) * g) / 4;
      ctx.strokeStyle = 'rgba(251,251,250,.08)';
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padL, y); ctx.stroke();
    }
    data.bars.forEach(([label, v], i) => {
      const x = padL + i * bw + bw * 0.2;
      const bh = (h - padB - padT) * v * anim;
      const y = h - padB - bh;
      const grad = ctx.createLinearGradient(0, y, 0, h - padB);
      grad.addColorStop(0, i === 0 ? EMBER : SADDLE);
      grad.addColorStop(1, 'rgba(158,107,78,.25)');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, bw * 0.6, bh);
      ctx.fillStyle = TAUPE;
      ctx.font = '7.5px "DM Mono", monospace';
      ctx.save();
      ctx.translate(x + bw * 0.3, h - padB + 12);
      ctx.rotate(-0.42);
      ctx.textAlign = 'right';
      ctx.fillText(label.toUpperCase(), 0, 0);
      ctx.restore();
    });
    ctx.fillStyle = CHALK;
    ctx.font = '500 15px "Cormorant Garamond", serif';
    ctx.fillText(data.label, padL, 26);
    ctx.fillStyle = TAUPE;
    ctx.font = '7.5px "DM Mono", monospace';
    ctx.fillText('ILLUSTRATIVE SHAPES — REAL DASHBOARD DATA NOT SUPPLIED', padL + 150, 26);
  });
  ui.innerHTML = Object.keys(views).map((key) =>
    `<button type="button" data-view="${key}" class="${key === view ? 'is-on' : ''}">${views[key].label}</button>`
  ).join('') + `<span class="lab-readout">STANDS IN FOR THE TABLEAU EXPLORATION</span>`;
  ui.querySelectorAll('[data-view]').forEach((btn) => btn.addEventListener('click', () => {
    view = btn.dataset.view;
    ui.querySelectorAll('[data-view]').forEach((b) => b.classList.toggle('is-on', b === btn));
    if (reducedMotion) { anim = 1; loop.redraw(); return; }
    const t0 = performance.now();
    const step = () => {
      anim = Math.min(1, (performance.now() - t0) / 650);
      loop.redraw();
      if (anim < 1) requestAnimationFrame(step);
    };
    anim = 0; step();
  }));
}

/* ══════════ 05 · PIPELINE TRACE (Amazon ML Challenge) ══════════ */
function initPipeline(stage) {
  const canvas = stage.querySelector('.lab-canvas');
  const ui = stage.querySelector('.lab-ui');
  const stages = [
    ['TSV INGEST', 'Rows of competition data arrive as tab-separated text.'],
    ['PREPROCESS', 'Cleaning, token handling, and feature preparation.'],
    ['MODEL SEARCH', 'Exploring candidate machine-learning approaches.'],
    ['EVALUATE', 'Validation thinking — metric and score not published.']
  ];
  let active = -1;
  const packets = Array.from({ length: 26 }, (_, i) => ({ p: i / 26, speed: 0.05 + Math.random() * 0.05 }));
  const loop = stageLoop(canvas, (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const pad = 46, y = h * 0.42;
    const xs = stages.map((_, i) => pad + (i * (w - pad * 2)) / (stages.length - 1));
    // spine
    ctx.strokeStyle = 'rgba(210,167,141,.3)';
    ctx.setLineDash([2, 6]);
    ctx.beginPath(); ctx.moveTo(xs[0], y); ctx.lineTo(xs[xs.length - 1], y); ctx.stroke();
    ctx.setLineDash([]);
    // packets flowing
    for (const pkt of packets) {
      pkt.p += reducedMotion ? 0 : pkt.speed * 0.016;
      if (pkt.p > 1) pkt.p = 0;
      const px = xs[0] + pkt.p * (xs[xs.length - 1] - xs[0]);
      const py = y + Math.sin(pkt.p * 14 + t) * 12;
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(210,167,141,.75)';
      ctx.fill();
    }
    // stage nodes
    stages.forEach(([name], i) => {
      const x = xs[i];
      const on = i === active;
      ctx.beginPath();
      ctx.arc(x, y, on ? 15 : 11, 0, Math.PI * 2);
      ctx.fillStyle = on ? 'rgba(158,107,78,.9)' : '#141210';
      ctx.fill();
      ctx.strokeStyle = on ? EMBER : 'rgba(210,167,141,.6)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      if (on) {
        ctx.beginPath();
        ctx.arc(x, y, 21 + Math.sin(t * 3) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(210,167,141,.35)';
        ctx.stroke();
      }
      ctx.fillStyle = on ? CHALK : TAUPE;
      ctx.font = '8px "DM Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`0${i + 1}`, x, y + 3);
      ctx.fillText(name, x, y + 44);
      ctx.textAlign = 'left';
    });
    if (active >= 0) {
      ctx.fillStyle = '#D1C6BE';
      ctx.font = '11px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(stages[active][1], w / 2, h - 64);
      ctx.textAlign = 'left';
    }
  });
  ui.innerHTML = stages.map((s, i) => `<button type="button" data-stage="${i}">${s[0]}</button>`).join('') +
    `<span class="lab-readout">TAP A STAGE TO INSPECT IT</span>`;
  ui.querySelectorAll('[data-stage]').forEach((btn) => btn.addEventListener('click', () => {
    active = active === Number(btn.dataset.stage) ? -1 : Number(btn.dataset.stage);
    ui.querySelectorAll('[data-stage]').forEach((b) => b.classList.toggle('is-on', Number(b.dataset.stage) === active));
    loop.redraw();
  }));
}

/* ══════════ 06 · NETWORK LAB (social network analysis) ══════════ */
function initNetwork(stage) {
  const canvas = stage.querySelector('.lab-canvas');
  const ui = stage.querySelector('.lab-ui');
  const nodeCount = 16;
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    x: Math.random(), y: Math.random(), vx: 0, vy: 0,
    r: i % 5 === 0 ? 6.5 : 4, id: i
  }));
  const links = [];
  for (let i = 0; i < nodeCount; i++) {
    const degree = 1 + Math.floor(Math.random() * 3);
    for (let d = 0; d < degree; d++) {
      const j = Math.floor(Math.random() * nodeCount);
      if (j !== i && !links.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) links.push([i, j]);
    }
  }
  let selected = -1, dragNode = -1;
  const neighbors = (i) => links.filter(([a, b]) => a === i || b === i).map(([a, b]) => (a === i ? b : a));
  const loop = stageLoop(canvas, (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    // physics
    if (!reducedMotion) {
      for (const n of nodes) {
        let fx = 0, fy = 0;
        for (const m of nodes) {
          if (m === n) continue;
          const dx = n.x - m.x, dy = n.y - m.y;
          const d2 = Math.max(0.002, dx * dx + dy * dy);
          fx += (dx / d2) * 0.00005; fy += (dy / d2) * 0.00005;
        }
        fx += (0.5 - n.x) * 0.0004; fy += (0.48 - n.y) * 0.0004;
        n.vx = (n.vx + fx) * 0.92; n.vy = (n.vy + fy) * 0.92;
        if (nodes.indexOf(n) !== dragNode) { n.x += n.vx; n.y += n.vy; }
        n.x = Math.max(0.05, Math.min(0.95, n.x));
        n.y = Math.max(0.08, Math.min(0.82, n.y));
      }
      for (const [a, b] of links) {
        const na = nodes[a], nb = nodes[b];
        const dx = nb.x - na.x, dy = nb.y - na.y;
        const d = Math.hypot(dx, dy) || 1;
        const pull = (d - 0.22) * 0.0012;
        na.vx += dx * pull; na.vy += dy * pull;
        nb.vx -= dx * pull; nb.vy -= dy * pull;
      }
    }
    const px = (n) => [n.x * w, n.y * h + 14];
    // links
    for (const [a, b] of links) {
      const [x1, y1] = px(nodes[a]), [x2, y2] = px(nodes[b]);
      const hot = selected >= 0 && (a === selected || b === selected);
      ctx.strokeStyle = hot ? 'rgba(210,167,141,.85)' : 'rgba(210,167,141,.2)';
      ctx.lineWidth = hot ? 1.4 : 0.8;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
    // nodes
    const hotSet = selected >= 0 ? new Set([selected, ...neighbors(selected)]) : null;
    for (const n of nodes) {
      const [x, y] = px(n);
      const hot = hotSet?.has(n.id);
      ctx.beginPath();
      ctx.arc(x, y, n.r + (n.id === selected ? 3 : 0), 0, Math.PI * 2);
      ctx.fillStyle = hot ? EMBER : (n.r > 5 ? SADDLE : 'rgba(151,173,134,.8)');
      ctx.fill();
      if (n.id === selected) {
        ctx.strokeStyle = CHALK; ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });
  const readout = () => {
    const el = ui.querySelector('.lab-readout');
    if (selected >= 0) el.textContent = `NODE ${String(selected + 1).padStart(2, '0')} — DEGREE ${neighbors(selected).length} · DRAG TO REARRANGE`;
    else el.textContent = 'DRAG NODES · CLICK TO INSPECT DEGREE';
  };
  const pick = (event) => {
    const b = canvas.getBoundingClientRect();
    const x = event.clientX - b.left, y = event.clientY - b.top;
    let best = -1, bestD = 26;
    nodes.forEach((n) => {
      const d = Math.hypot(n.x * b.width - x, n.y * b.height + 14 - y);
      if (d < bestD) { bestD = d; best = n.id; }
    });
    return best;
  };
  canvas.addEventListener('pointerdown', (event) => {
    const hit = pick(event);
    if (hit >= 0) { dragNode = hit; canvas.setPointerCapture(event.pointerId); }
  });
  canvas.addEventListener('pointermove', (event) => {
    if (dragNode < 0) return;
    const b = canvas.getBoundingClientRect();
    nodes[dragNode].x = Math.max(0.05, Math.min(0.95, (event.clientX - b.left) / b.width));
    nodes[dragNode].y = Math.max(0.08, Math.min(0.82, (event.clientY - b.top - 14) / b.height));
    if (reducedMotion) loop.redraw();
  });
  canvas.addEventListener('pointerup', (event) => {
    if (dragNode >= 0) {
      selected = dragNode === selected ? -1 : dragNode;
      dragNode = -1;
      readout();
      if (reducedMotion) loop.redraw();
    }
  });
  ui.innerHTML = `<span class="lab-readout">DRAG NODES · CLICK TO INSPECT DEGREE</span>`;
  readout();
}

/* ══════════ BUILD THE LABS ══════════ */
const demoInits = { scanner: initScanner, soil: initSoil, market: initMarket, pipeline: initPipeline, network: initNetwork };

export function initDemos() {
  const list = document.getElementById('project-list');
  if (!list) return;
  projects.forEach((project, index) => {
    const article = document.createElement('article');
    article.className = 'lab';
    article.dataset.focus = project.focus;
    article.innerHTML = `
      <div class="lab-info">
        <span class="lab-index mono">${String(index + 2).padStart(2, '0')}</span>
        <span class="lab-category mono">${project.category}</span>
        <h3 class="lab-name">${project.title}</h3>
        <p class="lab-summary">${project.summary}</p>
        <p class="lab-note">${project.note}</p>
        ${project.link ? `<a class="lab-repo" href="${project.link}" target="_blank" rel="noopener noreferrer">VIEW REPOSITORY <span aria-hidden="true">↗</span></a>` : ''}
      </div>
      <div class="lab-stage">
        <div class="lab-stage-head mono"><span>${project.demoTag} / INTERACTIVE</span><span class="lab-sim-tag">ILLUSTRATIVE SIMULATION</span></div>
        <canvas class="lab-canvas" aria-label="Interactive illustration for ${project.title}"></canvas>
        <div class="lab-ui"></div>
      </div>`;
    list.append(article);
    demoInits[project.id](article.querySelector('.lab-stage'));
  });

  /* ProofPass pipeline console */
  const stageData = [
    ['STAGE 01 / SOURCE SESSION', 'A user authenticates with a real web source — Reclaim-backed session proofs let the system reference what the source actually showed, without handing over the whole document.'],
    ['STAGE 02 / ZKTLS PROOF', 'The web session becomes a cryptographic proof: evidence that specific data came from a specific source, without exposing everything else in the session.'],
    ['STAGE 03 / AI EXTRACTION', 'Groq / Llama 3.1 8B Instant structures the proven content into a normalized claim — extraction shapes the claim, but does not by itself prove it true.'],
    ['STAGE 04 / CLAIM HASH', 'The structured claim is hashed with keccak256 and anchored in the MST registry contract, so the record can be referenced without storing raw data on-chain.'],
    ['STAGE 05 / VERIFIER', 'A recruiter or auditor portal queries verifySkill() for supported claims — trust depends on the whole chain, from source proof to what the verifier actually checks.']
  ];
  const nameEl = document.getElementById('pipe-stage-name');
  const copyEl = document.getElementById('pipe-stage-copy');
  const nodes = [...document.querySelectorAll('.pipe-node')];
  const dots = [...document.querySelectorAll('.pipe-dots circle')];
  const packet = document.getElementById('pipe-packet');
  const runBtn = document.getElementById('pipe-run');
  const path = document.querySelector('.pipe-path');
  const pathLength = path ? path.getTotalLength() : 0;

  const setStage = (i) => {
    nodes.forEach((n, j) => {
      n.classList.toggle('is-active', j === i);
      n.setAttribute('aria-selected', String(j === i));
    });
    dots.forEach((d, j) => d.classList.toggle('lit', j <= i));
    nameEl.textContent = stageData[i][0];
    copyEl.textContent = stageData[i][1];
  };
  nodes.forEach((node) => node.addEventListener('click', () => setStage(Number(node.dataset.stage))));

  let running = false;
  runBtn?.addEventListener('click', () => {
    if (running || !path) return;
    running = true;
    runBtn.disabled = true;
    runBtn.textContent = 'TRACING PROOF…';
    packet.classList.add('running');
    const t0 = performance.now();
    const duration = reducedMotion ? 10 : 3400;
    const step = () => {
      const p = Math.min(1, (performance.now() - t0) / duration);
      const pt = path.getPointAtLength(p * pathLength);
      packet.setAttribute('cx', pt.x);
      packet.setAttribute('cy', pt.y);
      setStage(Math.min(4, Math.floor(p * 5)));
      if (p < 1) requestAnimationFrame(step);
      else {
        running = false;
        runBtn.disabled = false;
        runBtn.textContent = 'RUN A PROOF TRACE ↗';
        packet.classList.remove('running');
        nameEl.textContent = 'TRACE COMPLETE / VERIFIER QUERY';
        copyEl.textContent = 'The chain walked end to end: session → proof → extraction → hash → verifySkill(). Remember: a clean trace demonstrates the architecture, not the truth of any real-world claim.';
      }
    };
    step();
  });
  setStage(0);
}
