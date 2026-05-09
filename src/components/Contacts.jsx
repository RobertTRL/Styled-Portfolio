import { useState, useEffect, useRef } from 'react';
import '../styles/contacts.css';

const PHONE_NUMBER   = '+254 791 154 865';
const PHONE_DIALABLE = '+254791154865';
const EMAIL          = 'robertojnr2802@gmail.com';
const LINKEDIN_URL   = 'https://www.linkedin.com/in/robert-toroitich-82b24639a/';
const GITHUB_URL     = 'https://github.com/RobertTRL';

const CONTACT_LINKS = [
  {
    id:     'linkedin',
    label:  'LinkedIn',
    sub:    "Let's connect professionally",
    href:   LINKEDIN_URL,
    symbol: '↗',
    action: 'link',
  },
  {
    id:     'github',
    label:  'GitHub',
    sub:    'Browse my repositories',
    href:   GITHUB_URL,
    symbol: '↗',
    action: 'link',
  },
  {
    id:     'email',
    label:  'Email',
    sub:    EMAIL,
    href:   `mailto:${EMAIL}`,
    symbol: '→',
    action: 'link',
  },
  {
    id:     'phone',
    label:  'Phone',
    sub:    PHONE_NUMBER,
    href:   `tel:${PHONE_DIALABLE}`,
    symbol: '↓',
    action: 'phone',
  },
];

export default function Contacts({ isDark }) {
  const themeClass = isDark ? 'dark-mode' : 'light-mode';
  const [copiedId, setCopiedId] = useState(null);

  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

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

  function handlePhoneClick() {
    navigator.clipboard.writeText(PHONE_NUMBER).catch(() => {});
    setCopiedId('phone');
    setTimeout(() => setCopiedId(null), 2200);
  }

  function handleLinkClick(e, item) {
    if (item.action === 'phone') handlePhoneClick(e);
  }

  return (
    <section
      ref={sectionRef}
      className={`contacts-section ${themeClass} ${isInView ? 'in-view' : ''}`}
      id="contacts"
    >
      <div className="contacts-inner">

        <h1 className="contacts-watermark">Contacts</h1>

        <div className="contacts-content">
          <p className="contacts-label">Get in touch</p>

          <h2 className="contacts-heading">
            Let's build something<br />
            <span className="serif-word">together.</span>
          </h2>

          <div className="contacts-divider" />

          <p className="contacts-tagline">
            I'm currently open to new opportunities — freelance, full-time, or
            just a good conversation about the web.
          </p>

          <div className="availability-badge">
            <span className="badge-dot" />
            Available for work
          </div>

          <ul className="contact-list">
            {CONTACT_LINKS.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`contact-link ${copiedId === item.id ? 'copied' : ''}`}
                  target={item.action === 'link' ? '_blank' : undefined}
                  rel={item.action === 'link' ? 'noopener noreferrer' : undefined}
                  onClick={(e) => handleLinkClick(e, item)}
                >
                  <span className="link-left">
                    <span className="link-label">{item.label}</span>
                    <span className="link-sub">
                      {copiedId === item.id ? '✓ Copied to clipboard' : item.sub}
                    </span>
                  </span>
                  <span className="link-symbol" aria-hidden="true">
                    {copiedId === item.id ? '✓' : item.symbol}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="contacts-footer">
            Prefer a formal approach?{' '}
            <a href={`mailto:${EMAIL}`} className="footer-link">
              Send me an email
            </a>{' '}
            and I'll respond within 24 hours.
          </p>
        </div>
      </div>
    </section>
  );
}