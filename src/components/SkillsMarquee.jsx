import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/skills.css";

const SPEED = 60;
const INITIAL_COPY_COUNT = 4;

export default function SkillsMarquee({ images, speed = SPEED }) {
  const trackRef = useRef(null);
  const controlRef = useRef(null);
  const x = useMotionValue(0);

  const [copyCount, setCopyCount] = useState(INITIAL_COPY_COUNT);
  const [sequenceWidth, setSequenceWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const repeatedImages = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, copyIndex) =>
        images.map((image, imageIndex) => ({
          ...image,
          copyIndex,
          key: `${copyIndex}-${imageIndex}-${image.src}`,
        })),
      ).flat(),
    [copyCount, images],
  );

  useEffect(() => {
    const track = trackRef.current;
    const viewport = track?.parentElement;

    if (!track || !viewport || images.length === 0) return undefined;

    const measure = () => {
      const nextSequenceWidth = track.scrollWidth / copyCount;
      if (!nextSequenceWidth) return;

      // One visible sequence plus one additional full sequence ensures
      // content remains visible while the first sequence slides away.
      const neededCopies = Math.max(
        2,
        Math.ceil(viewport.clientWidth / nextSequenceWidth) + 1,
      );

      setSequenceWidth(nextSequenceWidth);
      setCopyCount((current) =>
        current === neededCopies ? current : neededCopies,
      );
    };

    const frameId = requestAnimationFrame(measure);
    const resizeObserver = new ResizeObserver(measure);

    resizeObserver.observe(track);
    resizeObserver.observe(viewport);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [copyCount, images]);

  useEffect(() => {
    if (!sequenceWidth || isPaused || speed <= 0) {
      controlRef.current?.stop();
      return undefined;
    }

    let cancelled = false;

    const runLeg = () => {
      if (cancelled) return;

      // Handles a pause/resume exactly at the loop boundary.
      if (x.get() <= -sequenceWidth) {
        x.set(0);
      }

      const distanceLeft = Math.max(sequenceWidth + x.get(), 1);

      controlRef.current = animate(x, -sequenceWidth, {
        duration: distanceLeft / speed,
        ease: "linear",
        onComplete: () => {
          if (cancelled) return;

          x.set(0);
          runLeg();
        },
      });
    };

    runLeg();

    return () => {
      cancelled = true;
      controlRef.current?.stop();
      controlRef.current = null;
    };
  }, [isPaused, sequenceWidth, speed, x]);

  return (
    <div
      className="marquee-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div className="marquee-track" ref={trackRef} style={{ x }}>
        {repeatedImages.map((image) => (
          <div
            className="marquee-item"
            key={image.key}
            aria-hidden={image.copyIndex > 0 || undefined}
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