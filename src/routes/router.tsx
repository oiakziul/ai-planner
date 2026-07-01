import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { Footer } from '@/pages/Footer';
import clsx from 'clsx';

const SimulationFormPage = lazy(() => import('@/pages/SimulationFormPage').then(m => ({ default: m.SimulationFormPage })));
const Pagina1 = lazy(() => import('@/pages/Pagina1').then(m => ({ default: m.Pagina1 })));
const Pagina2 = lazy(() => import('@/pages/Pagina2').then(m => ({ default: m.Pagina2 })));
const Pagina3 = lazy(() => import('@/pages/Pagina3').then(m => ({ default: m.Pagina3 })));
const classeLoad = clsx(
  'relative bg-stripes-custom0 h-screen w-full z-9999',
  'flex justify-center items-center overflow-hidden'
)

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
          <Route path="pagina1" element={<Pagina1 />} />
          <Route path="pagina2" element={<Pagina2 />} />
          <Route path="pagina3" element={<Pagina3 />} />
          <Route path="footer" element={<Footer />} />

          <Route path="*" element={<SimulationFormPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};