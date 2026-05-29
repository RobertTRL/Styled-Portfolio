import { lazy, Suspense, useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero.jsx';
import './App.css';
import './styles/bgandswitch.css';

// Keep lazy() for code-splitting, but we'll pre-warm them manually
const AboutMe      = lazy(() => import('./components/AboutMe.jsx'));
const Background   = lazy(() => import('./components/Background.jsx'));
const Contacts     = lazy(() => import('./components/Contacts.jsx'));
const CustomCursor = lazy(() => import('./components/CustomCursor.jsx'));
const GreetingBoy  = lazy(() => import('./components/GreetingBoy.jsx'));
const Navbar       = lazy(() => import('./components/Navbar.jsx'));
const Projects     = lazy(() => import('./components/Projects.jsx'));
const Skills       = lazy(() => import('./components/Skills.jsx'));
const Analytics    = lazy(() =>
  import('@vercel/analytics/react').then(m => ({ default: m.Analytics }))
);
const SpeedInsights = lazy(() =>
  import('@vercel/speed-insights/react').then(m => ({ default: m.SpeedInsights }))
);

const preloadAll = () =>
  Promise.all([
    import('./components/Background.jsx'),
    import('./components/AboutMe.jsx'),
    import('./components/Contacts.jsx'),
    import('./components/CustomCursor.jsx'),
    import('./components/GreetingBoy.jsx'),
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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Remove preload class after first paint to re-enable transitions
    const t = setTimeout(() => setIsPreload(false), 50);

    // Fetch all lazy chunks in parallel; mount everything once all resolve
    preloadAll().then(() => setIsReady(true));

    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem('isDark', JSON.stringify(isDark));
  }, [isDark]);

  return (
    <div className={`app-wrapper ${isPreload ? 'preload' : ''} ${isDark ? 'night' : ''}`}>
      <Suspense fallback={null}>
        {isReady && <CustomCursor isDark={isDark} />}
        {isReady && <Background />}
      </Suspense>

      {/* Header & Hero are not lazy — always render immediately */}
      <Header isDark={isDark} onToggle={() => setIsDark(p => !p)} />

      <main className="items" id="content">
        <Suspense fallback={null}>
          {isReady && <GreetingBoy />}
        </Suspense>

        <Hero isDark={isDark} />

        <Suspense fallback={null}>
          {isReady && (
            <>
              <AboutMe    isDark={isDark} />
              <Skills     isDark={isDark} />
              <Contacts   isDark={isDark} />
              <Projects   isDark={isDark} />
            </>
          )}
        </Suspense>
      </main>

      <Suspense fallback={null}>
        {isReady && <Navbar isDark={isDark} />}
        {isReady && <Analytics />}
        {isReady && <SpeedInsights />}
      </Suspense>
    </div>
  );
};

export default App;