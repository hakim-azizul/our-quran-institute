import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBookCanvas({
  spreadIndex = 0,
  scrollProgress = 0, // continuous float 0.0 to 8.0
  scrollVelocity = 0,
  isOpeningIntro = false,
  openIntroProgress = 1
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const bookGroupRef = useRef(null);
  const turningPageRef = useRef(null);
  const particlesRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const scrollProgRef = useRef(0);
  const scrollVelRef = useRef(0);
  const isOpeningIntroRef = useRef(false);
  const openIntroProgRef = useRef(1);

  useEffect(() => {
    scrollProgRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    scrollVelRef.current = scrollVelocity;
  }, [scrollVelocity]);

  useEffect(() => {
    isOpeningIntroRef.current = isOpeningIntro;
  }, [isOpeningIntro]);

  useEffect(() => {
    openIntroProgRef.current = openIntroProgress;
  }, [openIntroProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x041c17, 0.022);

    // Camera with dynamic aspect ratio and distance for mobile/tablet
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(
      42,
      aspect,
      0.1,
      100
    );
    const initialZ = aspect < 1.0 ? 14.0 / Math.max(0.45, aspect * 1.15) : 14.0;
    camera.position.set(0, 0.52, initialZ);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xfff6e6, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.45);
    dirLight.position.set(6, 12, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xc5a45a, 0.95);
    rimLight.position.set(-8, 5, -6);
    scene.add(rimLight);

    // Sacred floating golden dust particles
    const particleCount = 260;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 30;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(251, 246, 233, 1)');
    grad.addColorStop(0.35, 'rgba(197, 164, 90, 0.85)');
    grad.addColorStop(1, 'rgba(197, 164, 90, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 32, 32);
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.65
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // --- 3D BOOK MODEL ---
    const bookGroup = new THREE.Group();
    bookGroupRef.current = bookGroup;
    scene.add(bookGroup);

    const bookWidth = 12.3;
    const pageHalfWidth = bookWidth / 2;
    const bookHeight = 7.0;
    const pageDepth = 0.3;

    const coverMaterial = new THREE.MeshStandardMaterial({
      color: 0x072d24,
      roughness: 0.45,
      metalness: 0.12
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xc5a45a,
      roughness: 0.3,
      metalness: 0.85
    });

    const paperParchmentMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbf6e9,
      roughness: 0.85,
      metalness: 0.02
    });

    const edgeCanvas = document.createElement('canvas');
    edgeCanvas.width = 64;
    edgeCanvas.height = 256;
    const eCtx = edgeCanvas.getContext('2d');
    for (let y = 0; y < 256; y += 4) {
      eCtx.fillStyle = y % 8 === 0 ? '#DDD0B5' : '#C7B797';
      eCtx.fillRect(0, y, 64, 4);
    }
    const edgeTexture = new THREE.CanvasTexture(edgeCanvas);
    edgeTexture.wrapS = THREE.RepeatWrapping;
    edgeTexture.wrapT = THREE.RepeatWrapping;
    edgeTexture.repeat.set(4, 16);

    const edgeMaterial = new THREE.MeshStandardMaterial({
      map: edgeTexture,
      roughness: 0.9,
      metalness: 0.05
    });

    // Left Page Stack
    const leftPageStackGeo = new THREE.BoxGeometry(pageHalfWidth, bookHeight, pageDepth);
    const leftPageStackMat = [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      paperParchmentMaterial,
      coverMaterial
    ];
    const leftPageStack = new THREE.Mesh(leftPageStackGeo, leftPageStackMat);
    leftPageStack.position.set(-pageHalfWidth / 2, 0, -pageDepth / 2);
    leftPageStack.receiveShadow = true;
    bookGroup.add(leftPageStack);

    // Right Page Stack
    const rightPageStackGeo = new THREE.BoxGeometry(pageHalfWidth, bookHeight, pageDepth);
    const rightPageStackMat = [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      paperParchmentMaterial,
      coverMaterial
    ];
    const rightPageStack = new THREE.Mesh(rightPageStackGeo, rightPageStackMat);
    rightPageStack.position.set(pageHalfWidth / 2, 0, -pageDepth / 2);
    rightPageStack.receiveShadow = true;
    bookGroup.add(rightPageStack);

    // Spine
    const spineGeo = new THREE.CylinderGeometry(0.38, 0.38, bookHeight + 0.12, 24, 1, false, 0, Math.PI);
    const spine = new THREE.Mesh(spineGeo, coverMaterial);
    spine.rotation.z = Math.PI / 2;
    spine.rotation.y = Math.PI / 2;
    spine.position.set(0, 0, -pageDepth - 0.2);
    spine.receiveShadow = true;
    bookGroup.add(spine);

    // Gold Corner Protectors
    const cornerSize = 0.55;
    const cornerGeo = new THREE.BoxGeometry(cornerSize, cornerSize, pageDepth + 0.08);
    const c1 = new THREE.Mesh(cornerGeo, goldMaterial);
    c1.position.set(-bookWidth / 2 + cornerSize / 2, bookHeight / 2 - cornerSize / 2, -pageDepth / 2);
    bookGroup.add(c1);
    const c2 = new THREE.Mesh(cornerGeo, goldMaterial);
    c2.position.set(-bookWidth / 2 + cornerSize / 2, -bookHeight / 2 + cornerSize / 2, -pageDepth / 2);
    bookGroup.add(c2);
    const c3 = new THREE.Mesh(cornerGeo, goldMaterial);
    c3.position.set(bookWidth / 2 - cornerSize / 2, bookHeight / 2 - cornerSize / 2, -pageDepth / 2);
    bookGroup.add(c3);
    const c4 = new THREE.Mesh(cornerGeo, goldMaterial);
    c4.position.set(bookWidth / 2 - cornerSize / 2, -bookHeight / 2 + cornerSize / 2, -pageDepth / 2);
    bookGroup.add(c4);

    // Silk Ribbon Bookmark with Gold Diamond Charm (kept in CSS book layer)
    const ribbonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, bookHeight / 2 + 0.2, 0.05),
      new THREE.Vector3(0.08, 1.2, 0.08),
      new THREE.Vector3(-0.06, -0.8, 0.12),
      new THREE.Vector3(0.15, -bookHeight / 2 - 0.6, 0.25)
    ]);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 32, 0.045, 8, false);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xc5a45a,
      roughness: 0.4,
      metalness: 0.6
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    // Ribbon is handled by CSS closed-book layer; do not add protruding background mesh

    const charmGeo = new THREE.OctahedronGeometry(0.18, 0);
    charmGeo.scale(1, 1.4, 0.35);
    const charm = new THREE.Mesh(charmGeo, goldMaterial);
    charm.position.set(0.15, -bookHeight / 2 - 0.75, 0.28);
    charm.rotation.z = Math.PI / 4;
    // Charm is handled by CSS closed-book layer

    // 3D Turning Page with dynamic vertex curvature
    const turningPageGeo = new THREE.PlaneGeometry(pageHalfWidth, bookHeight, 36, 36);
    turningPageGeo.translate(pageHalfWidth / 2, 0, 0);

    const turningPageMatFront = new THREE.MeshStandardMaterial({
      color: 0xfbf6e9,
      roughness: 0.85,
      side: THREE.FrontSide
    });
    const turningPageMatBack = new THREE.MeshStandardMaterial({
      color: 0xfbf6e9,
      roughness: 0.85,
      side: THREE.BackSide
    });

    const turningPageMesh = new THREE.Mesh(turningPageGeo, [turningPageMatFront, turningPageMatBack]);
    turningPageMesh.position.set(0, 0, 0.04);
    turningPageMesh.castShadow = true;
    turningPageMesh.receiveShadow = true;
    turningPageMesh.visible = false;
    bookGroup.add(turningPageMesh);
    turningPageRef.current = turningPageMesh;

    // Mouse movement parallax
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const aspect = container.clientWidth / container.clientHeight;
      camera.aspect = aspect;
      if (aspect < 1.0) {
        camera.position.z = 14.0 / Math.max(0.45, aspect * 1.15);
      } else {
        camera.position.z = 14.0;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Floating dust motes (sync with scroll velocity)
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array;
        const velOffset = scrollVelRef.current * 0.008;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += Math.sin(elapsed * 0.4 + i) * 0.003 - velOffset;
          if (positions[i * 3 + 1] > 11) positions[i * 3 + 1] = -11;
          if (positions[i * 3 + 1] < -11) positions[i * 3 + 1] = 11;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.rotation.y = elapsed * 0.01;
      }

      // Smooth camera & book parallax (Gentle and slow)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.035;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.035;

      // Lower book placement with gentle downward parallax as you scroll deeper
      const sProg = scrollProgRef.current;
      const scrollDownShift = (sProg / 8) * -0.22;
      bookGroup.position.y = -0.46 + scrollDownShift + Math.sin(elapsed * 0.4) * 0.015;

      // Hide 3D book group while the initial closed book is opening so it doesn't bleed through
      const isIntro = isOpeningIntroRef.current;
      const introProg = openIntroProgRef.current;
      bookGroup.visible = !isIntro || introProg >= 0.95;

      if (turningPageMesh) {
        turningPageMesh.visible = false;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Page Color on spread changes
  useEffect(() => {
    if (!bookGroupRef.current) return;
    const isDarkSpread = spreadIndex === 3 || spreadIndex === 8;
    const pageColor = isDarkSpread ? 0x083b32 : 0xfbf6e9;

    bookGroupRef.current.traverse((child) => {
      if (child.isMesh && child.material && Array.isArray(child.material)) {
        if (child.material[4]?.color) {
          child.material[4].color.setHex(pageColor);
        }
      }
    });
  }, [spreadIndex]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
}
