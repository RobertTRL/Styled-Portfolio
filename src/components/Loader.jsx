import React, { useState, useEffect } from 'react';
import '../styles/loader.css';

const LETTERS = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'];

const Loader = ({ isDark, isLoading }) => {
  const [shouldRender, setShouldRender] = useState(true);

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

          {/* Animator wrapper handles the exit animation and responsive sizing */}
          <div className="scene-animator">
            <div className="noodle-scene">
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