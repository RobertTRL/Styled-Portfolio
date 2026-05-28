import { lazy, Suspense, useEffect, useState } from 'react';
import Header from './components/Header';
import './App.css';
import './styles/bgandswitch.css';
import Hero from './components/Hero.jsx'

const AboutMe = lazy(() => import('./components/AboutMe.jsx'));
const Background = lazy(() => import('./components/Background.jsx'));
const Contacts = lazy(() => import('./components/Contacts.jsx'));
const CustomCursor = lazy(() => import('./components/CustomCursor.jsx'));
const GreetingBoy = lazy(() => import('./components/GreetingBoy.jsx'));
const Navbar = lazy(() => import('./components/Navbar.jsx'));
const Projects = lazy(() => import('./components/Projects.jsx'));
const Skills = lazy(() => import('./components/Skills.jsx'));
const Analytics = lazy(() =>
  import('@vercel/analytics/react').then((module) => ({ default: module.Analytics }))
);
const SpeedInsights = lazy(() =>
  import('@vercel/speed-insights/react').then((module) => ({ default: module.SpeedInsights }))
);

function scheduleIdle(callback, delay = 0, timeout = 1500) {
  let idleId;
  const timeoutId = window.setTimeout(() => {
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(callback, { timeout });
    } else {
      idleId = window.setTimeout(callback, 0);
    }
  }, delay);

  return () => {
    window.clearTimeout(timeoutId);
    if (idleId === undefined) return;
    if ('cancelIdleCallback' in window) {
      window.cancelIdleCallback(idleId);
    } else {
      window.clearTimeout(idleId);
    }
  };
}

const App = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('isDark');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isPreload, setIsPreload] = useState(true);
  const [showBackground, setShowBackground] = useState(false);
  const [showBelowFold, setShowBelowFold] = useState(false);
  const [showEnhancements, setShowEnhancements] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsPreload(false), 50);
    const cancelBackground = scheduleIdle(() => setShowBackground(true), 250);
    const cancelBelowFold = scheduleIdle(() => setShowBelowFold(true), 600);
    const cancelEnhancements = scheduleIdle(() => setShowEnhancements(true), 900);
    const cancelAnalytics = scheduleIdle(() => setShowAnalytics(true), 2500, 3000);

    return () => {
      clearTimeout(timeoutId);
      cancelBackground();
      cancelBelowFold();
      cancelEnhancements();
      cancelAnalytics();
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
      <Suspense fallback={null}>
        {showEnhancements && <CustomCursor isDark={isDark} />}
        {showBackground && <Background />}
      </Suspense>

      <Header isDark={isDark} onToggle={handleToggle} />

      <main className="items" id="content">
        <Suspense fallback={null}>
          {showEnhancements && <GreetingBoy />}
        </Suspense>
        <Hero isDark={isDark} />

        <Suspense fallback={null}>
          {showBelowFold && (
            <>
              <AboutMe isDark={isDark} />
              <Skills isDark={isDark} />
              <Contacts isDark={isDark} />
              <Projects isDark={isDark} />
            </>
          )}
        </Suspense>
      </main>

      <Suspense fallback={null}>
        {showEnhancements && <Navbar isDark={isDark} />}
        {showAnalytics && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </Suspense>
    </div>
  );
};


export default App;