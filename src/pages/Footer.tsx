import { useTranslation } from "react-i18next";
import { ChevronsUp, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import ButtonDemo from "@/components/shadcn-space/button/button-18";
import { LuLinkedin } from "react-icons/lu";

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

  const circleButtonBase = cn(
    "inline-flex justify-center items-center rounded-full text-xl cursor-pointer shrink-0",
    "h-12 w-12 bg-accent/20 border border-border transition-all duration-500 ease-out",
    "text-foreground",
    "hover:text-primary-foreground hover:border-primary hover:bg-primary hover:-translate-y-2",
    "hover:shadow-lg hover:shadow-primary/30",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "active:scale-95"
  );

  const footerBase = cn(
    "relative py-8 px-6 w-full min-h-90 xl:min-h-80 transition-colors duration-300 select-none",
    "bg-background/60 backdrop-blur-md border-t border-border mt-2 overflow-hidden"
  );

  const magicBackground = cn(
    "absolute inset-0 -z-10 h-full w-full",
    "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]",
    "[background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_100%,#000_60%,transparent_100%)]"
  );

  const footerContainer = cn("max-w-6xl mx-auto text-center pt-2 relative z-10");

  const containerSeta = cn("flex justify-center items-center mx-auto mb-10");

  const botaoSeta = cn(circleButtonBase, "group");

  const iconeSetaAnimado = cn(
    "transition-transform duration-300 group-hover:-translate-y-1"
  );

  const footerDivider = cn("border-t border-border/60 pt-6");

  const footerCopyright = cn("text-muted-foreground text-sm mb-4 font-medium");

  const linksRow = cn(
    "flex items-center justify-center gap-4 w-full mt-4"
  );

  const eMailLinkMobile = cn(circleButtonBase);

  return (
    <footer className={footerBase}>
      <div className={magicBackground} />

      <div className={footerContainer}>
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

        <div className={footerDivider}>
          <p className={footerCopyright}>
            © {new Date().getFullYear()} {t("copy_hight")}
          </p>

          <section className={linksRow}>
            <div className="hidden lg:flex">
              <ButtonDemo />
            </div>

            <a
              className={cn(eMailLinkMobile, "lg:hidden")}
              href="mailto:kaioaac3@gmail.com"
              aria-label="E-mail"
              title="E-mail"
            >
              <Mail className="w-5 h-5" />
            </a>

            <a
              href="https://www.linkedin.com/in/kaioluizcarmodebrito/"
              target="_blank"
              rel="noopener noreferrer"
              className={circleButtonBase}
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <LuLinkedin className="w-5 h-5" />
            </a>
          </section>
        </div>
      </div>
    </footer>
  );
};