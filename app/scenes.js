import * as THREE from './vendor/three.module.min.js';

/* ═══════════════════════════════════════════════════════════════
   Scene system — hero sculpture, proof network, signal study.
   Acre & Espresso materials: saddle metal, leather, chalk, taupe.
   ═══════════════════════════════════════════════════════════════ */

const palette = {
  chalk: 0xfbf9f6,
  espresso: 0x141212,
  taupe: 0x8c827a,
  saddle: 0x9e6b4e,
  leatherLight: 0xc09a81,
  ember: 0xd2a78d,
  sage: 0x97ad86,
  surface: 0xe9e1da
};
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scenes = [];

function addLights(scene, dark, kind) {
  if (kind === 'signal') {
    scene.add(new THREE.AmbientLight(0xffffff, 3.5));
    const key = new THREE.DirectionalLight(0xffeedd, 5.5);
    key.position.set(4.5, 6, 7.5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 3.0);
    fill.position.set(-4, 4, 5);
    scene.add(fill);
    const warm = new THREE.PointLight(palette.ember, 60, 20);
    warm.position.set(2, 4, 3);
    scene.add(warm);
    const back = new THREE.DirectionalLight(0xd2a78d, 2.0);
    back.position.set(-3, -2, -4);
    scene.add(back);
    return;
  }
  scene.add(new THREE.AmbientLight(0xffffff, dark ? 0.55 : 1.45));
  const key = new THREE.DirectionalLight(0xfff2e8, dark ? 2.6 : 3.1);
  key.position.set(3.5, 4.2, 5);
  scene.add(key);
  const warm = new THREE.PointLight(palette.saddle, dark ? 60 : 26, 16);
  warm.position.set(-3.5, -1, 2.5);
  scene.add(warm);
  const rim = new THREE.PointLight(palette.sage, dark ? 26 : 0, 14);
  rim.position.set(3, 2.5, -3.5);
  scene.add(rim);
}

function line(points, color = palette.taupe, opacity = 0.42) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
}

/* ── HERO: AI & Data Science Neural Constellation & Tensor Field ────── */
function createHero(group) {
  const neuralNet = new THREE.Group();
  group.add(neuralNet);

  // Neural network architecture: layers of nodes (Input -> Latent -> Output)
  const layerDefs = [
    { x: -3.2, count: 5, color: palette.sage, rad: 0.11 },
    { x: -1.6, count: 7, color: palette.ember, rad: 0.13 },
    { x: 0.1, count: 8, color: palette.chalk, rad: 0.14 },
    { x: 1.8, count: 6, color: palette.saddle, rad: 0.12 },
    { x: 3.3, count: 4, color: palette.leatherLight, rad: 0.11 }
  ];

  const nodePositions = [];
  const layerNodes = [];

  layerDefs.forEach((layer, layerIdx) => {
    const nodes = [];
    const span = (layer.count - 1) * 0.85;
    for (let i = 0; i < layer.count; i++) {
      const y = -span / 2 + i * 0.85;
      const z = Math.sin((layerIdx + i) * 0.7) * 0.75;
      const pos = new THREE.Vector3(layer.x, y, z);
      nodePositions.push(pos);
      nodes.push(pos);

      // Node mesh: glowing icosahedron
      const nodeMesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(layer.rad, 1),
        new THREE.MeshStandardMaterial({
          color: layer.color,
          metalness: 0.7,
          roughness: 0.2,
          emissive: layer.color,
          emissiveIntensity: 0.4
        })
      );
      nodeMesh.position.copy(pos);
      neuralNet.add(nodeMesh);

      // Outer delicate halo ring around key nodes
      if (i % 2 === 0) {
        const halo = new THREE.Mesh(
          new THREE.TorusGeometry(layer.rad * 1.8, 0.005, 6, 40),
          new THREE.MeshBasicMaterial({ color: palette.chalk, transparent: true, opacity: 0.4 })
        );
        halo.position.copy(pos);
        halo.rotation.x = Math.PI / 2 + i * 0.4;
        neuralNet.add(halo);
      }
    }
    layerNodes.push(nodes);
  });

  // Synaptic network connection lines between adjacent layers
  const synapseMaterial = new THREE.LineBasicMaterial({
    color: palette.ember,
    transparent: true,
    opacity: 0.28
  });

  for (let l = 0; l < layerNodes.length - 1; l++) {
    const curr = layerNodes[l];
    const next = layerNodes[l + 1];
    for (let i = 0; i < curr.length; i++) {
      for (let j = 0; j < next.length; j++) {
        // Connect most nodes with probabilistic pruning
        if (Math.abs(i - j) <= 2 || (i + j) % 3 === 0) {
          const geom = new THREE.BufferGeometry().setFromPoints([curr[i], next[j]]);
          neuralNet.add(new THREE.Line(geom, synapseMaterial));
        }
      }
    }
  }

  // Active neural signal impulses traveling along pathways
  const impulses = [];
  for (let p = 0; p < 18; p++) {
    const fromLayer = p % (layerNodes.length - 1);
    const toLayer = fromLayer + 1;
    const fromIdx = (p * 2) % layerNodes[fromLayer].length;
    const toIdx = (p * 3) % layerNodes[toLayer].length;
    const startPt = layerNodes[fromLayer][fromIdx];
    const endPt = layerNodes[toLayer][toIdx];

    const pulse = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 10),
      new THREE.MeshBasicMaterial({ color: palette.chalk, transparent: true, opacity: 0.95 })
    );
    neuralNet.add(pulse);
    impulses.push({ mesh: pulse, start: startPt, end: endPt, t: Math.random(), speed: 0.008 + Math.random() * 0.012 });
  }

  // 3D Data Manifold / Latent coordinate grid
  const gridGroup = new THREE.Group();
  group.add(gridGroup);
  const gridPts = [];
  for (let gx = -4.5; gx <= 4.5; gx += 0.9) {
    gridPts.push(new THREE.Vector3(gx, -2.4, -2.5), new THREE.Vector3(gx, -2.4, 2.5));
  }
  for (let gz = -2.5; gz <= 2.5; gz += 0.8) {
    gridPts.push(new THREE.Vector3(-4.5, -2.4, gz), new THREE.Vector3(4.5, -2.4, gz));
  }
  gridGroup.add(new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(gridPts),
    new THREE.LineBasicMaterial({ color: palette.taupe, transparent: true, opacity: 0.22 })
  ));

  // Concentric Tensor rings surrounding the neural core
  const tensorRings = [];
  [[3.2, 0.4, 0.2, palette.ember, 0.4], [3.8, -0.7, 0.6, palette.sage, 0.3], [4.4, 0.15, 1.1, palette.chalk, 0.25]].forEach(([rad, rx, ry, color, opacity], i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(rad, 0.007, 8, 180),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
    );
    ring.rotation.set(rx, ry, i * 0.4);
    group.add(ring);
    tensorRings.push(ring);
  });

  // Data point cluster (starlight & feature vectors)
  const dCount = 380;
  const dPos = new Float32Array(dCount * 3);
  for (let i = 0; i < dCount; i++) {
    const r = 2.4 + Math.random() * 3.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    dPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    dPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
    dPos[i * 3 + 2] = r * Math.cos(phi);
  }
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  const dataParticles = new THREE.Points(
    dGeo,
    new THREE.PointsMaterial({
      color: palette.ember,
      size: 0.024,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  group.add(dataParticles);

  return { neuralNet, impulses, gridGroup, tensorRings, dataParticles };
}


/* ── PORTRAIT: 3D Grid Globe with Stable Crystal-Clear Photo Inside ─────── */
function createPortrait(group) {
  // Portrait group that stays upright and facing the viewer with NO movement
  const photoAnchor = new THREE.Group();
  group.add(photoAnchor);

  // Rotating outer sphere grid and orbital particles
  const globeGrid = new THREE.Group();
  group.add(globeGrid);

  // Load the user's portrait texture (square cropped, face centered 1:1)
  const textureLoader = new THREE.TextureLoader();
  const portraitTexture = textureLoader.load('./assets/portrait_square.jpg');
  portraitTexture.colorSpace = THREE.SRGBColorSpace;
  portraitTexture.generateMipmaps = true;
  portraitTexture.minFilter = THREE.LinearMipmapLinearFilter;
  portraitTexture.magFilter = THREE.LinearFilter;
  portraitTexture.anisotropy = 16;

  // Portrait plane: circular disc inside the globe, centered and crystal-clear
  const photoRadius = 1.05;
  const portraitGeo = new THREE.CircleGeometry(photoRadius, 64);
  const portraitMat = new THREE.MeshBasicMaterial({
    map: portraitTexture,
    side: THREE.FrontSide,
    transparent: false,
    depthWrite: true
  });
  const portraitMesh = new THREE.Mesh(portraitGeo, portraitMat);
  portraitMesh.position.set(0, 0, 0);
  photoAnchor.add(portraitMesh);

  // Dark backing disc to prevent any rear lines bleeding through
  const backPlate = new THREE.Mesh(
    new THREE.CircleGeometry(photoRadius + 0.005, 64),
    new THREE.MeshBasicMaterial({ color: 0x12100f, side: THREE.BackSide })
  );
  backPlate.position.set(0, 0, -0.002);
  photoAnchor.add(backPlate);

  // Glowing metallic rim frame around the photo
  const portraitRim = new THREE.Mesh(
    new THREE.RingGeometry(photoRadius - 0.012, photoRadius + 0.022, 64),
    new THREE.MeshBasicMaterial({
      color: palette.ember,
      side: THREE.DoubleSide
    })
  );
  portraitRim.position.set(0, 0, 0.002);
  photoAnchor.add(portraitRim);

  // Subtle chalk accent ring
  const chalkHalo = new THREE.Mesh(
    new THREE.RingGeometry(photoRadius + 0.032, photoRadius + 0.042, 64),
    new THREE.MeshBasicMaterial({ color: palette.chalk, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
  );
  chalkHalo.position.set(0, 0, 0.003);
  photoAnchor.add(chalkHalo);

  // 4 Cardinal technical bracket markers
  const bracketMat = new THREE.MeshBasicMaterial({ color: palette.ember, transparent: true, opacity: 0.85 });
  [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].forEach((ang) => {
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.02), bracketMat);
    tick.position.set(Math.cos(ang) * (photoRadius + 0.055), Math.sin(ang) * (photoRadius + 0.055), 0.005);
    tick.rotation.z = ang;
    photoAnchor.add(tick);
  });

  // ── SPHERE GRID: Clean, elegant latitude & longitude grid kind enclosing the photo ──
  const sphereRadius = 1.28;
  const gridLines = [];

  // Latitude rings (horizontal circles)
  [-0.95, -0.65, -0.32, 0, 0.32, 0.65, 0.95].forEach((h) => {
    const r = Math.sqrt(Math.max(0, sphereRadius * sphereRadius - h * h));
    const latRing = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.0055, 6, 120),
      new THREE.MeshBasicMaterial({
        color: h === 0 ? palette.ember : palette.saddle,
        transparent: true,
        opacity: h === 0 ? 0.45 : 0.22
      })
    );
    latRing.position.y = h;
    latRing.rotation.x = Math.PI / 2;
    globeGrid.add(latRing);
    gridLines.push(latRing);
  });

  // Longitude meridian rings (vertical circles)
  for (let m = 0; m < 8; m++) {
    const ang = (m * Math.PI) / 8;
    const longRing = new THREE.Mesh(
      new THREE.TorusGeometry(sphereRadius, 0.005, 6, 120),
      new THREE.MeshBasicMaterial({ color: palette.chalk, transparent: true, opacity: 0.18 })
    );
    longRing.rotation.y = ang;
    globeGrid.add(longRing);
    gridLines.push(longRing);
  }

  // Subtle outer wireframe sphere shell for high-tech grid globe depth
  const wireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(sphereRadius, 16, 12));
  const wireMat = new THREE.LineBasicMaterial({ color: palette.taupe, transparent: true, opacity: 0.12 });
  const wireSphere = new THREE.LineSegments(wireGeo, wireMat);
  globeGrid.add(wireSphere);

  // Orbital rings around the globe with satellites
  const orbits = [];
  [
    [1.55, 0.38, 0.22, palette.ember, 0.65],
    [1.8, 1.15, -0.35, palette.sage, 0.5],
    [2.05, -0.6, 1.2, palette.chalk, 0.4]
  ].forEach(([radius, rx, ry, color, opacity], i) => {
    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.008, 6, 140),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
    );
    orbit.rotation.set(rx, ry, i * 0.4);
    globeGrid.add(orbit);
    orbits.push(orbit);

    const sat = new THREE.Mesh(
      new THREE.OctahedronGeometry(i === 0 ? 0.075 : 0.05, 0),
      new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.2, emissive: color, emissiveIntensity: 0.4 })
    );
    sat.userData = { radius, phase: i * 2.1, rx, ry };
    globeGrid.add(sat);
    orbits.push(sat);
  });

  // Revolving orbital particle cloud (400 particles revolving around the sphere)
  const count = 400;
  const points = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const cChalk = new THREE.Color(palette.chalk);
  const cEmber = new THREE.Color(palette.ember);
  const cSage = new THREE.Color(palette.sage);

  for (let i = 0; i < count; i++) {
    const r = i < 240 ? 1.34 + Math.random() * 0.25 : 1.64 + Math.random() * 0.65;
    const theta = Math.random() * Math.PI * 2;
    const y = Math.random() * 2 - 1;
    const planar = Math.sqrt(Math.max(0, 1 - y * y));
    points[i * 3] = r * planar * Math.cos(theta);
    points[i * 3 + 1] = r * y;
    points[i * 3 + 2] = r * planar * Math.sin(theta);

    const c = i % 3 === 0 ? cChalk : i % 2 === 0 ? cEmber : cSage;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
  dustGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const dust = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({
      size: 0.024,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  globeGrid.add(dust);

  return { photoAnchor, portraitMesh, globeGrid, orbits, dust };
}

/* ── PROOF: verification network ───────────────────────────── */
function createProof(group) {
  const body = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.72, 0),
    new THREE.MeshPhysicalMaterial({ color: palette.saddle, metalness: 0.72, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.12 })
  );
  group.add(body);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(0.735, 0)),
    new THREE.LineBasicMaterial({ color: palette.chalk, transparent: true, opacity: 0.72 })
  );
  group.add(edges);
  const orbit = new THREE.Group();
  group.add(orbit);
  [[1.22, 0.6, 0.2], [1.48, 1.15, 0.85], [1.72, 0.33, 1.35]].forEach(([radius, rx, ry], i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.008, 6, 120),
      new THREE.MeshBasicMaterial({ color: i === 1 ? palette.ember : palette.taupe, transparent: true, opacity: 0.62 })
    );
    ring.rotation.set(rx, ry, i * 0.5);
    orbit.add(ring);
  });
  const nodes = [
    new THREE.Vector3(-1.15, 0.5, 0.2), new THREE.Vector3(1.18, 0.62, -0.1),
    new THREE.Vector3(0.92, -0.88, 0.46), new THREE.Vector3(-0.98, -0.72, -0.3)
  ];
  const nodeMeshes = nodes.map((v, i) => {
    const mesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(i === 0 ? 0.12 : 0.085, 0),
      new THREE.MeshStandardMaterial({ color: i === 2 ? palette.ember : palette.saddle, metalness: 0.5, roughness: 0.3 })
    );
    mesh.position.copy(v);
    group.add(mesh);
    return mesh;
  });
  for (let i = 0; i < nodes.length; i++) {
    group.add(line([nodes[i], nodes[(i + 1) % nodes.length]], palette.ember, 0.6));
    group.add(line([nodes[i], new THREE.Vector3(0, 0, 0)], palette.taupe, 0.34));
  }
  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.94, 0.004, 5, 100),
    new THREE.MeshBasicMaterial({ color: palette.chalk, transparent: true, opacity: 0.3 })
  );
  innerRing.rotation.x = 1.04;
  group.add(innerRing);
  return { body, edges, orbit, nodeMeshes };
}

/* ── SIGNAL: 3D interactive multi-mode graph matrix & loss surface ── */
function createSignal(group) {
  const COLS = 6;
  const ROWS = 4;
  const bars = [];
  const caps = [];

  // 4 mathematical graph distributions
  const calcHeights = (c, r) => {
    const nx = (c / (COLS - 1)) * 2 - 1; // -1 to 1
    const nz = (r / (ROWS - 1)) * 2 - 1; // -1 to 1
    const dist = Math.sqrt(nx * nx + nz * nz);

    // 1. Loss Landscape (convex optimization valley with descent minima)
    const loss = 0.16 + Math.pow(dist / 1.25, 2) * 1.25 + 0.1 * Math.cos(nx * 4);

    // 2. Fourier Signal Spectrum (harmonic sine/cosine frequency decomposition)
    const fourier = 0.65 + 0.45 * Math.sin(c * 1.3 + 0.5) + 0.28 * Math.cos(r * 1.8);

    // 3. Latent Clusters (multimodal Gaussian clustering distribution)
    const d1 = Math.pow(c - 1.2, 2) + Math.pow(r - 0.8, 2);
    const d2 = Math.pow(c - 4.2, 2) + Math.pow(r - 2.4, 2);
    const clusters = 0.2 + 1.25 * Math.exp(-d1 / 1.6) + 1.15 * Math.exp(-d2 / 1.8);

    // 4. Tensor Probability Density (softmax grid distribution)
    const density = 0.35 + 0.8 * Math.sin((c + 1) * 0.65) * Math.cos((r + 1) * 0.75) + (c % 2 === 0 ? 0.3 : 0.1);

    return {
      loss: Math.max(0.12, loss),
      fourier: Math.max(0.15, fourier),
      clusters: Math.max(0.15, clusters),
      density: Math.max(0.15, density)
    };
  };

  const xStart = -2.1;
  const xStep = 0.84;
  const zStart = -1.0;
  const zStep = 0.68;

  // Dedicated illumination for vibrant 3D graph presentation
  const keyLight = new THREE.DirectionalLight(0xfff5ea, 3.2);
  keyLight.position.set(4.5, 5.0, 7.5);
  group.add(keyLight);
  const frontFill = new THREE.DirectionalLight(0xffffff, 1.8);
  frontFill.position.set(-3.5, 4.0, 6.0);
  group.add(frontFill);
  const warmLight = new THREE.PointLight(palette.ember, 25, 14);
  warmLight.position.set(-2.0, 3.5, 3.0);
  group.add(warmLight);
  group.add(new THREE.AmbientLight(0xffffff, 1.2));

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = xStart + c * xStep;
      const z = zStart + r * zStep;
      const hPresets = calcHeights(c, r);
      const initH = hPresets.loss;

      // Color scheme based on spatial coordinates: ember, saddle, taupe, sage
      const color = (c + r) % 3 === 0 ? palette.ember : (c % 2 === 0 ? palette.saddle : palette.leatherLight);

      const barGeo = new THREE.BoxGeometry(0.38, 1, 0.38);
      barGeo.translate(0, 0.5, 0); // anchor at base
      const barMat = new THREE.MeshLambertMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.55
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(x, 0, z);
      bar.scale.set(1, initH, 1);

      bar.userData = {
        col: c,
        row: r,
        x,
        z,
        baseColor: color,
        hPresets,
        targetH: initH,
        currentH: initH,
        phase: (c * 0.6 + r * 0.9)
      };

      group.add(bar);
      bars.push(bar);

      // Glowing vertex cap node on top of each bar
      const cap = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.065, 0),
        new THREE.MeshStandardMaterial({
          color: palette.chalk,
          metalness: 0.8,
          roughness: 0.2,
          emissive: palette.ember,
          emissiveIntensity: 0.4
        })
      );
      cap.position.set(x, initH + 0.05, z);
      group.add(cap);
      caps.push({ cap, bar });
    }
  }

  // 3D coordinate ground grid plane
  const gridPts = [];
  for (let x = -2.6; x <= 2.6; x += 0.84) {
    gridPts.push(new THREE.Vector3(x, 0, -1.4), new THREE.Vector3(x, 0, 1.6));
  }
  for (let z = -1.4; z <= 1.6; z += 0.68) {
    gridPts.push(new THREE.Vector3(-2.6, 0, z), new THREE.Vector3(2.6, 0, z));
  }
  group.add(new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(gridPts),
    new THREE.LineBasicMaterial({ color: palette.chalk, transparent: true, opacity: 0.32 })
  ));

  // Dynamic Spline Trendline connecting the front row of graph peaks
  const trendlinePts = [];
  for (let c = 0; c < COLS; c++) {
    trendlinePts.push(new THREE.Vector3(bars[c].position.x, bars[c].scale.y + 0.08, bars[c].position.z));
  }
  const trendlineGeo = new THREE.BufferGeometry().setFromPoints(trendlinePts);
  const trendline = new THREE.Line(
    trendlineGeo,
    new THREE.LineBasicMaterial({ color: palette.chalk, transparent: true, opacity: 0.85 })
  );
  group.add(trendline);

  // Floating data constellation orbit
  const orbitGroup = new THREE.Group();
  group.add(orbitGroup);
  const dataNodes = [];
  for (let i = 0; i < 10; i++) {
    const node = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.075, 0),
      new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? palette.ember : palette.sage,
        metalness: 0.7,
        roughness: 0.2,
        emissive: i % 2 === 0 ? palette.ember : palette.sage,
        emissiveIntensity: 0.35
      })
    );
    node.userData = { rad: 2.2 + (i % 3) * 0.4, speed: 0.35 + i * 0.06, phase: i * 0.65 };
    orbitGroup.add(node);
    dataNodes.push(node);
  }

  let activeMode = 'loss';
  const setGraphMode = (mode) => {
    activeMode = mode;
    for (const b of bars) {
      if (b.userData.hPresets[mode] !== undefined) {
        b.userData.targetH = b.userData.hPresets[mode];
      }
    }
  };

  return { bars, caps, trendline, orbitGroup, dataNodes, setGraphMode, activeMode: () => activeMode };
}

/* ── CONNECT: 3D planetary communication beacon & constellation ── */
function createConnect(group) {
  const beacon = new THREE.Group();
  group.add(beacon);

  // Central glowing communication core
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.72, 1),
    new THREE.MeshPhysicalMaterial({
      color: palette.ember,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 1,
      emissive: palette.saddle,
      emissiveIntensity: 0.55
    })
  );
  beacon.add(core);

  const coreCage = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.78, 0),
    new THREE.MeshBasicMaterial({ color: palette.chalk, wireframe: true, transparent: true, opacity: 0.65 })
  );
  beacon.add(coreCage);

  // Concentric pulsing signal rings
  const rings = [];
  [[1.18, 0.2, 0.4, palette.ember, 0.7], [1.56, -0.6, 0.8, palette.sage, 0.55], [1.95, 0.9, -0.3, palette.leatherLight, 0.5], [2.35, 0.3, 1.1, palette.chalk, 0.35]].forEach(([rad, rx, ry, color, opacity], i) => {
    const r = new THREE.Mesh(
      new THREE.TorusGeometry(rad, 0.008, 6, 140),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
    );
    r.rotation.set(rx, ry, i * 0.5);
    beacon.add(r);
    rings.push(r);
  });

  // Constellation communication satellites and interconnecting beams
  const satellites = [];
  const satCoords = [
    new THREE.Vector3(1.35, 0.65, 0.3),
    new THREE.Vector3(-1.25, 0.75, -0.4),
    new THREE.Vector3(0.95, -1.05, 0.5),
    new THREE.Vector3(-1.1, -0.85, 0.35),
    new THREE.Vector3(0, 1.45, -0.2),
    new THREE.Vector3(0.3, -1.35, -0.6)
  ];

  satCoords.forEach((coord, i) => {
    const sat = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.09, 0),
      new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? palette.ember : palette.chalk,
        metalness: 0.6,
        roughness: 0.25,
        emissive: palette.ember,
        emissiveIntensity: 0.35
      })
    );
    sat.position.copy(coord);
    beacon.add(sat);
    satellites.push({ mesh: sat, basePos: coord.clone(), phase: i * 1.1 });
  });

  // Connect lines between satellites
  for (let i = 0; i < satCoords.length; i++) {
    const next = satCoords[(i + 1) % satCoords.length];
    beacon.add(line([satCoords[i], next], palette.ember, 0.45));
    beacon.add(line([satCoords[i], new THREE.Vector3(0, 0, 0)], palette.chalk, 0.25));
  }

  // Floating beacon particles
  const pCount = 340;
  const pPositions = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const r = 1.3 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.75;
    pPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: palette.chalk,
    size: 0.024,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  beacon.add(pMesh);

  return { beacon, core, coreCage, rings, satellites, pMesh };
}

const sceneBuilders = { hero: createHero, portrait: createPortrait, proof: createProof, signal: createSignal, connect: createConnect };

function makeScene(canvas) {
  const kind = canvas.dataset.scene;
  const wrap = canvas.parentElement;
  const dark = kind !== 'signal';
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(kind === 'signal' ? 38 : (kind === 'hero' ? 44 : kind === 'portrait' ? 35 : kind === 'connect' ? 36 : 34), 1, 0.1, 100);
  camera.position.set(...(kind === 'signal' ? [4.4, 3.15, 7.8] : kind === 'connect' ? [0, 0, 5.6] : [0, 0, kind === 'hero' ? 6.8 : kind === 'portrait' ? 5.2 : 5.15]));
  camera.lookAt(0, 0, 0);
  addLights(scene, dark, kind);
  const group = new THREE.Group();
  scene.add(group);
  const elements = sceneBuilders[kind](group);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, kind === 'portrait' ? 2.5 : (window.innerWidth < 640 ? 1.3 : 1.6)));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  const state = {
    kind, wrap, canvas, scene, camera, renderer, group, elements,
    visible: false, progress: 0,
    baseX: kind === 'signal' ? -0.12 : 0.1,
    speed: kind === 'proof' ? 0.12 : 0.085,
    drag: { active: false, x: 0, y: 0, rotY: 0, rotX: 0, targetY: 0, targetX: 0 },
    parallax: { x: 0, y: 0 }
  };
  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width < 1 || bounds.height < 1) return;
    renderer.setSize(bounds.width, bounds.height, false);
    camera.aspect = bounds.width / bounds.height;
    camera.updateProjectionMatrix();
    renderScene(state, 0);
  };
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize, { passive: true });
  resize();

  if ((kind === 'hero' || kind === 'portrait' || kind === 'connect' || kind === 'signal') && !reducedMotion) {
    const interactive = kind === 'portrait' ? wrap : canvas;
    wrap.style.touchAction = 'pan-y';
    canvas.style.touchAction = 'pan-y';
    const onDown = (event) => {
      state.drag.active = true;
      state.drag.x = event.clientX;
      state.drag.y = event.clientY;
      interactive.setPointerCapture?.(event.pointerId);
    };
    const onMove = (event) => {
      if (state.drag.active) {
        state.drag.targetY += (event.clientX - state.drag.x) * 0.0052;
        state.drag.targetX += (event.clientY - state.drag.y) * 0.0032;
        state.drag.targetX = Math.max(-0.7, Math.min(0.7, state.drag.targetX));
        state.drag.x = event.clientX;
        state.drag.y = event.clientY;
      } else if (event.pointerType !== 'touch') {
        const bounds = wrap.getBoundingClientRect();
        state.parallax.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        state.parallax.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      }
    };
    const onUp = () => { state.drag.active = false; };
    interactive.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    if (kind === 'hero' || kind === 'connect' || kind === 'signal') canvas.style.pointerEvents = 'auto';
  }

  // Interactive raycaster for 3D graph bar probes
  if (kind === 'signal') {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const readout = document.getElementById('graph-cursor-readout');
    canvas.addEventListener('pointermove', (e) => {
      if (state.drag.active) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(elements.bars);
      if (hits.length > 0) {
        const hitBar = hits[0].object;
        const u = hitBar.userData;
        if (readout && u) {
          readout.innerHTML = `TENSOR PROBE [COL ${u.col + 1}, ROW ${u.row + 1}] · VAL: <strong>${u.currentH.toFixed(3)}</strong> · DENSITY: <strong>${Math.min(100, Math.round(u.currentH * 68))}%</strong>`;
          readout.style.borderColor = 'rgba(251, 251, 250, 0.7)';
        }
        elements.bars.forEach((b) => {
          if (b === hitBar) {
            b.material.emissive.set(palette.chalk);
            b.material.emissiveIntensity = 0.65;
          } else {
            b.material.emissive.set(b.userData.baseColor);
            b.material.emissiveIntensity = 0.12;
          }
        });
      } else {
        if (readout) {
          readout.innerHTML = 'HOVER OVER BARS TO PROBE TENSOR VALUES';
          readout.style.borderColor = 'rgba(251, 251, 250, 0.2)';
        }
        elements.bars.forEach((b) => {
          b.material.emissive.set(b.userData.baseColor);
          b.material.emissiveIntensity = 0.18;
        });
      }
    });
    canvas.addEventListener('pointerleave', () => {
      if (readout) {
        readout.innerHTML = 'HOVER OVER BARS TO PROBE TENSOR VALUES';
        readout.style.borderColor = 'rgba(251, 251, 250, 0.2)';
      }
      elements.bars.forEach((b) => {
        b.material.emissive.set(b.userData.baseColor);
        b.material.emissiveIntensity = 0.18;
      });
    });
  }

  scenes.push(state);
  return state;
}

window.setSignalGraphMode = (mode) => {
  const sig = scenes.find((s) => s.kind === 'signal');
  if (sig && sig.elements.setGraphMode) {
    sig.elements.setGraphMode(mode);
  }
};

function renderScene(state, elapsed) {
  const motion = reducedMotion ? 0 : elapsed;

  if (state.kind === 'portrait') {
    // Photo stays crystal clear, perfectly framed, with ZERO motion
    const d = state.drag;
    d.rotY += (d.targetY - d.rotY) * 0.08;
    d.rotX += (d.targetX - d.rotX) * 0.08;

    // Rock-solid static photo (ZERO movement, ZERO parallax, ZERO rotation)
    state.elements.photoAnchor.position.set(0, 0, 0);
    state.elements.photoAnchor.rotation.set(0, 0, 0);
    state.elements.portraitMesh.position.set(0, 0, 0);
    state.elements.portraitMesh.rotation.set(0, 0, 0);

    // The sphere grid spins around the photo
    state.elements.globeGrid.rotation.y = d.rotY + motion * 0.16;
    state.elements.globeGrid.rotation.x = d.rotX + Math.sin(motion * 0.35) * 0.05;

    // Dust particles revolving
    state.elements.dust.rotation.y = -motion * 0.09;
    state.elements.dust.rotation.z = Math.sin(motion * 0.22) * 0.05;

    // Satellites orbiting
    for (const item of state.elements.orbits) {
      if (!item.userData || item.userData.radius === undefined) continue;
      const { radius, phase, rx, ry } = item.userData;
      const a = motion * 0.44 + phase;
      const pt = new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      pt.applyEuler(new THREE.Euler(rx, ry, 0));
      item.position.copy(pt);
      item.rotation.y = motion * 0.48;
    }
    state.camera.lookAt(0, 0, 0);
    state.renderer.render(state.scene, state.camera);
    return;
  }

  if (state.kind === 'hero') {
    // AI Neural Constellation & Latent Tensor Field
    const d = state.drag;
    d.rotY += (d.targetY - d.rotY) * 0.08;
    d.rotX += (d.targetX - d.rotX) * 0.08;
    state.group.rotation.y = d.rotY + motion * 0.055 + state.parallax.x * 0.14;
    state.group.rotation.x = d.rotX + state.parallax.y * 0.08 + Math.sin(motion * 0.35) * 0.02;

    // Animate neural signal impulses along the network
    if (state.elements.impulses) {
      for (const p of state.elements.impulses) {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
        p.mesh.position.lerpVectors(p.start, p.end, p.t);
        const scale = Math.sin(p.t * Math.PI) * 1.4;
        p.mesh.scale.setScalar(Math.max(0.2, scale));
      }
    }

    // Tensor rings
    if (state.elements.tensorRings) {
      state.elements.tensorRings.forEach((ring, idx) => {
        ring.rotation.z = motion * (0.04 + idx * 0.02);
      });
    }

    if (state.elements.dataParticles) {
      state.elements.dataParticles.rotation.y = motion * 0.025;
    }

    state.camera.position.x += (state.parallax.x * 0.3 - state.camera.position.x) * 0.04;
    state.camera.position.y += (-state.parallax.y * 0.2 - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
    state.renderer.render(state.scene, state.camera);
    return;
  }

  if (state.kind === 'connect') {
    // 3D Planetary Communication Beacon
    state.group.rotation.y = motion * 0.12 + state.parallax.x * 0.15;
    state.group.rotation.x = Math.sin(motion * 0.3) * 0.05 + state.parallax.y * 0.08;
    if (state.elements.core) {
      state.elements.core.rotation.y = motion * 0.2;
      state.elements.core.rotation.x = motion * 0.12;
      state.elements.coreCage.rotation.copy(state.elements.core.rotation);
      const pulse = 1 + Math.sin(motion * 2.2) * 0.08;
      state.elements.core.scale.setScalar(pulse);
    }
    if (state.elements.rings) {
      state.elements.rings.forEach((r, idx) => {
        r.rotation.z = motion * (0.15 + idx * 0.05);
      });
    }
    if (state.elements.satellites) {
      state.elements.satellites.forEach((sat) => {
        const a = motion * 0.6 + sat.phase;
        sat.mesh.position.x = sat.basePos.x + Math.sin(a) * 0.18;
        sat.mesh.position.y = sat.basePos.y + Math.cos(a) * 0.18;
        sat.mesh.rotation.y = motion * 0.8;
      });
    }
    if (state.elements.pMesh) {
      state.elements.pMesh.rotation.y = -motion * 0.06;
    }
    state.renderer.render(state.scene, state.camera);
    return;
  }

  // Fallback for proof and signal
  if (state.kind === 'signal') {
    // 3D Interactive Multi-Mode Graph
    const d = state.drag;
    d.rotY += (d.targetY - d.rotY) * 0.08;
    d.rotX += (d.targetX - d.rotX) * 0.08;

    state.group.rotation.y = d.rotY + state.progress * Math.PI * 0.45 + Math.sin(motion * 0.22) * 0.04;
    state.group.rotation.x = state.baseX + d.rotX + Math.cos(motion * 0.28) * 0.025;

    // Smoothly morph bars to their target heights with organic wave ripple
    const trendlinePts = [];
    for (let i = 0; i < state.elements.bars.length; i++) {
      const b = state.elements.bars[i];
      const u = b.userData;
      u.currentH += (u.targetH - u.currentH) * 0.09;
      const pulse = Math.sin(motion * 1.8 + u.phase) * 0.035;
      const actualH = Math.max(0.08, u.currentH + pulse);
      b.scale.y = actualH;

      const capObj = state.elements.caps[i];
      if (capObj) {
        capObj.cap.position.y = actualH + 0.05;
      }

      if (i < 6) {
        trendlinePts.push(new THREE.Vector3(b.position.x, actualH + 0.06, b.position.z));
      }
    }

    if (state.elements.trendline && trendlinePts.length > 0) {
      state.elements.trendline.geometry.setFromPoints(trendlinePts);
    }

    if (state.elements.orbitGroup) {
      state.elements.orbitGroup.rotation.y = motion * 0.22;
      for (const node of state.elements.dataNodes) {
        const a = motion * node.userData.speed + node.userData.phase;
        node.position.set(
          Math.cos(a) * node.userData.rad,
          1.2 + Math.sin(a * 1.6) * 0.35,
          Math.sin(a) * node.userData.rad
        );
      }
    }

    state.renderer.render(state.scene, state.camera);
    return;
  }

  // Fallback for proof
  state.group.rotation.y = state.progress * Math.PI * 1.05 + motion * state.speed;
  state.group.rotation.x = state.baseX + state.progress * 0.38 + Math.sin(motion * 0.55) * 0.035;
  state.group.rotation.z = Math.cos(motion * 0.3) * 0.035;
  if (state.kind === 'proof') {
    state.elements.body.rotation.x = motion * 0.16;
    state.elements.edges.rotation.copy(state.elements.body.rotation);
    state.elements.orbit.rotation.y = motion * 0.15;
  }
}

function updateScrollProgress() {
  const viewport = window.innerHeight || 1;
  for (const state of scenes) {
    const rect = state.wrap.getBoundingClientRect();
    state.progress = THREE.MathUtils.clamp((viewport - rect.top) / (viewport + rect.height), 0, 1);
    if (reducedMotion && state.visible) renderScene(state, 0);
  }
}

let animationFrame = 0;
let lastFrame = 0;
function animate(timestamp) {
  animationFrame = 0;
  if (document.visibilityState === 'hidden') return;
  if (timestamp - lastFrame < 28 && !reducedMotion) { startAnimation(); return; }
  lastFrame = timestamp;
  for (const state of scenes) if (state.visible) renderScene(state, timestamp * 0.001);
  if (!reducedMotion && scenes.some((state) => state.visible)) startAnimation();
}
function startAnimation() {
  if (!animationFrame && document.visibilityState !== 'hidden' && scenes.some((state) => state.visible)) {
    animationFrame = window.requestAnimationFrame(animate);
  }
}
function onScroll() {
  updateScrollProgress();
  if (!reducedMotion) startAnimation();
}

export function initialize3DScenes() {
  try {
    document.querySelectorAll('canvas[data-scene]').forEach(makeScene);
  } catch (error) {
    console.warn('3D scene failed, continuing without it:', error);
    return;
  }
  if (!scenes.length) return;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const state = scenes.find((item) => item.wrap === entry.target);
        if (state) {
          state.visible = entry.isIntersecting;
          if (state.visible) renderScene(state, 0);
        }
      });
      startAnimation();
    }, { threshold: 0.01, rootMargin: '120px 0px' });
    scenes.forEach((state) => observer.observe(state.wrap));
  } else {
    scenes.forEach((state) => { state.visible = true; renderScene(state, 0); });
    startAnimation();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    } else startAnimation();
  });
  updateScrollProgress();
}
