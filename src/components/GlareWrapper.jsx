import { useRef, useEffect } from 'react';
import '../styles/glarewrapper.css';

/**
 * GlareWrapper
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps any content with the holographic card effect:
 *   • 3-D tilt (perspective + rotateX/Y driven by CSS custom properties)
 *   • Glare spotlight (radial-gradient tracking cursor position)
 *   • Rainbow foil overlay (repeating-linear-gradient + blend modes)
 *   • Diagonal stripe layer (depth shimmer)
 *
 * Performance notes
 * ─────────────────
 * State math runs eagerly on every pointermove (cheap — just arithmetic).
 * DOM writes (setProperty) are batched to one per animation frame via rAF,
 * capping the write rate at the screen's refresh rate (~60–120 Hz) instead of
 * the raw pointer-event rate which can exceed 240 Hz on high-end devices.
 */
export default function GlareWrapper({ children, className = '' }) {
  const refElement      = useRef(null);
  const isPointerInside = useRef(false);
  const rafRef          = useRef(null);     // pending rAF id, or null
  const enterTimerRef   = useRef(null);     // pending enter-delay timer, or null

  const state = useRef({
    glare:      { x: 50, y: 50 },
    background: { x: 50, y: 50 },
    rotate:     { x: 0,  y: 0  },
  });

  /* ── Flush latest state values to CSS custom properties ── */
  /* Called only from inside a requestAnimationFrame callback. */
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

  /* ── Cancel any in-flight timers on unmount ── */
  useEffect(() => {
    return () => {
      if (rafRef.current)        cancelAnimationFrame(rafRef.current);
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
    };
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────
   * onPointerMove
   *
   * Two-phase approach:
   *   1. Compute — runs every event, updates state.current in place (pure math,
   *      no DOM access, negligible cost even at 240 Hz).
   *   2. Commit  — schedules ONE setProperty batch per animation frame.
   *      If a frame is already scheduled, the new state will be picked up by
   *      the existing callback when it fires (state.current is always current).
   * ───────────────────────────────────────────────────────────────────────── */
  const handlePointerMove = (e) => {
    const rotateFactor = 0.4;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = {
      x: ((e.clientX - rect.left) / rect.width)  * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    };
    const delta = { x: pct.x - 50, y: pct.y - 50 };

    /* Phase 1 — mutate state in place (no DOM touch) */
    const { background, rotate, glare } = state.current;
    background.x = 50 + pct.x / 4 - 12.5;
    background.y = 50 + pct.y / 3 - 16.67;
    rotate.x     = -(delta.x / 3.5) * rotateFactor;
    rotate.y     =  (delta.y / 2)   * rotateFactor;
    glare.x      = pct.x;
    glare.y      = pct.y;

    /* Phase 2 — one DOM write per frame */
    if (rafRef.current) return;                       // frame already scheduled
    rafRef.current = requestAnimationFrame(() => {
      updateStyles();                                 // reads latest state.current
      rafRef.current = null;
    });
  };

  const handlePointerEnter = () => {
    isPointerInside.current = true;

    /* Guard against stacked timers on rapid enter/leave */
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current);

    enterTimerRef.current = setTimeout(() => {
      if (isPointerInside.current) {
        refElement.current?.style.setProperty('--duration', '0s');
        refElement.current?.style.setProperty('--opacity',  '1');
      }
      enterTimerRef.current = null;
    }, 300);
  };

  const handlePointerLeave = () => {
    isPointerInside.current = false;

    /* Cancel a pending enter timer — pointer left before 300 ms elapsed */
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }

    /* Cancel a pending rAF — prevents it from overwriting the reset below */
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const el = refElement.current;
    if (!el) return;
    el.style.removeProperty('--duration');
    el.style.setProperty('--opacity', '0');
    el.style.setProperty('--r-x', '0deg');
    el.style.setProperty('--r-y', '0deg');
  };

  return (
    <div
      ref={refElement}
      className={`glare-wrapper ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
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