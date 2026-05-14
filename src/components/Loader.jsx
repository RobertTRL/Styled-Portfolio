import React, { useState, useEffect } from 'react';
import '../styles/loader.css';

const LETTERS = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'];

const Loader = ({ isDark, isLoading }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [scale, setScale] = useState(1);

  // Responsive scaling logic
  useEffect(() => {
    const handleResize = () => {
      // Calculate how much we can scale the 800x600 scene based on viewport
      // We take up to 95% of the width and 60% of the height (leaving room for text)
      const scaleX = (window.innerWidth * 0.95) / 800;
      const scaleY = (window.innerHeight * 0.6) / 600;
      
      // Choose the smaller scale to ensure it fits, capped between 0.4 and 1.5
      const calculatedScale = Math.min(scaleX, scaleY);
      setScale(Math.max(0.4, Math.min(calculatedScale, 1.5)));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // 1.5s timer perfectly fits the 1.4s hyperdrive bgFade animation
      const timer = setTimeout(() => setShouldRender(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div className={`loader-container ${isDark ? 'dark-mode' : 'light-mode'} ${!isLoading ? 'water-dissolve' : ''}`}>
      <div className="loader-pattern" />
      <div className="loader-overlay" />

      <div className="content-container">
        <div className="camp-loader-layout">

          {/* Animator wrapper sizes itself dynamically based on the scaled scene to maintain document flow */}
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
                  <div className="boy__eyes"></div>
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

          {/* ── Letters + progress ── */}
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
            <div className="loader-progress">
              <div className="loader-progress-beam" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Loader;