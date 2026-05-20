import React, { useEffect, useRef, useState } from 'react';
import '../styles/projects.css';
import { GithubCalendar } from './GithubCalendar';

export default function Projects({ isDark }) {
  const themeClass = isDark ? 'dark-mode' : 'light-mode';
  
  // 1. Create a reference to the section and a state for visibility
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  // 2. Set up the IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Sets to true when at least 30% of the section is visible
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.3, 
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`projects-section ${themeClass} ${isInView ? 'in-view' : ''}`} 
      id="projects"
    >
      {/* ── Watermark ── */}
      <h1 className="projects-watermark">Projects</h1>

      {/* ── Intro ── */}
      <div className="projects-intro">
        <p className="projects-label">What have I built?</p>
        <h2 className="projects-heading">
          Selected works displaying{' '}
          <span className="serif-word">creativity</span> in action.
        </h2>
        <div className="projects-divider" />
      </div>

      {/* ── Projects Content Placeholder ── */}
      <div className="projects-content">
        {<GithubCalendar username="RobertTRL" colorSchema="green" shape="rounded"/>}
      </div>

    </section>
  );
}