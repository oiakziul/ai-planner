import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { US, BR, ES } from "country-flag-icons/react/3x2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useTheme, type ColorTheme } from "@/context/ThemeContext";
// [NOVO]: Importação do seu círculo cromático personalizado com centro dinâmico
import { ColorWheelIcon } from "@/assets/styles/componentes/ColorWheelIcon";
import { Menu, ChartNoAxesCombined, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import InteractiveHoverButton from "@/components/shadcn-space/button/button-19";
import ButtonRipple from "@/components/shadcn-space/button/button-16";

const navLinks = [
  { to: "/", label: "Início" },
  { to: "/resultado", label: "Resultado" },
  { to: "/historico", label: "Histórico" },
];

// Atualizado com todas as 17 cores para corresponder aos seus arquivos de temas
const THEME_OPTIONS: { id: ColorTheme; name: string; dotClass: string }[] = [
  // FILEIRA 1: Tons Quentes (Rosa ao Amarelo/Lima)
  { id: "rose", name: "Vinho (Padrão)", dotClass: "bg-rose-500" },
  { id: "red", name: "Vermelho", dotClass: "bg-red-500" },
  { id: "orange", name: "Laranja", dotClass: "bg-orange-500" },
  { id: "amber", name: "Âmbar", dotClass: "bg-amber-500" },
  { id: "yellow", name: "Amarelo", dotClass: "bg-yellow-500" },
  { id: "lime", name: "Limão", dotClass: "bg-lime-500" },

  // FILEIRA 2: Transição Verdes para Azuis Claros
  { id: "green", name: "Verde", dotClass: "bg-green-500" },
  { id: "emerald", name: "Esmeralda", dotClass: "bg-emerald-500" },
  { id: "teal", name: "Teal", dotClass: "bg-teal-500" },
  { id: "cyan", name: "Ciano", dotClass: "bg-cyan-500" },
  { id: "sky", name: "Céu", dotClass: "bg-sky-500" },
  { id: "blue", name: "Azul", dotClass: "bg-blue-500" },

  // FILEIRA 3: Tons Frios Escuros, Roxos e o Neutro
  { id: "indigo", name: "Índigo", dotClass: "bg-indigo-500" },
  { id: "violet", name: "Violeta", dotClass: "bg-violet-600" },
  { id: "purple", name: "Roxo", dotClass: "bg-purple-500" },
  { id: "fuchsia", name: "Fúcsia", dotClass: "bg-fuchsia-500" },
  { id: "pink", name: "Rosa", dotClass: "bg-pink-500" },
  { id: "slate", name: "Cinza Minimalista", dotClass: "bg-slate-500" },
];

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation("header");
  const location = useLocation();
  const navigate = useNavigate();
  const { colorTheme, setColorTheme } = useTheme();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const langRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainScroll = document.querySelector("main");
    const handleScroll = () => {
      if (mainScroll) setIsAtTop(mainScroll.scrollTop < 5);
    };
    mainScroll?.addEventListener("scroll", handleScroll);
    return () => mainScroll?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (langRef.current && !langRef.current.contains(target)) {
        setIsLangOpen(false);
      }
      if (colorRef.current && !colorRef.current.contains(target)) {
        setIsColorOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const flagClass = "h-5 w-auto rounded-sm shadow-sm";

  const supportedLanguages = [
    { code: "pt", flag: <BR className={flagClass} />, name: t("portuguese") },
    { code: "en", flag: <US className={flagClass} />, name: t("english") },
    { code: "es", flag: <ES className={flagClass} />, name: t("spanish") },
  ];

  const currentLang =
    supportedLanguages.find((l) => l.code === i18n.language.split("-")[0]) ||
    supportedLanguages[0];

  const dropdownBase = cn(
    "absolute top-[calc(100%+12px)] left-0 w-48 rounded-2xl border border-border/60",
    "bg-popover/98 backdrop-blur-xl shadow-2xl overflow-hidden",
    "transition-all duration-200 origin-top-left z-50"
  );

  const isPlanejarActive = location.pathname === "/";
  const isHistoricoActive = location.pathname === "/historico";

  return (
    <>
      {/* Estilização Dinâmica da Scrollbar Global */}
      <style dangerouslySetInnerHTML={{
        __html: `
          ::-webkit-scrollbar {
            width: 8px !important;
            height: 8px !important;
          }
          ::-webkit-scrollbar-thumb {
            background-color: var(--primary) !important;
            opacity: 0.8 !important;
            border-radius: 99px !important;
          }
          ::-webkit-scrollbar-track {
            background-color: transparent !important;
          }
          ::selection {
            background-color: var(--primary) !important;
            color: var(--primary-foreground) !important;
          }
        `
      }} />

      {/* HEADER PRINCIPAL */}
      <header
        className={cn(
          "mx-auto flex items-center justify-between w-[95%] max-w-3xl h-16 px-4 md:px-6",
          "z-50 rounded-2xl sticky top-4 transition-all duration-300 ease-in-out font-sans select-none",
          isAtTop
            ? "opacity-100 translate-y-0 shadow-lg bg-background/85 backdrop-blur-md border border-border"
            : "opacity-0 -translate-y-10 pointer-events-none"
        )}
      >
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-bold text-lg text-foreground tracking-tight shrink-0"
        >
          <img src="/logo192.png" alt="Logo" className="h-8 w-8 object-contain rounded-lg" />
          <span className="bg-linear-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
            AI Planner
          </span>
        </Link>

        {/* DIREITA */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* MENU DE NAVEGAÇÃO */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "flex h-10 items-center gap-2 px-3 rounded-xl border border-border/50 font-medium text-sm cursor-pointer",
                "bg-accent/15 hover:bg-accent hover:text-accent-foreground transition-all duration-200",
                isMenuOpen && "bg-accent"
              )}
            >
              <Menu className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline text-xs">{t("Páginas")}</span>
            </button>

            {isMenuOpen && (
              <div className={dropdownBase}>
                <div className="px-4 py-2.5 border-b border-border/40">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Navegação
                  </p>
                </div>
                <ul className="p-1.5 space-y-0.5">
                  {navLinks.map((link) => {
                    const active = location.pathname === link.to;
                    return (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
                            active
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full shrink-0 transition-all",
                              active ? "bg-primary scale-125 animate-pulse" : "bg-border"
                            )}
                          />
                          {t(link.label, link.label)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-border/50" />

          {/* PALETA DE CORES (DROPDOWN DE TEMAS) */}
          <div className="relative" ref={colorRef}>
            <button
              onClick={() => setIsColorOpen(!isColorOpen)}
              className={cn(
                "flex items-center justify-center h-9 w-9 rounded-full transition-all text-muted-foreground hover:text-primary",
                "hover:bg-accent hover:scale-105 active:scale-95 cursor-pointer",
                isColorOpen && "bg-accent text-primary"
              )}
              title="Mudar cor do tema"
            >
              {/* [CORRIGIDO]: Substituído <Palette /> pelo novo ícone dinâmico em SVG */}
              <ColorWheelIcon className="h-8 w-8 shrink-0" />
            </button>

            {isColorOpen && (
              /* Largura do dropdown expandida para w-56 para caber perfeitamente as 17 cores */
              <div className="absolute top-[calc(100%+8px)] right-0 w-56 z-50 rounded-2xl p-2 border border-border/60 shadow-2xl bg-popover/98 backdrop-blur-xl">
                <div className="px-2 py-1.5 border-b border-border/40 mb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Temas de Cor
                  </p>
                </div>
                {/* Alterado para grid-cols-6 para que as 17 cores quebrem linha harmoniosamente em 3 linhas */}
                <div className="grid grid-cols-6 gap-2 p-1">
                  {THEME_OPTIONS.map((theme) => {
                    const active = colorTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setColorTheme(theme.id);
                          setIsColorOpen(false);
                        }}
                        className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center border transition-all cursor-pointer",
                          active ? "border-primary scale-110 ring-2 ring-primary/25" : "border-transparent hover:scale-105"
                        )}
                        title={theme.name}
                      >
                        <span className={cn("h-4.5 w-4.5 rounded-full block", theme.dotClass)} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* IDIOMA */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={cn(
                "mr-1 flex items-center justify-center h-9 w-9 rounded-full transition-all",
                "hover:scale-105 active:scale-95 cursor-pointer"
              )}
            >
              {currentLang.flag}
            </button>
            {isLangOpen && (
              <ul className="absolute top-[calc(100%+8px)] right-0 w-48 z-50 rounded-2xl p-1.5 border border-border/60 shadow-2xl bg-popover/98 backdrop-blur-xl overflow-hidden">
                <div className="px-3 py-2 border-b border-border/40 mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Idioma
                  </p>
                </div>
                {supportedLanguages.map((lang) => {
                  const active = i18n.language.split("-")[0] === lang.code;
                  return (
                    <li
                      key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); setIsLangOpen(false); }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl transition-all text-sm",
                        active
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {lang.flag}
                      <span className="font-medium">{lang.name}</span>
                      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <AnimatedThemeToggler variant="circle" duration={500} fromCenter />

          {/* BOTÕES DE NAVEGAÇÃO DESKTOP */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="h-5 w-px bg-border/50" />
            <InteractiveHoverButton
              icon={ChartNoAxesCombined}
              nome="Planejar"
              onClick={() => navigate("/")}
              className={cn(
                "shadow-sm active:scale-95 ring transition-all h-10 py-0",
                isPlanejarActive 
                  ? "ring-primary/30 bg-primary/[0.07] text-primary font-semibold"
                  : "ring-ring/50 text-foreground"
              )}
            />
            <ButtonRipple
              icon={Clock}
              nome="Histórico"
              variant="ghost"
              size="default"
              disabled={false}
              onClick={() => navigate("/historico")}
              className={cn(
                "shadow-lg h-10 py-0 ring transition-all",
                isHistoricoActive
                  ? "ring-primary/35 bg-primary/[0.07] text-primary font-semibold"
                  : "ring-primary/20 text-foreground"
              )}
            />
          </div>

        </div>

        {/* Linha indicadora de página ativa */}
        <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent opacity-80" />
      </header>

      {/* BARRA DE NAVEGAÇÃO MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="mx-3 mb-3 flex items-center gap-2 px-3 py-2.5 rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl">
          <div className="flex-1">
            <InteractiveHoverButton
              icon={ChartNoAxesCombined}
              nome="Planejar"
              onClick={() => navigate("/")}
              className={cn(
                "w-full shadow-md active:scale-95 ring transition-all h-11 py-0",
                isPlanejarActive
                  ? "ring-primary/40 bg-primary/8 text-primary font-bold"
                  : "ring-ring/50 text-foreground"
              )}
            />
          </div>
          <div className="h-8 w-px bg-border/50 shrink-0" />
          <div className="flex-1">
            <ButtonRipple
              icon={Clock}
              nome="Histórico"
              onClick={() => navigate("/historico")}
              className={cn(
                "w-full shadow-lg h-11 py-0 ring transition-all",
                isHistoricoActive
                  ? "ring-primary/40 bg-primary/8 text-primary font-bold"
                  : "ring-primary/20 text-foreground"
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
};