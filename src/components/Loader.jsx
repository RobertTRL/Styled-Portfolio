import React, { useState, useEffect } from 'react';
import '../styles/loader.css';
 
const Loader = ({ isDark, isLoading }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [dissolving,   setDissolving]   = useState(false);
 
  useEffect(() => {
    if (!isLoading) {
      const dissolveTimer = setTimeout(() => setDissolving(true), 0);
      const unmountTimer  = setTimeout(() => setShouldRender(false), 1500);
      return () => {
        clearTimeout(dissolveTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [isLoading]);
 
  if (!shouldRender) return null;
 
  return (
    <div
      className={`loader-container ${isDark ? 'dark-mode' : 'light-mode'} ${dissolving ? 'water-dissolve' : ''}`}
    >
      <div className="loader-pattern" />
      <div className="loader-overlay" />
    </div>
  );
};
 
export default Loader;