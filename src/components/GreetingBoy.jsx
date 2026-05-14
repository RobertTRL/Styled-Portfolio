import React from 'react';
import '../styles/greetingboy.css';

const GreetingBoy = ({ greeting = "Hello there!" }) => {
  return (
    
    <div className="greeting-container">
      {/* Dynamic greeting bubble */}
      <div className="speech-bubble">
        {greeting}
      </div>

      <div className="boy-simple">
        <div className="boy__head-simple">
          <div className="boy__hair-simple"></div>
          <div className="boy__eyes-simple"></div>
          <div className="boy__smile"></div>
          <div className="boy__cheeks-simple"></div>
        </div>
        <div className="boy__arm-wave"></div>
      </div>
    </div>
    
  );
};

export default GreetingBoy;