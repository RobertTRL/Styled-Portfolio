import { useState, useEffect } from 'react';
import Header from './components/Header';
import Background from './components/background';
import './App.css';
import './styles/bgandswitch.css';
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import AboutMe from './components/AboutMe.jsx'
import Skills from './components/Skills.jsx'
import Contacts from './components/Contacts.jsx';

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const [isPreload, setIsPreload] = useState(true);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) setIsDark(true);

    const timeoutId = setTimeout(() => setIsPreload(false), 50);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleToggle = () => {
    console.log("Toggle clicked! Current mode:", isDark ? "Night" : "Day");
    setIsDark(prevDark => !prevDark);
  };

  return (
    <div className={`app-wrapper ${isPreload ? 'preload' : ''} ${isDark ? 'night' : ''}`}>
      <Background/>
      <div className='items' >
          <Header isDark={isDark} onToggle={handleToggle} />
          <Hero isDark={isDark}/>
          <AboutMe isDark={isDark}/>
          <Skills isDark={isDark}/>
          <Contacts isDark={isDark}/>
          <Navbar isDark={isDark}/>
      </div>
      
    </div>
  );
};

export default App;