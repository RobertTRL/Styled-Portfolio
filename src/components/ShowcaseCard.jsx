import React from "react";
import { motion } from "framer-motion";
import "../styles/showcasecard.css";

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
  const onCtaClick = () => {
    if (Ctalink) window.open(Ctalink, "_blank");
  };

  return (
    <motion.div
      className={`sc-card ${
        isDark ? "sc-card-dark" : "sc-card-light"
      } ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="sc-image-container">
        {tagline && (
          <motion.div
            className={`sc-tagline ${
              isDark ? "sc-tagline-dark" : "sc-tagline-light"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.2 }}
          >
            {tagline}
          </motion.div>
        )}

        <div className="sc-hero-img-wrapper">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="sc-hero-img"
            decoding="async"
          />
        </div>

        <div
          className={`sc-gradient-overlay ${
            isDark
              ? "sc-gradient-overlay-dark"
              : "sc-gradient-overlay-light"
          }`}
        />
      </div>

      <div className="sc-content">
        <motion.h2
          className={`sc-heading ${
            isDark ? "sc-heading-dark" : "sc-heading-light"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.2 }}
        >
          {heading}
        </motion.h2>

        {description && (
          <motion.p
            className={`sc-description ${
              isDark ? "sc-description-dark" : "sc-description-light"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.2 }}
          >
            {description}
          </motion.p>
        )}

        {Ctalink && (
          <motion.button
            type="button"
            onClick={onCtaClick}
            className={`sc-cta ${
              isDark ? "sc-cta-dark" : "sc-cta-light"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="sc-cta-shine" aria-hidden="true" />
            <span className="sc-cta-text">{ctaText}</span>
          </motion.button>
        )}
      </div>

      {(brandName || services.length > 0) && (
        <motion.div
          className={`sc-footer ${
            isDark ? "sc-footer-dark" : "sc-footer-light"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.2 }}
        >
          <div className="sc-footer-flex">
            {brandName && (
              <motion.span
                className={`sc-brand ${
                  isDark ? "sc-brand-dark" : "sc-brand-light"
                }`}
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
                      className={`sc-service ${
                        isDark ? "sc-service-dark" : "sc-service-light"
                      }`}
                      whileHover={{
                        color: isDark ? "#ffffff" : "#111827",
                        scale: 1.05,
                      }}
                    >
                      {service}
                    </motion.span>

                    {index < services.length - 1 && (
                      <motion.span
                        className={`sc-divider ${
                          isDark ? "sc-divider-dark" : "sc-divider-light"
                        }`}
                        initial={{ rotate: 0 }}
                        whileHover={{
                          color: isDark ? "#ffffff" : "#111827",
                          scale: 1.05,
                          rotate: 180,
                        }}
                        transition={{
                          duration: 0.6,
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

      <div className="sc-border-glow" aria-hidden="true" />
    </motion.div>
  );
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
  return (
    <motion.div
      className={`sc-compact-card ${
        isDark ? "sc-compact-card-dark" : "sc-compact-card-light"
      } ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      <div className="sc-compact-image">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="sc-hero-img"
          decoding="async"
        />
        <div className="sc-compact-gradient" />
      </div>

      <div className="sc-compact-content">
        <h3
          className={`sc-compact-heading ${
            isDark
              ? "sc-compact-heading-dark"
              : "sc-compact-heading-light"
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
        aria-hidden="true"
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
    </motion.div>
  );
}

export { ShowcaseCard, ShowcaseCardCompact };