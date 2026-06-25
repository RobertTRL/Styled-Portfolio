import { useRef, useEffect } from 'react';
import '../styles/glarewrapper.css';

/**
 * GlareWrapper — optimised
 * ─────────────────────────────────────────────────────────────────────────────
 * Key changes vs. the original:
 *
 *   1. getBoundingClientRect() is cached on pointerenter and invalidated by a
 *      ResizeObserver + scroll listener — eliminates forced reflow per move.
 *
 *   2. Pointer events are attached natively with { passive: true } so the
 *      browser never blocks the compositor waiting for preventDefault().
 *
 *   3. All six CSS custom-property writes are collapsed into one
 *      el.style.cssText assignment per rAF, producing a single style
 *      invalidation instead of six.
 *
 *   4. Every handler is stable (lives inside useEffect), so React never
 *      re-attaches synthetic listeners and children never re-render due to
 *      changed handler identity.
 */
export default function GlareWrapper({ children, className = '' }) {
  const refElement = useRef(null);

  useEffect(() => {
    const el = refElement.current;
    if (!el) return;

    /* ── Mutable state (never triggers React render) ── */
    let isInside   = false;
    let raf        = null;
    let enterTimer = null;
    let cachedRect = null;                         // ① cached layout

    const ROTATE_FACTOR = 0.4;

    /* ── Cache helpers ── */
    const refreshRect = () => { cachedRect = el.getBoundingClientRect(); };

    /* ── Flush state → CSS (one write per frame) ── */
    /* Using a single cssText assignment means ONE style invalidation */
    let gx = 50, gy = 50, bx = 50, by = 50, rx = 0, ry = 0;

    const commitStyles = () => {
      el.style.cssText =              // ③ single invalidation
          el.style.cssText.replace(    // preserve anything we didn't set
            /--m-x:[^;]*;?|--m-y:[^;]*;?|--r-x:[^;]*;?|--r-y:[^;]*;?|--bg-x:[^;]*;?|--bg-y:[^;]*;?/g, '')
        + `--m-x:${gx}%;--m-y:${gy}%;--r-x:${rx}deg;--r-y:${ry}deg;`
        + `--bg-x:${bx}%;--bg-y:${by}%;`;
      raf = null;
    };

    /* ─── Pointer handlers (native, passive) ── ② ── */
    const onMove = (e) => {
      if (!cachedRect) return;
      const pctX = ((e.clientX - cachedRect.left) / cachedRect.width)  * 100;
      const pctY = ((e.clientY - cachedRect.top)  / cachedRect.height) * 100;
      const dx   = pctX - 50;
      const dy   = pctY - 50;

      /* Pure math — no DOM reads */
      bx =  50 + pctX / 4 - 12.5;
      by =  50 + pctY / 3 - 16.67;
      rx = -(dx / 3.5) * ROTATE_FACTOR;
      ry =  (dy / 2)   * ROTATE_FACTOR;
      gx =  pctX;
      gy =  pctY;

      if (!raf) raf = requestAnimationFrame(commitStyles);
    };

    const onEnter = () => {
      isInside = true;
      refreshRect();                               // ① one reflow on enter

      if (enterTimer) clearTimeout(enterTimer);
      enterTimer = setTimeout(() => {
        if (isInside) {
          el.style.setProperty('--duration', '0s');
          el.style.setProperty('--opacity',  '1');
        }
        enterTimer = null;
      }, 300);
    };

    const onLeave = () => {
      isInside   = false;
      cachedRect = null;

      if (enterTimer) { clearTimeout(enterTimer); enterTimer = null; }
      if (raf)        { cancelAnimationFrame(raf); raf = null; }

      el.style.removeProperty('--duration');
      el.style.setProperty('--opacity', '0');
      el.style.setProperty('--r-x', '0deg');
      el.style.setProperty('--r-y', '0deg');
    };

    /* ── Attach native passive listeners ── */
    el.addEventListener('pointermove',  onMove,  { passive: true });
    el.addEventListener('pointerenter', onEnter, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });

    /* ── Invalidate rect cache on resize / scroll ── */
    const ro = new ResizeObserver(refreshRect);
    ro.observe(el);
    /* Nearest scrollable ancestor — capture phase catches all scroll containers */
    window.addEventListener('scroll', () => { if (isInside) refreshRect(); },
                            { passive: true, capture: true });

    /* ── Cleanup ── */
    return () => {
      el.removeEventListener('pointermove',  onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      ro.disconnect();
      if (raf)        cancelAnimationFrame(raf);
      if (enterTimer) clearTimeout(enterTimer);
    };
  }, []);                                          // ④ runs once, all handlers stable

  return (
    <div ref={refElement} className={`glare-wrapper ${className}`}>
      <div className="glare-tilt">
        <div className="glare-content">{children}</div>
        <div className="glare-spotlight" />
        <div className="glare-foil" />
      </div>
    </div>
  );
}