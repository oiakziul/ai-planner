import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { US, BR, ES } from "country-flag-icons/react/3x2";
import { Link, useLocation } from "react-router-dom";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Menu, ChartNoAxesCombined, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import InteractiveHoverButton from "@/components/shadcn-space/button/button-19";
import ButtonRipple from "@/components/shadcn-space/button/button-16";

const navLinks = [
  { to: "/", label: "Início" },
  { to: "/pagina1", label: "Pagina1" },
  { to: "/pagina2", label: "Pagina2" },
  { to: "/pagina3", label: "Pagina3" },
];

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation("header");
  const location = useLocation();
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

  // Dropdown base
  const dropdownBase = cn(
    "absolute top-[calc(100%+12px)] left-0 w-48 rounded-2xl border border-border/60",
    "bg-popover/98 backdrop-blur-xl shadow-2xl overflow-hidden",
    "transition-all duration-200 origin-top-left"
  );

  return (
    <>
      {/* ══════════════════════════════════════
          HEADER PRINCIPAL (RESPONSIVO)
      ══════════════════════════════════════ */}
      <header
        className={cn(
          "mx-auto flex items-center justify-between w-[95%] max-w-7xl h-16 px-4 md:px-6",
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

        {/* CENTRO: cápsula de links — só visível no PC (lg+) */}
        <nav className="hidden lg:flex items-center gap-1 bg-accent/20 border border-border/40 px-1.5 py-1 rounded-full">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                )}
              >
                {t(link.label, link.label)}
              </Link>
            );
          })}
        </nav>

        {/* DIREITA */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* MENU — [CORRIGIDO]: Escondido no PC (lg:hidden), visível apenas no Android/Tablet */}
          <div className="relative lg:hidden" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "flex h-10 items-center gap-2 px-3 rounded-xl border border-border/50 font-medium text-sm",
                "bg-accent/15 hover:bg-accent hover:text-accent-foreground transition-all duration-200",
                isMenuOpen && "bg-accent"
              )}
            >
              <Menu className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline text-xs">{t("Páginas")}</span>
            </button>

            {/* DROPDOWN — links diretos */}
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

          {/* DIVISOR — [CORRIGIDO]: Escondido no PC (lg:hidden) para acompanhar a ocultação do menu */}
          <div className="h-5 w-px bg-border/50 lg:hidden" />

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

          {/* TEMA */}
          <AnimatedThemeToggler variant="circle" duration={500} fromCenter />

          {/* BOTÕES DE PC — visíveis apenas em telas grandes (lg+) */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="h-5 w-px bg-border/50" />
            <InteractiveHoverButton
              icon={ChartNoAxesCombined}
              nome="Planejar"
              className="shadow-md hover:bg-primary/15 active:scale-95 ring ring-ring/50 h-10 py-0"
            />
            <ButtonRipple
              icon={Clock}
              nome="Histórico"
              variant="ghost"
              size="default"
              disabled={false}
              className="ring ring-primary/20 shadow-lg h-10 py-0"
            />
          </div>

        </div>
      </header>

      {/* ══════════════════════════════════════
          BOTTOM BAR — só visível no mobile (< lg)
      ══════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="mx-3 mb-3 flex items-center gap-2 px-3 py-2.5 rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl">
          <div className="flex-1">
            <InteractiveHoverButton
              icon={ChartNoAxesCombined}
              nome="Planejar"
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
              className="w-full ring ring-primary/20 shadow-lg h-11 py-0"
            />
          </div>
        </div>
      </div>
    </>
  );
};