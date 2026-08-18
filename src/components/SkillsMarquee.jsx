import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/skills.css";

const SPEED = 60;

export default function SkillsMarquee({ images, speed = SPEED }) {
  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const controlRef = useRef(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Two copies are enough for a seamless loop.
  const loopImages = useMemo(() => [...images, ...images], [images]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const measure = () => {
      setTrackWidth(track.scrollWidth / 2);
    };

    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [loopImages]);

  useEffect(() => {
    if (!trackWidth || isPaused || speed <= 0) {
      controlRef.current?.stop();
      return undefined;
    }

    const runLeg = () => {
      if (x.get() <= -trackWidth) x.set(0);

      const distanceLeft = trackWidth + x.get();
      controlRef.current = animate(x, -trackWidth, {
        duration: distanceLeft / speed,
        ease: "linear",
        onComplete: () => {
          x.set(0);
          runLeg();
        },
      });
    };

    runLeg();

    return () => {
      controlRef.current?.stop();
      controlRef.current = null;
    };
  }, [isPaused, speed, trackWidth, x]);

  return (
    <div
      className="marquee-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div className="marquee-track" ref={trackRef} style={{ x }}>
        {loopImages.map((image, index) => (
          <div
            className="marquee-item"
            key={`${image.src}-${index}`}
            aria-hidden={index >= images.length || undefined}
          >
            <img
              src={image.src}
              alt=""
              draggable={false}
              decoding="async"
              className={image.className || ""}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}