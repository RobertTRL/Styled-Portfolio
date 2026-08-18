import { useEffect, useRef } from "react";
import "../styles/glarewrapper.css";

export default function GlareWrapper({ children, className = "" }) {
  const refElement = useRef(null);

  useEffect(() => {
    const element = refElement.current;
    if (!element) return undefined;

    let isInside = false;
    let frameId = null;
    let enterTimer = null;
    let cachedRect = null;

    const ROTATE_FACTOR = 0.4;

    let glareX = 50;
    let glareY = 50;
    let backgroundX = 50;
    let backgroundY = 50;
    let rotateX = 0;
    let rotateY = 0;

    const refreshRect = () => {
      cachedRect = element.getBoundingClientRect();
    };

    const commitStyles = () => {
      element.style.cssText =
        element.style.cssText.replace(
          /--m-x:[^;]*;?|--m-y:[^;]*;?|--r-x:[^;]*;?|--r-y:[^;]*;?|--bg-x:[^;]*;?|--bg-y:[^;]*;?/g,
          "",
        ) +
        `--m-x:${glareX}%;--m-y:${glareY}%;--r-x:${rotateX}deg;--r-y:${rotateY}deg;` +
        `--bg-x:${backgroundX}%;--bg-y:${backgroundY}%;`;

      frameId = null;
    };

    const onMove = (event) => {
      if (!cachedRect) return;

      const percentX =
        ((event.clientX - cachedRect.left) / cachedRect.width) * 100;
      const percentY =
        ((event.clientY - cachedRect.top) / cachedRect.height) * 100;

      const deltaX = percentX - 50;
      const deltaY = percentY - 50;

      backgroundX = 50 + percentX / 4 - 12.5;
      backgroundY = 50 + percentY / 3 - 16.67;
      rotateX = -(deltaX / 3.5) * ROTATE_FACTOR;
      rotateY = (deltaY / 2) * ROTATE_FACTOR;
      glareX = percentX;
      glareY = percentY;

      if (!frameId) {
        frameId = requestAnimationFrame(commitStyles);
      }
    };

    const onEnter = () => {
      isInside = true;
      refreshRect();

      if (enterTimer) clearTimeout(enterTimer);

      enterTimer = window.setTimeout(() => {
        if (isInside) {
          element.style.setProperty("--duration", "0s");
          element.style.setProperty("--opacity", "1");
        }

        enterTimer = null;
      }, 300);
    };

    const onLeave = () => {
      isInside = false;
      cachedRect = null;

      if (enterTimer) {
        clearTimeout(enterTimer);
        enterTimer = null;
      }

      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }

      element.style.removeProperty("--duration");
      element.style.setProperty("--opacity", "0");
      element.style.setProperty("--r-x", "0deg");
      element.style.setProperty("--r-y", "0deg");
    };

    const onScroll = () => {
      if (isInside) refreshRect();
    };

    const resizeObserver = new ResizeObserver(refreshRect);

    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerenter", onEnter, { passive: true });
    element.addEventListener("pointerleave", onLeave, { passive: true });

    resizeObserver.observe(element);
    window.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerenter", onEnter);
      element.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll, true);

      resizeObserver.disconnect();

      if (frameId) cancelAnimationFrame(frameId);
      if (enterTimer) clearTimeout(enterTimer);
    };
  }, []);

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