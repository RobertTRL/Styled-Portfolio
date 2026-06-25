import * as React from "react";
import "../styles/githubcalendar.css";

function cx(...classes) {
    return classes.filter(Boolean).join(" ");
}

function getLevelClass(level, schema = "green", isDark = false) {
    const theme = isDark ? "dark" : "light";
    const map = {
        NONE: `gc-${schema}-0-${theme}`,
        FIRST_QUARTILE: `gc-${schema}-1-${theme}`,
        SECOND_QUARTILE: `gc-${schema}-2-${theme}`,
        THIRD_QUARTILE: `gc-${schema}-3-${theme}`,
        FOURTH_QUARTILE: `gc-${schema}-4-${theme}`,
    };
    return map[level] ?? `gc-${schema}-0-${theme}`;
}

function getShapeClass(shape) {
    const map = {
        circle: "gc-shape-circle",
        square: "gc-shape-square",
        squircle: "gc-shape-squircle",
        rounded: "gc-shape-rounded",
    };
    return map[shape] ?? "gc-shape-rounded";
}

const glowColors = {
    green: "#10b981",
    blue: "#3b82f6",
    purple: "#a855f7",
    orange: "#f97316",
    gray: "#a1a1aa",
};

export function GithubCalendar({
    username,
    variant = "default",
    shape = "rounded",
    glowIntensity = 5,
    className,
    showTotal = true,
    colorSchema = "green",
    isDark = false,
}) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // ISSUE-05 FIX: Replace 3 separate state vars with one combined object.
    // Before: setHoveredDate + setHoveredCount + setMousePos = 3 re-renders per hover.
    // After:  setHovered({ date, count, x, y })           = 1 re-render per hover.
    // Also fixes the original bug where onMouseLeave never cleared mousePos.
    const [hovered, setHovered] = React.useState(null); // null | { date, count, x, y }

    const containerRef = React.useRef(null);

    React.useEffect(() => {
        if (!username) return undefined;

        const controller = new AbortController();

        async function fetchData() {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://github-contributions-api.deno.dev/${username}.json`,
                    { signal: controller.signal }
                );
                if (!response.ok) throw new Error("Failed to fetch GitHub data");
                setData(await response.json());
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err instanceof Error ? err.message : "An error occurred");
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        fetchData();
        return () => controller.abort();
    }, [username]);

    React.useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new ResizeObserver(() => {
            const parent = el.parentElement;
            if (!parent) return;

            const naturalWidth = el.scrollWidth;
            const available = parent.clientWidth;
            const scale =
                available > 0 ? Math.min(1, available / naturalWidth) : 1;

            el.style.setProperty("--gc-scale", scale);

            parent.style.height =
                scale < 1 ? `${el.scrollHeight * scale}px` : "";
        });

        observer.observe(el.parentElement);
        return () => observer.disconnect();
    }, [data]);

    // Stable reference — not recreated on every render.
    // Also clears the full hovered object (fixes the original mousePos leak).
    const handleMouseLeave = React.useCallback(() => setHovered(null), []);

    if (error) {
        return <div className={cx("gc-error", className)}>Error: {error}</div>;
    }

    if (loading) {
        return <div className={cx("gc-loading", className)} aria-hidden="true" />;
    }

    const weeks = data?.contributions || [];

    return (
        <div className="gc-wrapper">
            <div ref={containerRef} className={cx("gc-container", className)}>
                {showTotal && (
                    <div className="gc-header">
                        <div className="gc-username">
                            <svg
                                height="16"
                                aria-hidden="true"
                                viewBox="0 0 16 16"
                                width="16"
                                className="gc-icon"
                            >
                                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                            </svg>
                            <span
                                className="gc-username-text"
                                style={isDark ? { color: "#ffffff" } : undefined}
                            >
                                @{username}
                            </span>
                        </div>
                        <span className="gc-total-text">
                            {data?.totalContributions} contributions in the last year
                        </span>
                    </div>
                )}

                <div
                    className="gc-grid"
                    onMouseLeave={handleMouseLeave}
                    aria-label={`GitHub contribution calendar for ${username}`}
                >
                    {/* Tooltip reads from the single hovered object */}
                    {hovered && (
                        <div
                            className="gc-tooltip"
                            style={{ left: hovered.x, top: hovered.y - 40 }}
                        >
                            <span className="gc-tooltip-count">{hovered.count}</span>
                            <span className="gc-tooltip-label">
                                contributions on {hovered.date}
                            </span>
                        </div>
                    )}

                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="gc-week">
                            {week.map((day) => {
                                const isGlowing =
                                    variant === "city-lights" && day.contributionCount > 0;
                                const isMinimal = variant === "minimal";
                                const glowPx =
                                    day.contributionCount > 3
                                        ? glowIntensity * 1.5
                                        : glowIntensity;
                                const glowStyle =
                                    isGlowing && day.contributionLevel !== "NONE"
                                        ? {
                                              boxShadow: `0 0 ${glowPx}px ${
                                                  glowColors[colorSchema] ?? "#10b981"
                                              }`,
                                          }
                                        : undefined;

                                return (
                                    <div
                                        key={day.date}
                                        onMouseEnter={(e) => {
                                            // ISSUE-05 FIX: ONE setState call → ONE re-render.
                                            // Was: setHoveredDate + setHoveredCount + setMousePos (3 calls).
                                            const rect =
                                                e.currentTarget.getBoundingClientRect();
                                            const parentRect =
                                                e.currentTarget.offsetParent?.getBoundingClientRect() ??
                                                { left: 0, top: 0 };
                                            setHovered({
                                                date: day.date,
                                                count: day.contributionCount,
                                                x: rect.left - parentRect.left + rect.width / 2,
                                                y: rect.top - parentRect.top,
                                            });
                                        }}
                                        className={cx(
                                            "gc-day",
                                            getLevelClass(
                                                day.contributionLevel,
                                                colorSchema,
                                                isDark
                                            ),
                                            getShapeClass(shape),
                                            isGlowing && "gc-glowing",
                                            isMinimal && "gc-minimal"
                                        )}
                                        style={glowStyle}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}