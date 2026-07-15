"use client";

import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { collapsedLayout, expandedLayout, categoryColor } from "@/lib/stackLayout";
import { resolveSrc } from "@/lib/store";

interface Props {
  project: Project;
  focused: boolean;
  dimmed: boolean;
  expandMaxW: number;
  onHover: (h: boolean) => void;
}

/**
 * Ein haptischer Bilderstapel auf dem Lichttisch.
 * Zusammengelegt: versetzt rotierte Papiere. Klick → fächert elegant auf.
 */
export const ProjectStack = memo(function ProjectStack({ project, focused, dimmed, expandMaxW, onHover }: Props) {
  const [hovered, setHovered] = useState(false);
  const collapsed = useMemo(() => collapsedLayout(project), [project]);
  const expanded = useMemo(() => expandedLayout(project, expandMaxW), [project, expandMaxW]);

  return (
    <div
      data-slug={project.slug}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" && !focused) {
          setHovered(true);
          onHover(true);
        }
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") {
          setHovered(false);
          onHover(false);
        }
      }}
      className="ll-stack"
      style={{
        position: "absolute",
        left: project.x,
        top: project.y,
        width: 0,
        height: 0,
        transform: `translate3d(calc(var(--wind-x, 0px) * ${0.4 + (project.images.length % 3) * 0.18}), calc(var(--wind-y, 0px) * ${0.4 + (project.images.length % 3) * 0.18}), 0) rotate(${project.rot}deg)`,
        opacity: dimmed ? 0.28 : 1,
        filter: dimmed ? "blur(2.5px) saturate(0.8)" : "none",
        transition: "opacity 480ms var(--ease-flow), filter 480ms var(--ease-flow)",
        zIndex: focused ? 20 : 5,
      }}
    >
      {project.images.map((im, i) => {
        const c = collapsed[i];
        const x = expanded.items[i];
        const peek = hovered && !focused;
        const target = focused
          ? { x: x.x - x.w / 2, y: x.y - x.h / 2, rotate: x.rot, width: x.w, height: x.h }
          : {
              x: c.x - c.w / 2 + (peek && i === 1 ? -c.w * 0.06 : 0),
              y: c.y - c.h / 2 + (peek && i === 0 ? -10 : 0),
              rotate: c.rot + (peek ? (i === 0 ? -2 : i === 1 ? 2.5 : 0) : 0),
              width: c.w,
              height: c.h,
            };
        return (
          <motion.div
            key={im.src}
            className="ll-paper"
            data-idx={i}
            initial={false}
            animate={target}
            transition={{
              type: "spring",
              stiffness: focused ? 210 : 260,
              damping: focused ? 24 : 26,
              mass: 0.9,
              delay: (focused ? i : project.images.length - 1 - i) * 0.05,
            }}
            style={{
              position: "absolute",
              zIndex: focused ? x.z : c.z,
              boxShadow: focused
                ? "inset 0 0 0 0.5px rgba(23,18,28,0.10), var(--shadow-paper-lift)"
                : undefined,
            }}
          >
            <img
              src={resolveSrc(im.src)}
              alt={project.title.de}
              width={Math.round(im.w)}
              height={Math.round(im.h)}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
            />
            {i === 0 && !focused && (
              <span
                className="ll-tape"
                style={{ "--tape-color": categoryColor[project.category]?.tape } as React.CSSProperties}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
});
