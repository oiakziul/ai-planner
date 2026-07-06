import { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import { ScrollToTop } from "./componentes/ScrollToTop";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollProgress } from "../assets/styles/componentes/ScrollProgress";
import { useTheme } from "@/context/ThemeContext";

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

    scrollGradient:
      "bg-[radial-gradient(circle_at_right,var(--primary)_15%,#f59e0b_50%,#b45309_100%)]",
    ambientGlow:
      "bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.45),rgba(180,83,9,0.25)_50%,transparent_75%)]",
    pulseGlow:
      "bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.8),rgba(245,158,11,0.4)_50%,transparent_75%)]",
  },
  resultado: {

    scrollGradient:
      "bg-[radial-gradient(circle_at_right,var(--primary)_10%,#94a3b8_45%,#475569_100%)]",
    ambientGlow:
      "bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.55),rgba(71,85,105,0.3)_50%,transparent_75%)]",
    pulseGlow:
      "bg-[radial-gradient(circle_at_top,rgba(226,232,240,0.85),rgba(100,116,139,0.45)_50%,transparent_75%)]",
  },
  historico: {

    scrollGradient:
      "bg-[radial-gradient(circle_at_right,var(--primary)_10%,#c2703c_45%,#7c3f23_100%)]",
    ambientGlow:
      "bg-[radial-gradient(circle_at_top,rgba(194,112,60,0.4),rgba(124,63,35,0.22)_50%,transparent_75%)]",
    pulseGlow:
      "bg-[radial-gradient(circle_at_top,rgba(224,137,79,0.75),rgba(124,63,35,0.35)_50%,transparent_75%)]",
  },
};

export const Home = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  const { colorTheme, theme } = useTheme();

  const pageState = getPageState(location.pathname);
  const { scrollGradient, ambientGlow, pulseGlow } = STATE_CONFIG[pageState];

  const pageWrapper = clsx(
    "w-full h-full scroll-auto duration-100",
    "text-foreground",
    "overflow-y-auto",
    "snap-y-center snap-mandatory",
    "scrollbar-hide bg-stripes-custom0"
  );

  const layoutMain = clsx(
    "h-full w-full relative z-10",
    "bg-cover bg-center bg-no-repeat bg-fixed",
    "bg-background"
  );

  return (
    <div className="w-full h-dvh overflow-hidden bg-background relative">
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

      <div
        className={clsx(
          "absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-70 pointer-events-none blur-[45px] transition-all duration-700 ease-in-out z-0",
          ambientGlow
        )}
      />

      <div
        key={pageState}
        className={clsx(
          "page-state-pulse absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 pointer-events-none blur-[55px] z-0",
          pulseGlow
        )}
      />

      <ScrollProgress
        key={`${colorTheme}-${theme}-${location.pathname}`}
        containerRef={mainRef}
        activeColor={scrollGradient}
      />

      <main
        ref={mainRef}
        id="inicio"
        className={clsx(layoutMain, pageWrapper, "border-border")}
      >
        <Header />

        <div className="min-h-screen w-full pt-6 px-2 relative z-10">
          <Outlet />
        </div>

        <Footer />
      </main>
    </div>
  );
};