import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero.jsx';
import GreetingBoy from './components/GreetingBoy.jsx';
import Loader from './components/Loader.jsx';

import './App.css';
import './styles/bgandswitch.css';

const AboutMe     = lazy(() => import('./components/AboutMe.jsx'));
const Background  = lazy(() => import('./components/Background.jsx'));
const Contacts    = lazy(() => import('./components/Contacts.jsx'));
const CustomCursor = lazy(() => import('./components/CustomCursor.jsx'));
const Navbar      = lazy(() => import('./components/Navbar.jsx'));
const Projects    = lazy(() => import('./components/Projects.jsx'));
const Skills      = lazy(() => import('./components/Skills.jsx'));

const Analytics = lazy(() =>
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
    import('./components/Navbar.jsx'),
    import('./components/Projects.jsx'),
    import('./components/Skills.jsx'),
    import('@vercel/analytics/react'),
    import('@vercel/speed-insights/react'),
  ]);

// ─── Inner shell rendered once isReady is true ───────────────────────────────
// Isolated so its useLayoutEffect fires right when *this* tree commits to DOM.
const AppContent = ({ isDark, onToggle, onDOMCommitted }) => {
  useLayoutEffect(() => {
    // Runs synchronously after DOM commit, before browser paint.
    // Telling the loader to dissolve here means the browser composites
    // the loader fade-out and the new content in the same frame — no white gap.
    onDOMCommitted();
  }, []);

  return (
    <Suspense fallback={null}>
      <GreetingBoy isDark={isDark} isLoading={false} />
      <CustomCursor isDark={isDark} />
      <Background />
      <Header isDark={isDark} onToggle={onToggle} />
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
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
const App = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('isDark');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isPreload,  setIsPreload]  = useState(true);
  const [isReady,    setIsReady]    = useState(false);
  const [dissolve,   setDissolve]   = useState(false);
  const [showLoader, setShowLoader] = useState(true);

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

      {/* Loader is always rendered until it fully fades out itself */}
      {showLoader && (
        <div
          className={`loader-container ${isDark ? 'dark-mode' : 'light-mode'} ${dissolve ? 'water-dissolve' : ''}`}
          style={{ pointerEvents: dissolve ? 'none' : 'all' }}
          onAnimationEnd={(e) => {
            if (e.animationName === 'bgFade') setShowLoader(false);
          }}
        >
          <div className="loader-pattern" />
          <div className="loader-overlay" />
        </div>
      )}

      {/* AppContent mounts when all chunks are loaded.
          Its useLayoutEffect fires before the browser paints,
          triggering the dissolve at the exact frame content is committed. */}
      {isReady && (
        <AppContent
          isDark={isDark}
          onToggle={() => setIsDark(p => !p)}
          onDOMCommitted={() => setDissolve(true)}
        />
      )}

    </div>
  );
};

export default App;