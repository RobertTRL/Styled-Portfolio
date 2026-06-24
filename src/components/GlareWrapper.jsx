import { useRef } from 'react';
import '../styles/glarewrapper.css';

/**
 * GlareWrapper
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps any content with the holographic card effect extracted from GlareCard:
 *   • 3-D tilt (perspective + rotateX/Y driven by CSS custom properties)
 *   • Glare spotlight (radial-gradient tracking cursor position)
 *   • Rainbow foil overlay (repeating-linear-gradient + blend modes)
 *   • Diagonal stripe layer (depth shimmer)
 *   • Rounded shape  — matches GlareCard's --radius (48px), softened to 24px
 *     here so it fits portfolio cards without looking like a bubble.
 *
 * No Tailwind. No fixed width/height. Adapts to whatever dimensions the
 * parent grid gives the card.
 */
export default function GlareWrapper({ children, className = '' }) {
  const isPointerInside = useRef(false);
  const refElement      = useRef(null);

  const state = useRef({
    glare:      { x: 50, y: 50 },
    background: { x: 50, y: 50 },
    rotate:     { x: 0,  y: 0  },
  });

  /* ── Push updated values to CSS custom properties ── */
  const updateStyles = () => {
    const el = refElement.current;
    if (!el) return;
    const { glare, background, rotate } = state.current;
    el.style.setProperty('--m-x',  `${glare.x}%`);
    el.style.setProperty('--m-y',  `${glare.y}%`);
    el.style.setProperty('--r-x',  `${rotate.x}deg`);
    el.style.setProperty('--r-y',  `${rotate.y}deg`);
    el.style.setProperty('--bg-x', `${background.x}%`);
    el.style.setProperty('--bg-y', `${background.y}%`);
  };

  return (
    <div
      ref={refElement}
      className={`glare-wrapper ${className}`}
      onPointerMove={(e) => {
        const rotateFactor = 0.4;
        const rect = e.currentTarget.getBoundingClientRect();
        const pos  = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        const pct = {
          x: (100 / rect.width)  * pos.x,
          y: (100 / rect.height) * pos.y,
        };
        const delta = { x: pct.x - 50, y: pct.y - 50 };

        const { background, rotate, glare } = state.current;
        background.x = 50 + pct.x / 4 - 12.5;
        background.y = 50 + pct.y / 3 - 16.67;
        rotate.x     = -(delta.x / 3.5) * rotateFactor;
        rotate.y     =  (delta.y / 2)   * rotateFactor;
        glare.x      = pct.x;
        glare.y      = pct.y;

        updateStyles();
      }}
      onPointerEnter={() => {
        isPointerInside.current = true;
        setTimeout(() => {
          if (isPointerInside.current) {
            refElement.current?.style.setProperty('--duration', '0s');
            refElement.current?.style.setProperty('--opacity',  '1');
          }
        }, 300);
      }}
      onPointerLeave={() => {
        isPointerInside.current = false;
        const el = refElement.current;
        if (!el) return;
        el.style.removeProperty('--duration');
        el.style.setProperty('--opacity', '0');
        el.style.setProperty('--r-x', '0deg');
        el.style.setProperty('--r-y', '0deg');
      }}
    >
      {/* ── 3-D tilt layer ── */}
      <div className="glare-tilt">

        {/* ── Actual card content (slot) ── */}
        <div className="glare-content">
          {children}
        </div>

        {/* ── Glare spotlight ── */}
        <div className="glare-spotlight" />

        {/* ── Rainbow foil + diagonal shimmer ── */}
        <div className="glare-foil" />

      </div>
    </div>
  );
}