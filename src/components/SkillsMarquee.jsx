import { motion, useMotionValue, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import '../styles/skills.css';

const SPEED = 60; // pixels per second

export default function SkillsMarquee({ images, speed = SPEED }) {
  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const controlRef = useRef(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const quadrupledImages = [...images, ...images, ...images, ...images];

  // Measure one full sequence once it's laid out.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setTrackWidth((trackRef.current?.scrollWidth || 0) / 2);
    });
    return () => cancelAnimationFrame(frame);
  }, [images]);

  // Constant-speed loop. Stops in place on hover, resumes from the same x.
  useEffect(() => {
    if (!trackWidth || isPaused) {
      controlRef.current?.stop();
      return;
    }

    const runLeg = () => {
      const distanceLeft = trackWidth + x.get(); // x.get() is <= 0
      controlRef.current = animate(x, -trackWidth, {
        duration: distanceLeft / speed,
        ease: 'linear',
        onComplete: () => {
          x.set(0); // wraps seamlessly — position 0 looks identical to -trackWidth
          runLeg();
        },
      });
    };

    runLeg();
    return () => controlRef.current?.stop();
  }, [trackWidth, isPaused, speed, x]);

  return (
    <div
      className="marquee-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div className="marquee-track" ref={trackRef} style={{ x }}>
        {quadrupledImages.map((img, i) => (
          <div className="marquee-item" key={i} aria-hidden={i >= images.length || undefined}>
            <img
              src={img.src}
              alt=""
              draggable={false}
              decoding="async"
              className={img.className || ''}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}