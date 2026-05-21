import React, { useState, useEffect } from 'react';
import '../styles/greetingboy.css';
 
const GreetingBoy = ({ greeting = "Hello!" }) => {
  const [mood, setMood] = useState('happy');
 
  useEffect(() => {
    const timer = setTimeout(() => {
      setMood('bored');
    }, 22000);
 
    return () => clearTimeout(timer);
  }, [mood]);
 
  const goHappy = () => setMood('happy');
 
  return (
    <div
      className="greeting-container"
      onMouseEnter={goHappy}
      onClick={goHappy}
    >
      <div className={`speech-bubble ${mood === 'happy' ? 'show' : ''}`}>
        {greeting}
      </div>
 
      <div className={`boy-simple ${mood}`}>
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