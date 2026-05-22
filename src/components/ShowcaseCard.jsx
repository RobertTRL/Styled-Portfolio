import React, { useRef, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import "../styles/showcasecard.css"

// FIX: moved outside the component so it's not recreated on every render
const SPRING_CONFIG = { damping: 25, stiffness: 150 }

function ShowcaseCard({
    tagline,
    heading,
    description,
    imageUrl,
    imageAlt = "Showcase image",
    ctaText,
    brandName,
    services = [],
    className = "",
    enableTilt = true,
    maxTilt = 8,
    enableParallax = true,
    isDark = true,
    Ctalink
}) {
    const cardRef = useRef(null)
    const [isHovered, setIsHovered] = useState(false)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const rotateX = useSpring(
        useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]),
        SPRING_CONFIG
    )

    const rotateY = useSpring(
        useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]),
        SPRING_CONFIG
    )

    const parallaxX = useSpring(
        useTransform(mouseX, [-0.5, 0.5], [-15, 15]),
        SPRING_CONFIG
    )

    const parallaxY = useSpring(
        useTransform(mouseY, [-0.5, 0.5], [-15, 15]),
        SPRING_CONFIG
    )

    const glowX = useSpring(
        useTransform(mouseX, [-0.5, 0.5], [0, 100]),
        SPRING_CONFIG
    )

    const glowY = useSpring(
        useTransform(mouseY, [-0.5, 0.5], [0, 100]),
        SPRING_CONFIG
    )

    const handleMouseMove = useCallback(
        (e) => {
            if (!cardRef.current || !enableTilt) return

            const rect = cardRef.current.getBoundingClientRect()
            const x = (e.clientX - rect.left) / rect.width - 0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5

            mouseX.set(x)
            mouseY.set(y)
        },
        [mouseX, mouseY, enableTilt]
    )

    // FIX: replaced void ternary expression with a clean if statement
    const onCtaClick = () => {
        if (Ctalink) window.open(Ctalink, "_blank")
    }

    const handleMouseEnter = () => setIsHovered(true)

    const handleMouseLeave = () => {
        setIsHovered(false)
        mouseX.set(0)
        mouseY.set(0)
    }

    return (
        <motion.div
            ref={cardRef}
            className={`sc-card ${isDark ? "sc-card-dark" : "sc-card-light"} ${className}`}
            style={{
                transformStyle: "preserve-3d",
                perspective: 1000,
                rotateX: enableTilt ? rotateX : 0,
                rotateY: enableTilt ? rotateY : 0,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{
                scale: 1.02,
                boxShadow: isDark
                    ? "0 40px 80px -20px rgba(0,0,0,0.6)"
                    : "0 40px 80px -20px rgba(15,23,42,0.12)",
            }}
        >
            {/* Glow Overlay */}
            <motion.div
                className="sc-hover-glow"
                style={{
                    zIndex: 10,
                    pointerEvents: "none",
                    background: isDark
                        ? `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.08) 0%, transparent 50%)`
                        : `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.7) 0%, transparent 55%)`,
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Image */}
            <div className="sc-image-container">
                {tagline && (
                    <motion.div
                        className={`sc-tagline ${isDark ? "sc-tagline-dark" : "sc-tagline-light"}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {tagline}
                    </motion.div>
                )}

                <motion.div
                    className="sc-hero-img-wrapper"
                    style={{
                        x: enableParallax ? parallaxX : 0,
                        y: enableParallax ? parallaxY : 0,
                    }}
                >
                    <motion.img
                        src={imageUrl}
                        alt={imageAlt}
                        className="sc-hero-img"
                        initial={{ scale: 1 }}
                        animate={{ scale: isHovered ? 1.04 : 1 }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut",
                        }}
                    />
                </motion.div>

                <div
                    className={`sc-gradient-overlay ${
                        isDark ? "sc-gradient-overlay-dark" : "sc-gradient-overlay-light"
                    }`}
                />
            </div>

            {/* Content */}
            <div className="sc-content">
                <motion.h2
                    className={`sc-heading ${isDark ? "sc-heading-dark" : "sc-heading-light"}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {heading}
                </motion.h2>

                {description && (
                    <motion.p
                        className={`sc-description ${isDark ? "sc-description-dark" : "sc-description-light"}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        {description}
                    </motion.p>
                )}

                {Ctalink && (
                    <motion.button
                        onClick={onCtaClick}
                        className={`sc-cta ${isDark ? "sc-cta-dark" : "sc-cta-light"}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.span
                            className="sc-cta-shine"
                            animate={
                                isHovered
                                    ? { translateX: "200%" }
                                    : { translateX: "-100%" }
                            }
                            transition={{
                                duration: 0.6,
                                ease: "easeInOut",
                            }}
                        />
                        <span className="sc-cta-text">{ctaText}</span>
                    </motion.button>
                )}
            </div>

            {/* Footer */}
            {(brandName || services.length > 0) && (
                <motion.div
                    className={`sc-footer ${isDark ? "sc-footer-dark" : "sc-footer-light"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <div className="sc-footer-flex">
                        {brandName && (
                            <motion.span
                                className={`sc-brand ${isDark ? "sc-brand-dark" : "sc-brand-light"}`}
                                whileHover={{ color: isDark ? "#ffffff" : "#111827" }}
                            >
                                {brandName}
                            </motion.span>
                        )}

                        {services.length > 0 && (
                            <div className="sc-services">
                                {services.map((service, index) => (
                                    <React.Fragment key={service}>
                                        <motion.span
                                            className={`sc-service ${isDark ? "sc-service-dark" : "sc-service-light"}`}
                                            whileHover={{
                                                color: isDark ? "#ffffff" : "#111827",
                                                scale: 1.05,
                                            }}
                                        >
                                            {service}
                                        </motion.span>

                                        {index < services.length - 1 && (
                                            <motion.span
                                                className={`sc-divider ${isDark ? "sc-divider-dark" : "sc-divider-light"}`}
                                                initial={{ rotate: 0 }}
                                                whileHover={{ rotate: 180 }}
                                                transition={{
                                                    duration: 0.35,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                            >
                                                <span className="sc-divider-inner">✦</span>
                                            </motion.span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Border Glow */}
            <motion.div
                className="sc-border-glow"
                animate={{
                    boxShadow: isHovered
                        ? isDark
                            ? "inset 0 0 0 1px rgba(255,255,255,0.15)"
                            : "inset 0 0 0 1px rgba(17,24,39,0.08)"
                        : isDark
                        ? "inset 0 0 0 1px rgba(255,255,255,0.05)"
                        : "inset 0 0 0 1px rgba(17,24,39,0.04)",
                }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    )
}

function ShowcaseCardCompact({
    heading,
    description,
    imageUrl,
    imageAlt = "Showcase image",
    className = "",
    onClick,
    isDark = true,
}) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            className={`sc-compact-card ${
                isDark ? "sc-compact-card-dark" : "sc-compact-card-light"
            } ${className}`}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
        >
            <div className="sc-compact-image">
                <motion.img
                    src={imageUrl}
                    alt={imageAlt}
                    className="sc-hero-img"
                    animate={{ scale: isHovered ? 1.08 : 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                />
                <div className="sc-compact-gradient" />
            </div>

            <div className="sc-compact-content">
                <h3
                    className={`sc-compact-heading ${
                        isDark ? "sc-compact-heading-dark" : "sc-compact-heading-light"
                    }`}
                >
                    {heading}
                </h3>

                {description && (
                    <p
                        className={`sc-compact-desc ${
                            isDark ? "sc-compact-desc-dark" : "sc-compact-desc-light"
                        }`}
                    >
                        {description}
                    </p>
                )}
            </div>

            <motion.div
                className={`sc-compact-icon ${
                    isDark ? "sc-compact-icon-dark" : "sc-compact-icon-light"
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? 0 : -10,
                }}
                transition={{ duration: 0.2 }}
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                </svg>
            </motion.div>
        </motion.div>
    )
}

export { ShowcaseCard, ShowcaseCardCompact }