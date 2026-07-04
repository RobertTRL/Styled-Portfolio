import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { extend, useThree } from "@react-three/fiber";
import "../styles/globe.css";

extend({ ThreeGlobe });

const CAMERA_Z               = 300;
const ASPECT                 = 1;
const RING_PROPAGATION_SPEED = 3;
const MAX_DPR                = 1.5; // caps render resolution on high-DPI screens

/* ── Arc data radiating from Nakuru, Kenya (-0.303, 36.080) ── */
const ARCS = [
  // ── Existing (Paris removed — it collided with London) ──
  { order: 1,  startLat: -0.303, startLng: 36.080, endLat:  51.505, endLng:  -0.090, arcAlt: 0.40, color: "#06b6d4" }, // London
  { order: 2,  startLat: -0.303, startLng: 36.080, endLat:  40.713, endLng: -74.006, arcAlt: 0.50, color: "#06b6d4" }, // New York
  { order: 3,  startLat: -0.303, startLng: 36.080, endLat:  35.689, endLng: 139.692, arcAlt: 0.55, color: "#06b6d4" }, // Tokyo
  { order: 4,  startLat: -0.303, startLng: 36.080, endLat: -33.868, endLng: 151.209, arcAlt: 0.60, color: "#818cf8" }, // Sydney
  { order: 5,  startLat: -0.303, startLng: 36.080, endLat:   1.352, endLng: 103.820, arcAlt: 0.42, color: "#06b6d4" }, // Singapore
  { order: 6,  startLat: -0.303, startLng: 36.080, endLat:  37.774, endLng: -122.42, arcAlt: 0.50, color: "#818cf8" }, // San Francisco
  { order: 7,  startLat: -0.303, startLng: 36.080, endLat:   6.524, endLng:   3.379, arcAlt: 0.20, color: "#06b6d4" }, // Lagos

  // ── Africa ──
  { order: 8,  startLat: -0.303, startLng: 36.080, endLat:  30.044, endLng:  31.235, arcAlt: 0.30, color: "#818cf8" }, // Cairo
  { order: 9,  startLat: -0.303, startLng: 36.080, endLat:  33.573, endLng:  -7.589, arcAlt: 0.35, color: "#06b6d4" }, // Casablanca
  { order: 10, startLat: -0.303, startLng: 36.080, endLat:   9.145, endLng:  40.489, arcAlt: 0.25, color: "#818cf8" }, // Addis Ababa
  { order: 11, startLat: -0.303, startLng: 36.080, endLat: -26.204, endLng:  28.047, arcAlt: 0.30, color: "#06b6d4" }, // Johannesburg

  // ── South America (previously empty) ──
  { order: 12, startLat: -0.303, startLng: 36.080, endLat: -23.550, endLng: -46.633, arcAlt: 0.45, color: "#818cf8" }, // São Paulo
  { order: 13, startLat: -0.303, startLng: 36.080, endLat: -34.603, endLng: -58.381, arcAlt: 0.50, color: "#06b6d4" }, // Buenos Aires
  { order: 14, startLat: -0.303, startLng: 36.080, endLat:   4.711, endLng: -74.072, arcAlt: 0.55, color: "#818cf8" }, // Bogotá
  { order: 15, startLat: -0.303, startLng: 36.080, endLat: -12.046, endLng: -77.043, arcAlt: 0.55, color: "#06b6d4" }, // Lima
  { order: 16, startLat: -0.303, startLng: 36.080, endLat: -33.447, endLng: -70.673, arcAlt: 0.50, color: "#818cf8" }, // Santiago

  // ── Middle East ──
  { order: 17, startLat: -0.303, startLng: 36.080, endLat:  25.204, endLng:  55.270, arcAlt: 0.30, color: "#06b6d4" }, // Dubai
  { order: 18, startLat: -0.303, startLng: 36.080, endLat:  41.008, endLng:  28.978, arcAlt: 0.35, color: "#818cf8" }, // Istanbul

  // ── Europe ──
  { order: 19, startLat: -0.303, startLng: 36.080, endLat:  52.520, endLng:  13.405, arcAlt: 0.35, color: "#06b6d4" }, // Berlin
  { order: 20, startLat: -0.303, startLng: 36.080, endLat:  41.902, endLng:  12.496, arcAlt: 0.35, color: "#818cf8" }, // Rome
  { order: 21, startLat: -0.303, startLng: 36.080, endLat:  55.756, endLng:  37.618, arcAlt: 0.35, color: "#06b6d4" }, // Moscow

  // ── Asia ──
  { order: 22, startLat: -0.303, startLng: 36.080, endLat:  39.904, endLng: 116.407, arcAlt: 0.40, color: "#818cf8" }, // Beijing
  { order: 23, startLat: -0.303, startLng: 36.080, endLat:  19.076, endLng:  72.877, arcAlt: 0.30, color: "#06b6d4" }, // Mumbai
  { order: 24, startLat: -0.303, startLng: 36.080, endLat:  13.756, endLng: 100.502, arcAlt: 0.35, color: "#818cf8" }, // Bangkok
  { order: 25, startLat: -0.303, startLng: 36.080, endLat:  37.566, endLng: 126.978, arcAlt: 0.45, color: "#06b6d4" }, // Seoul

  // ── North America & Oceania ──
  { order: 26, startLat: -0.303, startLng: 36.080, endLat:  19.433, endLng: -99.133, arcAlt: 0.55, color: "#818cf8" }, // Mexico City
  { order: 27, startLat: -0.303, startLng: 36.080, endLat: -36.848, endLng: 174.763, arcAlt: 0.55, color: "#06b6d4" }, // Auckland
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
  const { gl } = useThree();
  useEffect(() => {
    // dpr and sizing are handled by <Canvas dpr={...}> and R3F's own
    // resize observer now — this only needs to set the transparent clear color.
    gl.setClearColor(0x000000, 0);
  }, [gl]);
  return null;
}

// isDark is accepted but currently unused below — the material/data/rings
// effects don't branch on it. Left as a prop in case you want to wire up
// an actual dark/light globe variant later; for now it just costs nothing
// since it's no longer in any dependency array.
function GlobeMesh({ isDark }) {
  const groupRef = useRef(null);
  const globeRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [countries, setCountries] = useState(null);

  /* Fetch globe.json at runtime instead of bundling 477 KB into the JS chunk.
     Move the file from src/data/globe.json to public/data/globe.json. */
  useEffect(() => {
    const controller = new AbortController();
    fetch("/data/globe.json", { signal: controller.signal })
      .then((res) => res.json())
      .then(setCountries)
      .catch((err) => {
        if (err.name !== "AbortError") console.error("Failed to load globe data:", err);
      });
    return () => controller.abort();
  }, []);

  /* Init once */
  useEffect(() => {
    if (!groupRef.current || globeRef.current) return;
    globeRef.current = new ThreeGlobe();
    groupRef.current.add(globeRef.current);
    setReady(true);
  }, []);

  /* Material — fixed colors regardless of theme, so this only needs to run once ready */
  useEffect(() => {
    if (!ready || !globeRef.current) return;
    const mat = globeRef.current.globeMaterial();
    mat.color             = new Color("#0d1f4a");
    mat.emissive          = new Color("#1a3a7a");
    mat.emissiveIntensity = 0.6;
    mat.shininess         = 0.9;
  }, [ready]);

  /* Data — gated on the fetched countries payload instead of a static import */
  useEffect(() => {
    if (!ready || !globeRef.current || !countries) return;

    const polyColor = "rgba(150,210,255,0.7)";
    const arcTime   = 2000;
    const arcLength = 0.9;

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
      .arcColor((d)    => d.color)
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
  }, [ready, countries]);

  /* Rings pulse interval — also independent of isDark */
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
  }, [ready]);

  return <group ref={groupRef} />;
}

function GlobeScene({ isDark }) {
  // Stable identity for the whole component lifetime. Without this, a fresh
  // Scene/Camera was created on every render and handed to <Canvas>, which
  // most likely reset OrbitControls' current rotation back to default.
  const { scene, camera } = useMemo(() => {
    const s = new Scene();
    s.fog = new Fog(0xffffff, 400, 2000);
    const c = new PerspectiveCamera(50, ASPECT, 180, 1800);
    return { scene: s, camera: c };
  }, []);

  const lightPos1 = useMemo(() => new Vector3(-400, 100, 400), []);
  const lightPos2 = useMemo(() => new Vector3(-200, 500, 200), []);

  return (
    <Canvas scene={scene} camera={camera} dpr={[1, MAX_DPR]}>
      <WebGLRendererConfig />
      <ambientLight     color="#ffffff" intensity={1.2} />
      <directionalLight color="#ffffff" position={lightPos1} intensity={1.5} />
      <directionalLight color="#4f70ff" position={lightPos2} intensity={0.8} />
      <pointLight       color="#06b6d4" position={lightPos2} intensity={1.0} />
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