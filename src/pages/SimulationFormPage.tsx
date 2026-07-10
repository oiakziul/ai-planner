// src/pages/Inicio.tsx
import clsx from "clsx";
import { SimulationHero } from "./componentes/features/Simulation/Hero";
import { SimulationForm } from "./componentes/features/Simulation/Form";

export const SimulationFormPage = () => {

  const base = clsx(
    "relative min-h-145 md:min-h-165",
    "flex justify-center mx-auto rounded-2xl",
    "text-card-foreground font-bold py-4 px-2 pb-6 md:p-10",
    "w-full max-w-xl overflow-hidden transition-all duration-300"
  );

  const mainContentClass = clsx(
    "text-center px-0 font-sans"
  );

  return (
    <div id="inicio" className={base}>
      <main className={mainContentClass}>
        <SimulationHero />
        <SimulationForm />
      </main>
    </div>
  );
};