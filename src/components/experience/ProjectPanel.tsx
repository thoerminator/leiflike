"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

interface Props {
  project: Project | null;
  onClose: () => void;
}

/** Die Projekt-Infokarte, die beim Fan-Out hereingleitet. */
export function ProjectPanel({ project, onClose }: Props) {
  const { t, l } = useI18n();
  return (
    <AnimatePresence>
      {project && (
        <motion.aside
          key={project.slug}
          initial={{ x: 60, opacity: 0, rotate: 0.8 }}
          animate={{ x: 0, opacity: 1, rotate: -0.4 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 28, delay: 0.18 }}
          className="ll-panel"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <span className="ll-eyebrow">{project.year ?? t(project.category)}</span>
            <button
              onClick={onClose}
              aria-label={t("close")}
              style={{
                border: "none",
                background: "var(--accent-soft)",
                color: "var(--text-strong)",
                width: 34,
                height: 34,
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "1rem",
                lineHeight: 1,
                transition: "transform var(--dur-fast) var(--ease-pop), opacity var(--dur-fast)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              ×
            </button>
          </div>

          <h2 style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)", margin: "0.7em 0 0.35em" }}>
            {l(project.title)}
          </h2>

          <span className="ll-tag" style={{ marginBottom: "1.1em" }}>
            {t(project.category)}
          </span>

          <dl style={{ margin: "1.1em 0 0", display: "grid", gap: "0.8em" }}>
            {project.client && (
              <div>
                <dt className="ll-dt">{t("client")}</dt>
                <dd className="ll-dd">{l(project.client)}</dd>
              </div>
            )}
            {project.scope && (
              <div>
                <dt className="ll-dt">{t("scope")}</dt>
                <dd className="ll-dd">{l(project.scope)}</dd>
              </div>
            )}
            {project.year && (
              <div>
                <dt className="ll-dt">{t("year")}</dt>
                <dd className="ll-dd">{project.year}</dd>
              </div>
            )}
          </dl>

          {project.note && (
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.05rem",
                lineHeight: 1.45,
                color: "var(--text-strong)",
                marginTop: "1.4em",
              }}
            >
              „{l(project.note)}“
            </p>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
