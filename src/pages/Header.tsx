import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { US, BR, ES } from "country-flag-icons/react/3x2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useTheme, type ColorTheme } from "@/context/ThemeContext";
import { ColorWheelIcon } from "@/assets/styles/componentes/ColorWheelIcon";
import {
  Menu,
  ChartNoAxesCombined,
  Clock,
  Home as HomeIcon,
  Check,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import InteractiveHoverButton from "@/components/shadcn-space/button/button-19";
import ButtonRipple from "@/components/shadcn-space/button/button-16";

const navLinks: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Início", icon: HomeIcon },
  { to: "/resultado", label: "Resultado", icon: ChartNoAxesCombined },
  { to: "/historico", label: "Histórico", icon: Clock },
];

const THEME_OPTIONS: { id: ColorTheme; name: string; dotClass: string }[] = [
  { id: "rose", name: "Vinho (Padrão)", dotClass: "bg-rose-500" },
  { id: "red", name: "Vermelho", dotClass: "bg-red-500" },
  { id: "orange", name: "Laranja", dotClass: "bg-orange-500" },
  { id: "amber", name: "Âmbar", dotClass: "bg-amber-500" },
  { id: "yellow", name: "Amarelo", dotClass: "bg-yellow-500" },
  { id: "lime", name: "Limão", dotClass: "bg-lime-500" },
  { id: "green", name: "Verde", dotClass: "bg-green-500" },
  { id: "emerald", name: "Esmeralda", dotClass: "bg-emerald-500" },
  { id: "teal", name: "Teal", dotClass: "bg-teal-500" },
  { id: "cyan", name: "Ciano", dotClass: "bg-cyan-500" },
  { id: "sky", name: "Céu", dotClass: "bg-sky-500" },
  { id: "blue", name: "Azul", dotClass: "bg-blue-500" },
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
  const [isScrolled, setIsScrolled] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainScroll = document.querySelector("main");
    const handleScroll = () => {
      if (mainScroll) setIsScrolled(mainScroll.scrollTop > 8);
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

  const currentThemeMeta = THEME_OPTIONS.find((th) => th.id === colorTheme);

  const dropdownBase = cn(
    "absolute top-[calc(100%+12px)] left-0 w-52 rounded-2xl border border-border/60",
    "bg-popover/98 backdrop-blur-xl shadow-2xl overflow-hidden",
    "transition-all duration-200 origin-top-left z-50"
  );

  const iconTriggerClass = (active: boolean) =>
    cn(
      "flex items-center justify-center h-9 w-9 rounded-full transition-all cursor-pointer",
      "hover:scale-105 active:scale-95",
      "outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      active && "bg-accent text-primary ring-1 ring-primary/20"
    );

  const isPlanejarActive = location.pathname === "/";
  const isHistoricoActive = location.pathname === "/historico";

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
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

          @keyframes headerIntro {
            0% { opacity: 0; transform: translateY(-14px) scale(0.97); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes dockIntro {
            0% { opacity: 0; transform: translateY(16px) scale(0.97); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .header-intro { animation: headerIntro 550ms cubic-bezier(0.22, 1, 0.36, 1) both; }
          .dock-intro { animation: dockIntro 550ms cubic-bezier(0.22, 1, 0.36, 1) both; }
          @media (prefers-reduced-motion: reduce) {
            .header-intro, .dock-intro { animation: none; }
          }
        `,
        }}
      />

      <header
        className={cn(
          "header-intro mx-auto flex items-center justify-between w-[95%] max-w-4xl px-2 sm:px-4 md:px-6",
          "z-50 rounded-[1.75rem] sticky top-4 transition-all duration-300 ease-in-out font-sans select-none",
          "ring-1 ring-black/5 border",
          isScrolled
            ? "h-14 shadow-[0_14px_45px_-10px_rgba(0,0,0,0.35)] bg-background/90 backdrop-blur-2xl border-border"
            : "h-16 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.25)] bg-background/80 backdrop-blur-xl border-border/70"
        )}
      >
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-2 font-bold text-foreground tracking-tight shrink-0"
        >
          <img
            src="/logo192.png"
            alt="Logo"
            className="h-7 w-7 sm:h-8 sm:w-8 object-contain rounded-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
          />
          <span className="text-base sm:text-lg bg-linear-to-r from-foreground via-foreground to-primary bg-size-[200%_100%] bg-clip-text text-transparent transition-[background-position] duration-500 group-hover:bg-position-[100%_0]">
            AI Planner
          </span>
        </Link>

        {/* DIREITA */}
        <div className="flex items-center gap-3.5 sm:gap-4 md:gap-5">
          {/* MENU DE NAVEGAÇÃO */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              className={cn(
                "flex h-8.5 sm:h-10 items-center gap-1.5 px-1.5 sm:px-3 rounded-xl border border-border/50 font-medium text-sm cursor-pointer",
                "bg-accent/15 hover:bg-accent hover:text-accent-foreground transition-all duration-200",
                "outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isMenuOpen && "bg-accent"
              )}
            >
              <Menu className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline text-xs">{t("Páginas")}</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                  isMenuOpen && "rotate-180"
                )}
              />
            </button>

            {isMenuOpen && (
              <div className={dropdownBase} role="menu">
                <div className="px-4 py-2.5 border-b border-border/40">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Navegação
                  </p>
                </div>
                <ul className="p-1.5 space-y-0.5">
                  {navLinks.map((link) => {
                    const active = location.pathname === link.to;
                    const Icon = link.icon;
                    return (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          onClick={() => setIsMenuOpen(false)}
                          role="menuitem"
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
                            "outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                            active
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              active ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                          <span className="flex-1">{t(link.label, link.label)}</span>
                          {active && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_1px_var(--primary)]" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-linear-to-b from-transparent via-border to-transparent" />

          {/* PALETA DE CORES */}
          <div className="relative" ref={colorRef}>
            <button
              onClick={() => setIsColorOpen(!isColorOpen)}
              aria-expanded={isColorOpen}
              aria-haspopup="menu"
              className={cn(iconTriggerClass(isColorOpen), "group text-muted-foreground hover:text-primary")}
              title="Mudar cor do tema"
            >
              <ColorWheelIcon className="h-7.5 w-7.5 shrink-0 transition-transform duration-500 group-hover:rotate-45" />
            </button>

            {isColorOpen && (
              <div
                role="menu"
                className="absolute top-[calc(100%+8px)] right-0 w-56 z-50 rounded-2xl p-2 border border-border/60 shadow-2xl bg-popover/98 backdrop-blur-xl"
              >
                <div className="px-2 py-1.5 border-b border-border/40 mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Temas de Cor
                  </p>
                  <span className="text-[10px] font-medium text-primary">
                    {currentThemeMeta?.name}
                  </span>
                </div>
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
                          "relative h-6 w-6 rounded-full flex items-center justify-center border transition-all cursor-pointer",
                          "outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                          active
                            ? "border-primary scale-110 ring-2 ring-primary/25"
                            : "border-transparent hover:scale-105"
                        )}
                        title={theme.name}
                      >
                        <span className={cn("h-4.5 w-4.5 rounded-full block", theme.dotClass)} />
                        {active && (
                          <Check className="absolute h-3 w-3 text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.6)]" />
                        )}
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
              aria-expanded={isLangOpen}
              aria-haspopup="menu"
              className={cn(iconTriggerClass(isLangOpen), "overflow-hidden")}
            >
              {currentLang.flag}
            </button>
            {isLangOpen && (
              <ul
                role="menu"
                className="absolute top-[calc(100%+8px)] right-0 w-48 z-50 rounded-2xl p-1.5 border border-border/60 shadow-2xl bg-popover/98 backdrop-blur-xl overflow-hidden"
              >
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
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          i18n.changeLanguage(lang.code);
                          setIsLangOpen(false);
                        }
                      }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl transition-all text-sm",
                        "outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                        active
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {lang.flag}
                      <span className="font-medium">{lang.name}</span>
                      {active && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-center h-9 shrink-0">
            <AnimatedThemeToggler variant="circle" duration={500} fromCenter />
          </div>

          {/* BOTÕES DESKTOP */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="h-5 w-px bg-linear-to-b from-transparent via-border to-transparent" />
            <div className="relative">
              <InteractiveHoverButton
                icon={ChartNoAxesCombined}
                nome="Planejar"
                onClick={() => navigate("/")}
                className={cn(
                  "shadow-sm active:scale-95 ring transition-all h-10 py-0 text-sm [&_svg]:h-6 [&_svg]:w-6",
                  isPlanejarActive
                    ? "ring-primary/30 bg-primary/[0.07] text-primary font-semibold shadow-[0_0_16px_-4px_var(--primary)]"
                    : "ring-ring/50 text-foreground"
                )}
              />
              {isPlanejarActive && (
                <span className="absolute rounded-full bg-primary " />
              )}
            </div>
            <div className="relative">
              <ButtonRipple
                icon={Clock}
                nome="Histórico"
                variant="ghost"
                size="default"
                disabled={false}
                onClick={() => navigate("/historico")}
                className={cn(
                  "shadow-lg h-10 py-0 text-sm ring transition-all [&_svg]:h-4 [&_svg]:w-4",
                  isHistoricoActive
                    ? "ring-primary/35 bg-primary/[0.07] text-primary font-semibold shadow-[0_0_16px_-4px_var(--primary)]"
                    : "ring-primary/20 text-foreground"
                )}
              />
              {isHistoricoActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_2px_var(--primary)]" />
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent opacity-80" />
      </header>

      {/* DOCK MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="dock-intro relative mx-2 mb-2 flex items-center gap-1.5 px-2 py-2 rounded-2xl border border-border/60 bg-background/90 backdrop-blur-2xl shadow-[0_-8px_30px_-8px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
          <div className="absolute -top-px left-6 right-6 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />

          <div className="relative flex-1">
            <InteractiveHoverButton
              icon={ChartNoAxesCombined}
              nome="Planejar"
              onClick={() => navigate("/")}
              className={cn(
                "w-full shadow-md active:scale-95 ring transition-all h-10 py-0 text-sm [&_svg]:h-3.5 [&_svg]:w-3.5",
                isPlanejarActive
                  ? "ring-primary/40 bg-primary/8 text-primary font-bold shadow-[0_0_16px_-4px_var(--primary)]"
                  : "ring-ring/50 text-foreground"
              )}
            />
            {isPlanejarActive && (
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_2px_var(--primary)]" />
            )}
          </div>
          <div className="h-8 w-px bg-linear-to-b from-transparent via-border to-transparent shrink-0" />
          <div className="relative flex-1">
            <ButtonRipple
              icon={Clock}
              nome="Histórico"
              onClick={() => navigate("/historico")}
              className={cn(
                "w-full shadow-lg h-10 py-0 text-sm ring transition-all [&_svg]:h-3.5 [&_svg]:w-3.5",
                isHistoricoActive
                  ? "ring-primary/40 bg-primary/8 text-primary font-bold shadow-[0_0_16px_-4px_var(--primary)]"
                  : "ring-primary/20 text-foreground"
              )}
            />
            {isHistoricoActive && (
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_2px_var(--primary)]" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};