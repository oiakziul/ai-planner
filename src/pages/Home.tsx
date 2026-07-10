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
    scrollGradient:
      "bg-[radial-gradient(circle_at_right,var(--primary)_15%,oklch(0.82_0.19_78)_50%,oklch(0.58_0.21_45)_100%)]", 
    ambientGlow:
      "bg-[radial-gradient(circle_at_top,oklch(0.82_0.19_78_/_0.45),oklch(0.58_0.21_45_/_0.20)_50%,transparent_75%)]",
    pulseGlow:
      "bg-[radial-gradient(circle_at_top,oklch(0.90_0.15_85_/_0.90),oklch(0.75_0.18_70_/_0.40)_50%,transparent_75%)]",
  },

  resultado: {
    scrollGradient:
      "bg-[radial-gradient(circle_at_right,var(--primary)_15%,oklch(0.65_0.11_285)_45%,oklch(0.32_0.09_275)_100%)]", 
    ambientGlow:
      "bg-[radial-gradient(circle_at_top,oklch(0.65_0.11_285_/_0.40),oklch(0.32_0.09_275_/_0.20)_50%,transparent_75%)]",
    pulseGlow:
      "bg-[radial-gradient(circle_at_top,oklch(0.75_0.13_290_/_0.80),oklch(0.50_0.10_280_/_0.40)_50%,transparent_75%)]",
  },

  historico: {
   scrollGradient:
      "bg-[radial-gradient(circle_at_right,var(--primary)_15%,oklch(0.68_0.19_315)_50%,oklch(0.38_0.14_305)_100%)]", 
    ambientGlow:
      "bg-[radial-gradient(circle_at_top,oklch(0.68_0.19_315_/_0.40),oklch(0.38_0.14_305_/_0.20)_50%,transparent_75%)]",
    pulseGlow:
      "bg-[radial-gradient(circle_at_top,oklch(0.82_0.16_310_/_0.85),oklch(0.55_0.15_308_/_0.40)_50%,transparent_75%)]",
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