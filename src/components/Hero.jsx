import '../styles/hero.css';
import { motion } from 'framer-motion';

export default function Hero({ isDark }) {
  const themeClass = isDark ? 'dark-mode' : 'light-mode';

  function scrollToAbout() {
    document.getElementById('about')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  return (
    <div className={`hero-section ${themeClass}`} id="home">
      <div className="main-text-wrapper">
        <motion.h1
          className="main-text"
          whileHover={{ y: -12 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 10,
          }}
        >
          I focus on making<br />
          <span className="serif-word">immersive</span> experiences.
        </motion.h1>
      </div>

      <p className="description">
        Hi there. I'm Robert Toroitich, and you've just landed on my portfolio page.
        I'm your go-to Full-stack Developer!
      </p>

      <motion.button
        className="hero-btn"
        onClick={scrollToAbout}
        whileHover={{ x: 6 }}
        whileTap={{ x: 3, opacity: 0.6 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        Learn More
        <span className="hero-btn-arrow" aria-hidden="true">↓</span>
      </motion.button>
    </div>
  );
}