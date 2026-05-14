import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import '../styles/loader.css';

const LETTERS = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'];

const Loader = ({ isDark, isLoading }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const canvasRef = useRef(null);
  const isDarkRef = useRef(isDark);
  const sceneRefs = useRef({});

  // Sync state without triggering a re-mount of the canvas
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    let W = container.clientWidth, H = container.clientHeight;
    let animId;

    // 1. High-End Renderer Setup
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020818);
    scene.fog = new THREE.FogExp2(0x020818, 0.025); // Exp2 fog is more realistic

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 3.8, 10.5);
    camera.lookAt(0, 1.2, 0);

    // 2. Cinematic Lighting
    const ambient = new THREE.AmbientLight(0x223355, 0.4);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xfff5e6, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.camera.left = -8;
    sunLight.shadow.camera.right = 8;
    sunLight.shadow.camera.top = 8;
    sunLight.shadow.camera.bottom = -8;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    const moonLight = new THREE.DirectionalLight(0x8ab4f8, 0);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 512;
    moonLight.shadow.mapSize.height = 512;
    scene.add(moonLight);

    // 3. Materials (Upgraded to Standard for light reaction)
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: 0x080d18, roughness: 0.9, metalness: 0.1 
    });
    const gnd = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), groundMat);
    gnd.rotation.x = -Math.PI / 2;
    gnd.receiveShadow = true;
    scene.add(gnd);

    const coneMats = [];
    const makeTree = (x, z, s) => {
      const g = new THREE.Group();
      const cm = new THREE.MeshStandardMaterial({ color: 0x0a0f14, roughness: 0.8 });
      coneMats.push(cm);
      [[0.65*s,1.5*s,0.85*s],[0.85*s,1.8*s,0.38*s],[1.05*s,2.0*s,0]].forEach(([r,h,yo]) => {
        const c = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), cm);
        c.position.y = yo + h / 2;
        c.castShadow = true;
        c.receiveShadow = true;
        g.add(c);
      });
      const tk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08*s, 0.12*s, 0.45*s, 6),
        new THREE.MeshStandardMaterial({ color: 0x2a1505, roughness: 0.9 })
      );
      tk.position.y = 0.22 * s;
      tk.castShadow = true;
      g.add(tk);
      g.position.set(x, 0, z);
      return g;
    };

    const trees = [
      [-6,-3,1.2], [-4,-4.5,0.9], [-2.5,-5.5,1.1],
      [0.5,-6,1.3], [2.5,-5,0.85], [4.5,-4.2,1.1], [6.5,-3,0.9],
    ].map(([x,z,s]) => { const t = makeTree(x,z,s); scene.add(t); return t; });

    // Tent
    const tentShape = new THREE.Shape();
    tentShape.moveTo(-1.8,0); tentShape.lineTo(1.8,0); tentShape.lineTo(0,2.4); tentShape.closePath();
    const tentMat = new THREE.MeshStandardMaterial({ color: 0xf2c86b, roughness: 1, side: THREE.DoubleSide });
    const tent = new THREE.Mesh(new THREE.ExtrudeGeometry(tentShape, { depth: 3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 }), tentMat);
    tent.position.set(1.5, 0, -0.2);
    tent.castShadow = true;
    tent.receiveShadow = true;
    scene.add(tent);

    const ridgePole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 3.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x3d3542, roughness: 0.7 })
    );
    ridgePole.rotation.z = Math.PI / 2;
    ridgePole.position.set(1.5, 2.45, 1.3);
    ridgePole.castShadow = true;
    scene.add(ridgePole);

    // Tent Flaps
    const flapMat = new THREE.MeshStandardMaterial({ color: 0xe6d4b8, roughness: 0.9, side: THREE.DoubleSide });
    const leftFlap = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.4), flapMat);
    leftFlap.position.set(0.85, 0.7, 2.8); 
    leftFlap.rotation.y = 0.5; 
    leftFlap.castShadow = true;
    scene.add(leftFlap);
    
    const rightFlap = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.4), flapMat.clone());
    rightFlap.position.set(2.15, 0.7, 2.8); 
    rightFlap.rotation.y = -0.5; 
    rightFlap.castShadow = true;
    scene.add(rightFlap);

    // Campfire Group
    const fg = new THREE.Group();
    fg.position.set(-2.5, 0, 2.5);
    scene.add(fg);

    const logMat = new THREE.MeshStandardMaterial({ color: 0x3a1c0d, roughness: 1 });
    [Math.PI/4, -Math.PI/4].forEach(ry => {
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.1,1.2,8), logMat);
      log.rotation.z = Math.PI / 2; log.rotation.y = ry; log.position.y = 0.08;
      log.castShadow = true;
      log.receiveShadow = true;
      fg.add(log);
    });

    const potMat = new THREE.MeshStandardMaterial({ color: 0x4a4354, roughness: 0.4, metalness: 0.6 });
    const pot = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 12, 0, Math.PI*2, 0, Math.PI/1.6), potMat);
    pot.position.set(0, 1.35, 0); 
    pot.castShadow = true;
    fg.add(pot);

    const fLight = new THREE.PointLight(0xff7711, 4, 8);
    fLight.position.set(0, 0.8, 0);
    fLight.castShadow = true;
    fg.add(fLight);

    // High-End Glowing Fire Particles
    const FC = 200;
    const fp = new Float32Array(FC * 3);
    const fv = [];
    for (let i = 0; i < FC; i++) {
      fp[i*3]   = (Math.random()-0.5)*0.35;
      fp[i*3+1] = Math.random()*0.6;
      fp[i*3+2] = (Math.random()-0.5)*0.35;
      fv.push({ vx:(Math.random()-0.5)*0.004, vy:0.015+Math.random()*0.025, life:Math.random() });
    }
    const fGeo = new THREE.BufferGeometry();
    fGeo.setAttribute('position', new THREE.BufferAttribute(fp, 3));
    
    // Additive blending for true glow
    const sparkMat = new THREE.PointsMaterial({ 
      color: 0xffaa33, size: 0.15, transparent: true, opacity: 0.8, 
      blending: THREE.AdditiveBlending, depthWrite: false 
    });
    const coreMat = new THREE.PointsMaterial({ 
      color: 0xffeebb, size: 0.08, transparent: true, opacity: 0.9, 
      blending: THREE.AdditiveBlending, depthWrite: false 
    });
    fg.add(new THREE.Points(fGeo, sparkMat));
    fg.add(new THREE.Points(fGeo, coreMat));

    // Sun & Moon
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 24, 24), 
      new THREE.MeshBasicMaterial({ color: 0xffeaa8 })
    );
    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 24, 24), 
      new THREE.MeshBasicMaterial({ color: 0xddeeff })
    );
    scene.add(sunMesh); scene.add(moonMesh);

    // Stars
    const sPos = new Float32Array(400*3);
    for (let i = 0; i < 400; i++) {
      const th = Math.random()*Math.PI*2, ph = Math.random()*Math.PI*0.45, r = 25+Math.random()*10;
      sPos[i*3]   = r*Math.sin(ph)*Math.cos(th);
      sPos[i*3+1] = r*Math.cos(ph)+2;
      sPos[i*3+2] = r*Math.sin(ph)*Math.sin(th)-10;
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const starMat = new THREE.PointsMaterial({ 
      color: 0xffffff, size: 0.1, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false 
    });
    scene.add(new THREE.Points(sGeo, starMat));

    sceneRefs.current = { groundMat, coneMats };

    const darkNight = new THREE.Color(0x020818);
    const darkDay = new THREE.Color(0x0a1a3a);
    const lightNight = new THREE.Color(0x8ab4f8);
    const lightDay = new THREE.Color(0xc2deff);
    const bgCol = new THREE.Color();

    const clock = new THREE.Clock();

    // Animation loop
    const tick = () => {
      animId = requestAnimationFrame(tick);
      const elapsedTime = clock.getElapsedTime();
      const T = elapsedTime * 0.4; // Speed multiplier

      const dark = isDarkRef.current;
      const sy = Math.sin(T), sx = Math.cos(T);

      sunMesh.position.set(sx*15, sy*10, -15);
      moonMesh.position.set(-sx*15, -sy*10, -15);
      const df = Math.max(0, sy); // Day factor (0 to 1)

      // Smooth color transitions
      bgCol.copy(dark ? darkNight : lightNight).lerp(dark ? darkDay : lightDay, df);
      scene.background.copy(bgCol);
      scene.fog.color.copy(bgCol);

      // Light Intensity adjustments based on time
      ambient.intensity = dark ? 0.1 + df*0.3 : 0.3 + df*0.6;
      sunLight.position.copy(sunMesh.position);
      sunLight.intensity = df * 2.5;
      moonLight.position.copy(moonMesh.position);
      moonLight.intensity = (1 - df) * (dark ? 0.6 : 0.2);

      starMat.opacity = dark ? (1-df)*0.85 : 0;
      fLight.intensity = 3 + Math.sin(elapsedTime*15)*0.6 + Math.sin(elapsedTime*25)*0.3;
      pot.rotation.y = Math.sin(elapsedTime)*0.1;

      // Particle update
      for (let i = 0; i < FC; i++) {
        fp[i*3]   += fv[i].vx;
        fp[i*3+1] += fv[i].vy;
        fv[i].life += 0.015;
        if (fv[i].life > 1 || fp[i*3+1] > 1.8) {
          fp[i*3]   = (Math.random()-0.5)*0.3;
          fp[i*3+1] = 0;
          fp[i*3+2] = (Math.random()-0.5)*0.3;
          fv[i].life = 0;
          fv[i].vy   = 0.015 + Math.random()*0.025;
          fv[i].vx   = (Math.random()-0.5)*0.004;
        }
      }
      fGeo.attributes.position.needsUpdate = true;

      // Gentle environment movement
      trees.forEach((tr, i) => { tr.rotation.z = Math.sin(elapsedTime*0.5 + i)*0.02; });
      leftFlap.rotation.y  =  0.5 + Math.sin(elapsedTime*0.8)*0.05;
      rightFlap.rotation.y = -0.5 - Math.sin(elapsedTime*0.8)*0.05;
      
      // Cinematic Camera breathing
      camera.position.y = 3.8 + Math.sin(elapsedTime * 0.4) * 0.15;
      camera.position.x = Math.sin(elapsedTime * 0.2) * 0.2;
      camera.lookAt(0, 1.2, 0);

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

  // Sync ground/tree materials when isDark prop changes
  useEffect(() => {
    const { groundMat, coneMats } = sceneRefs.current;
    if (!groundMat) return;
    
    const targetGnd = isDark ? 0x080d18 : 0x3d5a26;
    const targetTree = isDark ? 0x0a0f14 : 0x112814;

    groundMat.color.setHex(targetGnd);
    coneMats.forEach(m => m.color.setHex(targetTree));
  }, [isDark]);

  // Exit: wait for CSS animation then unmount
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShouldRender(false), 1600); // Matched to new CSS timing
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
            <span key={i} className="loader-letter" style={{ animationDelay: `${i * 0.08}s` }}>
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