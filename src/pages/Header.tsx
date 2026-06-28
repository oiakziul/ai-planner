import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { US, BR, ES } from "country-flag-icons/react/3x2";
import { Link } from "react-router-dom";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import clsx from "clsx";

const navData = [
  {
    id: "Paginas",
    label: "AI Planner",
    links: [
      { to: "/", label: "Inicio" },
      { to: "/pagina1", label: "Pagina1" },
      { to: "/pagina2", label: "Pagina2" },
      { to: "/pagina3", label: "Pagina3" },
    ],
  },
];

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation("header");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);

  const langRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainScroll = document.querySelector("main");
    const handleScroll = () => {
      if (mainScroll) setIsAtTop(mainScroll.scrollTop < 5);
    };
    mainScroll?.addEventListener("scroll", handleScroll);
    return () => mainScroll?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node))
        setIsLangOpen(false);
      if (catRef.current && !catRef.current.contains(event.target as Node)) {
        setIsCatOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const flagIcon = clsx("h-5 w-auto");

  const supportedLanguages = [
    { code: "pt", flag: <BR className={flagIcon} />, name: t("portuguese") },
    { code: "en", flag: <US className={flagIcon} />, name: t("english") },
    { code: "es", flag: <ES className={flagIcon} />, name: t("spanish") },
  ];

  const currentLang =
    supportedLanguages.find((l) => l.code === i18n.language.split("-")[0]) ||
    supportedLanguages[0];

  const headerStyle = clsx(
    "mx-auto flex items-center justify-center w-[95%] md:w-72 h-16 gap-6",
    "z-50 rounded-lg sticky top-4 transition-all duration-300 ease-in-out ",
    "text-card-foreground  select-none",
    isAtTop
      ? "opacity-100 translate-y-0"
      : "opacity-0 -translate-y-10 pointer-events-none"
  );

  const menuTriggerStyle = clsx(
    "flex h-10 items-center gap-2 px-3 rounded-lg font-medium transition-all",
    "hover:bg-accent dark:hover:bg-accent hover:text-hoverHeader ",
    "focus-visible:ring-2 focus-visible:ring-ring outline-none ",
    "dark:bg-aprimary/20  ring ring-accent/50"
  );

  const menuDropdownStyle = clsx(
    "absolute top-full left-0 mt-3.5 w-48 rounded-md border border-border",
    "shadow-xl transition-all duration-200",
    "bg-popover/90 text-popover-foreground  backdrop-blur-3xl",
    !isCatOpen && "hidden"
  );

  const menuItemStyle = clsx(
    "relative px-4 py-2 flex justify-between items-center",
    "cursor-pointer rounded-md transition-all duration-200",
    "hover:bg-accent  hover:text-hoverHeader"
  );

  const submenuStyle = (id: string) => clsx(
    "absolute -top-2.5 left-full ml-0.5 md:w-48 w-34.5", 
    "font-medium rounded-md border border-border shadow-xl transition-all duration-200",
    "bg-popover/90 text-popover-foreground  backdrop-blur-3xl ",
    activeSubmenu !== id && "hidden"
  );

  const submenuLinkStyle = clsx(
    "block px-4 py-2 mt-1.5 rounded-md text-sm transition-all duration-200",
    "hover:bg-accent  hover:text-hoverHeader"
  );

  const langDropdownStyle = clsx(
    "absolute top-full left-0 mt-2 w-48 z-50 rounded-md py-2 border", 
    "border-border shadow-xl transition-all duration-200",
    "bg-popover/90  text-popover-foreground  backdrop-blur-3xl",
    !isLangOpen && "hidden"
  );

  const langItemStyle = clsx(
    "flex items-center gap-3 px-4 py-2 cursor-pointer", 
    "rounded-md transition-all duration-200",
    "hover:bg-accent hover:text-accent-foreground  "
  );

  return (
    <header className={clsx(headerStyle,'')}>
      <div className="flex items-center gap-4">
        {/* MENU */}
        <div
          className="relative "
          ref={catRef}
          onMouseLeave={() => setActiveSubmenu(null)}
        >
          <b
            onClick={() => setIsCatOpen(!isCatOpen)}
            className={menuTriggerStyle}
          >
            <span className="text-lg">☰</span>
            <span className="">{t("Páginas")}</span>
          </b>
          <div className={menuDropdownStyle}>
            <ul className="py-2">
              {navData.map((cat) => (
                <li
                  key={cat.id}
                  onMouseEnter={() => setActiveSubmenu(cat.id)}
                  className={menuItemStyle}
                >
                  <span className="text-sm font-medium">{cat.label}</span>
                  <span className="text-xs">▶️</span>

                  {/* SUBMENU */}
                  <div className={submenuStyle(cat.id)}>
                    <ul className="py-1">
                      {cat.links.map((link) => (
                        <li key={link.to}>
                          <Link
                            to={link.to}
                            onClick={() => {
                              setIsCatOpen(false);
                              setActiveSubmenu(null);
                            }}
                            className={submenuLinkStyle}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* LANG */}
        <div className="relative scale-105 bg-black" ref={langRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center hover:scale-110 transition-transform"
          >
            {currentLang.flag}
          </button>

          <ul className={langDropdownStyle}>
            {supportedLanguages.map((lang) => (
              <li
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setIsLangOpen(false);
                }}
                className={langItemStyle}
              >
                {lang.flag}
                <span className="font-medium text-sm">{lang.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="focus:outline-none focus:ring-0 focus:ring-offset-0">
        <AnimatedThemeToggler variant="circle" duration={600} fromCenter />
      </div>
    </header>
  );
};