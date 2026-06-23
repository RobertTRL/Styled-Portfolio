import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/cardstack.css';

/* ── tiny classname helper (replaces cn from @/lib/utils) ── */
function cn(...args) {
  return args.filter(Boolean).join(' ');
}

/* ── inline arrow-up-right icon (replaces lucide-react) ── */
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

/* ── default data ── */
const defaultItems = [
  {
    name: 'Mira Vale',
    role: 'Creative Lead',
    description:
      'Shapes visual systems with enough restraint to feel expensive and enough edge to be remembered.',
    accent: '#f8d66d',
    initials: 'MV',
    stat: 'Identity',
    image: '/images/orbit-card-stack/mira-vale.png',
  },
  {
    name: 'Noor Kade',
    role: 'Product Strategy',
    description:
      'Turns loose ideas into sharp product moves, crisp priorities, and launchable experiences.',
    accent: '#78dcca',
    initials: 'NK',
    stat: 'Roadmap',
    image: '/images/orbit-card-stack/noor-kade.png',
  },
  {
    name: 'Ari Chen',
    role: 'Founder',
    description:
      'Sets the taste bar, protects the details, and keeps the whole team pointed at the same high signal.',
    accent: '#f3f1ea',
    initials: 'AC',
    stat: 'Vision',
    image: '/images/orbit-card-stack/ari-chen.png',
  },
  {
    name: 'Sana Holt',
    role: 'Frontend Engineer',
    description:
      'Builds the motion, polish, and interface texture that make the product feel calm under pressure.',
    accent: '#b9a7ff',
    initials: 'SH',
    stat: 'Motion',
    image: '/images/orbit-card-stack/sana-holt.png',
  },
  {
    name: 'Ezra Moon',
    role: 'Operations',
    description:
      'Keeps the machine quiet, the handoffs clean, and the team moving without pointless friction.',
    accent: '#ff9d77',
    initials: 'EM',
    stat: 'Systems',
    image: '/images/orbit-card-stack/ezra-moon.png',
  },
];

/* ── helpers ── */
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

/* ── Portrait sub-component ── */
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

  /* illustrated placeholder face */
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

/* ── main component ── */
export function CardStack({
  items = defaultItems,
  className,
  cardClassName,
  defaultActiveIndex = 2,
  spread = 168,
  lift = 34,
  onActiveChange,
}) {
  const shouldReduceMotion = useReducedMotion();
  const safeItems = items.length ? items : defaultItems;
  const defaultIndex = clampIndex(defaultActiveIndex, safeItems.length);
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [raisedIndex, setRaisedIndex] = useState(defaultIndex);
  const raiseTimeoutRef = useRef(null);

  const center = (safeItems.length - 1) / 2;
  const transition = shouldReduceMotion
    ? { duration: 0.01 }
    : { type: 'spring', stiffness: 350, damping: 30, mass: 0.7 };

  const collapseTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (raiseTimeoutRef.current) window.clearTimeout(raiseTimeoutRef.current);
      if (collapseTimeoutRef.current) window.clearTimeout(collapseTimeoutRef.current);
    };
  }, []);

  const activateCard = (item, index) => {
    setActiveIndex(index);
    onActiveChange?.(item, index);

    if (raiseTimeoutRef.current) window.clearTimeout(raiseTimeoutRef.current);

    raiseTimeoutRef.current = window.setTimeout(
      () => setRaisedIndex(index),
      shouldReduceMotion ? 0 : 45,
    );
  };

  const scheduleCollapse = () => {
    if (collapseTimeoutRef.current) window.clearTimeout(collapseTimeoutRef.current);
    collapseTimeoutRef.current = window.setTimeout(() => {
      setExpanded(false);
      setActiveIndex(defaultIndex);
      setRaisedIndex(defaultIndex);
    }, 80);
  };

  const cancelCollapse = () => {
    if (collapseTimeoutRef.current) {
      window.clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
  };

  const cardLayouts = useMemo(
    () =>
      safeItems.map((_, index) => {
        const fromCenter = index - center;
        const collapsedFromActive = index - defaultIndex;
        const expandedRotate = fromCenter * 8.5;

        return {
          collapsed: {
            x: collapsedFromActive * 10,
            y: Math.abs(collapsedFromActive) * 5,
            rotate: collapsedFromActive * 2.8,
          },
          expanded: {
            x: fromCenter * spread,
            y:
              Math.abs(fromCenter) * 30 +
              Math.max(0, Math.abs(fromCenter) - 1) * 10,
            rotate: expandedRotate,
          },
        };
      }),
    [center, defaultIndex, safeItems, spread],
  );

  return (
    <div className={cn('orbit-stack-stage', className)}>
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
                setExpanded(true);
                activateCard(item, index);
              }}
            >
              <div className="orbit-card-portrait-wrap">
                <Portrait item={item} />
                <div className="orbit-arrow-btn">
                  <ArrowUpRightIcon />
                </div>
              </div>

              <div className="orbit-card-body">
                <div>
                  <p className="orbit-card-role">{item.role}</p>
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