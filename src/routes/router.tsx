import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home';

import { cn } from '@/lib/utils';

// IMPORTAÇÕES DINÂMICAS (Code Splitting): Agora com nomes de páginas reais e semânticos [1]
const SimulationFormPage = lazy(() => import('@/pages/SimulationFormPage').then(m => ({ default: m.SimulationFormPage })));
const SimulationResultsPage = lazy(() => import('@/pages/SimulationResultsPage').then(m => ({ default: m.SimulationResultsPage })));
const SimulationHistoryPage = lazy(() => import('@/pages/SimulationHistoryPage').then(m => ({ default: m.SimulationHistoryPage })));

const classeLoad = cn(
  'relative bg-background h-screen w-full z-[9999]', // [CORRIGIDO]: bg-background aplica sua cor Obsidiana automaticamente
  'flex justify-center items-center overflow-hidden'
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={
      <div className={classeLoad}>
        . . .
      </div>
    }>
      <Routes>
        <Route path="/" element={<Home />}>

          <Route index element={<SimulationFormPage />} />          
          <Route path="resultado" element={<SimulationResultsPage />} />          
          <Route path="historico" element={<SimulationHistoryPage />} />
          
          <Route path="*" element={<SimulationFormPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};