import '../styles/about.css';
import smilingEmoji from '../assets/smiling-emoji.webp';
import wavingHandSign from '../assets/waving-hand-sign.webp';
import { useInView } from '../hooks/useInView';
import { OrbitCardStack } from './OrbitCardStack';

export default function AboutMe({ isDark }) {
  const themeClass = isDark ? 'dark-mode' : 'light-mode';
  const [sectionRef, isInView] = useInView(0.3);

  return (
    <section
      ref={sectionRef}
      className={`about-section ${themeClass} ${isInView ? 'in-view' : ''}`}
      id="about"
    >
      <div className="about-inner">
        {/* ── Left column: watermark + text ── */}
        <div className="about-left">
          <h1 className="about-watermark">About <br />Me</h1>

          <div className="about-content">
            <p className="about-label">Who am i?</p>

            <h2 className="about-heading">
              A developer who<br />
              cares about <span className="serif-word">craft.</span>
            </h2>

            <div className="about-divider" />

            <div className="about-greeting">
              Hello
              <span className="emoji-group">
                <img src={smilingEmoji} alt="Smiling" />
                <img src={wavingHandSign} alt="Waving" />
              </span>
            </div>

            <p className="about-text">
              I'm <span className="highlight name">Robert Toroitich</span>, a{' '}
              <span className="highlight role">Full-Stack Software Engineer</span> and{' '}
              <span className="highlight role">Graphic Designer</span>. I especially
              focus on building detailed, pragmatic and immersive{' '}
              <span className="highlight exp">web experiences</span>.
              Walk with me as I turn your ideas into production-ready websites.
            </p>
          </div>
        </div>

        {/* ── Right column: card stack ── */}
        <div className="about-right">
          <OrbitCardStack />
        </div>
      </div>
    </section>
  );
}