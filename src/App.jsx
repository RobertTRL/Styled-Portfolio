import { useState, useEffect } from 'react';
import Header from './components/Header';
import Background from './components/Background.jsx';
import './App.css';
import './styles/bgandswitch.css';
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import AboutMe from './components/AboutMe.jsx'
import Skills from './components/Skills.jsx'
import Contacts from './components/Contacts.jsx';
import Loader from './components/Loader.jsx';
import GreetingBoy from './components/GreetingBoy.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Projects from './components/Projects.jsx';
// import { Analytics } from '@vercel/analytics/react'
// import { SpeedInsights } from "@vercel/speed-insights/react"

const App = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('isDark');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isPreload, setIsPreload] = useState(true);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsPreload(false), 50);
    const loadId = setTimeout(() => setIsLoading(false), 5500);
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(loadId)
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('isDark', JSON.stringify(isDark));
  }, [isDark]);

  const handleToggle = () => {
    setIsDark(prev => !prev);
  };

  return (
    <div className={`app-wrapper ${isPreload ? 'preload' : ''} ${isDark ? 'night' : ''}`}>
      <CustomCursor isDark={isDark}/>
      <Loader isDark={isDark} isLoading={isLoading} />
      <Background />
      <div className='items'>
        <Header isDark={isDark} onToggle={handleToggle} />
        <GreetingBoy/>
        <Hero isDark={isDark} />
        <AboutMe isDark={isDark} />
        <Skills isDark={isDark} />
        <Contacts isDark={isDark} />
        <Projects isDark={isDark} />
        <Navbar isDark={isDark} />
      </div>
      {/* <Analytics />
      <SpeedInsights /> */}
    </div>
  );
};

export default App;