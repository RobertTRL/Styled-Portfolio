import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/navbar.css';
 
const NAV_ITEMS = [
  { label: 'Home',     href: '#home'     },
  { label: 'About Me', href: '#about'    },
  { label: 'Skills',   href: '#skills'   },
  { label: 'Projects', href: '#projects' },
  { label: 'Contacts', href: '#contacts' },
];
 
export default function NavBar({ isDark }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
 
  function handleItemClick(e, href) {
    if (!href || href === '#') return;
    e.preventDefault();
    const target = document.getElementById(href.replace('#', ''));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
 
  return (
    <nav
      id="glass-nav"
      className={isDark ? 'dark' : 'light'}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {NAV_ITEMS.map(({ label, href }, index) => (
        <a
          key={label}
          href={href}
          className="nav-item"
          onMouseEnter={() => setHoveredIndex(index)}
          onClick={(e) => handleItemClick(e, href)}
        >
          {/*
           * The pill lives inside each nav-item so it inherits the item's
           * bounding box via `inset: 0` in CSS. layoutId="hover-pill" tells
           * Framer Motion to treat every conditional instance as the SAME
           * element and morph between positions instead of fade-out/fade-in.
           *
           * Crucially: NO initial/animate/exit opacity props here.
           * Those would fight layoutId and cause the flash you saw.
           * AnimatePresence (below) only orchestrates the very first appear
           * and very last disappear; mid-nav movement is pure layout morph.
           */}
          <AnimatePresence>
            {hoveredIndex === index && (
              <motion.div
                id="hover-pill"
                layoutId="hover-pill"
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 32,
                  mass: 0.9,
                }}
              />
            )}
          </AnimatePresence>
 
          <span className="nav-item-text">{label}</span>
        </a>
      ))}
    </nav>
  );
}