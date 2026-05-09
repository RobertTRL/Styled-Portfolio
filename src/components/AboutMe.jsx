import React, { useEffect, useRef, useState } from 'react';
import '../styles/about.css';
import smilingEmoji from '../assets/smiling-emoji.png';
import wavingHandSign from '../assets/waving-hand-sign.png';

export default function AboutMe({ isDark }) {
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
      className={`about-section ${themeClass} ${isInView ? 'in-view' : ''}`} 
      id="about"
    >
      <div className="about-inner">
        <h1 className="about-watermark">About <br />Me</h1>

        <div className="about-content">
          <p className="about-label">Who am i?</p>

          <h2 className="about-heading">
            A developer who<br />
            cares about <span className="serif-word">craft.</span>
          </h2>

          <div className="about-divider" />

          <div className="about-greeting">
            Hello<span className="emoji-group"><img src={smilingEmoji} alt="Smiling" /><img src={wavingHandSign} alt="Waving" />
            </span>
          </div>

          <p className="about-text">
            I'm <span className="highlight name">Robert Toroitich</span>, a{' '}
            <span className="highlight role">Full-Stack Software Engineer</span> and{' '}
            <span className="highlight role">Graphic Designer</span>. I especially
            focus on building detailed, pragmatic and{' '}
            <span className="highlight exp">immersive web experiences</span>.
            Walk with me as I turn your ideas into production-ready websites.
          </p>
        </div>
      </div>
    </section>
  )
}