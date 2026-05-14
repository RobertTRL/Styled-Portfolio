import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import '../styles/loader.css';

const LETTERS = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'];

const Loader = ({ isDark, isLoading }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const canvasRef  = useRef(null);
  const isDarkRef  = useRef(isDark);
  const sceneRefs  = useRef({});

  /* Keep isDark readable inside the animation loop without re-mounting */
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  /* ── Three.js scene — mount once ── */
  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = canvas.parentElement;
    let W = container.clientWidth, H = container.clientHeight;
    let animId;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    
    // Enable shadows for realistic depth
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 80);
    camera.position.set(0, 3.5, 9.5);
    camera.lookAt(0, 0.8, 0);

    /* Lights */
    const ambient = new THREE.AmbientLight(0x223355, 0.5); 
    scene.add(ambient);
    
    const sunLight = new THREE.DirectionalLight(0xfff0cc, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 30;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    scene.add(sunLight);

    /* Ground */
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x080d18, roughness: 1 });
    const gnd = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), groundMat);
    gnd.rotation.x = -Math.PI / 2;
    gnd.receiveShadow = true;
    scene.add(gnd);

    /* ── The Version 2 Trees ── */
    const coneMats = [];
    const makeTree = (x, z, s) => {
      const g  = new THREE.Group();
      // Using standard material with flatShading to catch the light beautifully
      const cm = new THREE.MeshStandardMaterial({ color: 0x0d1117, roughness: 0.9, flatShading: true });
      coneMats.push(cm);
      
      // Restored the smoother 8-sided ConeGeometry from Version 2
      [[0.65*s,1.5*s,0.85*s],[0.85*s,1.8*s,0.38*s],[1.05*s,2.0*s,0]].forEach(([r,h,yo]) => {
        const c = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), cm);
        c.position.y = yo + h / 2;
        c.castShadow = true;
        c.receiveShadow = true;
        g.add(c);
      });
      
      const tk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07*s, 0.1*s, 0.45*s, 6),
        new THREE.MeshStandardMaterial({ color: 0x2a1505, roughness: 0.9 })
      );
      tk.position.y = 0.22 * s;
      tk.castShadow = true;
      g.add(tk);
      
      g.position.set(x, 0, z);
      return g;
    };

    const trees = [
      [-5,-3,1.1],[-3.5,-4.2,0.9],[-2,-4.8,1.0],
      [0.2,-5.2,1.2],[2,-4.8,0.85],[3.5,-4,1.0],[5.2,-3,0.9],
    ].map(([x,z,s]) => { const t = makeTree(x,z,s); scene.add(t); return t; });

    /* Tent body */
    const tentShape = new THREE.Shape();
    tentShape.moveTo(-1.8,0); tentShape.lineTo(1.8,0); tentShape.lineTo(0,2.3); tentShape.closePath();
    const tent = new THREE.Mesh(
      new THREE.ExtrudeGeometry(tentShape, { depth: 2.8, bevelEnabled: false }),
      new THREE.MeshStandardMaterial({ color: 0xf6d484, roughness: 0.8, side: THREE.DoubleSide })
    );
    tent.position.set(1.5, 0, -0.2);
    tent.castShadow = true;
    tent.receiveShadow = true;
    scene.add(tent);

    const ridgePole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 3, 6),
      new THREE.MeshStandardMaterial({ color: 0x4d4454, roughness: 0.8 })
    );
    ridgePole.rotation.z = Math.PI / 2;
    ridgePole.position.set(1.5, 2.3, 1.2);
    ridgePole.castShadow = true;
    scene.add(ridgePole);

    /* Door flaps */
    const flapMat  = new THREE.MeshStandardMaterial({ color: 0xedddc2, roughness: 0.9, side: THREE.DoubleSide });
    const leftFlap = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 1.3), flapMat);
    leftFlap.position.set(0.9, 0.65, 2.61); leftFlap.rotation.y = 0.5; leftFlap.castShadow = true; scene.add(leftFlap);
    
    const rightFlap = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 1.3), flapMat.clone());
    rightFlap.position.set(2.1, 0.65, 2.61); rightFlap.rotation.y = -0.5; rightFlap.castShadow = true; scene.add(rightFlap);

    /* Campfire group */
    const fg = new THREE.Group();
    fg.position.set(-2.2, 0, 2.2);
    scene.add(fg);

    const logMat = new THREE.MeshStandardMaterial({ color: 0x3d2010, roughness: 0.9 });
    [Math.PI/4, -Math.PI/4].forEach(ry => {
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,1.1,6), logMat);
      log.rotation.z = Math.PI / 2; log.rotation.y = ry; log.position.y = 0.07;
      log.castShadow = true;
      log.receiveShadow = true;
      fg.add(log);
    });

    const stickMat = new THREE.MeshStandardMaterial({ color: 0x2a1505, roughness: 0.9 });
    
    /* ── The 3D Cookpot Stand ── */
    const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.9, 6), stickMat);
    leftPost.position.set(-0.5, 0.95, 0); 
    leftPost.castShadow = true;
    fg.add(leftPost);

    const rightPost = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.9, 6), stickMat);
    rightPost.position.set(0.5, 0.95, 0); 
    rightPost.castShadow = true;
    fg.add(rightPost);

    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 6), stickMat);
    bar.rotation.z = Math.PI / 2; 
    bar.position.set(0, 1.85, 0); 
    bar.castShadow = true;
    fg.add(bar);

    const hanger = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.55, 4), stickMat);
    hanger.position.set(0, 1.55, 0); 
    hanger.castShadow = true;
    fg.add(hanger);

    const pot = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 12, 0, Math.PI*2, 0, Math.PI/1.6), 
      new THREE.MeshStandardMaterial({ color: 0x74667e, roughness: 0.6 })
    );
    pot.position.set(0, 1.3, 0); 
    pot.castShadow = true;
    pot.receiveShadow = true;
    fg.add(pot);

    const fLight = new THREE.PointLight(0xff6600, 2, 6);
    fLight.position.set(0, 0.6, 0); 
    fLight.castShadow = true; 
    fg.add(fLight);

    /* Fire particles */
    const FC = 150;
    const fp = new Float32Array(FC * 3);
    const fv = [];
    for (let i = 0; i < FC; i++) {
      fp[i*3]   = (Math.random()-0.5)*0.28;
      fp[i*3+1] = Math.random()*0.5;
      fp[i*3+2] = (Math.random()-0.5)*0.28;
      fv.push({ vx:(Math.random()-0.5)*0.003, vy:0.014+Math.random()*0.024, life:Math.random() });
    }
    const fGeo = new THREE.BufferGeometry();
    fGeo.setAttribute('position', new THREE.BufferAttribute(fp, 3));
    fg.add(new THREE.Points(fGeo, new THREE.PointsMaterial({ color:0xef7b1a, size:0.12, transparent:true, opacity:0.9 })));
    fg.add(new THREE.Points(fGeo, new THREE.PointsMaterial({ color:0xfffb80, size:0.07, transparent:true, opacity:0.75 })));

    /* Expose mutable materials for the isDark effect below */
    sceneRefs.current = { groundMat, coneMats };

    /* Animation loop */
    let T = 0;
    const tick = () => {
      animId = requestAnimationFrame(tick);
      T += 0.005;

      const dark = isDarkRef.current;
      const sy   = Math.sin(T), sx = Math.cos(T);

      const df = Math.max(0, sy);

      // Adjusted light levels to account for shadows
      ambient.intensity       = dark ? 0.3 + df*0.4 : 0.6 + df*0.5;
      sunLight.position.set(sx*10, sy*6, -10);
      sunLight.intensity      = df * 1.8; 
      
      fLight.intensity        = 1.6 + Math.sin(T*17)*0.45 + Math.sin(T*29)*0.2;
      pot.rotation.y          = Math.sin(T*2)*0.08;

      for (let i = 0; i < FC; i++) {
        fp[i*3]   += fv[i].vx;
        fp[i*3+1] += fv[i].vy;
        fv[i].life += 0.018;
        if (fv[i].life > 1 || fp[i*3+1] > 1.6) {
          fp[i*3]   = (Math.random()-0.5)*0.25;
          fp[i*3+1] = 0;
          fp[i*3+2] = (Math.random()-0.5)*0.25;
          fv[i].life = 0;
          fv[i].vy   = 0.014 + Math.random()*0.024;
          fv[i].vx   = (Math.random()-0.5)*0.003;
        }
      }
      fGeo.attributes.position.needsUpdate = true;

      trees.forEach((tr, i) => { tr.rotation.z = Math.sin(T*0.7 + i*1.1)*0.025; });
      leftFlap.rotation.y  =  0.5 + Math.sin(T*0.9)*0.06;
      rightFlap.rotation.y = -0.5 - Math.sin(T*0.9)*0.06;
      camera.position.y    =  3.5 + Math.sin(T*0.3)*0.08;

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      W = container.clientWidth; H = container.clientHeight;
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

  /* ── Sync ground/tree materials when isDark prop changes ── */
  useEffect(() => {
    const { groundMat, coneMats } = sceneRefs.current;
    if (!groundMat) return;
    groundMat.color.set(isDark ? 0x080d18 : 0x4a6a30);
    coneMats.forEach(m => m.color.set(isDark ? 0x0d1117 : 0x0d2010));
  }, [isDark]);

  /* ── Exit: wait for CSS animation then unmount ── */
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShouldRender(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div className={`loader-container ${isDark ? 'dark-mode' : 'light-mode'} ${!isLoading ? 'water-dissolve' : ''}`}>
      <canvas ref={canvasRef} className="loader-canvas" />

      <div className="loader-text-overlay">
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
  );
};

export default Loader;