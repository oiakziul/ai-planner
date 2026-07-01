// src/pages/Inicio.tsx
import clsx from "clsx";
// import { useTranslation } from "react-i18next";
import { SimulationHero } from "./componentes/features/Simulation/Hero";
import { SimulationForm } from "./componentes/features/Simulation/Form";

export const SimulationFormPage = () => {
  // const { t } = useTranslation("inicio");
  const base = clsx(
    "mt-10 md:mt-20 relative min-h-145 md:min-h-165 max-w-3xl overflow-hidden transition-all duration-300",
    "flex justify-center mx-auto rounded-2xl",
    "border-2 border-border bg-card/50 shadow-xl font-sans",
    "text-card-foreground font-bold px-4 py-10"
  );


  return (
    <div id="inicio" className={base}>
      <main className="drop-shadow-sm text-center px-4 font-sans">
        {/*t('msg')*/} 
        <SimulationHero/>
        <SimulationForm/>
      </main>
    </div>
  );
};