import { motion, useScroll, useSpring, useTransform } from "framer-motion"; // importa ferramentas de animação

interface ScrollProgressProps {
    containerRef: React.RefObject<HTMLElement | null>; // ref do elemento que terá o scroll observado
    activeColor: string; // classe de cor dinâmica (ex: bg-blue-500)
}

export const ScrollProgress = ({ containerRef, activeColor }: ScrollProgressProps) => {

    const { scrollYProgress } = useScroll({ // hook que monitora o scroll
        container: containerRef, // define qual elemento será observado (não precisa ser a página inteira)
    });

    const startAtTen = useTransform(scrollYProgress, [0, 1], [0.1, 1]); // mapeia 0→0.1 e 1→1 (não começa invisível)

    const scaleX = useSpring(startAtTen, { // suaviza o valor com física de mola
        stiffness: 100, // rigidez (maior = mais rápido)
        damping: 30, // amortecimento (maior = menos "quique")
        restDelta: 0.001 // precisão mínima pra parar a animação
    });

    return (
        <div className="fixed top-0 left-0 right-0 h-1.5 z-200 rounded-full overflow-hidden">
            <motion.div
                className={`h-full origin-left ${activeColor}`}
                style={{ scaleX }}
            />
        </div>
    );
};