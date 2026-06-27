import { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import { ScrollToTop } from "./componentes/ScrollToTop";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollProgress } from "../assets/styles/components/ScrollProgress";

const getScrollColor = (pathname: string) => {
  const path = pathname.toLowerCase();

  if (path === "/") return "bg-cor2"; 
  if (path.startsWith("/pagina1")) return "bg-cor4"; 
  if (path.startsWith("/pagina2")) return "bg-cor5"; 
  if (path.startsWith("/pagina3")) return "bg-cor1"; 

  return "bg-cor3"; 
};

export const Home = () => {
  const location = useLocation();
  const dynamicColor = getScrollColor(location.pathname);
  const mainRef = useRef<HTMLElement>(null);

  const pageWrapper = clsx(
    "w-full h-full scroll-auto duration-100",
    "text-foreground",
    "overflow-y-auto",
    "snap-y-center snap-mandatory",
    "scrollbar-hide bg-stripes-custom0 " 
  );

  // Estilos de fundo e estrutura do main
  const layoutMain = clsx(
    "h-full w-full",
    "bg-cover bg-center bg-no-repeat bg-fixed",
    "bg-background"
  );

  return (
    <div className="w-full h-dvh overflow-hidden bg-background">
      <ScrollToTop />

      <ScrollProgress containerRef={mainRef} activeColor={dynamicColor} />

      <main
        ref={mainRef}
        id="inicio"
        className={clsx(
          layoutMain,
          pageWrapper,
          "border-border",
        )}
      >
        <Header /> 

        <div className="min-h-screen w-full pt-6 px-2">
          <Outlet />
        </div>

        <Footer />
      </main>
    </div>
  );
};