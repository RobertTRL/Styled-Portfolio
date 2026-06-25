import { useState } from "react";
import "../styles/contacts.css";
import { useInView } from "../hooks/useInView";
import ContactGlobe from "./Globe.jsx";
 
/* ─── Contact data ─── */
const PHONE_NUMBER   = '+254 791 154 865';
const PHONE_DIALABLE = '+254791154865';
const EMAIL          = 'robertktoroitich@gmail.com';
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
    href:   '#',
    symbol: '→',
    action: 'copy',
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
  const themeClass              = isDark ? 'dark-mode' : 'light-mode';
  const [copiedId, setCopiedId] = useState(null);
  const [sectionRef, isInView]  = useInView(0.3);
 
  function handleCopyClick(e, value) {
    e.preventDefault();
    navigator.clipboard.writeText(value).catch(() => {});
    setCopiedId('email');
    setTimeout(() => setCopiedId(null), 2200);
  }
 
  function handlePhoneClick(e) {
    e.preventDefault();
    navigator.clipboard.writeText(PHONE_NUMBER).catch(() => {});
    setCopiedId('phone');
    setTimeout(() => setCopiedId(null), 2200);
  }
 
  function handleLinkClick(e, item) {
    if (item.action === 'phone') handlePhoneClick(e);
    if (item.action === 'copy')  handleCopyClick(e, EMAIL);
  }
 
  return (
    <section
      ref={sectionRef}
      className={`contacts-section ${themeClass} ${isInView ? 'in-view' : ''}`}
      id="contacts"
    >
      {/* ── Centred column ── */}
      <div className="contacts-inner">
 
        {/* 1. Watermark */}
        <h1 className="contacts-watermark" aria-hidden="true">Contacts</h1>
 
        {/* 2. Label + Heading + Divider */}
        <div className="contacts-header">
          <p className="contacts-label">Do you want to get in touch?</p>
          <h2 className="contacts-heading">
            Let's build something <span className="serif-word">together.</span>
          </h2>
          <div className="contacts-divider" />
        </div>
 
        {/* 3. Globe */}
        <ContactGlobe isDark={isDark} />
 
        {/* 4. Cards row */}
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
                  {copiedId === item.id ? '✓' : item.symbol}
                </span>
              </a>
            </li>
          ))}
        </ul>
 
      </div>
    </section>
  );
}