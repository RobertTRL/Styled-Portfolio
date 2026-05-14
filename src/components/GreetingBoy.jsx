import React, { useState, useEffect, use } from 'react';
import '../styles/greetingboy.css';

const GreetingBoy = ({ greeting = "Hello!" }) => {
  const [mood, setMood] = useState('happy');
  const [trigger, setTrigger] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMood('bored');
    }, 22000);

    return () => clearTimeout(timer);
  }, [mood]);

  return (
    <div 
      className="greeting-container" 
      onMouseEnter={() => setMood('happy')}
    >
      {/* Bubble only shows if happy */}
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