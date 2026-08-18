import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Color, Fog, PerspectiveCamera, Scene, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import "../styles/globe.css";

const CAMERA_Z = 300;
const ASPECT = 1;
const RING_PROPAGATION_SPEED = 3;
const MAX_DPR = 1.5;
const ARC_ANIMATION_TIME = 2000;
const ARC_DASH_LENGTH = 0.9;

const ARCS = [
  { order: 1, startLat: -0.303, startLng: 36.08, endLat: 51.505, endLng: -0.09, arcAlt: 0.4, color: "#06b6d4" },
  { order: 2, startLat: -0.303, startLng: 36.08, endLat: 40.713, endLng: -74.006, arcAlt: 0.5, color: "#06b6d4" },
  { order: 3, startLat: -0.303, startLng: 36.08, endLat: 35.689, endLng: 139.692, arcAlt: 0.55, color: "#06b6d4" },
  { order: 4, startLat: -0.303, startLng: 36.08, endLat: -33.868, endLng: 151.209, arcAlt: 0.6, color: "#818cf8" },
  { order: 5, startLat: -0.303, startLng: 36.08, endLat: 1.352, endLng: 103.82, arcAlt: 0.42, color: "#06b6d4" },
  { order: 6, startLat: -0.303, startLng: 36.08, endLat: 37.774, endLng: -122.42, arcAlt: 0.5, color: "#818cf8" },
  { order: 7, startLat: -0.303, startLng: 36.08, endLat: 6.524, endLng: 3.379, arcAlt: 0.2, color: "#06b6d4" },
  { order: 8, startLat: -0.303, startLng: 36.08, endLat: 30.044, endLng: 31.235, arcAlt: 0.3, color: "#818cf8" },
  { order: 9, startLat: -0.303, startLng: 36.08, endLat: 33.573, endLng: -7.589, arcAlt: 0.35, color: "#06b6d4" },
  { order: 10, startLat: -0.303, startLng: 36.08, endLat: 9.145, endLng: 40.489, arcAlt: 0.25, color: "#818cf8" },
  { order: 11, startLat: -0.303, startLng: 36.08, endLat: -26.204, endLng: 28.047, arcAlt: 0.3, color: "#06b6d4" },
  { order: 12, startLat: -0.303, startLng: 36.08, endLat: -23.55, endLng: -46.633, arcAlt: 0.45, color: "#818cf8" },
  { order: 13, startLat: -0.303, startLng: 36.08, endLat: -34.603, endLng: -58.381, arcAlt: 0.5, color: "#06b6d4" },
  { order: 14, startLat: -0.303, startLng: 36.08, endLat: 4.711, endLng: -74.072, arcAlt: 0.55, color: "#818cf8" },
  { order: 15, startLat: -0.303, startLng: 36.08, endLat: -12.046, endLng: -77.043, arcAlt: 0.55, color: "#06b6d4" },
  { order: 16, startLat: -0.303, startLng: 36.08, endLat: -33.447, endLng: -70.673, arcAlt: 0.5, color: "#818cf8" },
  { order: 17, startLat: -0.303, startLng: 36.08, endLat: 25.204, endLng: 55.27, arcAlt: 0.3, color: "#06b6d4" },
  { order: 18, startLat: -0.303, startLng: 36.08, endLat: 41.008, endLng: 28.978, arcAlt: 0.35, color: "#818cf8" },
  { order: 19, startLat: -0.303, startLng: 36.08, endLat: 52.52, endLng: 13.405, arcAlt: 0.35, color: "#06b6d4" },
  { order: 20, startLat: -0.303, startLng: 36.08, endLat: 41.902, endLng: 12.496, arcAlt: 0.35, color: "#818cf8" },
  { order: 21, startLat: -0.303, startLng: 36.08, endLat: 55.756, endLng: 37.618, arcAlt: 0.35, color: "#06b6d4" },
  { order: 22, startLat: -0.303, startLng: 36.08, endLat: 39.904, endLng: 116.407, arcAlt: 0.4, color: "#818cf8" },
  { order: 23, startLat: -0.303, startLng: 36.08, endLat: 19.076, endLng: 72.877, arcAlt: 0.3, color: "#06b6d4" },
  { order: 24, startLat: -0.303, startLng: 36.08, endLat: 13.756, endLng: 100.502, arcAlt: 0.35, color: "#818cf8" },
  { order: 25, startLat: -0.303, startLng: 36.08, endLat: 37.566, endLng: 126.978, arcAlt: 0.45, color: "#06b6d4" },
  { order: 26, startLat: -0.303, startLng: 36.08, endLat: 19.433, endLng: -99.133, arcAlt: 0.55, color: "#818cf8" },
  { order: 27, startLat: -0.303, startLng: 36.08, endLat: -36.848, endLng: 174.763, arcAlt: 0.55, color: "#06b6d4" },
];

const RING_DATA = ARCS.map(({ order, startLat, startLng, color }) => ({
  order,
  lat: startLat,
  lng: startLng,
  color,
}));

function disposeThreeGlobe(globe) {
  const disposed = new Set();

  const dispose = (resource) => {
    if (!resource || disposed.has(resource)) return;
    disposed.add(resource);
    resource.dispose?.();
  };

  globe.traverse((object) => {
    dispose(object.geometry);

    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];

    materials.filter(Boolean).forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value?.isTexture) dispose(value);
      });

      Object.values(material.uniforms ?? {}).forEach(({ value }) => {
        if (value?.isTexture) dispose(value);
      });

      dispose(material);
    });
  });

  globe.clear();
}

function WebGLRendererConfig() {
  const { gl } = useThree();

  useEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);

  return null;
}

function GlobeMesh() {
  const groupRef = useRef(null);
  const globeRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [countries, setCountries] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/data/globe.json", { signal: controller.signal })
      .then((res) => res.json())
      .then(setCountries)
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Failed to load globe data:", error);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!groupRef.current || globeRef.current) return undefined;

    const globe = new ThreeGlobe();
    globeRef.current = globe;
    groupRef.current.add(globe);
    setReady(true);

    return () => {
      groupRef.current?.remove(globe);
      disposeThreeGlobe(globe);
      globeRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    if (!ready || !globeRef.current) return;

    const material = globeRef.current.globeMaterial();
    material.color.set("#0d1f4a");
    material.emissive.set("#1a3a7a");
    material.emissiveIntensity = 0.6;
    material.shininess = 0.9;
  }, [ready]);

  useEffect(() => {
    if (!ready || !globeRef.current || !countries) return;

    const polygonColor = "rgba(150,210,255,0.7)";

    const points = ARCS.flatMap((arc) => [
      {
        order: arc.order,
        color: arc.color,
        lat: arc.startLat,
        lng: arc.startLng,
      },
      {
        order: arc.order,
        color: arc.color,
        lat: arc.endLat,
        lng: arc.endLng,
      },
    ]).filter(
      (value, index, values) =>
        values.findIndex(
          (candidate) =>
            candidate.lat === value.lat && candidate.lng === value.lng,
        ) === index,
    );

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(true)
      .atmosphereColor("#4a90d9")
      .atmosphereAltitude(0.25)
      .hexPolygonColor(() => polygonColor);

    globeRef.current
      .arcsData(ARCS)
      .arcStartLat((data) => data.startLat)
      .arcStartLng((data) => data.startLng)
      .arcEndLat((data) => data.endLat)
      .arcEndLng((data) => data.endLng)
      .arcColor((data) => data.color)
      .arcAltitude((data) => data.arcAlt)
      .arcStroke(0.3)
      .arcDashLength(ARC_DASH_LENGTH)
      .arcDashInitialGap((data) => data.order)
      .arcDashGap(15)
      .arcDashAnimateTime(ARC_ANIMATION_TIME);

    globeRef.current
      .pointsData(points)
      .pointColor((data) => data.color)
      .pointsMerge(true)
      .pointAltitude(0)
      .pointRadius(2);

    globeRef.current
      .ringsData(RING_DATA)
      .ringColor((data) => data.color)
      .ringMaxRadius(3)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(ARC_ANIMATION_TIME * ARC_DASH_LENGTH);
  }, [countries, ready]);

  return <group ref={groupRef} />;
}

function GlobeScene() {
  const { scene, camera } = useMemo(() => {
    const nextScene = new Scene();
    nextScene.fog = new Fog(0xffffff, 400, 2000);

    const nextCamera = new PerspectiveCamera(50, ASPECT, 180, 1800);
    return { scene: nextScene, camera: nextCamera };
  }, []);

  const lightPos1 = useMemo(() => new Vector3(-400, 100, 400), []);
  const lightPos2 = useMemo(() => new Vector3(-200, 500, 200), []);

  return (
    <Canvas scene={scene} camera={camera} dpr={[1, MAX_DPR]}>
      <WebGLRendererConfig />
      <ambientLight color="#ffffff" intensity={1.2} />
      <directionalLight color="#ffffff" position={lightPos1} intensity={1.5} />
      <directionalLight color="#4f70ff" position={lightPos2} intensity={0.8} />
      <pointLight color="#06b6d4" position={lightPos2} intensity={1} />
      <GlobeMesh />
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

export default function ContactGlobe() {
  return (
    <div className="contact-globe-wrapper" aria-hidden="true">
      <div className="contact-globe-canvas">
        <Suspense fallback={<div className="contact-globe-placeholder" />}>
          <GlobeScene />
        </Suspense>
      </div>
    </div>
  );
}