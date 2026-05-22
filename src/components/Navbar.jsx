import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/navbar.css';

const NAV_ITEMS = [
  { label: 'Home',     href: '#home'  },
  { label: 'About Me', href: '#about' },
  { label: 'Skills',   href: '#skills'},
  { label: 'Contacts', href: '#contacts'},
  { label: 'Projects', href: '#projects'},
];

export default function NavBar({ isDark }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  function handleItemClick(e, href) {
    if (!href || href === '#') return;

    e.preventDefault();
    const id = href.replace('#', '');
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <nav
      id="glass-nav"
      className={isDark ? 'dark' : 'light'}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <AnimatePresence>
        {NAV_ITEMS.map(({ label, href }, index) => (
          <a
            key={label}
            href={href}
            className="nav-item"
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={(e) => handleItemClick(e, href)}
          >
            {hoveredIndex === index && (
              <motion.div
                id="hover-pill"
                layoutId="hover-pill"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  type: 'tween',
                  ease: [0.76, 0, 0.24, 1], 
                  duration: 0.45,           
                }}
              />
            )}
            <span className="nav-item-text">{label}</span>
          </a>
        ))}
      </AnimatePresence>
    </nav>
  );
}