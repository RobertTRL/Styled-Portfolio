export default function SkillsMarquee({ images }) {
  // 2x duplication is enough for a seamless loop: each row already renders
  // two adjacent tracks of this content, so the strip actually visible on
  // screen at any moment is already 2x this array (44 items/row, ~4,000-
  // 4,500px) — comfortably wider than 4K and most ultrawide displays.
  // Dropping from 4x to 2x source duplication cuts items from 176 -> 88,
  // and DOM nodes (div + img + span per item) from 528 -> 264.
  const trackContent = [...images, ...images];

  const renderTrack = (rowId, trackNum, direction, hidden = false) => (
    <div className={`marquee-track track-${direction}`} aria-hidden={hidden || undefined}>
      {trackContent.map((img, i) => (
        <div className="marquee-item" key={`${rowId}-t${trackNum}-${i}`}>
          <img
            src={img.src}
            alt={img.alt}
            draggable={false}
            loading="lazy"
            decoding="async"
          />
          <span className="marquee-label">{img.alt}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="marquee-wrapper">
      {/* Row 1 — scrolls left */}
      <div className="marquee-row">
        {renderTrack('r1', 1, 'left')}
        {renderTrack('r1', 2, 'left', true)}
      </div>

      {/* Row 2 — scrolls right */}
      <div className="marquee-row">
        {renderTrack('r2', 1, 'right')}
        {renderTrack('r2', 2, 'right', true)}
      </div>
    </div>
  );
}