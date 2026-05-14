import React, { useEffect, useState } from 'react';
import '../styles/loader.css';

const LETTERS = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'];
const TREES = Array.from({ length: 7 }, (_, index) => index + 1);
const FIRE_LINES = Array.from({ length: 3 }, (_, index) => index + 1);
const FIRE_PARTICLES = Array.from({ length: 4 }, (_, index) => index + 1);
const STARS = Array.from({ length: 7 }, (_, index) => index + 1);

const Loader = ({ isDark = true, isLoading = true }) => {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      return undefined;
    }

    const timer = setTimeout(() => setShouldRender(false), 1500);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div
      className={`loader-container ${isDark ? 'dark-mode' : 'light-mode'} ${!isLoading ? 'water-dissolve' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy={isLoading}
    >
      <div className="loader-aurora" />
      <div className="loader-pattern" />
      <div className="loader-grain" />
      <div className="loader-overlay" />

      <div className="content-container">
        <div className="camp-loader-layout">
          <div className="camp-scene-animator">
            <div className="camp-scene">
              <div className="camp-backdrop">
                <div className="camp-ridge camp-ridge-back" />
                <div className="camp-ridge camp-ridge-front" />
              </div>

              <div className="camp-time-wrapper">
                <div className="camp-time">
                  <div className="camp-day" />
                  <div className="camp-night">
                    <div className="camp-moon" />
                    {STARS.map((star) => (
                      <div
                        key={star}
                        className={`camp-star camp-star${star} ${star <= 3 ? 'camp-star-big' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="camp-forest">
                {TREES.map((tree) => (
                  <div key={tree} className={`camp-tree camp-tree${tree}`}>
                    <div className="camp-branch camp-branch-top" />
                    <div className="camp-branch camp-branch-middle" />
                    <div className="camp-branch camp-branch-bottom" />
                  </div>
                ))}
              </div>

              <div className="camp-tent">
                <div className="camp-roof" />
                <div className="camp-roof-border-left">
                  <div className="camp-roof-border camp-roof-border1" />
                  <div className="camp-roof-border camp-roof-border2" />
                  <div className="camp-roof-border camp-roof-border3" />
                </div>
                <div className="camp-entrance">
                  <div className="camp-door camp-left-door">
                    <div className="camp-left-door-inner" />
                  </div>
                  <div className="camp-door camp-right-door">
                    <div className="camp-right-door-inner" />
                  </div>
                </div>
              </div>

              <div className="camp-floor">
                <div className="camp-ground camp-ground1" />
                <div className="camp-ground camp-ground2" />
              </div>

              <div className="camp-fireplace">
                <div className="camp-support" />
                <div className="camp-support" />
                <div className="camp-bar" />
                <div className="camp-hanger" />
                <div className="camp-smoke" />
                <div className="camp-pan" />
                <div className="camp-fire">
                  {FIRE_LINES.map((line) => (
                    <div key={line} className={`camp-line camp-line${line}`}>
                      {FIRE_PARTICLES.map((particle) => (
                        <div
                          key={particle}
                          className={`camp-particle camp-particle${particle}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="loader-wrapper">
            <span className="loader-sr-only">Loading</span>
            <div className="loader-letters" aria-hidden="true">
              {LETTERS.map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  className="loader-letter"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {char}
                </span>
              ))}
            </div>
            <div className="loader-progress" aria-hidden="true">
              <div className="loader-progress-beam" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
