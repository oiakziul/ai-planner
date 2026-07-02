import clsx from "clsx";
import { useTranslation } from "react-i18next";

export const SimulationHistoryPage = () => {
  const { t } = useTranslation("pagina1");

  const base = clsx(
    "relative w-full min-h-87.5 overflow-hidden transition-all duration-300",
    "flex items-center justify-center mx-auto rounded-3xl p-8 mt-6",
    "border border-border bg-card/30 backdrop-blur-md shadow-2xl text-card-foreground"
  );

  return (
    <div id="inicio" className={base}>
      <h1 className="drop-shadow-sm text-center px-4 font-sans">
        {t('msg')}
      </h1>

    </div>
  );
};