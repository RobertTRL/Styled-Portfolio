import { useEffect, useRef, useState } from 'react';
 
/**
 * useInView — triggers when an element scrolls into the viewport.
 *
 * @param {number} threshold  - Fraction of the element that must be visible (0–1). Default: 0.3
 * @returns {[React.RefObject, boolean]}  [ref to attach to your element, isInView boolean]
 *
 * Usage:
 *   const [sectionRef, isInView] = useInView(0.3);
 *   <section ref={sectionRef} className={isInView ? 'in-view' : ''}>
 */
export function useInView(threshold = 0.3) {
  const ref     = useRef(null);
  const [inView, setInView] = useState(false);
 
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
 
    const el = ref.current;
    if (el) observer.observe(el);
 
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [threshold]);
 
  return [ref, inView];
}