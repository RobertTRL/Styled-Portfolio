import React, { useState, useEffect, useRef } from 'react';
import '../styles/loader.css';
 
const LETTERS = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'];
 
// Must match --time in loader.css exactly
const ANIM_DURATION_MS = 7000;
// mouthOpen peaks at 95.58% — this is the smile climax
const SMILE_PEAK_PCT   = 0.88;
 
const Loader = ({ isDark, isLoading }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [dissolving,   setDissolving]   = useState(false);
  const [scale,        setScale]        = useState(1);
  const [mousePos,     setMousePos]     = useState({ x: 0, y: 0 });
 
  const eyeRef = useRef(null);
 
  // Responsive scaling
  useEffect(() => {
    const handleResize = () => {
      const scaleX = (window.innerWidth  * 0.95) / 800;
      const scaleY = (window.innerHeight * 0.80) / 600;
      setScale(Math.max(0.6, Math.min(Math.min(scaleX, scaleY), 2.5)));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 
  // Sync dissolve exit to smile peak keyframe
  useEffect(() => {
    if (!isLoading) {
      const smileMs = SMILE_PEAK_PCT * ANIM_DURATION_MS; // 21027ms into cycle
 
      // Read the boy animation's current position in its cycle
      const boyEl = document.querySelector('.boy');
      const anim  = boyEl
        ?.getAnimations()
        .find(a => a.animationName === 'boy');
 
      let waitMs = 0;
 
      if (anim && anim.currentTime != null) {
        const currentInCycle = anim.currentTime % ANIM_DURATION_MS;
        waitMs = smileMs - currentInCycle;
 
        // If we've already passed the smile peak this cycle, wait for next cycle
        if (waitMs < 0) waitMs += ANIM_DURATION_MS;
 
        // If we're already very close (within 200ms), go now rather than
        // making the user wait a full extra cycle
        if (waitMs > ANIM_DURATION_MS - 200) waitMs = 0;
      }
 
      const dissolveTimer = setTimeout(() => setDissolving(true), waitMs);
      // Unmount 1.5s after the dissolve animation starts
      const unmountTimer  = setTimeout(() => setShouldRender(false), waitMs + 1500);
 
      return () => {
        clearTimeout(dissolveTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [isLoading]);
 
  // Mouse tracking for eye follow
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
 
  // Iris offset
  let irisTx = 0;
  let irisTy = 0;
 
  if (eyeRef.current) {
    const rect       = eyeRef.current.getBoundingClientRect();
    const faceCenterX = rect.left + (62 * scale);
    const faceCenterY = rect.top  + (32 * scale);
    const rawDx = mousePos.x - faceCenterX;
    const rawDy = mousePos.y - faceCenterY;
    const mag   = Math.sqrt(rawDx * rawDx + rawDy * rawDy);
    const limitPx = 10;
    if (mag > 0) {
      const targetMag = Math.min(mag * 0.08, limitPx);
      irisTx = (rawDx / mag) * targetMag;
      irisTy = (rawDy / mag) * targetMag;
    }
  }
 
  if (!shouldRender) return null;
 
  return (
    <div className={`loader-container ${isDark ? 'dark-mode' : 'light-mode'} ${dissolving ? 'water-dissolve' : ''}`}>
      <div className="loader-pattern" />
      <div className="loader-overlay" />
 
      <div className="content-container">
        <div className="noodle-loader-layout">
 
          <div
            className="scene-animator"
            style={{ width: 800 * scale, height: 600 * scale }}
          >
            <div
              className="noodle-scene"
              style={{ transform: `scale(${scale})` }}
            >
              <div className="boy">
                <div className="boy__head">
                  <div className="boy__hair"></div>
                  <div
                    ref={eyeRef}
                    className="boy__eyes"
                    style={{ '--iris-tx': `${irisTx}px`, '--iris-ty': `${irisTy}px` }}
                  ></div>
                  <div className="boy__mouth"></div>
                  <div className="boy__cheeks"></div>
                </div>
                <div className="noodle"></div>
                <div className="boy__leftArm">
                  <div className="chopsticks"></div>
                </div>
              </div>
              <div className="plate"></div>
              <div className="rightArm"></div>
            </div>
          </div>
 
          <div className="loader-wrapper">
            <div className="loader-letters" aria-label="Loading">
              {LETTERS.map((char, i) => (
                <span
                  key={i}
                  className="loader-letter"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
};
 
export default Loader;