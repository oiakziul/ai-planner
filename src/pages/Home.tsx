import { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import clsx from "clsx";
import { ScrollToTop } from "./componentes/ScrollToTop";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollProgress } from "../assets/styles/componentes/ScrollProgress";
import { useTheme } from "@/context/ThemeContext"; // Importado para escutar as mudanças de cor em tempo real

const getScrollGradient = (pathname: string): string => {
  const path = pathname.toLowerCase();

  // [PÁGINA 2]: Resultado da Simulação (Cobre "/resultado" e "/resultado/:id") -> Prata Sutil
  if (path.startsWith("/resultado")) {
    return "bg-gradient-to-r from-primary via-primary/95 to-slate-200/60";
  }

  // [PÁGINA 3]: Histórico de Simulações (Cobre "/historico") -> Bronze Sutil
  if (path.startsWith("/historico")) {
    return "bg-gradient-to-r from-primary via-primary/90 to-orange-700/80";
  }

  // [PÁGINA 1]: Inserção de Dados (Cobre o início "/" e qualquer rota de fallback "*") -> Ouro Solar
  return "bg-gradient-to-r from-primary via-primary/90 to-yellow-300/80";
};

export const Home = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  
  // 1. Escuta o contexto de temas. Isso garante que o componente Home reaja e mude de cor instantaneamente
  const { colorTheme, theme } = useTheme();

  // 2. Calcula o gradiente reativo com base no caminho da rota ativa
  const dynamicGradient = getScrollGradient(location.pathname);

  const pageWrapper = clsx(
    "w-full h-full scroll-auto duration-100",
    "text-foreground",
    "overflow-y-auto",
    "snap-y-center snap-mandatory",
    "scrollbar-hide bg-stripes-custom0"
  );

  const layoutMain = clsx(
    "h-full w-full",
    "bg-cover bg-center bg-no-repeat bg-fixed",
    "bg-background"
  );

  return (
    <div className="w-full h-dvh overflow-hidden bg-background">
      <ScrollToTop />

      {/* Forçamos a remontagem/re-renderização correta injetando uma key baseada no tema de cor ativo */}
      <ScrollProgress 
        key={`${colorTheme}-${theme}-${location.pathname}`} 
        containerRef={mainRef} 
        activeColor={dynamicGradient} 
      />

      <main
        ref={mainRef}
        id="inicio"
        className={clsx(
          layoutMain,
          pageWrapper,
          "border-border"
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