// src/pages/Header.tsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { US, BR, ES } from "country-flag-icons/react/3x2";
// [CORRIGIDO]: Adicionado 'useNavigate' para controlar cliques e redirecionamentos no roteador
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Menu, ChartNoAxesCombined, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import InteractiveHoverButton from "@/components/shadcn-space/button/button-19";
import ButtonRipple from "@/components/shadcn-space/button/button-16";

// Mapeamento atualizado com os nomes reais e semânticos do AI Planner
const navLinks = [
  { to: "/", label: "Início" },
  { to: "/resultado", label: "Resultado" },
  { to: "/historico", label: "Histórico" },
];

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation("header");
  const location = useLocation();
  const navigate = useNavigate(); // [NOVO]: Instanciamos a função de navegação por cliques [1]
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const langRef = useRef<HTMLDivElement>(null);
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
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setIsLangOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const flagClass = "h-5 w-auto rounded-sm shadow-sm ";

  const supportedLanguages = [
    { code: "pt", flag: <BR className={flagClass} />, name: t("portuguese") },
    { code: "en", flag: <US className={flagClass} />, name: t("english") },
    { code: "es", flag: <ES className={flagClass} />, name: t("spanish") },
  ];

  const currentLang =
    supportedLanguages.find((l) => l.code === i18n.language.split("-")[0]) ||
    supportedLanguages[0];

  // Dropdown que abre reto para baixo
  const dropdownBase = cn(
    "absolute top-[calc(100%+12px)] left-0 w-48 rounded-2xl border border-border/60",
    "bg-popover/98 backdrop-blur-xl shadow-2xl overflow-hidden",
    "transition-all duration-200 origin-top-left"
  );

  return (
    <>
      {/* ══════════════════════════════════════
          HEADER PRINCIPAL (UNIFICADO)
      ══════════════════════════════════════ */}
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
          <span className="hidden sm:inline-block">AI Planner</span>
        </Link>

        {/* DIREITA */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* MENU */}
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

            {/* DROPDOWN */}
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
                              active ? "bg-primary scale-125" : "bg-border"
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

          {/* IDIOMA */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={cn(
                "mr-2.5 md:mr-1 flex items-center justify-center h-9 w-9 rounded-full transition-all",
                "hover:bg-accent hover:scale-105 active:scale-95",
                isLangOpen && "bg-accent"
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

          {/* BOTÕES DE PC — [CORRIGIDO]: Vinculados ao clique e navegação síncrona! */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="h-5 w-px bg-border/50" />
            <InteractiveHoverButton
              icon={ChartNoAxesCombined}
              nome="Planejar"
              onClick={() => navigate("/")} // Redireciona para o início (formulário) [1]
              className="shadow-md hover:bg-primary/15 active:scale-95 ring ring-ring/50 h-10 py-0"
            />
            <ButtonRipple
              icon={Clock}
              nome="Histórico"
              variant="ghost"
              size="default"
              disabled={false}
              onClick={() => navigate("/historico")} // Redireciona para a página de histórico [1]
              className="ring ring-primary/20 shadow-lg h-10 py-0"
            />
          </div>

        </div>
      </header>

      {/* ══════════════════════════════════════
          BOTTOM BAR — [CORRIGIDO]: Vinculados ao clique no mobile também!
      ══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="mx-3 mb-3 flex items-center gap-2 px-3 py-2.5 rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl">
          <div className="flex-1">
            <InteractiveHoverButton
              icon={ChartNoAxesCombined}
              nome="Planejar"
              onClick={() => navigate("/")} // Redireciona no mobile [1]
              className="w-full shadow-md hover:bg-primary/15 active:scale-95 ring ring-ring/50 h-11 py-0"
            />
          </div>
          <div className="h-8 w-px bg-border/50 shrink-0" />
          <div className="flex-1">
            <ButtonRipple
              icon={Clock}
              nome="Histórico"
              variant="ghost"
              size="default"
              disabled={false}
              onClick={() => navigate("/historico")} // Redireciona no mobile [1]
              className="w-full ring ring-primary/20 shadow-lg h-11 py-0"
            />
          </div>
        </div>
      </div>
    </>
  );
};