import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { extend, useThree } from "@react-three/fiber";
import countries from "@/data/globe.json";
import "../styles/globe.css";
 
extend({ ThreeGlobe });
 
/* ─── Constants ─── */
const CAMERA_Z              = 300;
const ASPECT                = 1.2;
const RING_PROPAGATION_SPEED = 3;
 
/* ─── Arc data: connections from Nakuru, Kenya to various cities ─── */
const ARCS = [
  { order: 1,  startLat: -0.303,   startLng: 36.080,  endLat: 51.505,  endLng: -0.09,   arcAlt: 0.4,  color: ["#4f46e5", "#a5b4fc"] },
  { order: 2,  startLat: -0.303,   startLng: 36.080,  endLat: 40.713,  endLng: -74.006, arcAlt: 0.5,  color: ["#4f46e5", "#818cf8"] },
  { order: 3,  startLat: -0.303,   startLng: 36.080,  endLat: 48.856,  endLng: 2.352,   arcAlt: 0.38, color: ["#6366f1", "#a5b4fc"] },
  { order: 4,  startLat: -0.303,   startLng: 36.080,  endLat: 35.689,  endLng: 139.692, arcAlt: 0.55, color: ["#818cf8", "#4f46e5"] },
  { order: 5,  startLat: -0.303,   startLng: 36.080,  endLat: -33.868, endLng: 151.209, arcAlt: 0.6,  color: ["#a5b4fc", "#4f46e5"] },
  { order: 6,  startLat: -0.303,   startLng: 36.080,  endLat: 1.352,   endLng: 103.820, arcAlt: 0.42, color: ["#6366f1", "#818cf8"] },
  { order: 7,  startLat: -0.303,   startLng: 36.080,  endLat: 37.774,  endLng: -122.42, arcAlt: 0.5,  color: ["#4f46e5", "#c7d2fe"] },
  { order: 8,  startLat: -1.286,   startLng: 36.817,  endLat: 6.524,   endLng: 3.379,   arcAlt: 0.2,  color: ["#818cf8", "#6366f1"] },
];
 
/* ─── Helpers ─── */
function hexToRgb(hex) {
  const short = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(short, (_, r, g, b) => r + r + g + g + b + b);
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return res
    ? { r: parseInt(res[1], 16), g: parseInt(res[2], 16), b: parseInt(res[3], 16) }
    : null;
}
 
function genRandomNumbers(min, max, count) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (!arr.includes(r)) arr.push(r);
  }
  return arr;
}
 
/* ─── WebGL config ─── */
function WebGLRendererConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0);
  }, [gl, size]);
  return null;
}
 
/* ─── Globe mesh ─── */
function GlobeMesh({ isDark }) {
  const groupRef      = useRef(null);
  const globeRef      = useRef(null);
  const [ready, setReady] = useState(false);
 
  const globeColor  = isDark  ? "#0f1631" : "#dbeafe";
  const polyColor   = isDark  ? "rgba(165,180,252,0.65)" : "rgba(79,70,229,0.45)";
  const atmoColor   = isDark  ? "#a5b4fc" : "#6366f1";
  const arcTime     = 2000;
  const arcLength   = 0.9;
  const rings       = 1;
  const maxRings    = 3;
  const pointSize   = 1;
 
  /* Init once */
  useEffect(() => {
    if (!groupRef.current || globeRef.current) return;
    globeRef.current = new ThreeGlobe();
    groupRef.current.add(globeRef.current);
    setReady(true);
  }, []);
 
  /* Material */
  useEffect(() => {
    if (!ready || !globeRef.current) return;
    const mat = globeRef.current.globeMaterial();
    mat.color             = new Color(globeColor);
    mat.emissive          = new Color(isDark ? "#1e1b4b" : "#eff6ff");
    mat.emissiveIntensity = 0.12;
    mat.shininess         = 0.9;
  }, [ready, isDark, globeColor]);
 
  /* Data */
  useEffect(() => {
    if (!ready || !globeRef.current) return;
 
    const points = ARCS.flatMap((arc) => [
      { size: pointSize, order: arc.order, color: arc.color[0], lat: arc.startLat, lng: arc.startLng },
      { size: pointSize, order: arc.order, color: arc.color[1], lat: arc.endLat,   lng: arc.endLng   },
    ]).filter((v, i, a) =>
      a.findIndex((v2) => v2.lat === v.lat && v2.lng === v.lng) === i
    );
 
    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(true)
      .atmosphereColor(atmoColor)
      .atmosphereAltitude(0.12)
      .hexPolygonColor(() => polyColor);
 
    globeRef.current
      .arcsData(ARCS)
      .arcStartLat((d) => +d.startLat)
      .arcStartLng((d) => +d.startLng)
      .arcEndLat((d)   => +d.endLat)
      .arcEndLng((d)   => +d.endLng)
      .arcColor((d)    => d.color)
      .arcAltitude((d) => +d.arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
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
      .ringColor(() => polyColor)
      .ringMaxRadius(maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((arcTime * arcLength) / rings);
  }, [ready, isDark, polyColor, atmoColor]);
 
  /* Rings interval */
  useEffect(() => {
    if (!ready || !globeRef.current) return;
    const polyColor = isDark ? "rgba(165,180,252,0.65)" : "rgba(79,70,229,0.45)";
    const arcLength = 0.9;
    const arcTime   = 2000;
 
    const id = setInterval(() => {
      if (!globeRef.current) return;
      const idxs = genRandomNumbers(0, ARCS.length, Math.floor((ARCS.length * 4) / 5));
      globeRef.current.ringsData(
        ARCS.filter((_, i) => idxs.includes(i)).map((d) => ({
          lat: d.startLat, lng: d.startLng, color: d.color[0],
        }))
      );
    }, 2000);
 
    return () => clearInterval(id);
  }, [ready, isDark]);
 
  return <group ref={groupRef} />;
}
 
/* ─── Scene wrapper ─── */
function GlobeScene({ isDark }) {
  const scene = new Scene();
  scene.fog   = new Fog(0xffffff, 400, 2000);
 
  const ambientColor   = isDark ? "#a5b4fc" : "#6366f1";
  const dirLeftColor   = isDark ? "#818cf8" : "#4f46e5";
  const dirTopColor    = isDark ? "#c7d2fe" : "#a5b4fc";
  const pointLightColor= isDark ? "#6366f1" : "#4f46e5";
 
  return (
    <Canvas
      scene={scene}
      camera={new PerspectiveCamera(50, ASPECT, 180, 1800)}
    >
      <WebGLRendererConfig />
      <ambientLight     color={ambientColor}    intensity={0.6} />
      <directionalLight color={dirLeftColor}    position={new Vector3(-400,  100, 400)} />
      <directionalLight color={dirTopColor}     position={new Vector3(-200,  500, 200)} />
      <pointLight       color={pointLightColor} position={new Vector3(-200,  500, 200)} intensity={0.8} />
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
 
/* ─── Public component ─── */
export default function ContactGlobe({ isDark = false }) {
  return (
    <div className="contact-globe-wrapper" aria-hidden="true">
      <div className="contact-globe-fade contact-globe-fade--top" />
      <div className="contact-globe-canvas">
        <Suspense fallback={<div className="contact-globe-placeholder" />}>
          <GlobeScene isDark={isDark} />
        </Suspense>
      </div>
      <div className="contact-globe-fade contact-globe-fade--bottom" />
      <p className="contact-globe-caption">
        <span className="contact-globe-dot" />
        Based in Nairobi, Kenya — open to remote worldwide
      </p>
    </div>
  );
}