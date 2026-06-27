import clsx from "clsx";
import { useTranslation } from "react-i18next";

export const Pagina2 = () => {
  const { t } = useTranslation("pagina2");

  const base = clsx(
    "relative h-96 w-96 overflow-hidden transition-all duration-300", 
    "flex items-center justify-center mx-auto rounded-2xl",
    "border-2 border-border bg-card shadow-xl font-sans", 
    "text-card-foreground text-3xl font-bold" 
  );

  return (
    <div id="inicio" className={base}>
      <h1 className="drop-shadow-sm text-center px-4 font-sans">
        {t('msg')}
      </h1> 
    </div>
  );
};