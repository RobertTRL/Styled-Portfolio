import { useRef } from 'react';
import '../styles/navbar.css';

const NAV_ITEMS = [
  { label: 'Home',     href: '#home'  },
  { label: 'About Me', href: '#about' },
  { label: 'Skills',   href: '#skills'},
  { label: 'Contacts', href: '#contacts'},
  { label: 'Projects', href: '#projects'},
];

export default function NavBar({ isDark }) {
  const navRef  = useRef(null);
  const pillRef = useRef(null);

  const spring = useRef({
    px: 0, py: 0, pw: 0, ph: 0,
    vx: 0, vy: 0, vw: 0, vh: 0,
    tx: 0, ty: 0, tw: 100, th: 40,
    active: false,
    resisting: false,
    resistEnd: 0,
    rafId: null,
    lastT: null,
  });

  function getRect(el) {
    const nr = navRef.current.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return { x: er.left - nr.left, y: er.top - nr.top, w: er.width, h: er.height };
  }

  function applyPill(x, y, w, h, opacity) {
    const el = pillRef.current;
    if (!el) return;
    el.style.left   = x + 'px';
    el.style.top    = y + 'px';
    el.style.width  = w + 'px';
    el.style.height = h + 'px';
    if (opacity !== undefined) el.style.opacity = opacity;
  }

  function loop(t) {
    const s = spring.current;
    if (s.lastT === null) s.lastT = t - 16;
    const dt = Math.min((t - s.lastT) / 1000, 0.05);
    s.lastT = t;

    const res = s.resisting && t < s.resistEnd;
    if (t >= s.resistEnd) s.resisting = false;

    const k = res ? 28  : 200;
    const d = res ? 14  : 28;

    function step(pos, vel, tgt) {
      const a  = -k * (pos - tgt) - d * vel;
      const nv = vel + a * dt;
      return [pos + nv * dt, nv];
    }

    [s.px, s.vx] = step(s.px, s.vx, s.tx);
    [s.py, s.vy] = step(s.py, s.vy, s.ty);
    [s.pw, s.vw] = step(s.pw, s.vw, s.tw);
    [s.ph, s.vh] = step(s.ph, s.vh, s.th);

    applyPill(s.px, s.py, s.pw, s.ph);

    const settled =
      Math.abs(s.vx) < 0.2 && Math.abs(s.vy) < 0.2 &&
      Math.abs(s.vw) < 0.2 && Math.abs(s.vh) < 0.2 &&
      Math.abs(s.px - s.tx) < 0.25 && Math.abs(s.py - s.ty) < 0.25 &&
      Math.abs(s.pw - s.tw) < 0.25 && Math.abs(s.ph - s.th) < 0.25;

    if (!settled) {
      s.rafId = requestAnimationFrame(loop);
    } else {
      s.rafId = null;
      s.lastT = null;
    }
  }

  function handleItemEnter(e) {
    const s = spring.current;
    const r = getRect(e.currentTarget);

    if (!s.active) {
      s.px = r.x; s.py = r.y; s.pw = r.w; s.ph = r.h;
      s.vx = 0;   s.vy = 0;   s.vw = 0;   s.vh = 0;
      s.active = true;
      applyPill(s.px, s.py, s.pw, s.ph, '1');
    } else {
      const dist = Math.hypot(r.x - s.tx, r.y - s.ty);
      if (dist > 8) {
        s.resisting = true;
        s.resistEnd = performance.now() + 240;
      }
    }

    s.tx = r.x; s.ty = r.y; s.tw = r.w; s.th = r.h;

    if (!s.rafId) {
      s.lastT = null;
      s.rafId = requestAnimationFrame(loop);
    }
  }

  function handleNavLeave() {
    const s = spring.current;
    if (pillRef.current) pillRef.current.style.opacity = '0';
    s.active = false;
    s.vx = 0; s.vy = 0; s.vw = 0; s.vh = 0;
    if (s.rafId) {
      cancelAnimationFrame(s.rafId);
      s.rafId = null;
    }
  }

  function handleItemClick(e, href) {
    // Only intercept real anchor targets, ignore placeholder '#'
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
      ref={navRef}
      onMouseLeave={handleNavLeave}
    >
      {NAV_ITEMS.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          className="nav-item"
          onMouseEnter={handleItemEnter}
          onClick={(e) => handleItemClick(e, href)}
        >
          {label}
        </a>
      ))}
      <div id="hover-pill" ref={pillRef} />
    </nav>
  )
}