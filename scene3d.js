// Three.js 3D Party Scene with Animated Dancing Cats, 3D Birthday Cake, Floating Photo Frames & Disco Lights

class BirthdayScene3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = null;
    this.animationId = null;

    // Objects
    this.cats = [];
    this.cake = null;
    this.candles = [];
    this.candleFlames = [];
    this.candleLights = [];
    this.areCandlesLit = true;
    this.photoFrames = [];
    this.balloons = [];
    this.discoLights = [];
    this.confettiParticles = null;

    // Interaction & Camera
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.cameraAngle = { theta: 0.2, phi: 0.35, radius: 14 };
    this.autoRotate = true;
    this.danceSpeed = 1.0;
    this.danceMove = 'disco'; // 'disco', 'wobble', 'hop'

    this.init();
  }

  init() {
    if (!window.THREE) {
      console.error('Three.js not loaded!');
      return;
    }

    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c0919);
    this.scene.fog = new THREE.FogExp2(0x0c0919, 0.035);

    // Camera setup
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.1, 100);
    this.updateCameraPosition();

    // Clock
    this.clock = new THREE.Clock();

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Build Scene Elements
    this.setupLighting();
    this.buildStage();
    this.buildCake();
    this.buildDancingCats();
    this.buildBalloons();
    this.buildGiftBoxes();
    this.buildConfettiSystem();

    // Event Listeners
    this.setupEvents();

    // Start loop
    this.animate();
  }

  setupLighting() {
    // Ambient soft lighting
    const ambientLight = new THREE.AmbientLight(0xffe6f5, 0.55);
    this.scene.add(ambientLight);

    // Main key light
    const dirLight = new THREE.DirectionalLight(0xfff5ea, 0.85);
    dirLight.position.set(6, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    this.scene.add(dirLight);

    // Disco Spotlights (Magenta, Cyan, Gold)
    const colors = [0xff2a85, 0x00e5ff, 0xffd200];
    for (let i = 0; i < 3; i++) {
      const spot = new THREE.SpotLight(colors[i], 2.2, 25, Math.PI / 5, 0.4, 1.2);
      spot.position.set(Math.cos(i * 2.1) * 8, 9, Math.sin(i * 2.1) * 8);
      spot.target.position.set(0, 0, 0);
      this.scene.add(spot);
      this.scene.add(spot.target);
      this.discoLights.push(spot);
    }
  }

  buildStage() {
    const stageGroup = new THREE.Group();

    // Main Dance Platform
    const platformGeo = new THREE.CylinderGeometry(7.5, 8.2, 0.7, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x1d1738,
      roughness: 0.35,
      metalness: 0.25
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.35;
    platform.receiveShadow = true;
    stageGroup.add(platform);

    // Glowing Neon Ring around stage
    const ringGeo = new THREE.TorusGeometry(7.6, 0.08, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff3399 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    stageGroup.add(ring);

    // Disco Grid Floor
    const gridGeo = new THREE.CircleGeometry(7.2, 32);
    const gridMat = new THREE.MeshStandardMaterial({
      color: 0x271e4d,
      roughness: 0.2,
      metalness: 0.4
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = 0.01;
    grid.receiveShadow = true;
    stageGroup.add(grid);

    this.scene.add(stageGroup);
  }

  buildCake() {
    const cakeGroup = new THREE.Group();
    cakeGroup.position.set(0, 0, 0);

    // Cake Pedestal
    const standGeo = new THREE.CylinderGeometry(2.4, 2.8, 0.3, 32);
    const standMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.2 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.y = 0.15;
    stand.receiveShadow = true;
    cakeGroup.add(stand);

    // Tier 1 (Bottom) - Pastel Strawberry Pink
    const t1Geo = new THREE.CylinderGeometry(2.1, 2.1, 1.1, 36);
    const t1Mat = new THREE.MeshStandardMaterial({ color: 0xff8fa3, roughness: 0.3 });
    const t1 = new THREE.Mesh(t1Geo, t1Mat);
    t1.position.y = 0.3 + 0.55;
    t1.castShadow = true;
    t1.receiveShadow = true;
    cakeGroup.add(t1);

    // Frosting Cream Drips Tier 1
    const t1FrostGeo = new THREE.TorusGeometry(2.12, 0.12, 12, 36);
    const frostMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 });
    const t1Frost = new THREE.Mesh(t1FrostGeo, frostMat);
    t1Frost.rotation.x = Math.PI / 2;
    t1Frost.position.y = 1.4;
    cakeGroup.add(t1Frost);

    // Tier 2 (Middle) - Vanilla Cream
    const t2Geo = new THREE.CylinderGeometry(1.5, 1.5, 0.95, 32);
    const t2Mat = new THREE.MeshStandardMaterial({ color: 0xfff0c2, roughness: 0.3 });
    const t2 = new THREE.Mesh(t2Geo, t2Mat);
    t2.position.y = 1.4 + 0.475;
    t2.castShadow = true;
    t2.receiveShadow = true;
    cakeGroup.add(t2);

    // Tier 3 (Top) - Mint Frosting
    const t3Geo = new THREE.CylinderGeometry(0.95, 0.95, 0.8, 28);
    const t3Mat = new THREE.MeshStandardMaterial({ color: 0x85e3d2, roughness: 0.3 });
    const t3 = new THREE.Mesh(t3Geo, t3Mat);
    t3.position.y = 2.35 + 0.4;
    t3.castShadow = true;
    t3.receiveShadow = true;
    cakeGroup.add(t3);

    // Decorative Strawberries on Tier 3
    const strawGeo = new THREE.ConeGeometry(0.12, 0.22, 12);
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xff1e46, roughness: 0.2 });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const straw = new THREE.Mesh(strawGeo, strawMat);
      straw.position.set(Math.cos(angle) * 0.7, 3.18, Math.sin(angle) * 0.7);
      straw.rotation.x = Math.PI;
      cakeGroup.add(straw);
    }

    // 3D Candles on Cake Top
    const candlePositions = [
      { x: 0, z: 0 },
      { x: 0.38, z: 0.2 },
      { x: -0.38, z: 0.2 },
      { x: 0, z: -0.4 }
    ];

    candlePositions.forEach((pos) => {
      const candleG = new THREE.Group();
      candleG.position.set(pos.x, 3.15, pos.z);

      // Candle Stick
      const stickGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.7, 12);
      const stickMat = new THREE.MeshStandardMaterial({ color: 0xffc75f });
      const stick = new THREE.Mesh(stickGeo, stickMat);
      stick.position.y = 0.35;
      stick.castShadow = true;
      candleG.add(stick);

      // Wick
      const wickGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8);
      const wickMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      const wick = new THREE.Mesh(wickGeo, wickMat);
      wick.position.y = 0.74;
      candleG.add(wick);

      // Flame (teardrop)
      const flameGeo = new THREE.ConeGeometry(0.07, 0.24, 12);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xff8c00 });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.y = 0.88;
      candleG.add(flame);
      this.candleFlames.push(flame);

      // Inner flame core
      const coreGeo = new THREE.ConeGeometry(0.035, 0.15, 10);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xfff3a1 });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 0.86;
      candleG.add(core);
      this.candleFlames.push(core);

      // Flame Point Light
      const pLight = new THREE.PointLight(0xffaa22, 0.7, 3);
      pLight.position.set(pos.x, 4.0, pos.z);
      this.scene.add(pLight);
      this.candleLights.push(pLight);

      this.candles.push(candleG);
      cakeGroup.add(candleG);
    });

    this.cake = cakeGroup;
    this.scene.add(cakeGroup);
  }

  // Cute 3D Cartoon Cat Builder
  createCat(name, bodyColor, innerEarColor, hatColor, initialPos, rotationY) {
    const catGroup = new THREE.Group();
    catGroup.position.copy(initialPos);
    catGroup.rotation.y = rotationY;

    const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.45 });
    const earInnerMat = new THREE.MeshStandardMaterial({ color: innerEarColor, roughness: 0.5 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const blackMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const pinkNoseMat = new THREE.MeshStandardMaterial({ color: 0xff8fa3, roughness: 0.3 });
    const blushMat = new THREE.MeshBasicMaterial({ color: 0xff6b8b, transparent: true, opacity: 0.6 });

    // 1. Chubby Body
    const bodyGeo = new THREE.SphereGeometry(0.72, 24, 24);
    bodyGeo.scale(1, 1.25, 0.95);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.85;
    body.castShadow = true;
    body.receiveShadow = true;
    catGroup.add(body);

    // Cute White Tummy Patch
    const tummyGeo = new THREE.SphereGeometry(0.5, 18, 18);
    tummyGeo.scale(0.85, 1.1, 0.4);
    const tummy = new THREE.Mesh(tummyGeo, whiteMat);
    tummy.position.set(0, 0.8, 0.6);
    catGroup.add(tummy);

    // 2. Round Cute Head (with head pivot for bobbing)
    const headPivot = new THREE.Group();
    headPivot.position.set(0, 1.7, 0.1);

    const headGeo = new THREE.SphereGeometry(0.68, 24, 24);
    headGeo.scale(1.15, 1, 0.95);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.castShadow = true;
    headPivot.add(head);

    // Left Ear
    const earGeo = new THREE.ConeGeometry(0.24, 0.42, 10);
    const earL = new THREE.Mesh(earGeo, bodyMat);
    earL.position.set(0.42, 0.65, 0);
    earL.rotation.z = -0.35;
    headPivot.add(earL);

    const innerEarL = new THREE.Mesh(earGeo, earInnerMat);
    innerEarL.scale.set(0.65, 0.65, 0.65);
    innerEarL.position.set(0.42, 0.64, 0.05);
    innerEarL.rotation.z = -0.35;
    headPivot.add(innerEarL);

    // Right Ear
    const earR = new THREE.Mesh(earGeo, bodyMat);
    earR.position.set(-0.42, 0.65, 0);
    earR.rotation.z = 0.35;
    headPivot.add(earR);

    const innerEarR = new THREE.Mesh(earGeo, earInnerMat);
    innerEarR.scale.set(0.65, 0.65, 0.65);
    innerEarR.position.set(-0.42, 0.64, 0.05);
    innerEarR.rotation.z = 0.35;
    headPivot.add(innerEarR);

    // Cute Big Eyes
    const eyeGeo = new THREE.SphereGeometry(0.12, 14, 14);
    const eyeL = new THREE.Mesh(eyeGeo, blackMat);
    eyeL.position.set(0.26, 0.1, 0.6);
    headPivot.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, blackMat);
    eyeR.position.set(-0.26, 0.1, 0.6);
    headPivot.add(eyeR);

    // Eye Sparkles
    const sparkleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const sparkleL = new THREE.Mesh(sparkleGeo, whiteMat);
    sparkleL.position.set(0.28, 0.13, 0.69);
    headPivot.add(sparkleL);

    const sparkleR = new THREE.Mesh(sparkleGeo, whiteMat);
    sparkleR.position.set(-0.24, 0.13, 0.69);
    headPivot.add(sparkleR);

    // Blush Cheeks
    const blushGeo = new THREE.CircleGeometry(0.14, 12);
    const blushL = new THREE.Mesh(blushGeo, blushMat);
    blushL.position.set(0.45, -0.05, 0.55);
    blushL.rotation.y = 0.45;
    headPivot.add(blushL);

    const blushR = new THREE.Mesh(blushGeo, blushMat);
    blushR.position.set(-0.45, -0.05, 0.55);
    blushR.rotation.y = -0.45;
    headPivot.add(blushR);

    // Cute Snout & Nose
    const noseGeo = new THREE.ConeGeometry(0.06, 0.07, 8);
    const nose = new THREE.Mesh(noseGeo, pinkNoseMat);
    nose.position.set(0, -0.02, 0.68);
    nose.rotation.x = Math.PI / 2;
    headPivot.add(nose);

    // Party Hat!
    const hatGeo = new THREE.ConeGeometry(0.28, 0.7, 16);
    const hatMat = new THREE.MeshStandardMaterial({ color: hatColor, roughness: 0.2 });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.set(0, 0.95, 0);
    headPivot.add(hat);

    // Pom-pom on Hat
    const pomGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const pomMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const pom = new THREE.Mesh(pomGeo, pomMat);
    pom.position.set(0, 1.32, 0);
    headPivot.add(pom);

    catGroup.add(headPivot);

    // 3. Waving Left Paw (Arm)
    const armGeo = (typeof THREE.CapsuleGeometry === 'function') 
      ? new THREE.CapsuleGeometry(0.12, 0.45, 8, 12) 
      : new THREE.CylinderGeometry(0.12, 0.12, 0.5, 12);
    const armPivotL = new THREE.Group();
    armPivotL.position.set(0.65, 1.25, 0.25);
    const armL = new THREE.Mesh(armGeo, whiteMat);
    armL.position.y = -0.22;
    armPivotL.add(armL);
    catGroup.add(armPivotL);

    // Waving Right Paw (Arm)
    const armPivotR = new THREE.Group();
    armPivotR.position.set(-0.65, 1.25, 0.25);
    const armR = new THREE.Mesh(armGeo, whiteMat);
    armR.position.y = -0.22;
    armPivotR.add(armR);
    catGroup.add(armPivotR);

    // 4. Little Cute Feet
    const footGeo = new THREE.SphereGeometry(0.18, 14, 14);
    footGeo.scale(1, 0.65, 1.35);
    const footL = new THREE.Mesh(footGeo, whiteMat);
    footL.position.set(0.38, 0.12, 0.4);
    catGroup.add(footL);

    const footR = new THREE.Mesh(footGeo, whiteMat);
    footR.position.set(-0.38, 0.12, 0.4);
    catGroup.add(footR);

    // 5. Animated Tail
    const tailPivot = new THREE.Group();
    tailPivot.position.set(0, 0.4, -0.65);
    const tailGeo = new THREE.CylinderGeometry(0.07, 0.05, 0.8, 10);
    const tail = new THREE.Mesh(tailGeo, bodyMat);
    tail.position.set(0, 0.35, -0.2);
    tail.rotation.x = -0.6;
    tailPivot.add(tail);
    catGroup.add(tailPivot);

    this.scene.add(catGroup);

    return {
      group: catGroup,
      headPivot,
      armPivotL,
      armPivotR,
      tailPivot,
      name,
      baseY: initialPos.y,
      baseRotY: rotationY,
      jumpOffset: 0
    };
  }

  buildDancingCats() {
    // Cat 1: "Mochi" (Fluffy White) - Left front
    const cat1 = this.createCat('Mochi', 0xfafafa, 0xff99bb, 0xff4d8d, new THREE.Vector3(-3.2, 0.1, 1.8), 0.55);

    // Cat 2: "Ginger" (Orange Tabby) - Right front
    const cat2 = this.createCat('Ginger', 0xf39c12, 0xffeaa7, 0x00c9a7, new THREE.Vector3(3.2, 0.1, 1.8), -0.55);

    // Cat 3: "Oreo" (Tuxedo / Dark) - Center back left
    const cat3 = this.createCat('Oreo', 0x2c3e50, 0xff7675, 0xffc75f, new THREE.Vector3(-1.8, 0.1, -2.6), 0.25);

    // Cat 4: "Marshmallow" (Cute Pinkish / Cream) - Center back right
    const cat4 = this.createCat('Marshmallow', 0xffe6ee, 0xff99c8, 0x845ec2, new THREE.Vector3(1.8, 0.1, -2.6), -0.25);

    this.cats = [cat1, cat2, cat3, cat4];
  }

  buildBalloons() {
    const balloonColors = [0xff4d8d, 0xffc75f, 0x00c9a7, 0x845ec2, 0xff6f91, 0x2c73d2];
    const balloonPositions = [
      { x: -5.2, y: 4.5, z: -1.5 },
      { x: -4.8, y: 5.5, z: 1.2 },
      { x: 5.2, y: 4.8, z: -1.2 },
      { x: 4.7, y: 5.8, z: 1.5 },
      { x: 0, y: 6.8, z: -4.2 }
    ];

    balloonPositions.forEach((pos, idx) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(pos.x, pos.y, pos.z);

      // Balloon body (egg/sphere shape)
      const bGeo = new THREE.SphereGeometry(0.65, 20, 20);
      bGeo.scale(1, 1.25, 1);
      const bMat = new THREE.MeshStandardMaterial({
        color: balloonColors[idx % balloonColors.length],
        roughness: 0.15,
        metalness: 0.35
      });
      const balloon = new THREE.Mesh(bGeo, bMat);
      bGroup.add(balloon);

      // Balloon knot
      const knotGeo = new THREE.ConeGeometry(0.08, 0.12, 8);
      const knot = new THREE.Mesh(knotGeo, bMat);
      knot.position.y = -0.78;
      bGroup.add(knot);

      // String line
      const lineGeo = new THREE.CylinderGeometry(0.006, 0.006, 2.8, 6);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.y = -2.2;
      bGroup.add(line);

      this.balloons.push({ group: bGroup, baseY: pos.y, speed: 1.2 + idx * 0.2, phase: idx });
      this.scene.add(bGroup);
    });
  }

  buildGiftBoxes() {
    const boxPositions = [
      { x: -2.8, z: 0.4, col: 0xff3366, ribbon: 0xffd700, rot: 0.3, size: 0.8 },
      { x: 2.8, z: 0.2, col: 0x00c9a7, ribbon: 0xffffff, rot: -0.4, size: 0.7 },
      { x: -2.4, z: -1.2, col: 0x845ec2, ribbon: 0xffc75f, rot: 0.8, size: 0.65 },
      { x: 2.5, z: -1.4, col: 0xff9671, ribbon: 0xffffff, rot: -0.5, size: 0.75 }
    ];

    boxPositions.forEach(b => {
      const boxG = new THREE.Group();
      boxG.position.set(b.x, b.size / 2, b.z);
      boxG.rotation.y = b.rot;

      const cubeGeo = new THREE.BoxGeometry(b.size, b.size, b.size);
      const cubeMat = new THREE.MeshStandardMaterial({ color: b.col, roughness: 0.3 });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      cube.castShadow = true;
      cube.receiveShadow = true;
      boxG.add(cube);

      // Ribbon cross
      const ribGeo1 = new THREE.BoxGeometry(b.size + 0.02, b.size + 0.02, b.size * 0.2);
      const ribMat = new THREE.MeshStandardMaterial({ color: b.ribbon, roughness: 0.2 });
      const rib1 = new THREE.Mesh(ribGeo1, ribMat);
      boxG.add(rib1);

      const ribGeo2 = new THREE.BoxGeometry(b.size * 0.2, b.size + 0.02, b.size + 0.02);
      const rib2 = new THREE.Mesh(ribGeo2, ribMat);
      boxG.add(rib2);

      this.scene.add(boxG);
    });
  }

  // Floating 3D Polaroid Photo Frames
  updatePhotos(photos) {
    // Remove existing frames
    this.photoFrames.forEach(f => this.scene.remove(f.group));
    this.photoFrames = [];

    if (!photos || photos.length === 0) return;

    const frameCount = Math.min(photos.length, 6);
    const radius = 5.2;

    for (let i = 0; i < frameCount; i++) {
      const angle = (i / frameCount) * Math.PI * 2 + 0.4;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 2.6 + Math.sin(i * 1.5) * 0.5;

      const frameGroup = new THREE.Group();
      frameGroup.position.set(x, y, z);
      frameGroup.lookAt(0, y, 0); // Face the center stage

      // Polaroid White Border
      const borderGeo = new THREE.BoxGeometry(1.6, 2.0, 0.06);
      const borderMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.25,
        metalness: 0.05
      });
      const border = new THREE.Mesh(borderGeo, borderMat);
      border.castShadow = true;
      frameGroup.add(border);

      // Photo Texture on Front
      const loader = new THREE.TextureLoader();
      loader.load(photos[i], (texture) => {
        texture.minFilter = THREE.LinearFilter;
        const photoGeo = new THREE.PlaneGeometry(1.35, 1.35);
        const photoMat = new THREE.MeshBasicMaterial({ map: texture });
        const photoMesh = new THREE.Mesh(photoGeo, photoMat);
        photoMesh.position.set(0, 0.18, 0.035);
        frameGroup.add(photoMesh);
      });

      this.photoFrames.push({
        group: frameGroup,
        basePos: new THREE.Vector3(x, y, z),
        angle,
        speed: 0.6 + i * 0.15,
        phase: i
      });

      this.scene.add(frameGroup);
    }
  }

  buildConfettiSystem() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorPalette = [
      new THREE.Color(0xff4d8d),
      new THREE.Color(0xffc75f),
      new THREE.Color(0x00c9a7),
      new THREE.Color(0x845ec2),
      new THREE.Color(0xff9671)
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.confettiParticles = new THREE.Points(geometry, material);
    this.scene.add(this.confettiParticles);
  }

  // Interactive Action: Blow Candles!
  blowCandles() {
    if (!this.areCandlesLit) {
      // Re-light candles
      this.areCandlesLit = true;
      this.candleFlames.forEach(f => f.visible = true);
      this.candleLights.forEach(l => l.intensity = 0.7);
      if (window.sounds) window.sounds.playPop();
      return false; // returned false means relit
    }

    this.areCandlesLit = false;
    this.candleFlames.forEach(f => f.visible = false);
    this.candleLights.forEach(l => l.intensity = 0.0);

    if (window.sounds) {
      window.sounds.playBlowCandles();
    }

    // Trigger full screen confetti burst
    if (window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    }

    return true; // blown out!
  }

  // Interactive Action: Click on a Cat to make it flip & jump!
  triggerCatSpecial(index = 0) {
    const cat = this.cats[index % this.cats.length];
    if (!cat) return;

    if (window.sounds) {
      window.sounds.playCatMeow();
    }

    // Spin & Jump Animation
    const startTime = performance.now();
    const duration = 650;

    const doJump = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Arc jump
      cat.jumpOffset = Math.sin(progress * Math.PI) * 1.5;
      cat.group.rotation.y = cat.baseRotY + progress * Math.PI * 2;

      if (progress < 1) {
        requestAnimationFrame(doJump);
      } else {
        cat.jumpOffset = 0;
        cat.group.rotation.y = cat.baseRotY;
      }
    };

    requestAnimationFrame(doJump);
  }

  setDanceStyle(style) {
    this.danceMove = style;
  }

  // Events & Camera Controls
  setupEvents() {
    window.addEventListener('resize', () => this.onResize());

    const dom = this.renderer.domElement;

    // Mouse Dragging to Orbit Camera
    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.cameraAngle.theta -= deltaX * 0.008;
      this.cameraAngle.phi = Math.max(0.12, Math.min(Math.PI / 2.3, this.cameraAngle.phi + deltaY * 0.008));

      this.updateCameraPosition();
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch Support
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    dom.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

      this.cameraAngle.theta -= deltaX * 0.009;
      this.cameraAngle.phi = Math.max(0.12, Math.min(Math.PI / 2.3, this.cameraAngle.phi + deltaY * 0.009));

      this.updateCameraPosition();
      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    dom.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Click on canvas to raycast cats / cake
    dom.addEventListener('click', (e) => {
      const rect = dom.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);

      // Check cat clicks
      let clickedCat = false;
      this.cats.forEach((cat, idx) => {
        const intersects = raycaster.intersectObjects(cat.group.children, true);
        if (intersects.length > 0) {
          this.triggerCatSpecial(idx);
          clickedCat = true;
        }
      });

      // Check cake clicks
      if (!clickedCat && this.cake) {
        const intersectsCake = raycaster.intersectObjects(this.cake.children, true);
        if (intersectsCake.length > 0) {
          this.blowCandles();
        }
      }
    });
  }

  updateCameraPosition() {
    this.camera.position.x = this.cameraAngle.radius * Math.sin(this.cameraAngle.phi) * Math.sin(this.cameraAngle.theta);
    this.camera.position.y = this.cameraAngle.radius * Math.cos(this.cameraAngle.phi);
    this.camera.position.z = this.cameraAngle.radius * Math.sin(this.cameraAngle.phi) * Math.cos(this.cameraAngle.theta);
    this.camera.lookAt(0, 2.0, 0);
  }

  onResize() {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // Main Render & Animation Loop
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Auto rotate camera gently when not manually dragging
    if (this.autoRotate && !this.isDragging) {
      this.cameraAngle.theta += delta * 0.12;
      this.updateCameraPosition();
    }

    // 1. Animate Dancing Cats!
    const danceBPM = 120;
    const beat = time * (danceBPM / 60) * Math.PI;

    this.cats.forEach((cat, i) => {
      const offset = i * 0.75;
      const catBeat = beat + offset;

      // Cat Jump & Y Position
      cat.group.position.y = cat.baseY + Math.abs(Math.sin(catBeat)) * 0.25 + cat.jumpOffset;

      // Cat Head Bobbing
      cat.headPivot.position.y = 1.7 + Math.sin(catBeat * 2) * 0.08;
      cat.headPivot.rotation.z = Math.sin(catBeat) * 0.18;

      // Paws waving
      if (this.danceMove === 'disco') {
        cat.armPivotL.rotation.x = Math.sin(catBeat * 2) * 0.8 + 0.3;
        cat.armPivotL.rotation.z = Math.cos(catBeat) * 0.4;
        cat.armPivotR.rotation.x = -Math.sin(catBeat * 2) * 0.8 + 0.3;
        cat.armPivotR.rotation.z = -Math.cos(catBeat) * 0.4;
      } else if (this.danceMove === 'wobble') {
        cat.armPivotL.rotation.z = Math.sin(catBeat * 3) * 0.7;
        cat.armPivotR.rotation.z = -Math.sin(catBeat * 3) * 0.7;
      } else {
        // Hop style
        cat.armPivotL.rotation.x = -1.2 + Math.sin(catBeat) * 0.5;
        cat.armPivotR.rotation.x = -1.2 + Math.sin(catBeat) * 0.5;
      }

      // Tail Swish
      cat.tailPivot.rotation.y = Math.sin(catBeat * 2.2) * 0.6;
      cat.tailPivot.rotation.x = -0.2 + Math.cos(catBeat) * 0.3;
    });

    // 2. Animate Candle Flames Flickering
    if (this.areCandlesLit) {
      this.candleFlames.forEach((flame, idx) => {
        flame.scale.y = 0.9 + Math.sin(time * 15 + idx) * 0.25;
        flame.scale.x = 0.9 + Math.cos(time * 12 + idx) * 0.2;
      });
      this.candleLights.forEach((light, idx) => {
        light.intensity = 0.65 + Math.sin(time * 20 + idx) * 0.2;
      });
    }

    // 3. Animate Disco Lights Orbiting
    this.discoLights.forEach((spot, idx) => {
      const speed = 0.9 + idx * 0.2;
      const rad = 6.5;
      spot.position.x = Math.cos(time * speed + idx * 2) * rad;
      spot.position.z = Math.sin(time * speed + idx * 2) * rad;
    });

    // 4. Animate Floating Balloons
    this.balloons.forEach(b => {
      b.group.position.y = b.baseY + Math.sin(time * b.speed + b.phase) * 0.45;
      b.group.rotation.z = Math.sin(time * 0.8 + b.phase) * 0.08;
    });

    // 5. Animate Floating Photo Frames
    this.photoFrames.forEach(f => {
      f.group.position.y = f.basePos.y + Math.sin(time * f.speed + f.phase) * 0.35;
      f.group.rotation.z = Math.sin(time * 0.6 + f.phase) * 0.05;
    });

    // 6. Confetti Falling Particles
    if (this.confettiParticles) {
      const positions = this.confettiParticles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= delta * 1.5;
        if (positions[i] < -0.5) {
          positions[i] = 9.5;
        }
      }
      this.confettiParticles.geometry.attributes.position.needsUpdate = true;
      this.confettiParticles.rotation.y += delta * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

window.BirthdayScene3D = BirthdayScene3D;
