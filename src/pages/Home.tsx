import { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import { ScrollToTop } from "./componentes/ScrollToTop";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollProgress } from "../assets/styles/componentes/ScrollProgress";
import { useTheme } from "@/context/ThemeContext";
import { Particles } from "@/components/ui/particles";

type PageState = "criacao" | "resultado" | "historico";

const getPageState = (pathname: string): PageState => {
  const path = pathname.toLowerCase();
  if (path.startsWith("/resultado")) return "resultado";
  if (path.startsWith("/historico")) return "historico";
  return "criacao";
};

const STATE_CONFIG: Record<
  PageState,
  { scrollGradient: string; ambientGlow: string; pulseGlow: string }
> = {
  criacao: {
    // OURO PURO – primary → dourado radiante → bronze intenso
    scrollGradient:
      "bg-[radial-gradient(circle_at_right,var(--primary)_20%,#fbbf24_55%,#d97706_100%)]",
    ambientGlow:
      "bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.55),rgba(217,119,6,0.25)_50%,transparent_75%)]",
    pulseGlow:
      "bg-[radial-gradient(circle_at_top,rgba(253,224,71,0.95),rgba(251,191,36,0.50)_50%,transparent_75%)]",
  },

  resultado: {
    // VIDRO CRISTALINO – primary → ciano gelo → azul profundo (efeito refração)
    scrollGradient:
      "bg-[radial-gradient(circle_at_right,var(--primary)_20%,#67e8f9_55%,#1d4ed8_100%)]",
    ambientGlow:
      "bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.40),rgba(29,78,216,0.15)_50%,transparent_75%)]",
    pulseGlow:
      "bg-[radial-gradient(circle_at_top,rgba(165,243,252,0.90),rgba(103,232,249,0.40)_50%,transparent_75%)]",
  },

  historico: {
    // PRATA LUXUOSA – primary → prata metálica → grafite fumê
    scrollGradient:
      "bg-[radial-gradient(circle_at_right,var(--primary)_20%,#e2e8f0_55%,#475569_100%)]",
    ambientGlow:
      "bg-[radial-gradient(circle_at_top,rgba(226,232,240,0.55),rgba(71,85,105,0.25)_50%,transparent_75%)]",
    pulseGlow:
      "bg-[radial-gradient(circle_at_top,rgba(248,250,252,0.95),rgba(203,213,225,0.50)_50%,transparent_75%)]",
  },
};

export const Home = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  const { colorTheme, theme } = useTheme();

  const pageState = getPageState(location.pathname);
  const { scrollGradient, ambientGlow, pulseGlow } = STATE_CONFIG[pageState];

  const layoutRootClass = clsx(
    "w-full h-dvh overflow-hidden bg-background relative"
  );

  const ambientGlowClass = clsx(
    "absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl",
    "h-70 pointer-events-none blur-[45px] transition-all duration-700 ease-in-out z-0",
    ambientGlow
  );

  const pulseGlowClass = clsx(
    "page-state-pulse absolute top-0 left-1/2 -translate-x-1/2",
    "w-full max-w-6xl h-96 pointer-events-none blur-[55px] z-0",
    pulseGlow
  );

  const particlesContainerClass = clsx(
    "h-screen absolute inset-0 overflow-hidden pointer-events-none"
  );

  const particlesElementClass = clsx(
    "absolute inset-0"
  );

  const pageWrapper = clsx(
    "w-full h-full scroll-auto duration-100",
    "text-foreground overflow-y-auto",
    "snap-y-center snap-mandatory",
    "scrollbar-hide bg-stripes-custom0"
  );

  const layoutMain = clsx(
    "h-full w-full relative z-10",
    "bg-cover bg-center bg-no-repeat bg-fixed",
    "bg-background"
  );

  const containerOutlet = clsx(
    "min-h-screen w-full pt-6 px-2 relative z-10 mt-16 md:mt-26"
  );

  return (
    <div className={layoutRootClass}>
      <ScrollToTop />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes pageStatePulse {
              0% { opacity: 0; transform: scale(0.82); }
              35% { opacity: 1; transform: scale(1.08); }
              100% { opacity: 0; transform: scale(1.35); }
            }
            .page-state-pulse {
              animation: pageStatePulse 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }
          `,
        }}
      />

      <div className={ambientGlowClass} />

      <div key={pageState} className={pulseGlowClass} />

      <div className="absolute top-0 left-0 w-full z-50">
        <ScrollProgress
          key={`${colorTheme}-${theme}-${location.pathname}`}
          containerRef={mainRef}
          activeColor={scrollGradient}
        />
      </div>

      <main
        ref={mainRef}
        id="inicio"
        className={clsx(layoutMain, pageWrapper, "border-border")}
      >
        <div className={particlesContainerClass}>
          <Particles
            className={particlesElementClass}
            color={theme === "light" ? "#000000" : "#ffffff"}
            quantity={100}
          />
        </div>

        <Header />

        <div className={containerOutlet}>
          <Outlet />
        </div>

        <Footer />
      </main>
    </div>
  );
};