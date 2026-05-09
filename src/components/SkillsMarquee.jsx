export default function SkillsMarquee({ images }) {
  // Multiply images to guarantee the track is wider than the largest screen (e.g., 4K monitors).
  // 11 images * 4 = 44 items (approx 4400px wide). 
  const trackContent = [...images, ...images, ...images, ...images];

  return (
    <div className="marquee-wrapper">
      {/* Row 1 — scrolls left */}
      <div className="marquee-row">
        {/* Track 1 */}
        <div className="marquee-track track-left">
          {trackContent.map((img, i) => (
            <div className="marquee-item" key={`r1-t1-${i}`}>
              <img src={img.src} alt={img.alt} draggable={false} />
              <span className="marquee-label">{img.alt}</span>
            </div>
          ))}
        </div>
        {/* Track 2 (Duplicate for seamless loop) */}
        <div className="marquee-track track-left" aria-hidden="true">
          {trackContent.map((img, i) => (
            <div className="marquee-item" key={`r1-t2-${i}`}>
              <img src={img.src} alt={img.alt} draggable={false} />
              <span className="marquee-label">{img.alt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="marquee-row">
        {/* Track 1 */}
        <div className="marquee-track track-right">
          {trackContent.map((img, i) => (
            <div className="marquee-item" key={`r2-t1-${i}`}>
              <img src={img.src} alt={img.alt} draggable={false} />
              <span className="marquee-label">{img.alt}</span>
            </div>
          ))}
        </div>
        {/* Track 2 (Duplicate for seamless loop) */}
        <div className="marquee-track track-right" aria-hidden="true">
          {trackContent.map((img, i) => (
            <div className="marquee-item" key={`r2-t2-${i}`}>
              <img src={img.src} alt={img.alt} draggable={false} />
              <span className="marquee-label">{img.alt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}