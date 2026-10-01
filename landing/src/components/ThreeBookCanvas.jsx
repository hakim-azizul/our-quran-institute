'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeBookCanvas
 * Fixed ambient 3D particle and atmospheric lighting background canvas.
 * Renders floating sacred golden dust motes that react to mouse parallax and scroll velocity,
 * providing rich depth behind the vertical glassmorphic landing page without obstructing
 * any hero or section content.
 */
export default function ThreeBookCanvas({
  scrollProgress = 0,
  scrollVelocity = 0,
  isOpeningIntro = false,
  openIntroProgress = 1
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const scrollProgRef = useRef(0);
  const scrollVelRef = useRef(0);

  useEffect(() => {
    scrollProgRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    scrollVelRef.current = scrollVelocity;
  }, [scrollVelocity]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x041c17, 0.022);

    // Camera with dynamic aspect ratio
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Ambient & Accent Lights
    const ambientLight = new THREE.AmbientLight(0xfff6e6, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.45);
    dirLight.position.set(6, 12, 10);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xc5a45a, 0.95);
    rimLight.position.set(-8, 5, -6);
    scene.add(rimLight);

    // Sacred floating golden dust particles
    const particleCount = 260;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 32;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 24;
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

    // Mouse movement parallax
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const newAspect = w / h;
      camera.aspect = newAspect;
      if (newAspect < 1.0) {
        camera.position.z = 14.0 / Math.max(0.45, newAspect * 1.15);
      } else {
        camera.position.z = 14.0;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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
          if (positions[i * 3 + 1] > 12) positions[i * 3 + 1] = -12;
          if (positions[i * 3 + 1] < -12) positions[i * 3 + 1] = 12;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.rotation.y = elapsed * 0.01;
      }

      // Smooth camera parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.035;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.035;
      camera.position.x = mouseRef.current.x * 0.35;
      camera.position.y = 0.52 + mouseRef.current.y * 0.25;

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

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
}
