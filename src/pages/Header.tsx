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

const navLinks: { to: string; labelKey: string; icon: LucideIcon }[] = [
  { to: "/", labelKey: "Início", icon: HomeIcon },
  { to: "/resultado", labelKey: "Resultado", icon: ChartNoAxesCombined },
  { to: "/historico", labelKey: "Histórico", icon: Clock },
];

const THEME_OPTIONS: { id: ColorTheme; nameKey: string; dotClass: string }[] = [
  { id: "rose", nameKey: "theme_rose", dotClass: "bg-rose-500" },
  { id: "red", nameKey: "theme_red", dotClass: "bg-red-500" },
  { id: "orange", nameKey: "theme_orange", dotClass: "bg-orange-500" },
  { id: "amber", nameKey: "theme_amber", dotClass: "bg-amber-500" },
  { id: "yellow", nameKey: "theme_yellow", dotClass: "bg-yellow-500" },
  { id: "lime", nameKey: "theme_lime", dotClass: "bg-lime-500" },
  { id: "green", nameKey: "theme_green", dotClass: "bg-green-500" },
  { id: "emerald", nameKey: "theme_emerald", dotClass: "bg-emerald-500" },
  { id: "teal", nameKey: "theme_teal", dotClass: "bg-teal-500" },
  { id: "cyan", nameKey: "theme_cyan", dotClass: "bg-cyan-500" },
  { id: "sky", nameKey: "theme_sky", dotClass: "bg-sky-500" },
  { id: "blue", nameKey: "theme_blue", dotClass: "bg-blue-500" },
  { id: "indigo", nameKey: "theme_indigo", dotClass: "bg-indigo-500" },
  { id: "violet", nameKey: "theme_violet", dotClass: "bg-violet-600" },
  { id: "purple", nameKey: "theme_purple", dotClass: "bg-purple-500" },
  { id: "fuchsia", nameKey: "theme_fuchsia", dotClass: "bg-fuchsia-500" },
  { id: "pink", nameKey: "theme_pink", dotClass: "bg-pink-500" },
  { id: "slate", nameKey: "theme_slate", dotClass: "bg-slate-500" },
];

const globalStyles = `
  ::-webkit-scrollbar { width: 8px !important; height: 8px !important; }
  ::-webkit-scrollbar-thumb { 
    background-color: var(--primary) !important; 
    opacity: 0.8 !important; 
    border-radius: 99px !important; 
  }
  ::-webkit-scrollbar-track { background-color: transparent !important; }
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
`;

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation("header");
  const location = useLocation();
  const navigate = useNavigate();
  const { colorTheme, setColorTheme } = useTheme();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const langRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainScroll = document.querySelector("main");
    const handleScroll = () => {
      if (mainScroll) {
        const scrollTop = mainScroll.scrollTop;
        setIsAtTop(scrollTop < 5);
        setIsScrolled(scrollTop > 8);
      }
    };
    mainScroll?.addEventListener("scroll", handleScroll);
    return () => mainScroll?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (langRef.current && !langRef.current.contains(target)) setIsLangOpen(false);
      if (colorRef.current && !colorRef.current.contains(target)) setIsColorOpen(false);
      if (menuRef.current && !menuRef.current.contains(target)) setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const activeLang = i18n.language?.split("-")[0] || "pt";
    
    document.documentElement.setAttribute("lang", activeLang);

    // Altera dinamicamente o título da aba do navegador em tempo real
    document.title = activeLang === "en" 
      ? "AI Planner - Financial Intelligence" 
      : activeLang === "es"
      ? "AI Planner - Inteligencia Financiera"
      : "AI Planner - Inteligência Financeira";
  }, [i18n.language]);

  const supportedLanguages = [
    { code: "pt", flag: <BR className="h-5 w-auto rounded-sm shadow-sm" />, name: t("portuguese") },
    { code: "en", flag: <US className="h-5 w-auto rounded-sm shadow-sm" />, name: t("english") },
    { code: "es", flag: <ES className="h-5 w-auto rounded-sm shadow-sm" />, name: t("spanish") },
  ];

  const langCode = (i18n.resolvedLanguage || i18n.language || "pt").split("-")[0].toLowerCase();
  const currentLang = supportedLanguages.find((l) => l.code === langCode) || supportedLanguages[0];
  const currentThemeMeta = THEME_OPTIONS.find((th) => th.id === colorTheme);

  const path = location.pathname;
  const isPlanejarActive = path === "/" || path === "";
  const isHistoricoActive = path.startsWith("/historico");

  const headerWrapperClasses = cn(
    "header-intro mx-auto flex items-center justify-between",
    "w-full max-w-4xl px-2 sm:px-4 md:px-6",
    "z-50 rounded-[1.75rem] fixed top-4 left-0 right-0",
    "transition-all duration-500 ease-in-out font-sans select-none",
    "ring-1 ring-black/5 border",
    isAtTop 
      ? "opacity-100 translate-y-0" 
      : "opacity-0 translate-y-[-150%] pointer-events-none",
    isScrolled
      ? "h-14 shadow-md bg-card/80 backdrop-blur-xl border-border"
      : "h-16 shadow-lg bg-card/90 backdrop-blur-xl border-border/70"
  );
  
  const rightSectionClasses = cn("flex items-center gap-3.5 sm:gap-4 md:gap-5");
  const verticalDividerClass = cn(
    "h-5 w-px bg-linear-to-b from-transparent via-border to-transparent shrink-0"
  );

  const logoLinkClasses = cn(
    "group flex items-center gap-3 font-bold text-foreground tracking-tight shrink-0"
  );
  const logoImgClasses = cn(
    "h-7 w-7 sm:h-9 sm:w-9 object-contain rounded-lg transition-transform",
    "duration-300 group-hover:rotate-6 group-hover:scale-105"
  );
  const logoTextClasses = cn(
    "text-base sm:text-lg bg-linear-to-r from-foreground via-foreground to-primary",
    "bg-size-[200%_100%] bg-clip-text text-transparent transition-[background-position]",
    "duration-500 group-hover:bg-position-[100%_0]"
  );

  const getIconTriggerClass = (active: boolean) => cn(
    "flex items-center justify-center h-9 w-9 rounded-full transition-all cursor-pointer",
    "hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
    active && "bg-accent text-primary ring-1 ring-primary/20"
  );

  const dropdownBaseClasses = cn(
    "absolute top-[calc(100%+8px)] z-50 rounded-2xl border border-border/60",
    "shadow-2xl bg-popover/98 backdrop-blur-xl overflow-hidden"
  );
  const dropdownHeaderContainer = cn("px-3 py-2 border-b border-border/40 mb-1");
  const dropdownHeaderText = cn(
    "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
  );

  const menuTriggerBtn = cn(
    "flex h-8.5 sm:h-10 items-center justify-between px-2 sm:px-3 rounded-xl",
    "border border-border/50 font-medium text-sm cursor-pointer",
    "bg-accent/15 hover:bg-accent hover:text-accent-foreground transition-all duration-200",
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
    isMenuOpen && "bg-accent"
  );
  const menuLabelTextClass = cn("hidden sm:block text-xs md:text-[16px] w-[64px] text-center"); 
  
  const menuDropdownClasses = cn(dropdownBaseClasses, "left-0 right-auto w-52 p-0");
  const menuListClasses = cn("p-1.5 space-y-0.5");
  const getMenuItemClasses = (active: boolean) => cn(
    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
    active 
      ? "bg-primary/10 text-primary font-semibold" 
      : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
  );

  const colorTriggerBtnClass = cn(
    "group flex items-center justify-center h-9 w-9 rounded-full transition-all cursor-pointer",
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/50 text-muted-foreground hover:text-primary",
    isColorOpen && "bg-accent text-primary ring-1 ring-primary/20"
  );
  const colorWheelIconClasses = "h-7.5 w-7.5 shrink-0 transition-transform duration-500 group-hover:rotate-45";

  const themeDropdownClasses = cn(dropdownBaseClasses, "-right-2.5 sm:right-0 w-56 p-2");
  const themeDropdownHeaderClass = cn(dropdownHeaderContainer, "flex items-center justify-between px-2 py-1.5 mb-2");
  const themeGridClasses = cn("grid grid-cols-6 gap-2 p-1");
  const getThemeBtnClasses = (active: boolean) => cn(
    "relative h-6 w-6 mx-auto rounded-full flex items-center justify-center border",
    "transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
    active ? "border-primary scale-125 ring-2 ring-primary/25 z-10" : "border-transparent hover:scale-110"
  );

  const langDropdownClass = cn(dropdownBaseClasses, "right-0 w-48 p-1.5");
  const getLangItemClasses = (active: boolean) => cn(
    "flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl transition-all text-sm",
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
    active ? "bg-primary/10 text-primary font-semibold" : "hover:bg-accent hover:text-accent-foreground"
  );

  const desktopNavWrapper = cn("hidden lg:flex items-center gap-2");
  const getDesktopBtnClasses = (active: boolean) => cn(
    "shadow-sm active:scale-95 ring transition-all",
    "h-10 py-0 text-sm flex items-center justify-center",
    "w-[155px]", 
    "[&_svg]:h-5 [&_svg]:w-5",
    active 
      ? "ring-primary/30 bg-primary/5 text-foreground font-semibold shadow-xs" 
      : "ring-ring/50 text-foreground"
  );

  const mobileDockWrapper = cn(
    "fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-[env(safe-area-inset-bottom)]"
  );
  const mobileDockContainer = cn(
    "dock-intro relative mx-2 mb-2 flex items-center gap-1.5 px-2 py-2 rounded-full",
    "border border-border/60 bg-background/20 backdrop-blur-2xl",
    "shadow-[0_-8px_30px_-8px_rgba(0,0,0,0.25)] ring-1 ring-black/5"
  );
  const getMobileBtnClasses = (active: boolean) => cn(
    "w-full active:scale-95 ring transition-all h-10 py-0 text-sm justify-center",
    "[&_svg]:h-5 [&_svg]:w-5",
    active ? "ring-primary/40 bg-primary/8 text-foreground font-bold" : "ring-ring/50 text-primary"
  );

  const activeDotClass = cn(
    "absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5",
    "rounded-full bg-primary shadow-[0_0_6px_1px_var(--primary)] animate-pulse"
  );
  const headerBottomLine = cn(
    "absolute bottom-0 left-6 right-6 h-0.5",
    "bg-linear-to-r from-transparent via-primary to-transparent opacity-80 animate-pulse"
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      <header className={headerWrapperClasses}>
        
        {/* LOGO */}
        <Link to="/" className={logoLinkClasses}>
          <img 
            src="/logo192.png" 
            alt="Logo" 
            className={logoImgClasses} 
          />
          <span className={logoTextClasses}>
            AI Planner
          </span>
        </Link>

        {/* LADO DIREITO (CONTROLES E NAVEGAÇÃO) */}
        <div className={rightSectionClasses}>
          
          {/* MENU PÁGINAS */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              aria-expanded={isMenuOpen} 
              className={menuTriggerBtn}
            >
              <Menu className="h-4 w-4 shrink-0" />
              <span className={menuLabelTextClass}>
                {t("nav_pages", "Páginas")}
              </span>
              <ChevronDown 
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform", 
                  isMenuOpen && "rotate-180"
                )} 
              />
            </button>

            {isMenuOpen && (
              <div className={menuDropdownClasses}>
                <div className={dropdownHeaderContainer}>
                  <p className={dropdownHeaderText}>
                    {t("label_navigation", "Navegação")}
                  </p>
                </div>
                
                <ul className={menuListClasses}>
                  {navLinks.map((link) => {
                    const isActive = path === link.to || (link.to !== "/" && path.startsWith(link.to));
                    const Icon = link.icon;
                    return (
                      <li key={link.to}>
                        <Link 
                          to={link.to} 
                          onClick={() => setIsMenuOpen(false)} 
                          className={getMenuItemClasses(isActive)}
                        >
                          <Icon 
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors", 
                              isActive ? "text-primary" : "text-muted-foreground"
                            )} 
                          />
                          <span className="flex-1 truncate">
                            {t(link.labelKey, link.labelKey)}
                          </span>
                          
                          {isActive && (
                            <span 
                              className={activeDotClass.replace(
                                '-bottom-1.5 left-1/2 -translate-x-1/2', 
                                'relative left-0 bottom-0'
                              )} 
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className={verticalDividerClass} />

          {/* PALETA DE CORES */}
          <div className="relative" ref={colorRef}>
            <button 
              onClick={() => setIsColorOpen(!isColorOpen)} 
              aria-expanded={isColorOpen} 
              className={colorTriggerBtnClass} 
              title="Mudar cor do tema"
            >
              <ColorWheelIcon className={colorWheelIconClasses} />
            </button>

            {isColorOpen && (
              <div className={themeDropdownClasses}>
                <div className={themeDropdownHeaderClass}>
                  <p className={dropdownHeaderText}>
                    {t("label_themes", "Temas")}
                  </p>
                  <span className="text-[10px] font-medium text-primary truncate pl-2 text-right">
                    {currentThemeMeta ? t(currentThemeMeta.nameKey, currentThemeMeta.nameKey) : ""}
                  </span>
                </div>
                
                <div className={themeGridClasses}>
                  {THEME_OPTIONS.map((theme) => {
                    const isActive = colorTheme === theme.id;
                    return (
                      <button 
                        key={theme.id} 
                        onClick={() => { 
                          setColorTheme(theme.id); 
                          setIsColorOpen(false); 
                        }} 
                        className={getThemeBtnClasses(isActive)} 
                        title={t(theme.nameKey, theme.nameKey)}
                      >
                        <span className={cn("h-4.5 w-4.5 rounded-full block", theme.dotClass)} />
                        {isActive && (
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
              className={getIconTriggerClass(isLangOpen)}
            >
              {currentLang.flag}
            </button>

            {isLangOpen && (
              <ul className={langDropdownClass}>
                <div className={dropdownHeaderContainer}>
                  <p className={dropdownHeaderText}>
                    {t("label_language", "Idioma")}
                  </p>
                </div>
                
                {supportedLanguages.map((lang) => {
                  const isActive = i18n.language.split("-")[0] === lang.code;
                  return (
                    <li 
                      key={lang.code} 
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
                      className={getLangItemClasses(isActive)}
                    >
                      {lang.flag}
                      <span className="font-medium">
                        {lang.name}
                      </span>
                      
                      {isActive && (
                        <span 
                          className={activeDotClass.replace(
                            '-bottom-1.5 left-1/2 -translate-x-1/2', 
                            'ml-auto relative left-0 bottom-0'
                          )} 
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* MODO ESCURO/CLARO */}
          <div className="flex items-center justify-center h-9 shrink-0">
            <AnimatedThemeToggler 
              variant="circle" 
              duration={500} 
            />
          </div>

          {/* BOTÕES DESKTOP */}
          <div className={desktopNavWrapper}>
            <div className={verticalDividerClass} />
            
            <div className="relative">
              <InteractiveHoverButton 
                icon={ChartNoAxesCombined} 
                nome={t("nav_plan", "Planejar")} 
                onClick={() => navigate("/")} 
                className={getDesktopBtnClasses(isPlanejarActive)} 
              />
              
            </div>
            
            <div className="relative">
              <InteractiveHoverButton 
                icon={Clock} 
                nome={t("nav_history", "Histórico")} 
                onClick={() => navigate("/historico")} 
                className={getDesktopBtnClasses(isHistoricoActive)} 
              />
         
            </div>
          </div>
        </div>
        <div className={headerBottomLine} />
      </header>

      {/* DOCK MOBILE (BARRA INFERIOR DE NAVEGAÇÃO) */}
      <div className={mobileDockWrapper}>
        <div className={mobileDockContainer}>
          
          <div 
            className={cn(
              "absolute -top-px left-6 right-6 h-px",
              "bg-linear-to-r from-transparent via-primary/60 to-transparent"
            )} 
          />
          
          <div className="relative flex-1">
            <InteractiveHoverButton 
              icon={ChartNoAxesCombined} 
              nome={t("nav_plan", "Planejar")} 
              onClick={() => navigate("/")} 
              className={getMobileBtnClasses(isPlanejarActive)} 
            />
          </div>
          
          <div className={verticalDividerClass} />
          
          <div className="relative flex-1">
            <InteractiveHoverButton
              icon={Clock}
              nome={t("nav_history", "Histórico")}
              onClick={() => navigate("/historico")}
              className={getMobileBtnClasses(isHistoricoActive)} 
            />
          </div>

        </div>
      </div>
    </>
  );
};