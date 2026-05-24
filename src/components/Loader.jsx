import React, { useState, useEffect, useRef } from 'react';
import '../styles/loader.css';
 
const LETTERS = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'];
 
// ─── Timing constants ──────────────────────────────────────────────────────
// ANIM_DURATION_MS must exactly match `--time` in loader.css.
const ANIM_DURATION_MS = 7000;
 
// The dissolve starts at 88% of the cycle so that, 420 ms later (the 30%
// mark of the 1.4 s smileZoomExit), the zoom coincides with the open-mouth
// smile keyframe at 94.77 % — making the exit feel like the boy "bursts"
// out of the screen mid-smile.
const DISSOLVE_START_PCT = 0.88;
 
const Loader = ({ isDark, isLoading }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [dissolving,   setDissolving]   = useState(false);
  const [scale,        setScale]        = useState(1);
  const [mousePos,     setMousePos]     = useState({ x: 0, y: 0 });
 
  const eyeRef = useRef(null);
 
  // ── Responsive scaling ────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const sx = (window.innerWidth  * 0.95) / 800;
      const sy = (window.innerHeight * 0.80) / 600;
      setScale(Math.max(0.6, Math.min(Math.min(sx, sy), 2.5)));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 
  // ── Sync dissolve exit to smile keyframe ──────────────────────────────────
  useEffect(() => {
    if (isLoading) return;
 
    let waitMs = 0;
 
    try {
      const boyEl = document.querySelector('.boy');
      const anim  = boyEl
        ?.getAnimations?.()
        .find(a => a.animationName === 'boy');
 
      if (anim?.currentTime != null) {
        const targetMs      = DISSOLVE_START_PCT * ANIM_DURATION_MS;
        const currentInCycle = anim.currentTime % ANIM_DURATION_MS;
        waitMs = targetMs - currentInCycle;
 
        // Already past the target this cycle — wait for the next one
        if (waitMs < 0) waitMs += ANIM_DURATION_MS;
 
        // Within 200 ms of the target: fire now rather than waiting a full
        // extra cycle (avoids a near-miss adding 7 s of delay)
        if (waitMs > ANIM_DURATION_MS - 200) waitMs = 0;
      }
    } catch {
      // getAnimations unsupported or element missing — dissolve immediately
      waitMs = 0;
    }
 
    const dissolveTimer = setTimeout(() => setDissolving(true), waitMs);
    const unmountTimer  = setTimeout(() => setShouldRender(false), waitMs + 1500);
 
    return () => {
      clearTimeout(dissolveTimer);
      clearTimeout(unmountTimer);
    };
  }, [isLoading]);
 
  // ── Mouse tracking for eye follow ─────────────────────────────────────────
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
 
  // ── Iris offset (computed per-render, driven by mousePos state) ───────────
  let irisTx = 0;
  let irisTy = 0;
 
  if (eyeRef.current) {
    const rect        = eyeRef.current.getBoundingClientRect();
    const faceCenterX = rect.left + 62 * scale;
    const faceCenterY = rect.top  + 32 * scale;
    const rawDx = mousePos.x - faceCenterX;
    const rawDy = mousePos.y - faceCenterY;
    const mag   = Math.sqrt(rawDx * rawDx + rawDy * rawDy);
    if (mag > 0) {
      const travel = Math.min(mag * 0.08, 10);
      irisTx = (rawDx / mag) * travel;
      irisTy = (rawDy / mag) * travel;
    }
  }
 
  if (!shouldRender) return null;
 
  return (
    <div
      className={[
        'loader-container',
        isDark ? 'dark-mode' : 'light-mode',
        dissolving ? 'water-dissolve' : '',
      ].join(' ')}
    >
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
                  <div className="boy__hair" />
                  <div
                    ref={eyeRef}
                    className="boy__eyes"
                    style={{
                      '--iris-tx': `${irisTx}px`,
                      '--iris-ty': `${irisTy}px`,
                    }}
                  />
                  <div className="boy__mouth" />
                  <div className="boy__cheeks" />
                </div>
                <div className="noodle" />
                <div className="boy__leftArm">
                  <div className="chopsticks" />
                </div>
              </div>
              <div className="plate" />
              <div className="rightArm" />
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