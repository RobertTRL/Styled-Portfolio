import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

const useResizeObserver = (callback, elements, dependencies) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }
    const observers = elements.map(ref => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });
    callback();
    return () => observers.forEach(o => o?.disconnect());
  }, [callback, elements, dependencies]);
};

const useImageLoader = (seqRef, onLoad, dependencies) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];
    if (images.length === 0) {
      onLoad();
      return;
    }
    let remaining = images.length;
    const handleLoad = () => {
      remaining -= 1;
      if (remaining === 0) onLoad();
    };
    images.forEach(img => {
      if (img.complete) {
        handleLoad();
      } else {
        img.addEventListener('load', handleLoad, { once: true });
        img.addEventListener('error', handleLoad, { once: true });
      }
    });
    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleLoad);
      });
    };
  }, [onLoad, seqRef, dependencies]);
};

const useAnimationLoop = (trackRef, targetVelocity, seqWidth, isHovered, hoverSpeed) => {
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    const animate = timestamp => {
      if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;
      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = nextOffset;
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, isHovered, hoverSpeed, trackRef]);
};

const MarqueeRow = memo(({ images, direction, speed, pauseOnHover, hoverSpeed, rowId }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const seqRef = useRef(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const targetVelocity = useMemo(() => {
    const magnitude = Math.abs(speed);
    return direction === 'left' ? magnitude : -magnitude;
  }, [speed, direction]);

  // Row-level hover still eases the scroll speed down (not a hard pause) —
  // this is a scroll-behavior feature, separate from the per-item visual
  // hover effects that were removed below.
  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed;
    if (pauseOnHover) return 0;
    return targetVelocity * 0.2;
  }, [hoverSpeed, pauseOnHover, targetVelocity]);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceWidth = seqRef.current?.getBoundingClientRect?.().width ?? 0;
    if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
    }
  }, []);

  useResizeObserver(updateDimensions, [containerRef, seqRef], [images, direction]);
  useImageLoader(seqRef, updateDimensions, [images]);
  useAnimationLoop(trackRef, targetVelocity, seqWidth, isHovered, effectiveHoverSpeed);

  const trackItems = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, copyIndex) =>
        images.map((img, i) => ({ ...img, _key: `${rowId}-c${copyIndex}-${i}`, _hidden: copyIndex > 0 }))
      ).flat(),
    [copyCount, images, rowId]
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div className="marquee-row" ref={containerRef}>
      <div
        className={`marquee-track track-${direction}`}
        ref={trackRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {trackItems.map(img => (
          <div className="marquee-item" key={img._key} aria-hidden={img._hidden || undefined}>
            <img src={img.src} alt={img.alt} draggable={false} loading="lazy" decoding="async" />
          </div>
        ))}
      </div>

      <div
        className="marquee-track"
        ref={seqRef}
        aria-hidden="true"
        style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', top: 0, left: 0 }}
      >
        {images.map((img, i) => (
          <div className="marquee-item" key={`${rowId}-measure-${i}`}>
            <img src={img.src} alt="" draggable={false} loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </div>
  );
});
MarqueeRow.displayName = 'MarqueeRow';

export default function SkillsMarquee({ images }) {
  return (
    <div className="marquee-wrapper">
      <MarqueeRow images={images} direction="left" speed={40} rowId="r1" />
    </div>
  );
}