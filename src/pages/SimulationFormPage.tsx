// src/pages/Inicio.tsx
import clsx from "clsx";
// import { useTranslation } from "react-i18next";
import { SimulationHero } from "./componentes/features/Simulation/Hero";
import { SimulationForm } from "./componentes/features/Simulation/Form";

export const SimulationFormPage = () => {
  // const { t } = useTranslation("inicio");
  const base = clsx(
    "relative min-h-145 md:min-h-165" ,
    "flex justify-center mx-auto rounded-2xl",
    "md:shadow-lg md:ring-1 ring-border/50 font-sans",
    "text-card-foreground font-bold py-4 px-2 pb-6 md:p-10",
    "max-w-3xl overflow-hidden transition-all duration-300"
  );


  return (
    <div id="inicio" className={base}>
      <main className="text-center px-0 font-sans">
        {/*t('msg')*/} 
        <SimulationHero/>
        <SimulationForm/>
      </main>
    </div>
  );
};