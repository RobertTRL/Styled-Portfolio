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
    isDark = true,
    Ctalink,
}) {
    const onCtaClick = (e) => {
        // don't let a click on the CTA bubble up to any parent click handler
        e.stopPropagation()
        if (Ctalink) window.open(Ctalink, "_blank", "noopener,noreferrer")
    }

    return (
        <div className={`sc-card ${isDark ? "sc-card-dark" : "sc-card-light"} ${className}`}>
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

                <div className="sc-hero-img-wrapper">
                    <img src={imageUrl} alt={imageAlt} className="sc-hero-img" />
                </div>
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
                        {ctaText}
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