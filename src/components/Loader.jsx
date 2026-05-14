import React, { useState, useEffect, useRef } from 'react';
import '../styles/loader.css';

const LETTERS = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'];

const Loader = ({ isDark, isLoading }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [scale, setScale] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const eyeRef = useRef(null);

  // Responsive scaling logic
  useEffect(() => {
    const handleResize = () => {
      const scaleX = (window.innerWidth * 0.95) / 800;
      const scaleY = (window.innerHeight * 0.8) / 600; 
      
      const calculatedScale = Math.min(scaleX, scaleY);
      setScale(Math.max(0.6, Math.min(calculatedScale, 2.5)));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShouldRender(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Track the mouse to set state dynamically
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Compute just the X/Y translation offset for the iris
  let irisTx = 0; 
  let irisTy = 0;

  if (eyeRef.current) {
    const rect = eyeRef.current.getBoundingClientRect();
    
    // .boy__eyes block contains the left eye (at 0) and right eye (at 60px).
    // The "center" of the face/eyeline block is roughly left + 62 scaled pixels.
    const faceCenterX = rect.left + (62 * scale); 
    const faceCenterY = rect.top + (32 * scale);
    
    const rawDx = mousePos.x - faceCenterX;
    const rawDy = mousePos.y - faceCenterY;
    const mag = Math.sqrt(rawDx * rawDx + rawDy * rawDy);

    // Limit radius the iris can slide inside the eye
    const limitPx = 10; 
    
    if (mag > 0) {
      let targetMag = mag * 0.08; 
      if (targetMag > limitPx) {
         targetMag = limitPx;
      }
      
      irisTx = (rawDx / mag) * targetMag;
      irisTy = (rawDy / mag) * targetMag;
    }
  }

  if (!shouldRender) return null;

  return (
    <div className={`loader-container ${isDark ? 'dark-mode' : 'light-mode'} ${!isLoading ? 'water-dissolve' : ''}`}>
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
                  
                  {/* CSS Variables drive the background-position of ::before and ::after pseudo-elements */}
                  <div 
                    ref={eyeRef}
                    className="boy__eyes"
                    style={{
                      '--iris-tx': `${irisTx}px`,
                      '--iris-ty': `${irisTy}px`
                    }}
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

          {/* ── Letters ── */}
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