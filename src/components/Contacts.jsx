import { useState } from 'react';
import '../styles/contacts.css';
import { useInView } from '../hooks/useInView';

const PHONE_NUMBER = '+254 791 154 865';
const PHONE_DIALABLE = '+254791154865';
const EMAIL = 'robertojnr2802@gmail.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/robert-toroitich-82b24639a/';
const GITHUB_URL = 'https://github.com/RobertTRL';

const CONTACT_LINKS = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    sub: "Let's connect professionally",
    href: LINKEDIN_URL,
    symbol: 'open',
    action: 'link',
  },
  {
    id: 'github',
    label: 'GitHub',
    sub: 'Browse my repositories',
    href: GITHUB_URL,
    symbol: 'open',
    action: 'link',
  },
  {
    id: 'email',
    label: 'Email',
    sub: EMAIL,
    href: '#',
    symbol: 'copy',
    action: 'copy',
  },
  {
    id: 'phone',
    label: 'Phone',
    sub: PHONE_NUMBER,
    href: `tel:${PHONE_DIALABLE}`,
    symbol: 'call',
    action: 'phone',
  },
];

export default function Contacts({ isDark }) {
  const themeClass = isDark ? 'dark-mode' : 'light-mode';
  const [copiedId, setCopiedId] = useState(null);
  const [sectionRef, isInView] = useInView(0.3);

  function flashCopied(id) {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  }

  function handleCopyClick(e, value, id) {
    e.preventDefault();
    navigator.clipboard.writeText(value).catch(() => {});
    flashCopied(id);
  }

  function handleLinkClick(e, item) {
    if (item.action === 'copy') handleCopyClick(e, EMAIL, item.id);
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
          <p className="contacts-label">Do you want to get in touch?</p>

          <h2 className="contacts-heading">
            Let's build something<br />
            <span className="serif-word">together.</span>
          </h2>

          <div className="contacts-divider" />

          <p className="contacts-tagline">
            I'm currently open to new opportunities - freelance, full-time, or
            just a good conversation about the web.
          </p>

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
                      {copiedId === item.id ? 'Copied to clipboard' : item.sub}
                    </span>
                  </span>
                  <span className="link-symbol" aria-hidden="true">
                    {copiedId === item.id ? 'done' : item.symbol}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}