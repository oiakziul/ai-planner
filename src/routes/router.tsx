// src/routes/AppRoutes.tsx
import { lazy, Suspense, type ComponentType } from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home } from "@/pages/Home";
import { cn } from "@/lib/utils";

const SimulationFormPage = lazy(() =>
  import("@/pages/SimulationFormPage").then((m) => ({
    default: m.SimulationFormPage,
  }))
);

const SimulationResultsPage = lazy(() =>
  import("@/pages/SimulationResultsPage").then((m) => ({
    default: m.SimulationResultsPage,
  }))
);

const SimulationHistoryPage = lazy(() =>
  import("@/pages/SimulationHistoryPage").then((m) => ({
    default: m.SimulationHistoryPage as ComponentType<any>,
  }))
);

const classeLoad = cn(
  "relative bg-background h-screen w-full z-[9999]",
  "flex flex-col justify-center items-center overflow-hidden",
  "text-muted-foreground font-sans text-sm font-medium tracking-widest select-none"
);

export const AppRoutes = () => {
  const { t } = useTranslation("header");

  return (
    <Suspense
      fallback={
        <div className={classeLoad}>
          {t("loading_fallback", "Carregando . . .")}
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<SimulationFormPage />} />
          <Route path="resultado" element={<SimulationResultsPage />} />
          <Route path="resultado/:id" element={<SimulationResultsPage />} />
          <Route path="historico" element={<SimulationHistoryPage />} />
          <Route path="*" element={<SimulationFormPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};