import { useLayoutEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface ScrollProgressProps {
  containerRef: React.RefObject<HTMLElement | null>;
  activeColor: string;
}

export const ScrollProgress = ({ containerRef, activeColor }: ScrollProgressProps) => {
  const rawProgress = useMotionValue(0);

  const scaleX = useSpring(rawProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 0) {
        rawProgress.set(0.03);
        return;
      }

      const ratio = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      rawProgress.set(0.03 + ratio * 0.97);
    };

    updateProgress();

    el.addEventListener("scroll", updateProgress, { passive: true });

    const resizeObserver = new ResizeObserver(updateProgress);
    resizeObserver.observe(el);

    el.addEventListener("transitionend", updateProgress);

    return () => {
      el.removeEventListener("scroll", updateProgress);
      el.removeEventListener("transitionend", updateProgress);
      resizeObserver.disconnect();
    };
  }, [containerRef, rawProgress]);

  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden">
      <motion.div
        className={`h-full origin-left ${activeColor}`}
        style={{ scaleX }}
      />
    </div>
  );
};