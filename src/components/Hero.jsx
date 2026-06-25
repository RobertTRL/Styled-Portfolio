import '../styles/hero.css';

export default function Hero({ isDark }) {
  const themeClass = isDark ? 'dark-mode' : 'light-mode';

  function scrollToAbout() {
    const options = {
      behavior: 'smooth',
      block: 'start',
    };
    const target = document.getElementById('projects');

    if (target) {
      target.scrollIntoView(options);
      return;
    }

    window.setTimeout(() => {
      document.getElementById('about')?.scrollIntoView(options);
    }, 700);
  }

  return (
    <div className={`hero-section ${themeClass}`} id="home">
      <div className="main-text-wrapper">
        <h1 className="main-text">
          I focus on making<br />
          <span className="serif-word">immersive</span> experiences.
        </h1>
      </div>

      <p className="description">
        Hi there. I'm Robert Toroitich, and you've just landed on my portfolio page!
      </p>

      <button className="hero-btn" onClick={scrollToAbout}>
        View my work
        <span className="hero-btn-arrow" aria-hidden="true">&darr;</span>
      </button>
    </div>
  );
}