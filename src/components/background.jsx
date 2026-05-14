import React from 'react';

const Background = () => {
  return (
    <div className="scene">
      <div className="sky-master-container">
        <div className="sky-master-gradient"></div>
      </div>

      <div className="stars-layer">
        <div className="stars stars-1"></div>
        <div className="stars stars-2"></div>
        <div className="stars stars-3"></div>
        <div className="meteor m1"></div>
        <div className="meteor m2"></div>
        <div className="meteor m3"></div>
      </div>

      <div className="moon-wrapper">
        <div className="moon"></div>
      </div>

      <div className="sun-wrapper">
        <div className="sun"></div>
      </div>

      {/* --- NEW: Daytime Elements --- */}
      <div className="day-elements-container">
        <div className="hot-air-balloon pos-balloon">
          <div className="bob">
            <div className="balloon-envelope"></div>
            <div className="balloon-ropes"></div>
            <div className="balloon-basket"></div>
          </div>
        </div>
      </div>

      {/* --- NEW: Nighttime Elements --- */}
      <div className="night-elements-container">
        
        {/* Refactored Satellite */}
        <div className="satellite pos-satellite">
          <div className="float-rotate sat-tilt">
            
            {/* Left Wing (3 segments) */}
            <div className="sat-wing left">
              <div className="sat-panel"></div>
              <div className="sat-panel"></div>
              <div className="sat-panel"></div>
            </div>

            {/* Left Connecting Arm */}
            <div className="sat-arm"></div>

            {/* Central Core & Dishes */}
            <div className="sat-core">
              {/* Top Mini Antennae */}
              <div className="sat-mini top-left"></div>
              <div className="sat-mini top-right"></div>
              
              {/* Core Surface Detail */}
              <div className="sat-core-details"></div>

              {/* Main Forward-Facing Dish */}
              <div className="sat-dish">
                <div className="sat-dish-inner">
                  <div className="sat-dish-spike"></div>
                </div>
              </div>
            </div>

            {/* Right Connecting Arm */}
            <div className="sat-arm"></div>

            {/* Right Wing (3 segments) */}
            <div className="sat-wing right">
              <div className="sat-panel"></div>
              <div className="sat-panel"></div>
              <div className="sat-panel"></div>
            </div>

          </div>
        </div>

      </div>

      <div className="clouds-container">
        <div className="cloud cloud-1"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div><div className="puff p4"></div></div>
        <div className="cloud cloud-2"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div><div className="puff p4"></div></div>
        <div className="cloud cloud-3"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div><div className="puff p4"></div></div>
        <div className="cloud cloud-4"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div><div className="puff p4"></div></div>
        <div className="cloud cloud-5"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div><div className="puff p4"></div></div>
        <div className="cloud cloud-6"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div><div className="puff p4"></div></div>
        <div className="cloud cloud-h1"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div></div>
        <div className="cloud cloud-h2"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div></div>
        <div className="cloud cloud-h3"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div></div>
        <div className="cloud cloud-h4"><div className="puff p1"></div><div className="puff p2"></div><div className="puff p3"></div></div>
      </div>
    </div>
  );
};

export default Background;