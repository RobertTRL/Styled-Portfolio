"use client"
 
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import "../styles/githubcalendar.css"
 
// Join truthy class names (replaces the cn() / clsx utility)
function cx(...classes) {
    return classes.filter(Boolean).join(" ")
}
 
// Maps a contribution level + schema + theme to a CSS class name
function getLevelClass(level, schema = "green", isDark = false) {
    const theme = isDark ? "dark" : "light"
    const map = {
        NONE:           `gc-${schema}-0-${theme}`,
        FIRST_QUARTILE: `gc-${schema}-1-${theme}`,
        SECOND_QUARTILE:`gc-${schema}-2-${theme}`,
        THIRD_QUARTILE: `gc-${schema}-3-${theme}`,
        FOURTH_QUARTILE:`gc-${schema}-4-${theme}`,
    }
    return map[level] ?? `gc-${schema}-0-${theme}`
}
 
// Maps shape prop to a CSS class name
function getShapeClass(shape) {
    const map = {
        circle:   "gc-shape-circle",
        square:   "gc-shape-square",
        squircle: "gc-shape-squircle",
        rounded:  "gc-shape-rounded",
    }
    return map[shape] ?? "gc-shape-rounded"
}
 
// Glow colour per schema
const glowColors = {
    green:  "#10b981",
    blue:   "#3b82f6",
    purple: "#a855f7",
    orange: "#f97316",
    gray:   "#a1a1aa",
}
 
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
    const [data, setData] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)
    const [hoveredDate, setHoveredDate] = React.useState(null)
    const [hoveredCount, setHoveredCount] = React.useState(null)
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })
 
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fetch(
                    `https://github-contributions-api.deno.dev/${username}.json`
                )
                if (!response.ok) throw new Error("Failed to fetch GitHub data")
                setData(await response.json())
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
            } finally {
                setLoading(false)
            }
        }
 
        if (username) fetchData()
    }, [username])
 
    if (error) {
        return (
            <div className={cx("gc-error", className)}>
                Error: {error}
            </div>
        )
    }
 
    if (loading) {
        return <div className={cx("gc-loading", className)} />
    }
 
    const weeks = data?.contributions || []
 
    return (
        <div className={cx("gc-container", className)}>
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
                onMouseLeave={() => {
                    setHoveredDate(null)
                    setHoveredCount(null)
                }}
            >
                {/* Tooltip */}
                <AnimatePresence>
                    {hoveredDate && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="gc-tooltip"
                            style={{ left: mousePos.x, top: mousePos.y - 40 }}
                        >
                            <span className="gc-tooltip-count">{hoveredCount}</span>
                            <span className="gc-tooltip-label">contributions on {hoveredDate}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
 
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="gc-week">
                        {week.map((day, dayIndex) => {
                            const isGlowing = variant === "city-lights" && day.contributionCount > 0
                            const isMinimal = variant === "minimal"
 
                            const glowPx = day.contributionCount > 3
                                ? glowIntensity * 1.5
                                : glowIntensity
                            const glowStyle = isGlowing && day.contributionLevel !== "NONE"
                                ? { boxShadow: `0 0 ${glowPx}px ${glowColors[colorSchema] ?? "#10b981"}` }
                                : undefined
 
                            return (
                                <motion.div
                                    key={day.date}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: weekIndex * 0.01 + dayIndex * 0.01,
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                    }}
                                    onMouseEnter={(e) => {
                                        setHoveredDate(day.date)
                                        setHoveredCount(day.contributionCount)
                                        const rect = e.currentTarget.getBoundingClientRect()
                                        const parentRect = e.currentTarget.offsetParent.getBoundingClientRect()
                                        setMousePos({
                                            x: rect.left - parentRect.left + rect.width / 2,
                                            y: rect.top - parentRect.top,
                                        })
                                    }}
                                    className={cx(
                                        "gc-day",
                                        getLevelClass(day.contributionLevel, colorSchema, isDark),
                                        getShapeClass(shape),
                                        isGlowing && "gc-glowing",
                                        isMinimal && "gc-minimal",
                                    )}
                                    style={glowStyle}
                                />
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}