import * as THREE from 'three';

(function () {
  const canvases = document.querySelectorAll('[data-hero-canvas]');
  if (!canvases.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const accentRaw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const accentColor = accentRaw ? new THREE.Color(accentRaw) : new THREE.Color('#c0432b');
  const softColor = accentColor.clone().lerp(new THREE.Color('#f4efe4'), 0.45);

  canvases.forEach((canvas) => initHero(canvas));

  function initHero(canvas) {
    let w = canvas.clientWidth || canvas.parentElement.clientWidth;
    let h = canvas.clientHeight || canvas.parentElement.clientHeight;
    if (!w || !h) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 100);
    camera.position.set(0, 0, 5.4);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      canvas.style.display = 'none';
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;

    const stage = new THREE.Group();
    scene.add(stage);

    const glowSprite = createGlowSprite(accentColor);
    glowSprite.scale.set(5.2, 5.2, 1);
    glowSprite.position.z = -0.35;
    scene.add(glowSprite);

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.75, 2),
      new THREE.MeshBasicMaterial({ color: accentColor, wireframe: true, transparent: true, opacity: 0.23 })
    );
    stage.add(shell);

    const inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.03, 1),
      new THREE.MeshBasicMaterial({ color: softColor, wireframe: true, transparent: true, opacity: 0.18 })
    );
    stage.add(inner);

    const nodeGeometry = new THREE.IcosahedronGeometry(1.78, 2);
    const nodePositions = nodeGeometry.attributes.position.array;
    const nodes = new Float32Array(nodePositions.length);
    nodes.set(nodePositions);
    const nodePointsGeometry = new THREE.BufferGeometry();
    nodePointsGeometry.setAttribute('position', new THREE.BufferAttribute(nodes, 3));
    const nodePoints = new THREE.Points(
      nodePointsGeometry,
      new THREE.PointsMaterial({
        color: softColor,
        size: 0.026,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    stage.add(nodePoints);

    const connectors = createConnectorLines(nodes, accentColor);
    stage.add(connectors);

    const particleField = createParticleField(Math.min(110, Math.max(56, Math.floor(w / 12))), accentColor, softColor);
    scene.add(particleField);

    const lightTrail = createLightTrail(accentColor, softColor);
    stage.add(lightTrail);

    const target = new THREE.Vector2(0, 0);
    const current = new THREE.Vector2(0, 0);
    window.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      target.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    }, { passive: true });

    function onResize() {
      w = canvas.clientWidth || canvas.parentElement.clientWidth;
      h = canvas.clientHeight || canvas.parentElement.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    window.addEventListener('resize', onResize, { passive: true });

    const clock = new THREE.Clock();

    function renderStatic() {
      stage.rotation.set(-0.15, 0.45, -0.1);
      renderer.render(scene, camera);
    }

    if (reduceMotion) {
      glowSprite.material.opacity = 0.16;
      particleField.material.opacity = 0.16;
      lightTrail.visible = false;
      renderStatic();
      return;
    }

    function animate() {
      const t = clock.getElapsedTime();

      current.lerp(target, 0.045);
      stage.position.x = current.x * 0.34;
      stage.position.y = current.y * 0.22;
      particleField.position.x = current.x * 0.16;
      particleField.position.y = current.y * 0.1;
      glowSprite.position.x = current.x * 0.18;
      glowSprite.position.y = current.y * 0.12;

      shell.rotation.set(t * 0.11, t * 0.18, t * 0.045);
      inner.rotation.set(-t * 0.18, t * 0.26, -t * 0.06);
      nodePoints.rotation.copy(shell.rotation);
      connectors.rotation.copy(shell.rotation);

      particleField.rotation.y = t * 0.035;
      particleField.rotation.x = Math.sin(t * 0.3) * 0.05;

      lightTrail.rotation.x = Math.sin(t * 0.25) * 0.22 + 0.7;
      lightTrail.rotation.y = -t * 0.42;
      lightTrail.rotation.z = t * 0.18;
      lightTrail.children.forEach((trail, index) => {
        trail.material.opacity = 0.26 + Math.sin(t * 1.6 + index * 1.7) * 0.12;
      });

      glowSprite.material.opacity = 0.17 + Math.sin(t * 0.8) * 0.035;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();
  }

  function createConnectorLines(nodes, color) {
    const linePositions = [];
    const stride = 3;
    const count = nodes.length / stride;
    for (let i = 0; i < count; i += 2) {
      const ax = nodes[i * stride];
      const ay = nodes[i * stride + 1];
      const az = nodes[i * stride + 2];
      for (let j = i + 1; j < Math.min(count, i + 9); j += 3) {
        const bx = nodes[j * stride];
        const by = nodes[j * stride + 1];
        const bz = nodes[j * stride + 2];
        const d = Math.hypot(ax - bx, ay - by, az - bz);
        if (d > 0.48 && d < 1.15) linePositions.push(ax, ay, az, bx, by, bz);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    return new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
  }

  function createParticleField(count, color, softColor) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 1.45 + Math.random() * 2.15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      positions[i * 3 + 2] = Math.cos(phi) * radius - 0.15;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: color.clone().lerp(softColor, 0.35),
        size: 0.018,
        transparent: true,
        opacity: 0.36,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
  }

  function createLightTrail(color, softColor) {
    const lightTrail = new THREE.Group();
    const arcs = [
      { radius: 1.96, tube: 0.006, arc: 1.24, opacity: 0.34, rot: [0.95, 0.15, 0.2] },
      { radius: 1.38, tube: 0.005, arc: 0.86, opacity: 0.26, rot: [1.25, -0.55, 1.5] },
      { radius: 2.18, tube: 0.004, arc: 0.62, opacity: 0.18, rot: [0.45, 0.85, 2.7] },
    ];

    arcs.forEach((arc, index) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(arc.radius, arc.tube, 8, 96, Math.PI * arc.arc),
        new THREE.MeshBasicMaterial({
          color: index === 1 ? softColor : color,
          transparent: true,
          opacity: arc.opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      mesh.rotation.set(arc.rot[0], arc.rot[1], arc.rot[2]);
      lightTrail.add(mesh);
    });

    return lightTrail;
  }

  function createGlowSprite(color) {
    const size = 256;
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = size;
    glowCanvas.height = size;
    const ctx = glowCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255, 135, 92, 0.55)');
    gradient.addColorStop(0.34, 'rgba(224, 87, 60, 0.2)');
    gradient.addColorStop(1, 'rgba(224, 87, 60, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(glowCanvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      color,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowSprite = new THREE.Sprite(material);
    return glowSprite;
  }
})();
