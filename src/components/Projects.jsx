import React, { useEffect, useRef, useState } from 'react';
import '../styles/projects.css';
import { GithubCalendar } from './GithubCalendar';
import Portfolio from '../assets/portfolio-img.png'
import Dictionary from "../assets/dictionary-img.png"
import Coffee from "../assets/coffee-shop.png"
 
const CATEGORIES = [
  { id: 'software',    label: 'Software Engineering' },
  { id: 'graphic',     label: 'Graphic Design'        },
  { id: 'cad',         label: '3D & CAD Design'       },
  { id: 'electronics', label: 'Electronics'           },
];
 
// ─── Placeholder: drop real project cards here later ───────────────────────
const SOFTWARE_PROJECTS   = [
  {
    "id": 1,
    "title": "Portfolio",
    "image": `${Portfolio}`,
    "description": "A fully responsive personal portfolio built from scratch with React and Vite. Features a dark/light theme toggle with CSS variable-driven theming, intersection observer scroll animations, a live GitHub activity calendar, and a filterable projects section organized by discipline. Designed with a custom visual identity — including a liquid glass navigation bar, typographic watermarks, and fluid layouts."
  } ,
  {
    "id": 2,
    "title": "Simple Dictionary Website",
    "image": `${Dictionary}`,
    "description": "A sleek, responsive dictionary single-page application engineered with a clean, modular JavaScript architecture. Features real-time lexicon queries and asynchronous API integration for instantaneous word definition and phonetic retrieval, an optimized client-side search engine with dynamic input handling"
  } ,
  {
    "id": 3,
    "title": "Coffee Shop Page",
    "image": `${Coffee}`,
    "description": "A fully interactive React single-page application built from scratch with Vite and configured as a mock full-stack development environment. Features a local REST API powered by json-server for real-time CRUD operation simulation, a decoupled data layer mapping local JSON structures."
  }
];

const GRAPHIC_PROJECTS    = [];
const CAD_PROJECTS        = [];
const ELECTRONICS_PROJECTS = [];
 
const projectMap = {
  software:    SOFTWARE_PROJECTS,
  graphic:     GRAPHIC_PROJECTS,
  cad:         CAD_PROJECTS,
  electronics: ELECTRONICS_PROJECTS,
};
 
// Coming-soon card shown when a category has no projects yet
function ComingSoon({ category }) {
  return (
    <div className="coming-soon-card">
      <div className="coming-soon-shimmer" />
      <span className="coming-soon-icon" aria-hidden="true">◌</span>
      <p className="coming-soon-title">Coming soon</p>
      <p className="coming-soon-sub">
        {category.label} projects are on their way.
      </p>
    </div>
  );
}
 
export default function Projects({ isDark }) {
  const themeClass = isDark ? 'dark-mode' : 'light-mode';
 
  const sectionRef = useRef(null);
  const [isInView,      setIsInView]      = useState(false);
  const [activeTab,     setActiveTab]     = useState('software');
  const [animatingOut,  setAnimatingOut]  = useState(false);
  const [displayedTab,  setDisplayedTab]  = useState('software');
 
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);
 
  // Crossfade between panels
  function handleTabClick(id) {
    if (id === activeTab) return;
    setAnimatingOut(true);
    setTimeout(() => {
      setDisplayedTab(id);
      setActiveTab(id);
      setAnimatingOut(false);
    }, 180);
  }
 
  const projects       = projectMap[displayedTab] ?? [];
  const activeCategory = CATEGORIES.find(c => c.id === displayedTab);
 
  return (
    <section
      ref={sectionRef}
      className={`projects-section ${themeClass} ${isInView ? 'in-view' : ''}`}
      id="projects"
    >
      <h1 className="projects-watermark">Projects</h1>
 
      <div className="projects-intro">
        <p className="projects-label">What have I built?</p>
        <h2 className="projects-heading">
          Selected works displaying{' '}
          <span className="serif-word">creativity</span> in action.
        </h2>
        <div className="projects-divider" />
      </div>
 
      <div className="github-calendar">
        <GithubCalendar
          username="RobertTRL"
          isDark={isDark}
          colorSchema="green"
          shape="rounded"
        />
      </div>
 
      {/* ── Projects content ── */}
      <div className="projects-content">
 
        {/* ── Category nav ── */}
        <nav className="projects-tab-nav" aria-label="Project categories">
          <div className="projects-tab-track">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`projects-tab-btn ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => handleTabClick(cat.id)}
                aria-current={activeTab === cat.id ? 'true' : undefined}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="projects-tab-underline" />
        </nav>
 
        {/* ── Panel ── */}
        <div
          className={`projects-panel ${animatingOut ? 'panel-out' : 'panel-in'}`}
          key={displayedTab}
        >
          {projects.length === 0 ? (
            <ComingSoon category={activeCategory} />
          ) : (
            <div className="projects-grid">
              {projects.map((project, i) => (
                <div key={i} className="project-card-placeholder">{project.title}</div>
              ))}
            </div>
          )}
        </div>
 
      </div>
    </section>
  );
}