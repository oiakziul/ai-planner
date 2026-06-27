import { useTranslation } from "react-i18next";
import { ChevronsUp, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export const Footer = () => {
  const { t } = useTranslation("footer");

  const handleScrollTop = () => {
    const mainContent = document.querySelector("main");
    if (mainContent && mainContent.scrollHeight > mainContent.clientHeight) {
      mainContent.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };
  
  const footerBase = cn(
    "relative py-8 px-6 w-full min-h-60 transition-colors duration-300 select-none",
    "bg-background/60 backdrop-blur-md border-t border-border mt-2 overflow-hidden"
  );

  const magicBackground = cn(
    "absolute inset-0 -z-10 h-full w-full",
    "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]",
    "[background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_100%,#000_60%,transparent_100%)]"
  );

  const footerContainer = cn("max-w-6xl mx-auto text-center pt-2 relative z-10");
  
  const containerSeta = cn("flex justify-center items-center mx-auto mb-10");

  const botaoSeta = cn(
    "group flex justify-center items-center rounded-full text-xl cursor-pointer",
    "h-12 w-12 bg-accent/20 border border-border transition-all duration-500 ease-out",
    "text-foreground", 
    "hover:text-primary hover:border-primary hover:bg-primary/10 hover:-translate-y-2",
    "hover:shadow-[0_0_20px_rgba(var(--color-primary),0.3)]", 
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  );

  const iconeSetaAnimado = cn(
    "transition-transform duration-300 group-hover:-translate-y-1"
  );

  const footerDivider = cn("border-t border-border/60 pt-6");
  
  const footerCopyright = cn("text-muted-foreground text-sm mb-4 font-medium");
  
  const emailSection = cn("flex justify-center items-center");

  const eMailLink = cn(
    "group relative overflow-hidden flex items-center justify-center mx-auto gap-2 text-lg font-medium py-3 mt-3 w-48 h-12",
    "rounded-xl border border-border bg-background transition-all duration-300",
    "text-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--color-primary),0.15)] hover:-translate-y-1",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  );

  const shineEffect = cn(
    "absolute inset-0 -translate-x-full group-hover:translate-x-full",
    "bg-gradient-to-r from-transparent via-foreground/10 to-transparent",
    "transition-transform duration-700 ease-in-out"
  );

  const iconeMailAnimado = cn(
    "h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
  );

  // ==========================================
  // ESTRUTURA VISUAL (JSX)
  // ==========================================

  return (
    <footer className={footerBase}>
      <div className={magicBackground} />

      <div className={footerContainer}>
        
        {/* Seta */}
        <div className={containerSeta}>
          <button
            onClick={handleScrollTop}
            className={botaoSeta}
            aria-label={t("back_to_top")}
            title={t("back_to_top")}
          >
            <ChevronsUp className={iconeSetaAnimado} />
          </button>
        </div>

        {/* Divisor e Copyright */}
        <div className={footerDivider}>
          <p className={footerCopyright}>
            © {new Date().getFullYear()} {t("copy_hight")}
          </p>

          <section className={emailSection}>
            <a className={eMailLink} href="mailto:kaioaac3@gmail.com">
              <div className={shineEffect} />
              <Mail className={iconeMailAnimado} />
              <span>{t("email_label") || "E-mail"}</span>
            </a>
          </section>
        </div>

      </div>
    </footer>
  );
};