import clsx from "clsx";
//import { useTranslation } from "react-i18next";

export const Inicio = () => {
  //const { t } = useTranslation("inicio");

  const base = clsx(
    "relative overflow-hidden transition-all duration-300", 
    "flex items-center justify-center mx-auto rounded-2xl",
    "font-sans text-card-foreground text-3xl ", 
    "font-bold bg-primary-foreground/50" 
  );

  return (
    <div id="inicio" className={base}>
    
    </div>
  );
};