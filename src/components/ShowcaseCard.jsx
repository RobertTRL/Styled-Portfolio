import React from "react"
import "../styles/showcasecard.css"

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
    maxTilt = 12,
    enableParallax = true,
    isDark = true,
    Ctalink,
}) {
    const onCtaClick = (e) => {
        // don't let a click on the CTA bubble up to any parent click handler
        e.stopPropagation()
        if (Ctalink) window.open(Ctalink, "_blank", "noopener,noreferrer")
    }

    // Only property still needed from JS: how strong the CSS-driven tilt
    // should be. Everything else is a plain className toggle now.
    const cardStyle = enableTilt ? { "--sc-tilt": `${maxTilt}deg` } : undefined

    return (
        <div
            className={`sc-card ${isDark ? "sc-card-dark" : "sc-card-light"} ${
                enableTilt ? "sc-tilt-enabled" : ""
            } ${className}`}
            style={cardStyle}
        >
            {/* Glow Overlay - fades in on hover via CSS, no cursor tracking */}
            <div
                className={`sc-hover-glow ${
                    isDark ? "sc-hover-glow-dark" : "sc-hover-glow-light"
                }`}
            />

            {/* Image */}
            <div className="sc-image-container">
                {tagline && (
                    <div
                        className={`sc-tagline ${
                            isDark ? "sc-tagline-dark" : "sc-tagline-light"
                        }`}
                    >
                        {tagline}
                    </div>
                )}

                <div
                    className={`sc-hero-img-wrapper ${
                        enableParallax ? "sc-parallax-enabled" : ""
                    }`}
                >
                    <img src={imageUrl} alt={imageAlt} className="sc-hero-img" />
                </div>

                <div
                    className={`sc-gradient-overlay ${
                        isDark ? "sc-gradient-overlay-dark" : "sc-gradient-overlay-light"
                    }`}
                />
            </div>

            {/* Content */}
            <div className="sc-content">
                <h2
                    className={`sc-heading ${
                        isDark ? "sc-heading-dark" : "sc-heading-light"
                    }`}
                >
                    {heading}
                </h2>

                {description && (
                    <p
                        className={`sc-description ${
                            isDark ? "sc-description-dark" : "sc-description-light"
                        }`}
                    >
                        {description}
                    </p>
                )}

                {Ctalink && (
                    <button
                        type="button"
                        onClick={onCtaClick}
                        className={`sc-cta ${isDark ? "sc-cta-dark" : "sc-cta-light"}`}
                    >
                        <span className="sc-cta-shine" />
                        <span className="sc-cta-text">{ctaText}</span>
                    </button>
                )}
            </div>

            {/* Footer */}
            {(brandName || services.length > 0) && (
                <div className="sc-footer">
                    <div className="sc-footer-flex">
                        {brandName && (
                            <span
                                className={`sc-brand ${
                                    isDark ? "sc-brand-dark" : "sc-brand-light"
                                }`}
                            >
                                {brandName}
                            </span>
                        )}

                        {services.length > 0 && (
                            <div className="sc-services">
                                {services.map((service, index) => (
                                    <React.Fragment key={service}>
                                        <span
                                            className={`sc-service ${
                                                isDark ? "sc-service-dark" : "sc-service-light"
                                            }`}
                                        >
                                            {service}
                                        </span>

                                        {index < services.length - 1 && (
                                            <span
                                                className={`sc-divider ${
                                                    isDark ? "sc-divider-dark" : "sc-divider-light"
                                                }`}
                                            >
                                                <span className="sc-divider-inner">✦</span>
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Border Glow */}
            <div
                className={`sc-border-glow ${
                    isDark ? "sc-border-glow-dark" : "sc-border-glow-light"
                }`}
            />
        </div>
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
    const handleKeyDown = (e) => {
        if (!onClick) return
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onClick(e)
        }
    }

    return (
        <div
            className={`sc-compact-card ${
                isDark ? "sc-compact-card-dark" : "sc-compact-card-light"
            } ${className}`}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <div className="sc-compact-image">
                <img src={imageUrl} alt={imageAlt} className="sc-hero-img" />
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

            <div
                className={`sc-compact-icon ${
                    isDark ? "sc-compact-icon-dark" : "sc-compact-icon-light"
                }`}
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
            </div>
        </div>
    )
}

export { ShowcaseCard, ShowcaseCardCompact }