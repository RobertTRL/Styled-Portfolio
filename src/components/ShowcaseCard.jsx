import React, { useRef, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import "../styles/showcasecard.css" // Import the raw CSS file

function ShowcaseCard({
    tagline,
    heading,
    description,
    imageUrl,
    imageAlt = "Showcase image",
    ctaText,
    onCtaClick,
    brandName,
    services = [],
    className = "",
    enableTilt = true,
    maxTilt = 8,
    enableParallax = true,
}) {
    const cardRef = useRef(null)
    const [isHovered, setIsHovered] = useState(false)

    // Mouse position for tilt effect
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth spring animation for tilt
    const springConfig = { damping: 25, stiffness: 150 }
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig)
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig)

    // Parallax transform for image
    const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig)
    const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig)

    // Glow effect position
    const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig)
    const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig)

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

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => {
        setIsHovered(false)
        mouseX.set(0)
        mouseY.set(0)
    }

    return (
        <motion.div
            ref={cardRef}
            className={`sc-card ${className}`}
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
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.02, boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)" }}
        >
            {/* Subtle glow overlay on hover */}
            <motion.div
                className="sc-hero-img-wrapper"
                style={{
                    zIndex: 10,
                    pointerEvents: "none",
                    background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Image Section */}
            <div className="sc-image-container">
                {tagline && (
                    <motion.div
                        className="sc-tagline"
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
                        scale: 1.0,
                    }}
                >
                    <motion.img
                        src={imageUrl}
                        alt={imageAlt}
                        className="sc-hero-img"
                        initial={{ scale: 1.0 }}
                        animate={{ scale: isHovered ? 1.04 : 1.0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                </motion.div>

                <div className="sc-gradient-overlay" />
            </div>

            {/* Content Section */}
            <div className="sc-content">
                <motion.h2
                    className="sc-heading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {heading}
                </motion.h2>

                {description && (
                    <motion.p
                        className="sc-description"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        {description}
                    </motion.p>
                )}

                {ctaText && (
                    <motion.button
                        onClick={onCtaClick}
                        className="sc-cta"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.span
                            className="sc-cta-shine"
                            animate={isHovered ? { translateX: "200%" } : { translateX: "-100%" }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                        <span className="sc-cta-text">{ctaText}</span>
                    </motion.button>
                )}
            </div>

            {/* Footer Section */}
            {(brandName || services.length > 0) && (
                <motion.div
                    className="sc-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <div className="sc-footer-flex">
                        {brandName && (
                            <motion.span
                                className="sc-brand"
                                whileHover={{ color: "#ffffff" }}
                                transition={{ duration: 0.2 }}
                            >
                                {brandName}
                            </motion.span>
                        )}

                        {services.length > 0 && (
                            <div className="sc-services">
                                {services.map((service, index) => (
                                    <React.Fragment key={service}>
                                        <motion.span
                                            className="sc-service"
                                            whileHover={{ color: "#ffffff", scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {service}
                                        </motion.span>
                                        {index < services.length - 1 && (
                                            <motion.span
                                                className="sc-divider"
                                                initial={{ rotate: 0 }}
                                                whileHover={{ rotate: 90 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                ✦
                                            </motion.span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Border glow effect */}
            <motion.div
                className="sc-border-glow"
                style={{
                    borderRadius: "1.5rem",
                    pointerEvents: "none",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
                }}
                animate={{
                    boxShadow: isHovered
                        ? "inset 0 0 0 1px rgba(255,255,255,0.15)"
                        : "inset 0 0 0 1px rgba(255,255,255,0.05)",
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
}) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            className={`sc-compact-card ${className}`}
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
                <h3 className="sc-compact-heading">{heading}</h3>
                {description && <p className="sc-compact-desc">{description}</p>}
            </div>

            <motion.div
                className="sc-compact-icon"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
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

function ShowcaseCardHorizontal({
    tagline,
    heading,
    description,
    imageUrl,
    imageAlt = "Showcase image",
    ctaText,
    onCtaClick,
    brandName,
    services = [],
    className = "",
    imagePosition = "left",
}) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            className={`sc-horizontal-card ${imagePosition === "right" ? "sc-img-right" : ""} ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.01 }}
        >
            <div className="sc-horizontal-image-wrapper">
                {tagline && (
                    <div className="sc-tagline" style={{ top: '1.5rem', left: '1.5rem' }}>
                        {tagline}
                    </div>
                )}
                <motion.img
                    src={imageUrl}
                    alt={imageAlt}
                    className="sc-hero-img"
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <div className="sc-horizontal-gradient" />
            </div>

            <div className="sc-horizontal-content">
                <motion.h2
                    className="sc-horizontal-heading"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {heading}
                </motion.h2>

                {description && (
                    <motion.p
                        className="sc-horizontal-desc"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        {description}
                    </motion.p>
                )}

                {ctaText && (
                    <motion.button
                        onClick={onCtaClick}
                        className="sc-horizontal-cta"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {ctaText}
                    </motion.button>
                )}

                {(brandName || services.length > 0) && (
                    <div className="sc-horizontal-footer">
                        {brandName && <span className="sc-service">{brandName}</span>}
                        {services.length > 0 && (
                            <div className="sc-services">
                                {services.map((service, index) => (
                                    <React.Fragment key={service}>
                                        <span className="sc-service">{service}</span>
                                        {index < services.length - 1 && (
                                            <span className="sc-divider">✦</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

function ShowcaseGrid({
    children,
    columns = 3,
    gap = "md",
    className = "",
}) {
    return (
        <div className={`sc-grid sc-gap-${gap} sc-cols-${columns} ${className}`}>
            {children}
        </div>
    )
}

export {
    ShowcaseCard,
    ShowcaseCardCompact,
    ShowcaseCardHorizontal,
    ShowcaseGrid,
}