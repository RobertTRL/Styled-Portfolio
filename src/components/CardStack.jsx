import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../styles/cardstack.css';

function cn(...args) {
  return args.filter(Boolean).join(' ');
}

const DEFAULT_VIEWPORT_WIDTH = 1280;
const CARD_WIDTH = 336;
const CARD_MIN_HEIGHT = 430;
const MIN_CARD_SCALE = 0.86;
const SHRINK_START_WIDTH = 980;
const SHRINK_END_WIDTH = 390;

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function useViewportWidth() {
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? DEFAULT_VIEWPORT_WIDTH : window.innerWidth,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let frame = 0;
    const updateViewportWidth = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setViewportWidth(window.innerWidth);
      });
    };

    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', updateViewportWidth);
    };
  }, []);

  return viewportWidth;
}

function getResponsiveStackLayout({ baseSpread, itemCount, lift, viewportWidth }) {
  const maxFromCenter = Math.max((itemCount - 1) / 2, 1);
  const shrinkProgress = clampNumber(
    (viewportWidth - SHRINK_END_WIDTH) / (SHRINK_START_WIDTH - SHRINK_END_WIDTH),
    0,
    1,
  );
  const cardScale = MIN_CARD_SCALE + (1 - MIN_CARD_SCALE) * shrinkProgress;
  const cardWidth = Math.round(CARD_WIDTH * cardScale);
  const cardMinHeight = Math.round(CARD_MIN_HEIGHT * cardScale);

  const sidePadding =
    viewportWidth <= 420 ? 28 : viewportWidth <= 640 ? 40 : viewportWidth <= 1024 ? 64 : 96;
  const availableWidth = Math.max(0, viewportWidth - sidePadding);
  const spreadThatFits = Math.max(
    0,
    (availableWidth - cardWidth) / (maxFromCenter * 2),
  );

  const spreadFactor =
    viewportWidth <= 420
      ? 0.18
      : viewportWidth <= 520
        ? 0.24
        : viewportWidth <= 640
          ? 0.34
          : viewportWidth <= 768
            ? 0.48
            : viewportWidth <= 1024
              ? 0.72
              : 1;

  const fanRotation =
    viewportWidth <= 420
      ? 2.2
      : viewportWidth <= 520
        ? 3
        : viewportWidth <= 640
          ? 4.25
          : viewportWidth <= 768
            ? 5.75
            : viewportWidth <= 1024
              ? 7
              : 8.5;

  const vertGap =
    viewportWidth <= 420
      ? 31
      : viewportWidth <= 640
        ? 34
        : viewportWidth <= 768
          ? 36
          : 30;
  const vertExtra = viewportWidth <= 640 ? 8 : 10;
  const spread = Math.min(baseSpread * spreadFactor, spreadThatFits, baseSpread);
  const maxFanY = maxFromCenter * vertGap + Math.max(0, maxFromCenter - 1) * vertExtra;
  const stageBreathingRoom = viewportWidth <= 640 ? 34 : 24;
  const stageHeight = Math.ceil(
    cardMinHeight + 2 * Math.max(maxFanY, lift + 8) + stageBreathingRoom,
  );
  const descriptionGap = viewportWidth <= 640 ? 72 : viewportWidth <= 900 ? 56 : 42;

  return {
    spread,
    fanRotation,
    vertGap,
    vertExtra,
    cardWidth,
    cardMinHeight,
    stageHeight,
    descriptionGap,
  };
}

function useResponsiveStackLayout(baseSpread, itemCount, lift) {
  const viewportWidth = useViewportWidth();

  return useMemo(
    () =>
      getResponsiveStackLayout({
        baseSpread,
        itemCount,
        lift,
        viewportWidth,
      }),
    [baseSpread, itemCount, lift, viewportWidth],
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

const defaultItems = [
  {
    name: 'Software Engineer',
    description:
      'Designs reliable systems, solves complex problems, and transforms ideas into scalable digital experiences.',
    accent: '#78dcca',
    initials: 'SE',
    stat: 'Code',
    image: '/images/softeng.webp',
  },
  {
    name: 'Graphic Designer',
    description:
      'Crafts visual identities, communicates ideas through design, and turns concepts into memorable experiences.',
    accent: '#f3f1ea',
    initials: 'GD',
    stat: 'Design',
    image: '/images/graphdesign.webp',
  },
  {
    name: 'Leader',
    description:
      'Guides teams with clarity, balances vision with execution, and creates momentum that others can rally behind.',
    accent: '#f8d66d',
    initials: 'LD',
    stat: 'Leadership',
    image: '/images/leader.webp',
  },
  {
    name: 'Electrical Engineer',
    description:
      'Builds intelligent hardware systems, bridges electronics with innovation, and brings technical concepts to life.',
    accent: '#b9a7ff',
    initials: 'EE',
    stat: 'Electronics',
    image: '/images/robotics.webp',
  },
  {
    name: 'Learner',
    description:
      'Pursues knowledge relentlessly, explores new disciplines, and continuously sharpens skills through curiosity.',
    accent: '#ff9d77',
    initials: 'LR',
    stat: 'Growth',
    image: '/images/learner.webp',
  },
];

function clampIndex(index, length) {
  return Math.min(Math.max(index, 0), Math.max(length - 1, 0));
}

function getInitials(item) {
  if (item.initials) return item.initials;
  return item.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Portrait({ item }) {
  const initials = getInitials(item);

  if (item.image) {
    return (
      <div className="orbit-portrait">
        <img src={item.image} alt={item.name} className="orbit-portrait-img" />
        <div className="orbit-initials">{initials}</div>
      </div>
    );
  }

  return (
    <div className="orbit-portrait" style={{ '--accent': item.accent ?? '#f3f1ea' }}>
      <div className="orbit-portrait-bg" />
      <div className="orbit-portrait-body" />
      <div className="orbit-portrait-head">
        <div className="orbit-portrait-mouth" />
        <div className="orbit-portrait-eye orbit-portrait-eye--left" />
        <div className="orbit-portrait-eye orbit-portrait-eye--right" />
        <div className="orbit-portrait-nose" />
        <div
          className="orbit-portrait-hair"
          style={{ backgroundColor: item.accent ?? '#f3f1ea' }}
        />
      </div>
      <div className="orbit-initials">{initials}</div>
    </div>
  );
}

export function CardStack({
  items = defaultItems,
  className,
  cardClassName,
  defaultActiveIndex = 2,
  spread: baseSpread = 168,
  lift = 34,
  onActiveChange,
  style,
}) {
  const shouldReduceMotion = useReducedMotion();
  const safeItems = items.length ? items : defaultItems;
  const stackLayout = useResponsiveStackLayout(baseSpread, safeItems.length, lift);
  const defaultIndex = clampIndex(defaultActiveIndex, safeItems.length);
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [raisedIndex, setRaisedIndex] = useState(defaultIndex);
  const raiseTimeoutRef = useRef(null);
  const collapseTimeoutRef = useRef(null);

  const center = (safeItems.length - 1) / 2;
  const transition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: 'spring', stiffness: 350, damping: 30, mass: 0.7 };

  useEffect(() => {
    return () => {
      if (raiseTimeoutRef.current) window.clearTimeout(raiseTimeoutRef.current);
      if (collapseTimeoutRef.current) window.clearTimeout(collapseTimeoutRef.current);
    };
  }, []);

  const activateCard = useCallback(
    (item, index) => {
      setActiveIndex(index);
      onActiveChange?.(item, index);

      if (raiseTimeoutRef.current) window.clearTimeout(raiseTimeoutRef.current);

      raiseTimeoutRef.current = window.setTimeout(
        () => setRaisedIndex(index),
        shouldReduceMotion ? 0 : 45,
      );
    },
    [onActiveChange, shouldReduceMotion],
  );

  const scheduleCollapse = useCallback(() => {
    if (collapseTimeoutRef.current) window.clearTimeout(collapseTimeoutRef.current);
    collapseTimeoutRef.current = window.setTimeout(() => {
      setExpanded(false);
      setActiveIndex(defaultIndex);
      setRaisedIndex(defaultIndex);
    }, 80);
  }, [defaultIndex]);

  const cancelCollapse = useCallback(() => {
    if (collapseTimeoutRef.current) {
      window.clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
  }, []);

  const cardLayouts = useMemo(
    () =>
      safeItems.map((_, index) => {
        const fromCenter = index - center;
        const collapsedFromActive = index - defaultIndex;

        return {
          collapsed: {
            x: collapsedFromActive * 10,
            y: Math.abs(collapsedFromActive) * 5,
            rotate: collapsedFromActive * 2.8,
          },
          expanded: {
            x: fromCenter * stackLayout.spread,
            y:
              Math.abs(fromCenter) * stackLayout.vertGap +
              Math.max(0, Math.abs(fromCenter) - 1) * stackLayout.vertExtra,
            rotate: fromCenter * stackLayout.fanRotation,
          },
        };
      }),
    [center, defaultIndex, safeItems, stackLayout],
  );

  const stackStyle = {
    '--orbit-card-width': `${stackLayout.cardWidth}px`,
    '--orbit-card-min-height': `${stackLayout.cardMinHeight}px`,
    '--orbit-stage-height': `${stackLayout.stageHeight}px`,
    '--orbit-stack-description-gap': `${stackLayout.descriptionGap}px`,
    ...style,
  };

  return (
    <div className={cn('orbit-stack-stage', className)} style={stackStyle}>
      <div className="orbit-stack-inner">
        {safeItems.map((item, index) => {
          const active = activeIndex === index;
          const cardLayout = cardLayouts[index] ?? cardLayouts[defaultIndex];
          const layout = expanded ? cardLayout.expanded : cardLayout.collapsed;
          const raised = raisedIndex === index;
          const zIndex = raised
            ? 80
            : expanded
              ? 50 - Math.abs(index - raisedIndex)
              : 50 - Math.abs(index - defaultIndex);

          return (
            <motion.article
              key={`${item.name}-${index}`}
              className={cn('orbit-card', cardClassName)}
              style={{ zIndex }}
              animate={{
                x: `calc(-50% + ${layout.x}px)`,
                y: `calc(-50% + ${layout.y - (active && expanded ? lift : 0)}px)`,
                rotate: layout.rotate,
                scale: expanded ? 0.985 : 0.97,
              }}
              transition={transition}
              tabIndex={0}
              onMouseEnter={() => {
                cancelCollapse();
                setExpanded(true);
                activateCard(item, index);
              }}
              onMouseLeave={scheduleCollapse}
              onFocus={() => {
                cancelCollapse();
                setExpanded(true);
                activateCard(item, index);
              }}
              onBlur={scheduleCollapse}
            >
              <div className="orbit-card-portrait-wrap">
                <Portrait item={item} />
                <div className="orbit-arrow-btn">
                  <ArrowUpRightIcon />
                </div>
              </div>

              <div className="orbit-card-body">
                <div>
                  <h3 className="orbit-card-name">{item.name}</h3>
                </div>
                <p className="orbit-card-desc">{item.description}</p>
                <div className="orbit-card-footer">
                  <span className="orbit-card-stat">{item.stat ?? 'Profile'}</span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

export default CardStack;