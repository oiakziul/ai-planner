import { motion, useScroll, useSpring, useTransform } from "framer-motion";

interface ScrollProgressProps {
    containerRef: React.RefObject<HTMLElement | null>;
    activeColor: string;
}

export const ScrollProgress = ({ containerRef, activeColor }: ScrollProgressProps) => {

    const { scrollYProgress } = useScroll({
        container: containerRef,
    });

    const startAt5Percent = useTransform(scrollYProgress, [0, 1], [0.05, 1]);

    const scaleX = useSpring(startAt5Percent, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="fixed top-0 left-0 right-0 h-1.5 z-99999 rounded-full overflow-hidden">
            <motion.div
                className={`h-full origin-left ${activeColor}`}
                style={{ scaleX }}
            />
        </div>
    );
};