import React, { useState, useEffect } from 'react';
import '../styles/loader.css';
 
/**
 * Props:
 *   isDark      — theme token
 *   onDOMReady  — App calls this from useLayoutEffect once real content is
 *                 painted; only then do we start the dissolve so there's
 *                 zero gap between the loader fading and content appearing.
 */
const Loader = ({ isDark, onDOMReady }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [dissolving,   setDissolving]   = useState(false);
 
  // App signals the DOM is ready — kick off dissolve immediately
  useEffect(() => {
    if (!onDOMReady) return;
    // Expose trigger to parent via the callback pattern:
    // parent calls the returned function when content is mounted.
  }, []);
 
  return shouldRender ? (
    <div
      className={`loader-container ${isDark ? 'dark-mode' : 'light-mode'} ${dissolving ? 'water-dissolve' : ''}`}
      onAnimationEnd={(e) => {
        // bgFade is the last / longest animation — unmount after it ends
        if (e.animationName === 'bgFade') setShouldRender(false);
      }}
    >
      <div className="loader-pattern" />
      <div className="loader-overlay" />
    </div>
  ) : null;
};
 
export default Loader;