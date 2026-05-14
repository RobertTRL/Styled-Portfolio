import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import '../styles/loader.css';

const LETTERS = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'];

const Loader = ({ isDark, isLoading }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const canvasRef = useRef(null);
  const isDarkRef = useRef(isDark);

  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    let W = canvas.clientWidth, H = canvas.clientHeight;
    let animId;

    // Alpha: true lets your beautiful CSS backgrounds bleed through
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    // Adjusted camera to perfectly frame the diorama
    camera.position.set(0, 3, 11);
    camera.lookAt(0, 1.5, 0);

    /* ── Lighting (Ensures elements are beautifully lit) ── */
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xfff0cc, 0);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    /* ── Materials based on your exact CSS Hex Codes ── */
    // Using flatShading to make the low-poly 3D shapes catch light sharply
    const matWood = new THREE.MeshStandardMaterial({ color: 0x4D4454, flatShading: true, roughness: 0.9 });
    const matPot = new THREE.MeshStandardMaterial({ color: 0x74667e, flatShading: true, roughness: 0.5 });
    const matTent = new THREE.MeshStandardMaterial({ color: 0xf6d484, flatShading: true, side: THREE.DoubleSide });
    const matFlapL = new THREE.MeshStandardMaterial({ color: 0xEDDDC2, flatShading: true, side: THREE.DoubleSide });
    const matFlapR = new THREE.MeshStandardMaterial({ color: 0xEFE7CF, flatShading: true, side: THREE.DoubleSide });
    const matTree = new THREE.MeshStandardMaterial({ color: 0x050a0f, flatShading: true, roughness: 1 });

    /* ── 1. The Trees (Adding depth via Pyramids, strictly NO extrusion) ── */
    // A 4-sided cylinder is a pyramid. This perfectly mimics your 2D overlapping triangles but gives it true 3D volume.
    const makeTree = (x, z, scale) => {
      const g = new THREE.Group();
      
      const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.8 * scale, 1.4 * scale, 4), matTree);
      b1.position.y = 1.8 * scale; b1.castShadow = true; b1.receiveShadow = true;
      
      const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0, 1.1 * scale, 1.8 * scale, 4), matTree);
      b2.position.y = 1.1 * scale; b2.castShadow = true; b2.receiveShadow = true;
      
      const b3 = new THREE.Mesh(new THREE.CylinderGeometry(0, 1.4 * scale, 2.2 * scale, 4), matTree);
      b3.position.y = 0.4 * scale; b3.castShadow = true; b3.receiveShadow = true;

      g.add(b1, b2, b3);
      g.position.set(x, 0, z);
      
      // Rotate 45deg so the flat face of the pyramid faces the camera (matches 2D silhouette)
      g.rotation.y = Math.PI / 4; 
      return g;
    };

    const trees = [
      makeTree(-4.5, -2, 1.1), makeTree(-2.5, -3, 0.9), makeTree(-1.0, -4, 1.2),
      makeTree(0.5, -4.5, 0.8), makeTree(2.5, -3.5, 1.3), makeTree(4.0, -2.5, 0.95),
    ];
    trees.forEach(t => scene.add(t));

    /* ── 2. The Tent (Using basic geometric construction) ── */
    const tentGroup = new THREE.Group();
    tentGroup.position.set(2, 0, -1);

    // Main roof shape (A-frame built from planes to avoid extrusion entirely)
    const roofL = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 3), matTent);
    roofL.position.set(-0.9, 1.05, 0); roofL.rotation.z = Math.PI / 6; roofL.rotation.y = -Math.PI / 2;
    roofL.castShadow = true; roofL.receiveShadow = true;
    
    const roofR = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 3), matTent);
    roofR.position.set(0.9, 1.05, 0); roofR.rotation.z = -Math.PI / 6; roofR.rotation.y = -Math.PI / 2;
    roofR.castShadow = true; roofR.receiveShadow = true;
    
    const backWall = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 3, 3), matTent);
    backWall.rotation.x = Math.PI / 2; backWall.position.set(0, 0.6, -1.45); backWall.scale.set(1, 1, 0.05);

    // Door flaps
    const leftFlap = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.8), matFlapL);
    leftFlap.position.set(-0.5, 0.9, 1.5); leftFlap.rotation.y = 0.5; leftFlap.castShadow = true;
    
    const rightFlap = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.8), matFlapR);
    rightFlap.position.set(0.5, 0.9, 1.5); rightFlap.rotation.y = -0.5; rightFlap.castShadow = true;

    tentGroup.add(roofL, roofR, backWall, leftFlap, rightFlap);
    scene.add(tentGroup);

    /* ── 3. The Fireplace & Cookpot Stand ── */
    const fireGroup = new THREE.Group();
    fireGroup.position.set(-2, 0, 1.5);
    scene.add(fireGroup);

    // Stand Left Post
    const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6), matWood);
    leftPost.position.set(-0.7, 0.8, 0); leftPost.castShadow = true;
    // Stand Right Post
    const rightPost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6), matWood);
    rightPost.position.set(0.7, 0.8, 0); rightPost.castShadow = true;
    // Stand Crossbar
    const crossBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6), matWood);
    crossBar.position.set(0, 1.5, 0); crossBar.rotation.z = Math.PI / 2; crossBar.castShadow = true;
    // Stand Hanger (down to pot)
    const hanger = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), matWood);
    hanger.position.set(0, 1.25, 0); hanger.castShadow = true;

    fireGroup.add(leftPost, rightPost, crossBar, hanger);

    // The Cookpot
    const pot = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 6, 0, Math.PI*2, 0, Math.PI/1.5), matPot);
    pot.position.set(0, 1.0, 0); pot.castShadow = true; pot.receiveShadow = true;
    fireGroup.add(pot);

    // Campfire Logs
    [Math.PI/4, -Math.PI/4].forEach((angle) => {
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 6), matWood);
      log.rotation.x = Math.PI / 2; log.rotation.y = angle; log.position.y = 0.08;
      log.castShadow = true;
      fireGroup.add(log);
    });

    // Emissive Fire Particles & Light
    const fireLight = new THREE.PointLight(0xffaa00, 3, 7);
    fireLight.position.set(0, 0.5, 0);
    fireLight.castShadow = true;
    fireGroup.add(fireLight);

    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 40;
    const posArray = new Float32Array(particleCount * 3);
    const velArray = [];
    for(let i=0; i<particleCount; i++) {
      posArray[i*3] = (Math.random() - 0.5) * 0.4;
      posArray[i*3+1] = Math.random() * 0.6;
      posArray[i*3+2] = (Math.random() - 0.5) * 0.4;
      velArray.push({ vy: 0.02 + Math.random() * 0.03, life: Math.random() });
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xefb54a, size: 0.08, transparent: true, opacity: 0.8 });
    const fireParticles = new THREE.Points(particleGeo, particleMat);
    fireGroup.add(fireParticles);

    /* ── Sun & Moon ── */
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffe033 }));
    const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshBasicMaterial({ color: 0xfdfbd3 }));
    scene.add(sunMesh, moonMesh);

    const clock = new THREE.Clock();

    /* ── Animation Loop ── */
    const tick = () => {
      animId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      const dark = isDarkRef.current;

      // Orbiting light sources
      const sy = Math.sin(t * 0.5), sx = Math.cos(t * 0.5);
      sunMesh.position.set(sx * 12, sy * 8, -8);
      moonMesh.position.set(-sx * 12, -sy * 8, -8);
      
      const dayFactor = Math.max(0, sy);
      ambient.intensity = dark ? 0.2 + dayFactor * 0.2 : 0.4 + dayFactor * 0.4;
      dirLight.position.copy(sunMesh.position);
      dirLight.intensity = dayFactor * 2.5;

      // Dynamic Fire Simulation
      fireLight.intensity = 2 + Math.sin(t * 15) * 0.5 + Math.sin(t * 22) * 0.2;
      pot.position.y = 1.0 + Math.sin(t * 20) * 0.005; // pot jitter

      const positions = fireParticles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i*3+1] += velArray[i].vy;
        velArray[i].life -= 0.02;
        if (velArray[i].life < 0) {
          positions[i*3] = (Math.random() - 0.5) * 0.4;
          positions[i*3+1] = 0;
          positions[i*3+2] = (Math.random() - 0.5) * 0.4;
          velArray[i].life = 1;
        }
      }
      fireParticles.geometry.attributes.position.needsUpdate = true;

      // Gentle wind elements
      leftFlap.rotation.y = 0.5 + Math.sin(t) * 0.05;
      rightFlap.rotation.y = -0.5 - Math.sin(t) * 0.05;
      trees.forEach((tr, i) => { tr.rotation.z = Math.sin(t * 0.5 + i) * 0.02; });

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      W = canvasRef.current.clientWidth;
      H = canvasRef.current.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShouldRender(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div className={`loader-container ${isDark ? 'dark-mode' : 'light-mode'} ${!isLoading ? 'water-dissolve' : ''}`}>
      {/* Retained your original CSS animated backgrounds below the canvas */}
      <div className="loader-pattern" />

      <div className="content-container">
        {/* The 3D Canvas explicitly uses alpha: true so your stars/grid show through */}
        <canvas ref={canvasRef} className="loader-canvas" />

        <div className="loader-wrapper">
          <div className="loader-letters" aria-label="Loading">
            {LETTERS.map((char, i) => (
              <span key={i} className="loader-letter" style={{ animationDelay: `${i * 0.1}s` }}>
                {char}
              </span>
            ))}
          </div>
          <div className="loader-progress">
            <div className="loader-progress-beam" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;