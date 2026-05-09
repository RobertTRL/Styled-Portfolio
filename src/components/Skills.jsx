import React, { useEffect, useRef, useState } from 'react';
import '../styles/skills.css';
import SkillsMarquee from './SkillsMarquee';
import InDesign from '../assets/Adobe-InDesign-Logo.png'
import Photoshop from '../assets/Adobe-Photoshop-Logo.png'
import Claude from '../assets/claude-logo.svg'
import Gemini from '../assets/Google-Gemini.png'
import CSS from '../assets/icons8-css-144.png'
import HTMLIMG from '../assets/icons8-html-144.png'
import JavascriptIcon from '../assets/icons8-javascript-100.png'
import ReactIcon from '../assets/icons8-react-100.png'
import Illustator from '../assets/Adobe_Illustrator_CC_icon.png'
import GitIcon from '../assets/icons8-git-144.png'
import PythonIcon from '../assets/icons8-python-100.png'

// ── Replace src values when ready ──────────────────────────────────────────
const SKILL_IMAGES = [
  { src: HTMLIMG, alt: 'HTML' },
  { src: CSS, alt: 'CSS' },
  { src: JavascriptIcon, alt: 'JavaScript' },
  { src: ReactIcon, alt: 'React' },
  { src: PythonIcon, alt: 'Python' },
  { src: Photoshop, alt: 'Photoshop' },
  { src: Illustator, alt: 'Illustrator' },
  { src: InDesign, alt: 'Indesign' },
  { src: GitIcon, alt: 'Git' },
  { src: Claude, alt: 'Claude' },
  { src: Gemini, alt: 'Gemini' },
];

// ── Fill in your own education entries ────────────────────────────────────
const EDUCATION = [
  {
    institution: 'Jomo Kenyatta University of Agriculture and Technology',
    degree: 'Bachelor of Science in Electrical and Electronics Engineering',
    period: '2026 – 2030',
    description: 'Add a short summary of your studies, focus areas, or notable achievements here.',
  },
];

// ── Fill in your certifications ───────────────────────────────────────────
const CERTIFICATIONS = [
  {
    name: 'Software Engineering',
    issuer: 'Moringa School',
    year: '2026',
  },
  {
    name: 'Graphic Design MasterClass',
    issuer: 'Udemy.com',
    year: '2026',
  },
];

export default function Skills({ isDark }) {
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
      /* 3. Conditionally apply the in-view class */
      className={`skills-section ${themeClass} ${isInView ? 'in-view' : ''}`} 
      id="skills"
    >

      {/* ── Watermark ── */}
      <h1 className="skills-watermark">Skills</h1>

      {/* ── Intro ── */}
      <div className="skills-intro">
        <p className="skills-label">What do i work with?</p>
        <h2 className="skills-heading">
          Tools used to build{' '}
          <span className="serif-word">great</span> things.
        </h2>
        <div className="skills-divider" />
      </div>
      <SkillsMarquee images={SKILL_IMAGES} />
      <div className="skills-content">

        <div className="edu-cert-grid">
          <div className="edu-cert-col">
            <h3 className="col-heading">
            Education
            </h3>
            {EDUCATION.map((item, i) => (
              <div className="card" key={i}>
                <div className="card-top">
                  <span className="card-title">{item.degree}</span>
                  <span className="card-period">{item.period}</span>
                </div>
                <p className="card-sub">{item.institution}</p>
                {item.description && (
                  <p className="card-desc">{item.description}</p>
                )}
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="edu-cert-col">
            <h3 className="col-heading">
              Certifications
            </h3>
            {CERTIFICATIONS.map((item, i) => (
              <div className="card" key={i}>
                <div className="card-top">
                  <span className="card-title">{item.name}</span>
                  <span className="card-period">{item.year}</span>
                </div>
                <p className="card-sub">{item.issuer}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}