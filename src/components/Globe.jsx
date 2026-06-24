import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { extend, useThree } from "@react-three/fiber";
import countries from "@/data/globe.json";
import "../styles/globe.css";
 
extend({ ThreeGlobe });

const CAMERA_Z               = 300;
const ASPECT                 = 1;
const RING_PROPAGATION_SPEED = 3;

/* ── Arc data radiating from Nakuru, Kenya (-0.303, 36.080) ── */
const ARCS = [
  { order: 1, startLat: -0.303, startLng: 36.080, endLat:  51.505, endLng:  -0.090, arcAlt: 0.40, color: "#06b6d4" }, // London
  { order: 2, startLat: -0.303, startLng: 36.080, endLat:  40.713, endLng: -74.006, arcAlt: 0.50, color: "#06b6d4" }, // New York
  { order: 3, startLat: -0.303, startLng: 36.080, endLat:  48.856, endLng:   2.352, arcAlt: 0.35, color: "#818cf8" }, // Paris
  { order: 4, startLat: -0.303, startLng: 36.080, endLat:  35.689, endLng: 139.692, arcAlt: 0.55, color: "#06b6d4" }, // Tokyo
  { order: 5, startLat: -0.303, startLng: 36.080, endLat: -33.868, endLng: 151.209, arcAlt: 0.60, color: "#818cf8" }, // Sydney
  { order: 6, startLat: -0.303, startLng: 36.080, endLat:   1.352, endLng: 103.820, arcAlt: 0.42, color: "#06b6d4" }, // Singapore
  { order: 7, startLat: -0.303, startLng: 36.080, endLat:  37.774, endLng: -122.42, arcAlt: 0.50, color: "#818cf8" }, // San Francisco
  { order: 8, startLat: -0.303, startLng: 36.080, endLat:   6.524, endLng:   3.379, arcAlt: 0.20, color: "#06b6d4" }, // Lagos
];

function genRandomNumbers(min, max, count) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (!arr.includes(r)) arr.push(r);
  }
  return arr;
}

function WebGLRendererConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0);
  }, [gl, size]);
  return null;
}

function GlobeMesh({ isDark }) {
  const groupRef = useRef(null);
  const globeRef = useRef(null);
  const [ready, setReady] = useState(false);

  /* Init once */
  useEffect(() => {
    if (!groupRef.current || globeRef.current) return;
    globeRef.current = new ThreeGlobe();
    groupRef.current.add(globeRef.current);
    setReady(true);
  }, []);

  /* Material — matches the dark navy look from the reference */
  useEffect(() => {
    if (!ready || !globeRef.current) return;
    const mat = globeRef.current.globeMaterial();
    mat.color             = new Color("#0d1f4a");
    mat.emissive          = new Color("#1a3a7a");
    mat.emissiveIntensity = 0.6;
    mat.shininess         = 0.9;
  }, [ready, isDark]);

  /* Data */
  useEffect(() => {
    if (!ready || !globeRef.current) return;

    const polyColor = "rgba(150,210,255,0.7)";
    const arcTime   = 2000;
    const arcLength = 0.9;

    /* Deduplicated endpoint dots */
    const points = ARCS.flatMap((arc) => [
      { order: arc.order, color: arc.color, lat: arc.startLat, lng: arc.startLng },
      { order: arc.order, color: arc.color, lat: arc.endLat,   lng: arc.endLng   },
    ]).filter((v, i, a) =>
      a.findIndex((v2) => v2.lat === v.lat && v2.lng === v.lng) === i
    );

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(true)
      .atmosphereColor("#4a90d9")
      .atmosphereAltitude(0.25)
      .hexPolygonColor(() => polyColor);

    globeRef.current
      .arcsData(ARCS)
      .arcStartLat((d) => +d.startLat)
      .arcStartLng((d) => +d.startLng)
      .arcEndLat((d)   => +d.endLat)
      .arcEndLng((d)   => +d.endLng)
      .arcColor((d)    => d.color)          // single string — no array
      .arcAltitude((d) => +d.arcAlt)
      .arcStroke(0.3)
      .arcDashLength(arcLength)
      .arcDashInitialGap((d) => +d.order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => arcTime);

    globeRef.current
      .pointsData(points)
      .pointColor((d) => d.color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor((d) => d.color)
      .ringMaxRadius(3)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((arcTime * arcLength) / 1);
  }, [ready, isDark]);

  /* Rings pulse interval */
  useEffect(() => {
    if (!ready || !globeRef.current) return;
    const id = setInterval(() => {
      if (!globeRef.current) return;
      const idxs = genRandomNumbers(0, ARCS.length, Math.floor((ARCS.length * 4) / 5));
      globeRef.current.ringsData(
        ARCS.filter((_, i) => idxs.includes(i)).map((d) => ({
          lat: d.startLat, lng: d.startLng, color: d.color,
        }))
      );
    }, 2000);
    return () => clearInterval(id);
  }, [ready, isDark]);

  return <group ref={groupRef} />;
}

function GlobeScene({ isDark }) {
  const scene = new Scene();
  scene.fog   = new Fog(0xffffff, 400, 2000);

  return (
    <Canvas
      scene={scene}
      camera={new PerspectiveCamera(50, ASPECT, 180, 1800)}
    >
      <WebGLRendererConfig />
      <ambientLight     color="#ffffff" intensity={1.2} />
      <directionalLight color="#ffffff" position={new Vector3(-400, 100, 400)} intensity={1.5} />
      <directionalLight color="#4f70ff" position={new Vector3(-200, 500, 200)} intensity={0.8} />
      <pointLight       color="#06b6d4" position={new Vector3(-200, 500, 200)} intensity={1.0} />
      <GlobeMesh isDark={isDark} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={CAMERA_Z}
        maxDistance={CAMERA_Z}
        autoRotate
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export default function ContactGlobe({ isDark = false }) {
  return (
    <div className="contact-globe-wrapper" aria-hidden="true">
      <div className="contact-globe-canvas">
        <Suspense fallback={<div className="contact-globe-placeholder" />}>
          <GlobeScene isDark={isDark} />
        </Suspense>
      </div>
    </div>
  );
}