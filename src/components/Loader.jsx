import React, { useState, useEffect } from "react";
import "../styles/loader.css";

const LETTERS = ["L", "o", "a", "d", "i", "n", "g", ".", ".", "."];

const Loader = ({ isDark, isLoading }) => {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShouldRender(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div
      className={`loader-container ${isDark ? "dark-mode" : "light-mode"} ${
        !isLoading ? "water-dissolve" : ""
      }`}
    >
      {/* Cinematic gradient glow */}
      <div className="loader-aurora" />

      {/* Moving background pattern */}
      <div className="loader-pattern" />

      {/* Frosted glass overlay */}
      <div className="loader-overlay" />

      <div className="content-container">
        <div className="camp-loader-layout">
          {/* Scene Animator Wrapper */}
          <div className="camp-scene-animator">
            <div className="camp-scene">
              <div className="camp-forest">
                <div className="camp-tree camp-tree1">
                  <div className="camp-branch camp-branch-top"></div>
                  <div className="camp-branch camp-branch-middle"></div>
                </div>
                <div className="camp-tree camp-tree2">
                  <div className="camp-branch camp-branch-top"></div>
                  <div className="camp-branch camp-branch-middle"></div>
                  <div className="camp-branch camp-branch-bottom"></div>
                </div>
                <div className="camp-tree camp-tree3">
                  <div className="camp-branch camp-branch-top"></div>
                  <div className="camp-branch camp-branch-middle"></div>
                  <div className="camp-branch camp-branch-bottom"></div>
                </div>
                <div className="camp-tree camp-tree4">
                  <div className="camp-branch camp-branch-top"></div>
                  <div className="camp-branch camp-branch-middle"></div>
                  <div className="camp-branch camp-branch-bottom"></div>
                </div>
                <div className="camp-tree camp-tree5">
                  <div className="camp-branch camp-branch-top"></div>
                  <div className="camp-branch camp-branch-middle"></div>
                  <div className="camp-branch camp-branch-bottom"></div>
                </div>
                <div className="camp-tree camp-tree6">
                  <div className="camp-branch camp-branch-top"></div>
                  <div className="camp-branch camp-branch-middle"></div>
                  <div className="camp-branch camp-branch-bottom"></div>
                </div>
                <div className="camp-tree camp-tree7">
                  <div className="camp-branch camp-branch-top"></div>
                  <div className="camp-branch camp-branch-middle"></div>
                  <div className="camp-branch camp-branch-bottom"></div>
                </div>
              </div>

              <div className="camp-tent">
                <div className="camp-roof"></div>
                <div className="camp-roof-border-left">
                  <div className="camp-roof-border camp-roof-border1"></div>
                  <div className="camp-roof-border camp-roof-border2"></div>
                  <div className="camp-roof-border camp-roof-border3"></div>
                </div>

                <div className="camp-entrance">
                  <div className="camp-door camp-left-door">
                    <div className="camp-left-door-inner"></div>
                  </div>
                  <div className="camp-door camp-right-door">
                    <div className="camp-right-door-inner"></div>
                  </div>
                </div>
              </div>

              <div className="camp-floor">
                <div className="camp-ground camp-ground1"></div>
                <div className="camp-ground camp-ground2"></div>
              </div>

              <div className="camp-fireplace">
                <div className="camp-support"></div>
                <div className="camp-support"></div>
                <div className="camp-bar"></div>
                <div className="camp-hanger"></div>
                <div className="camp-smoke"></div>
                <div className="camp-pan"></div>

                <div className="camp-fire">
                  <div className="camp-line camp-line1">
                    <div className="camp-particle camp-particle1"></div>
                    <div className="camp-particle camp-particle2"></div>
                    <div className="camp-particle camp-particle3"></div>
                    <div className="camp-particle camp-particle4"></div>
                  </div>
                  <div className="camp-line camp-line2">
                    <div className="camp-particle camp-particle1"></div>
                    <div className="camp-particle camp-particle2"></div>
                    <div className="camp-particle camp-particle3"></div>
                    <div className="camp-particle camp-particle4"></div>
                  </div>
                  <div className="camp-line camp-line3">
                    <div className="camp-particle camp-particle1"></div>
                    <div className="camp-particle camp-particle2"></div>
                    <div className="camp-particle camp-particle3"></div>
                    <div className="camp-particle camp-particle4"></div>
                  </div>
                </div>
              </div>

              <div className="camp-time-wrapper">
                <div className="camp-time">
                  <div className="camp-day"></div>
                  <div className="camp-night">
                    <div className="camp-moon"></div>
                    <div className="camp-star camp-star1 camp-star-big"></div>
                    <div className="camp-star camp-star2 camp-star-big"></div>
                    <div className="camp-star camp-star3 camp-star-big"></div>
                    <div className="camp-star camp-star4"></div>
                    <div className="camp-star camp-star5"></div>
                    <div className="camp-star camp-star6"></div>
                    <div className="camp-star camp-star7"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Letters + progress */}
          <div className="loader-wrapper">
            <div className="loader-letters" aria-label="Loading">
              {LETTERS.map((char, i) => (
                <span
                  key={i}
                  className="loader-letter"
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  {char}
                </span>
              ))}
            </div>

            <div className="loader-progress">
              <div className="loader-progress-beam" />
              <div className="loader-progress-glow" />
            </div>

            <div className="loader-subtext">
              Preparing your experience...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;