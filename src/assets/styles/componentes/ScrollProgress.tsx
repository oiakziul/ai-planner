import { useEffect } from "react";
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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScroll = scrollHeight - clientHeight;

      // Se não houver rolagem, mantém o mínimo visual (3%)
      if (maxScroll <= 0) {
        rawProgress.set(0.03);
        return;
      }

      const ratio = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      rawProgress.set(0.03 + ratio * 0.97);
    };

    updateProgress();

    const timeout = setTimeout(updateProgress, 150);

    el.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    const resizeObserver = new ResizeObserver(updateProgress);
    resizeObserver.observe(el);

    const mutationObserver = new MutationObserver(updateProgress);
    mutationObserver.observe(el, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    });

    return () => {
      clearTimeout(timeout);
      el.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
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