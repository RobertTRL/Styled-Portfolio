import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is currently in the viewport.
 *
 * @param {number} threshold Fraction of the element that must be visible.
 * @returns {[React.RefObject, boolean]} Element ref and intersection state.
 */
export function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return [ref, inView];
}