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

  const handleDownloadResume = () => {
    const link = document.createElement('a')
    link.href = '/Robert_Toroitich_CV.pdf'
    link.download = 'Robert_Toroitich_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    };

  return (
    <div className={`hero-section ${themeClass}`} id="home">
      <div className="main-text-wrapper">
        <h1 className="main-text">
          I focus on making<br />
          <span className="serif-word">pragmatic</span> solutions.
        </h1>
      </div>

      <p className="description">
        Hi there. I'm Robert Toroitich, and you've just landed on my portfolio page!
      </p>

    <div className="hero-btn-group">
      <button className="hero-btn" onClick={scrollToAbout}>
        View my projects
        <span className="hero-btn-arrow hero-btn-arrow-down" aria-hidden="true">&darr;</span>
      </button>
      <span className="hero-btn-or">or</span>
      <button className="hero-btn" onClick={handleDownloadResume}>
        Download my CV
      <span className="hero-btn-arrow hero-btn-arrow-diagonal" aria-hidden="true">↗</span>
    </button>
    </div>
    </div>
  );
}