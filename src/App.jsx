import { lazy, Suspense, useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero.jsx';
import GreetingBoy from './components/GreetingBoy.jsx';
import Loader from './components/Loader.jsx';

import './App.css';
import './styles/bgandswitch.css';

const AboutMe = lazy(() => import('./components/AboutMe.jsx'));
const Background = lazy(() => import('./components/Background.jsx'));
const Contacts = lazy(() => import('./components/Contacts.jsx'));
const CustomCursor = lazy(() => import('./components/CustomCursor.jsx'));
const Navbar = lazy(() => import('./components/Navbar.jsx'));
const Projects = lazy(() => import('./components/Projects.jsx'));
const Skills = lazy(() => import('./components/Skills.jsx'));

const Analytics = lazy(() =>
  import('@vercel/analytics/react').then(m => ({
    default: m.Analytics,
  }))
);

const SpeedInsights = lazy(() =>
  import('@vercel/speed-insights/react').then(m => ({
    default: m.SpeedInsights,
  }))
);

const preloadAll = () =>
  Promise.all([
    import('./components/Background.jsx'),
    import('./components/AboutMe.jsx'),
    import('./components/Contacts.jsx'),
    import('./components/CustomCursor.jsx'),
    import('./components/Navbar.jsx'),
    import('./components/Projects.jsx'),
    import('./components/Skills.jsx'),
    import('@vercel/analytics/react'),
    import('@vercel/speed-insights/react'),
  ]);

const App = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('isDark');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isPreload, setIsPreload] = useState(true);
  const [isReady,   setIsReady]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsPreload(false), 50);
    preloadAll().then(() => setIsReady(true));
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem('isDark', JSON.stringify(isDark));
  }, [isDark]);

  return (
    <div className={`app-wrapper ${isPreload ? 'preload' : ''} ${isDark ? 'night' : ''}`}>

      <Loader isDark={isDark} isLoading={!isReady} />

      {isReady && (
        <Suspense fallback={null}>
          <GreetingBoy isDark={isDark} isLoading={!isReady} />

          <CustomCursor isDark={isDark} />
          <Background />

          <Header
            isDark={isDark}
            onToggle={() => setIsDark(p => !p)}
          />

          <main className="items" id="content">
            <Hero isDark={isDark} />
            <AboutMe isDark={isDark} />
            <Skills isDark={isDark} />
            <Contacts isDark={isDark} />
            <Projects isDark={isDark} />
          </main>

          <Navbar isDark={isDark} />

          <Analytics />
          <SpeedInsights />
        </Suspense>
      )}
    </div>
  );
};

export default App;